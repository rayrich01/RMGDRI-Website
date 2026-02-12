#!/usr/bin/env bash
#
# fix-vercel-eslint-build-break.sh
# Purpose: Add next.config.mjs to ignore ESLint during builds (stabilizes Vercel)
# Context: ESLint circular serialization error crashes Vercel builds
# Solution: Add eslint: { ignoreDuringBuilds: true } to next.config.mjs
#

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$PROJECT_ROOT"

echo "=== TTP: Fix Vercel ESLint Build Break ==="
echo "Date: $(date)"
echo "Project: $PROJECT_ROOT"
echo ""

# Gate A: Detect existing next.config files
echo "[Gate A] Detecting existing next.config files..."
if [ -f "next.config.js" ]; then
  echo "  ⚠️  Found next.config.js - this will be superseded by next.config.mjs"
fi
if [ -f "next.config.ts" ]; then
  echo "  ⚠️  Found next.config.ts - this will be superseded by next.config.mjs"
fi
if [ -f "next.config.mjs" ]; then
  echo "  ⚠️  Found existing next.config.mjs - will be backed up"
  cp next.config.mjs "next.config.mjs.backup.$(date +%Y%m%d_%H%M%S)"
  echo "  ✓ Backup created"
fi
echo ""

# Gate B: Snapshot current .eslintrc files
echo "[Gate B] Snapshotting .eslintrc configuration..."
if [ -f ".eslintrc.json" ]; then
  echo "  ✓ Found .eslintrc.json"
  cat .eslintrc.json | head -20
else
  echo "  ℹ️  No .eslintrc.json found"
fi
echo ""

# Gate C: Write next.config.mjs with ignoreDuringBuilds
echo "[Gate C] Writing next.config.mjs with ESLint ignore..."
cat > next.config.mjs << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Ignore ESLint during builds to prevent circular serialization crashes
    // ESLint will still run locally and can be enforced in GitHub Actions
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
EOF

if [ -f "next.config.mjs" ]; then
  echo "  ✓ next.config.mjs created successfully"
  echo ""
  echo "Content:"
  cat next.config.mjs
else
  echo "  ✗ Failed to create next.config.mjs"
  exit 1
fi
echo ""

# Gate D: Run local build smoke test
echo "[Gate D] Running local build smoke test..."
echo "  Running: npm run build"
if npm run build 2>&1 | tee /tmp/next-build-smoke.log; then
  echo "  ✓ Build succeeded"
else
  echo "  ✗ Build failed - check /tmp/next-build-smoke.log"
  echo "  Last 20 lines:"
  tail -20 /tmp/next-build-smoke.log
  exit 1
fi
echo ""

# Gate E: Show git diffstat
echo "[Gate E] Git diffstat:"
git diff --stat
echo ""
git diff next.config.mjs
echo ""

echo "=== TTP Complete ==="
echo ""
echo "Next steps:"
echo "  1. Review the changes above"
echo "  2. git add next.config.mjs"
echo "  3. git commit -m 'chore(ci): ignore ESLint during builds to stabilize Vercel'"
echo "  4. git push"
echo "  5. Monitor Vercel deployment status"
echo ""
