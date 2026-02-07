#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "== Preflight =="
pwd
test -f scripts/upload-image-secure.js
test -f package.json
git status --porcelain || true

echo "== Gate A: sanitize upload script (no nano artifacts) =="

# 1) Remove any accidental lines that start with "✅ "
perl -i -ne 'print unless /^✅ /' scripts/upload-image-secure.js

# 2) Ensure shebang is line 1 and dotenv is line 2
perl -0777 -i -pe '
  s/\A\s*#!\/usr\/bin\/env node\s*\n+//s;
  s/\A\s*require\('\''dotenv'\''\)\.config\(\{ path: '\''\.env\.local'\'' \}\);\s*\n+//s;
  $_ = "#!/usr/bin/env node\nrequire('\''dotenv'\'').config({ path: '\''.env.local'\'' });\n\n" . $_;
' scripts/upload-image-secure.js

echo "== Gate B: validate parse =="
node -c scripts/upload-image-secure.js
echo "✅ JS parses"

echo "== Evidence =="
sed -n '1,25p' scripts/upload-image-secure.js

echo "== Optional: run audit fix (non-breaking) =="
npm audit fix || true
npm audit --omit=dev || true

echo "== Stage + commit (only if changes exist) =="
if ! git diff --quiet; then
  git add scripts/upload-image-secure.js SECURITY_GUIDELINES.md scripts/README.md package.json package-lock.json || true
  git commit -m "chore(security): dotenv token loading; remove token scraping guidance" || true
else
  echo "No changes to commit."
fi

echo "✅ Done."
