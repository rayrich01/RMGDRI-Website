#!/usr/bin/env bash
set -euo pipefail

echo "== Add GitHub Actions CI guard: legacy email domain =="

# Ensure the npm script exists (best-effort check)
if ! node -e 'const p=require("./package.json"); process.exit(p.scripts && p.scripts["guard:legacy-domain"] ? 0 : 1)'; then
  echo "ERROR: package.json missing scripts.guard:legacy-domain"
  echo "Add it first, then re-run this runner."
  exit 1
fi

mkdir -p .github/workflows

cat > .github/workflows/legacy-domain-guard.yml <<'YAML'
name: Legacy Domain Guard

on:
  pull_request:
  push:

jobs:
  guard-legacy-domain:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install deps
        run: npm ci

      - name: Guard: block legacy @rmgdri.org
        run: npm run -s guard:legacy-domain
YAML

echo
echo "== Local sanity: show workflow file =="
ls -la .github/workflows/legacy-domain-guard.yml

echo
echo "== DONE =="
