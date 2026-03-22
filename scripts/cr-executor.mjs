#!/usr/bin/env node
/**
 * CR Executor — polls Supabase for pending CR tasks, executes via Claude Code CLI.
 *
 * Usage:
 *   node scripts/cr-executor.mjs              # process next pending task
 *   node scripts/cr-executor.mjs --poll       # poll continuously (every 60s)
 *   node scripts/cr-executor.mjs --dry-run    # show what would execute, don't run
 *
 * Requires:
 *   SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 *   Claude Code CLI (`claude`) in PATH
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { execSync, spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// ── Load env ──
const envPath = resolve(ROOT, '.env.local');
try {
  const envFile = readFileSync(envPath, 'utf-8');
  for (const line of envFile.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq);
    const val = trimmed.slice(eq + 1);
    if (!process.env[key]) process.env[key] = val;
  }
} catch (e) { /* no .env.local */ }

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
};

const DRY_RUN = process.argv.includes('--dry-run');
const POLL = process.argv.includes('--poll');
const POLL_INTERVAL = 60_000; // 60 seconds

// ── Tenant config ──
const HOME = process.env.HOME || process.env.USERPROFILE;
const TENANTS = {
  rmgdri: {
    repo: ROOT,
    branch: 'main',
    previewBase: 'https://rmgdri-site.vercel.app',
  },
  'misha-main': {
    repo: resolve(HOME, 'ControlHub/Misha_Studio-Website/misha-website'),
    branch: 'main',
    previewBase: 'https://mishacreations.com',
  },
  'misha-studio': {
    repo: resolve(HOME, 'ControlHub/Misha_Studio-Website/misha-studio-site'),
    branch: 'main',
    previewBase: 'https://studio.mishacreations.com',
  },
};

// ── Human-in-the-loop gates ──
const REQUIRES_APPROVAL = new Set([]);
const SENSITIVE_PATHS = ['/api/', '.env', 'middleware', 'auth'];

// ── Supabase helpers ──
async function fetchNextTask() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/cr_tasks?status=eq.pending&auto_execute=eq.true&order=priority.asc,created_at.asc&limit=1`,
    { headers }
  );
  if (!res.ok) throw new Error(`Supabase fetch failed: ${res.status}`);
  const tasks = await res.json();
  return tasks[0] || null;
}

async function updateTask(id, updates) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/cr_tasks?id=eq.${id}`, {
    method: 'PATCH',
    headers: { ...headers, 'Prefer': 'return=minimal' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) console.error(`Failed to update task ${id}: ${res.status}`);
}

// ── Tenant display names ──
const TENANT_NAMES = {
  rmgdri: 'RMGDRI website',
  'misha-main': 'Misha Creations main site (mishacreations.com)',
  'misha-studio': 'Misha Creations studio site (studio.mishacreations.com)',
};

