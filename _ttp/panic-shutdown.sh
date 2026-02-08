#!/usr/bin/env bash
set -euo pipefail

REPO="$HOME/ControlHub/RMGDRI_Website/rmgdri-site"
TTP="$REPO/_ttp"
EVID="$TTP/evidence"
STAMP="$(date +%F_%H%M%S)"
OUTDIR="$EVID/PanicShutdown_${STAMP}"

mkdir -p "$OUTDIR"

# --- transcript plumbing ---
exec > >(tee -a "$OUTDIR/transcript.log") 2>&1

echo "=== PANIC SHUTDOWN START ==="
date
echo "Repo: $REPO"
echo "Evidence: $OUTDIR"
echo ""

cd "$REPO"

# --- Gate A: host/toolchain snapshot ---
{
  echo "=== GATE A: Host/Toolchain ==="
  echo "whoami: $(whoami)"
  echo "pwd: $(pwd)"
  echo "hostname: $(hostname)"
  echo "uname: $(uname -a)"
  echo ""
  echo "node: $(node -v 2>/dev/null || echo MISSING)"
  echo "npm: $(npm -v 2>/dev/null || echo MISSING)"
  echo "git: $(git --version 2>/dev/null || echo MISSING)"
  echo ""
  echo "date: $(date)"
} | tee "$OUTDIR/env.snapshot.txt"

echo ""

# --- Gate B: repo state snapshot ---
{
  echo "=== GATE B: Repo State ==="
  echo "--- branch ---"
  git branch --show-current || true
  echo "--- HEAD ---"
  git log --oneline -10 || true
  echo "--- status (porcelain) ---"
  git status --porcelain || true
} | tee "$OUTDIR/repo.snapshot.txt"

echo ""

# --- Action: kill dev server (:3000) safely ---
echo "=== ACTION: Kill dev server on :3000 (if running) ==="
KILLED_3000=false
if command -v lsof >/dev/null 2>&1; then
  PIDS="$(lsof -ti:3000 || true)"
  if [[ -n "${PIDS}" ]]; then
    echo "Found PIDs: ${PIDS}"
    echo "${PIDS}" | xargs -I{} kill -9 {} 2>/dev/null || true
    echo "✅ Killed :3000"
    KILLED_3000=true
  else
    echo "No process on :3000"
  fi
else
  echo "lsof not found; skipping port kill"
fi
echo ""

# --- Gate B2: dependency + security quick checks ---
echo "=== GATE B2: Dependency/Security ==="
echo "--- npm audit (non-fatal; capture output) ---"
npm audit --audit-level=high > "$OUTDIR/npm.audit.txt" 2>&1 || echo "⚠️ npm audit reported findings (see npm.audit.txt)"
echo "Captured: $OUTDIR/npm.audit.txt"
echo ""

# --- Gate B3: deterministic cold production build ---
echo "=== GATE B3: Cold production build ==="
rm -rf .next || true
NODE_ENV=production npx next build > "$OUTDIR/next.build.log" 2>&1 || {
  echo "❌ FAIL: next build failed. Tail follows:"
  tail -60 "$OUTDIR/next.build.log" || true
  echo ""
  echo "Evidence folder: $OUTDIR"
  exit 1
}
echo "✅ next build PASS"
tail -25 "$OUTDIR/next.build.log" || true
echo ""

# --- Summary JSON ---
cat > "$OUTDIR/summary.json" <<JSON
{
  "type": "panic_shutdown_evidence",
  "timestamp": "$(date -Iseconds)",
  "repo": "$REPO",
  "evidence_dir": "$OUTDIR",
  "killed_port_3000": ${KILLED_3000},
  "npm_audit_file": "npm.audit.txt",
  "next_build_file": "next.build.log"
}
JSON

echo "=== EVIDENCE COMPLETE ==="
echo "Evidence folder: $OUTDIR"
echo ""

# --- Shutdown decision (y/N) ---
read -r -p "Shutdown now? (y/N): " ANS
ANS="${ANS:-N}"
if [[ "$ANS" =~ ^[Yy]$ ]]; then
  echo "Proceeding to shutdown..."
  # Use AppleScript to request shutdown; avoids sudo password prompts.
  osascript -e 'tell application "System Events" to shut down'
else
  echo "No shutdown. Exit."
fi
