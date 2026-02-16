#!/usr/bin/env bash
set -euo pipefail

REPO="$(pwd)"
STAMP="$(date +%Y-%m-%d_%H%M%S)"
BK="_ttp/evidence/AppRouterUnify_${STAMP}"
mkdir -p "$BK"

echo "[1] Preflight snapshots -> $BK"
git status -sb > "$BK/git_status.txt" || true
ls -la app src/app > "$BK/ls_app_vs_src_app.txt" || true

echo "[2] Ensure we have a safety branch"
BR="fix/unify-app-router-${STAMP}"
git checkout -b "$BR" >/dev/null 2>&1 || true
echo "branch=$BR"

echo "[3] Create target folders under src/app"
mkdir -p src/app/api src/app/apply

echo "[4] Move ROOT app/api/intake into src/app/api (if present)"
if [ -d "app/api/intake" ]; then
  mkdir -p src/app/api/intake
  rsync -a "app/api/intake/" "src/app/api/intake/"
  echo "copied app/api/intake -> src/app/api/intake"
else
  echo "no app/api/intake to move"
fi

echo "[5] Move ROOT apply shells into src/app/apply ONLY if src/app/apply does not exist"
if [ -d "app/apply" ]; then
  if [ -d "src/app/apply" ] && [ "$(ls -A src/app/apply 2>/dev/null | wc -l | tr -d ' ')" != "0" ]; then
    echo "src/app/apply already has content; leaving app/apply in place for manual merge"
  else
    rsync -a "app/apply/" "src/app/apply/"
    echo "copied app/apply -> src/app/apply"
  fi
else
  echo "no app/apply to move"
fi

echo "[6] Move ROOT contact shell ONLY if src/app does not already have a contact route"
if [ -d "app/contact" ]; then
  if find src/app -maxdepth 4 -type f -path "*/contact/page.tsx" | grep -q .; then
    echo "src/app already has contact/page.tsx; leaving app/contact in place for manual merge"
  else
    mkdir -p src/app/contact
    rsync -a "app/contact/" "src/app/contact/"
    echo "copied app/contact -> src/app/contact"
  fi
else
  echo "no app/contact to move"
fi

echo "[7] Disable ROOT app/ so Next cannot build the wrong router"
if [ -d "app" ]; then
  mv app "_app__disabled__${STAMP}"
  echo "moved app -> _app__disabled__${STAMP}"
fi

echo "[8] Build verification (route list should now include full site)"
npm run build | tee "$BK/build.log" >/dev/null

echo
echo "✅ Done. Next steps:"
echo "1) Inspect route output: grep -n \"Route (app)\" -n $BK/build.log | head"
echo "2) git status -sb"
echo "3) If good: git add -A && git commit -m \"fix: unify app router under src/app\" && git push -u origin \"$BR\""
