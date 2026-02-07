#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

# EDIT THIS LIST intentionally
INCLUDE=(
  "src/app/(main)/surrender"
  "src/components/DogFacts.tsx"
  "src/components/DogGallery.tsx"
  "src/components/DogPortableText.tsx"
  "src/components/Hero.tsx"
  "cowork-create-surrender-page.mjs"
  # "public/images/surrender"
  # "public/images/hero/hero-dane-outdoor.jpg"
)

echo "== Staging intended files =="
for p in "${INCLUDE[@]}"; do
  if [ -e "$p" ]; then
    echo "  + $p"
    git add "$p"
  else
    echo "  ! missing: $p"
  fi
done

git status
echo
echo "Now commit manually with a message you choose."
