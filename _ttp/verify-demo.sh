#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

ts="$(date)"
echo "DEMO VERIFY | $ts"

echo "--- build (tail) ---"
npx next build 2>&1 | tail -20

echo "--- wiring proof ---"
grep -r "HeroCarousel" src/ --include="*.tsx" -n || echo "OK: no HeroCarousel references"
test ! -f src/components/HeroCarousel.tsx && echo "OK: HeroCarousel file removed"

echo "--- routes smoke ---"
curl -s -o /dev/null -w "Homepage HTTP %{http_code}\n" http://localhost:3000/
curl -s -o /dev/null -w "Surrender HTTP %{http_code}\n" http://localhost:3000/surrender
curl -s http://localhost:3000/ | grep -qi 'href="/surrender"' && echo "OK: surrender link in homepage HTML"

echo "--- git ---"
git status --porcelain || true
git log --oneline -1