// ── Prompt builders by category ──
function buildPrompt(task) {
  const { category, title, description, page_url, payload, tenant } = task;
  const siteName = TENANT_NAMES[tenant] || tenant;

  const base = [
    `You are executing CR-${task.cr_number} for the ${siteName}.`,
    `Category: ${category}`,
    `Title: ${title}`,
    '',
    'INSTRUCTIONS:',
  ];

  const commitCmd = (prefix = '') =>
    `git add <changed-files> && git commit -m "${prefix}CR-${task.cr_number}: <brief summary>"`;

  switch (category) {
    case 'content-update':
    case 'pr-comment':
      base.push(
        '1. Find the file containing the content that needs to change.',
        page_url ? `   The target page is: ${page_url}` : '   Search the codebase for the relevant page.',
        '2. Make the exact text/content change described below.',
        '3. Do NOT change anything else.',
        `4. After editing, run: ${commitCmd()}`,
        '',
        'CHANGE REQUEST:',
        description || payload?.body || 'No description provided.',
      );
      break;

    case 'bug':
      base.push(
        '1. Reproduce and diagnose the bug described below.',
        page_url ? `   The affected page is: ${page_url}` : '',
        '2. Fix the root cause.',
        '3. Verify the fix makes sense.',
        `4. After fixing, run: ${commitCmd('fix: ')}`,
        '',
        'BUG REPORT:',
        description || payload?.body || 'No description provided.',
      );
      break;

    case 'seo-performance':
      base.push(
        '1. Diagnose the SEO/performance/accessibility issue described below.',
        page_url ? `   The affected page is: ${page_url}` : '',
        '2. Fix the root cause. Common areas: metadata, JSON-LD, image optimization, contrast ratios, headers.',
        '3. Do NOT change visual design unless explicitly requested.',
        `4. After fixing, run: ${commitCmd('fix: ')}`,
        '',
        'SEO/PERFORMANCE ISSUE:',
        description || payload?.body || 'No description provided.',
      );
      break;

    case 'portfolio-issue':
      base.push(
        '1. This is a portfolio/editor issue. Check if it is a Sanity content problem or a code problem.',
        '2. For code issues, find and fix the relevant file.',
        '3. For Sanity content issues, describe what needs to change in the CMS.',
        `4. After fixing, run: ${commitCmd('fix: ')}`,
        '',
        'PORTFOLIO/EDITOR ISSUE:',
        description || payload?.body || 'No description provided.',
      );
      break;

    case 'dog-record':
      base.push(
        '1. This is a dog record issue. Check if it is a Sanity content problem or a code problem.',
        '2. For code issues, find and fix the relevant file.',
        `3. After fixing, run: ${commitCmd('fix: ')}`,
        '',
        'DOG RECORD ISSUE:',
        description || payload?.body || 'No description provided.',
      );
      break;

    default:
      base.push(
        'This CR requires manual review. Please analyze the request and determine the best approach.',
        '',
        'REQUEST:',
        description || payload?.body || 'No description provided.',
      );
  }

  return base.join('\n');
}

