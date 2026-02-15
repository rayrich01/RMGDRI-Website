#!/usr/bin/env bash
set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DATE="${DATE:-$(date +%F)}"
TS="$(date +%H%M%S)"

EVID_ROOT="$REPO/_ttp/evidence"
OUT_DIR="$EVID_ROOT/${DATE}__EOD-REPORT-HARDEN__${TS}"
mkdir -p "$OUT_DIR"

log() { printf "%s\n" "$*" | tee -a "$OUT_DIR/run.log" >/dev/null; }
run() { log "\n$ $*"; (cd "$REPO" && eval "$*") 2>&1 | tee -a "$OUT_DIR/run.log" >/dev/null; }

log "== TTP: EOD Report Hardening =="
log "Repo: $REPO"
log "Out:  $OUT_DIR"

# Gate A: repo sanity
run "git status"
run "git branch --show-current"
run "git remote -v"

# Evidence: authoritative diff vs origin/main
run "git fetch origin"
run "git diff --name-status origin/main...HEAD > '$OUT_DIR/diff.name-status.txt'"
run "git diff --stat origin/main...HEAD > '$OUT_DIR/diff.stat.txt'"

# Counts: A/M/D/R (best-effort)
python3 - <<'PY' > "$OUT_DIR/diff.counts.txt"
from pathlib import Path
p = Path("diff.name-status.txt")
txt = p.read_text().splitlines() if p.exists() else []
added = modified = deleted = renamed = 0
for line in txt:
    if not line.strip():
        continue
    status = line.split()[0]
    if status.startswith("A"):
        added += 1
    elif status.startswith("M"):
        modified += 1
    elif status.startswith("D"):
        deleted += 1
    elif status.startswith("R"):
        renamed += 1
        modified += 1
print(f"added={added}")
print(f"modified={modified}")
print(f"deleted={deleted}")
print(f"renamed={renamed} (counted into modified)")
PY
# (move the counts file into OUT_DIR — python writes in CWD by default)
mv -f diff.name-status.txt "$OUT_DIR/diff.name-status.txt"
mv -f diff.stat.txt "$OUT_DIR/diff.stat.txt"
mv -f diff.counts.txt "$OUT_DIR/diff.counts.txt"

# Verify /successes shims exist (backward compat)
run "ls -la 'src/app/(main)/successes' > '$OUT_DIR/successes.ls.txt' || true"
run "ls -la 'src/app/(main)/successes/[year]' > '$OUT_DIR/successes.year.ls.txt' || true"
run "ls -la 'src/app/(main)/successes/[year]/[slug]' > '$OUT_DIR/successes.slug.ls.txt' || true"

# Verify no conflict markers remain
run "git grep -n '<<<<<<<\\|=======\\|>>>>>>>' -- src > '$OUT_DIR/merge-markers.txt' || true"

# Theme facts
run "rg -n 'darkMode:' tailwind.config.* > '$OUT_DIR/theme.tailwind.txt' || true"
run "rg -n 'ThemeProvider|next-themes|defaultTheme|enableSystem|suppressHydrationWarning' src/app/layout.tsx src/components/theme-provider.tsx > '$OUT_DIR/theme.provider.txt' || true"

# Sanity env facts
run "rg -n 'NEXT_PUBLIC_SANITY_PROJECT_ID|NEXT_PUBLIC_SANITY_DATASET|dataset\\s*:' src/lib/sanity/client.ts .env.local* > '$OUT_DIR/sanity.env.txt' || true"

# Optional build gate (skip by setting SKIP_BUILD=1)
if [[ "${SKIP_BUILD:-0}" != "1" ]]; then
  run "npm run build"
else
  log "\n(SKIP_BUILD=1 set; skipping npm run build)"
fi

# Paste-ready evidence for Claude
{
  echo "# EOD Report Evidence Bundle (Paste to Claude)"
  echo
  echo "## Diff counts"
  echo '```'
  cat "$OUT_DIR/diff.counts.txt" 2>/dev/null || echo "(missing)"
  echo '```'
  echo
  echo "## Changed files (name-status)"
  echo '```'
  sed -n '1,400p' "$OUT_DIR/diff.name-status.txt" 2>/dev/null || echo "(missing)"
  echo '```'
  echo
  echo "## Diff stat"
  echo '```'
  sed -n '1,400p' "$OUT_DIR/diff.stat.txt" 2>/dev/null || echo "(missing)"
  echo '```'
  echo
  echo "## /successes shim listings"
  echo '```'
  cat "$OUT_DIR/successes.ls.txt" 2>/dev/null || true
  cat "$OUT_DIR/successes.year.ls.txt" 2>/dev/null || true
  cat "$OUT_DIR/successes.slug.ls.txt" 2>/dev/null || true
  echo '```'
  echo
  echo "## Merge marker scan (should be empty)"
  echo '```'
  cat "$OUT_DIR/merge-markers.txt" 2>/dev/null || true
  echo '```'
  echo
  echo "## Theme facts"
  echo '```'
  cat "$OUT_DIR/theme.tailwind.txt" 2>/dev/null || true
  cat "$OUT_DIR/theme.provider.txt" 2>/dev/null || true
  echo '```'
  echo
  echo "## Sanity env facts"
  echo '```'
  cat "$OUT_DIR/sanity.env.txt" 2>/dev/null || true
  echo '```'
} > "$OUT_DIR/CLAUDE_INPUT.md"

log "\n✅ TTP complete."
log "Evidence folder: $OUT_DIR"
log "Key artifact for Claude: $OUT_DIR/CLAUDE_INPUT.md"
