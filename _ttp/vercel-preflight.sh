#!/usr/bin/env bash
set -euo pipefail

echo "=== Vercel Deployment Preflight Check ==="

echo ""
echo "--- Git ---"
git rev-parse --is-inside-work-tree >/dev/null
echo "Branch: $(git branch --show-current)"
echo "HEAD:   $(git rev-parse --short HEAD) $(git log -1 --pretty=%s)"

if [[ -n "$(git status --porcelain)" ]]; then
  echo "❌ Working tree is NOT clean."
  git status --porcelain
  exit 1
fi
echo "✓ working tree clean"

echo ""
echo "--- Toolchain ---"
node -v
npm -v

echo ""
echo "--- tsconfig.json alias health ---"
node - <<'NODE'
const fs = require('fs');
const j = JSON.parse(fs.readFileSync('tsconfig.json','utf8'));
const co = j.compilerOptions || {};
if (co.baseUrl !== ".") { console.error(`❌ baseUrl expected "." got ${co.baseUrl}`); process.exit(1); }
const paths = co.paths || {};
if (!paths["@/*"] || !paths["@/*"].includes("./src/*")) { console.error("❌ missing @/* -> ./src/*"); console.error(paths); process.exit(1); }
console.log("✓ baseUrl '.' and @/* -> ./src/*");
NODE

echo ""
echo "--- Sanity client canonicalization ---"
test -f src/lib/sanity/client.ts && echo "✓ src/lib/sanity/client.ts exists" || { echo "❌ missing src/lib/sanity/client.ts"; exit 1; }

if grep -RIn --include="*.ts" --include="*.tsx" '^import .*sanity/lib/client' src/app src/sanity src/lib >/dev/null 2>&1; then
  echo "❌ Found legacy imports of sanity/lib/client (should be @/lib/sanity/client)."
  grep -RIn --include="*.ts" --include="*.tsx" '^import .*sanity/lib/client' src/app src/sanity src/lib || true
  exit 1
fi
echo "✓ no legacy sanity/lib/client imports"

if grep -RIn --include="*.ts" --include="*.tsx" '^import .*@/sanity/lib/client' src >/dev/null 2>&1; then
  echo "❌ Found old alias imports @/sanity/lib/client (should be @/lib/sanity/client)."
  grep -RIn --include="*.ts" --include="*.tsx" '^import .*@/sanity/lib/client' src || true
  exit 1
fi
echo "✓ no @/sanity/lib/client imports"

echo ""
echo "--- Collision checks ---"
if [[ -f "sanity/structure.ts" ]]; then
  echo "❌ sanity/structure.ts exists and may shadow npm 'sanity/structure'. Rename it."
  exit 1
fi
echo "✓ no sanity/structure.ts collision"

echo ""
echo "--- Env vars (presence only; no values printed) ---"
if [[ -f ".env.local" ]]; then
  set -a
  source .env.local >/dev/null 2>&1 || true
  set +a
fi
node - <<'NODE'
const req = (k) => Boolean(process.env[k]);
console.log({
  NEXT_PUBLIC_SANITY_PROJECT_ID: req("NEXT_PUBLIC_SANITY_PROJECT_ID"),
  NEXT_PUBLIC_SANITY_DATASET: req("NEXT_PUBLIC_SANITY_DATASET"),
});
NODE
echo "NOTE: Vercel must also have these env vars set in dashboard."

echo ""
echo "--- Production build (cold) ---"
rm -rf .next || true
NODE_ENV=production npx next build >/tmp/vercel-preflight-build.log 2>&1 || {
  echo "❌ next build failed. Tail:"
  tail -60 /tmp/vercel-preflight-build.log || true
  exit 1
}
echo "✓ next build PASS"
tail -25 /tmp/vercel-preflight-build.log || true

echo ""
echo "=== PRECHECK PASS ✅ ==="