// ── Execute a single task ──
async function executeTask(task) {
  const tenant = TENANTS[task.tenant];
  if (!tenant) {
    await updateTask(task.id, { status: 'escalated', error: `Unknown tenant: ${task.tenant}` });
    return;
  }

  // Check if task requires approval
  if (REQUIRES_APPROVAL.has(task.category)) {
    await updateTask(task.id, { status: 'escalated', error: 'Feature requests require manual approval before execution.' });
    console.log(`CR-${task.cr_number}: Escalated (requires approval)`);
    return;
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`Executing CR-${task.cr_number}: ${task.title}`);
  console.log(`Category: ${task.category} | Priority: ${task.priority}`);
  console.log(`${'='.repeat(60)}\n`);

  const prompt = buildPrompt(task);

  if (DRY_RUN) {
    console.log('DRY RUN — would send this prompt to Claude Code:\n');
    console.log(prompt);
    return;
  }

  // Mark as executing
  await updateTask(task.id, { status: 'executing', started_at: new Date().toISOString(), attempts: task.attempts + 1 });

  try {
    // Execute via Claude Code CLI
    const result = execSync(
      `claude --print --dangerously-skip-permissions "${prompt.replace(/"/g, '\\"')}"`,
      {
        cwd: tenant.repo,
        encoding: 'utf-8',
        timeout: 300_000, // 5 minute timeout
        maxBuffer: 10 * 1024 * 1024,
      }
    );

    // Get the commit info
    let commit = '';
    let filesChanged = [];
    try {
      commit = execSync('git log -1 --format=%h', { cwd: tenant.repo, encoding: 'utf-8' }).trim();
      const diffStat = execSync('git diff --name-only HEAD~1..HEAD', { cwd: tenant.repo, encoding: 'utf-8' }).trim();
      filesChanged = diffStat.split('\n').filter(Boolean);
    } catch (e) { /* no commit made */ }

    // ── STOP-GATE: Push and verify ──
    if (commit) {
      try {
        execSync(`git push origin ${tenant.branch}`, { cwd: tenant.repo, encoding: 'utf-8' });
      } catch (pushErr) {
        // Push failed — hard stop, escalate immediately
        await updateTask(task.id, {
          status: 'escalated',
          error: `Push to ${tenant.branch} failed: ${pushErr.message?.slice(0, 500)}`,
        });
        console.error(`CR-${task.cr_number}: Push FAILED — escalated (not marking as review)`);
        return;
      }

      // Verify push landed on remote
      try {
        const fullSha = execSync('git rev-parse HEAD', { cwd: tenant.repo, encoding: 'utf-8' }).trim();
        execSync(`git fetch origin ${tenant.branch}`, { cwd: tenant.repo, encoding: 'utf-8' });
        execSync(`git merge-base --is-ancestor ${fullSha} origin/${tenant.branch}`, {
          cwd: tenant.repo,
          encoding: 'utf-8',
          stdio: 'pipe',
        });
        console.log(`  Push verified: ${commit} confirmed on origin/${tenant.branch}`);
      } catch (verifyErr) {
        // Push appeared to succeed but verification failed
        await updateTask(task.id, {
          status: 'escalated',
          error: `Push verification failed: commit ${commit} not confirmed on origin/${tenant.branch}. ${verifyErr.message?.slice(0, 300)}`,
        });
        console.error(`CR-${task.cr_number}: Push verification FAILED — escalated`);
        return;
      }
    }

    // Build preview URL
    const previewUrl = task.page_url
      ? `${tenant.previewBase}${task.page_url.startsWith('/') ? task.page_url : '/' + task.page_url}`
      : tenant.previewBase;

    // Build semantic validation hint for the notifier
    const title = task.title || '';
    const desc = task.description || '';
    const quotedMatch = title.match(/['"]([^'"]{3,})['"]/);
    const validationHint = quotedMatch
      ? quotedMatch[1]
      : (desc.match(/['"]([^'"]{3,})['"]/)?.[1] || '');

    if (validationHint) {
      console.log(`  Validation hint: "${validationHint}"`);
    } else {
      console.warn(`  No validation hint extracted — notifier will fail closed`);
    }

    // Update task as complete — notifier will pick it up
    await updateTask(task.id, {
      status: 'review',
      result: {
        commit,
        files_changed: filesChanged,
        preview_url: previewUrl,
        summary: `CR-${task.cr_number}: ${task.title}`,
        claude_output: result.slice(0, 2000), // truncate
        validation_hint: validationHint,
      },
    });

    console.log(`\nCR-${task.cr_number}: Complete (commit: ${commit || 'none'})`);
    console.log(`Files: ${filesChanged.join(', ') || 'none'}`);

  } catch (err) {
    const attempts = task.attempts + 1;
    const maxAttempts = 2;

    if (attempts >= maxAttempts) {
      // Deadletter
      await updateTask(task.id, {
        status: 'escalated',
        error: `Failed after ${attempts} attempts: ${err.message?.slice(0, 500)}`,
      });
      console.error(`CR-${task.cr_number}: ESCALATED after ${attempts} failures`);
    } else {
      // Retry
      await updateTask(task.id, {
        status: 'pending',
        error: `Attempt ${attempts} failed: ${err.message?.slice(0, 500)}`,
        attempts,
      });
      console.warn(`CR-${task.cr_number}: Attempt ${attempts} failed, will retry`);
    }
  }
}

// ── Main loop ──
async function main() {
  console.log(`CR Executor started${DRY_RUN ? ' (DRY RUN)' : ''}${POLL ? ' (polling)' : ''}`);

  do {
    try {
      const task = await fetchNextTask();
      if (task) {
        await executeTask(task);
      } else if (POLL) {
        process.stdout.write('.');
      } else {
        console.log('No pending auto-execute tasks.');
      }
    } catch (err) {
      console.error('Executor error:', err.message);
    }

    if (POLL) {
      await new Promise(r => setTimeout(r, POLL_INTERVAL));
    }
  } while (POLL);
}

main();
