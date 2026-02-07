#!/usr/bin/env bash
set -euo pipefail

# === RMGDRI Automated Security & Sanity Check Runner ===
# Runs twice daily (6am & 7:30pm Denver Time) via launchd
# Purpose: Evidence capture, security scanning, dependency audits, and optional commits

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

TS="$(date +"%Y-%m-%d_%H%M%S")"
LOG_DIR="_ttp/logs"
mkdir -p "$LOG_DIR"
LOG_FILE="${LOG_DIR}/automated-check_${TS}.log"

# Configuration
AUTO_COMMIT="${AUTO_COMMIT:-false}"  # Set to "true" to enable auto-commit
COMMIT_MESSAGE="${COMMIT_MESSAGE:-chore: automated security check and cleanup [skip ci]}"

echo "=== RMGDRI Automated Check Started ===" | tee -a "$LOG_FILE"
echo "Timestamp: $TS" | tee -a "$LOG_FILE"
echo "Root: $ROOT" | tee -a "$LOG_FILE"
echo "Auto-commit: $AUTO_COMMIT" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

# Step 1: Run preflight checks (evidence capture + security scans)
echo "▶ Step 1: Running preflight checks..." | tee -a "$LOG_FILE"
if ./_ttp/run-eod-preflight.sh 2>&1 | tee -a "$LOG_FILE"; then
    echo "✅ Preflight checks completed successfully" | tee -a "$LOG_FILE"
else
    echo "❌ Preflight checks failed" | tee -a "$LOG_FILE"
    exit 1
fi
echo "" | tee -a "$LOG_FILE"

# Step 2: Check for security issues in latest evidence
echo "▶ Step 2: Analyzing security scan results..." | tee -a "$LOG_FILE"
LATEST_EVID=$(ls -td _ttp/evidence/* 2>/dev/null | head -1)
if [ -n "$LATEST_EVID" ] && [ -f "$LATEST_EVID/security-scan.md" ]; then
    if grep -qE "sk[A-Za-z0-9]{20,}|SANITY_(AUTH|API)_TOKEN\s*=" "$LATEST_EVID/security-scan.md"; then
        echo "⚠️  WARNING: Potential security tokens detected!" | tee -a "$LOG_FILE"
        echo "Review: $LATEST_EVID/security-scan.md" | tee -a "$LOG_FILE"
        # Do not auto-commit if security issues found
        AUTO_COMMIT="false"
    else
        echo "✅ No security issues detected" | tee -a "$LOG_FILE"
    fi
else
    echo "⚠️  Could not find security scan results" | tee -a "$LOG_FILE"
fi
echo "" | tee -a "$LOG_FILE"

# Step 3: Check npm audit results
echo "▶ Step 3: Checking npm audit results..." | tee -a "$LOG_FILE"
if [ -n "$LATEST_EVID" ] && [ -f "$LATEST_EVID/npm-audit.txt" ]; then
    # Check if npm audit ran successfully
    if grep -q "audit endpoint returned an error" "$LATEST_EVID/npm-audit.txt" 2>/dev/null; then
        echo "ℹ️  npm audit was blocked or failed (this is normal in restricted environments)" | tee -a "$LOG_FILE"
    else
        # Count vulnerabilities safely
        CRITICAL_VULNS=$(grep -ci "critical" "$LATEST_EVID/npm-audit.txt" 2>/dev/null || echo "0")
        HIGH_VULNS=$(grep -ci "high" "$LATEST_EVID/npm-audit.txt" 2>/dev/null || echo "0")

        if [ "$CRITICAL_VULNS" -gt 0 ] || [ "$HIGH_VULNS" -gt 5 ]; then
            echo "⚠️  WARNING: Critical or high-severity vulnerabilities found" | tee -a "$LOG_FILE"
            echo "Review: $LATEST_EVID/npm-audit.txt" | tee -a "$LOG_FILE"
        else
            echo "✅ No critical vulnerabilities detected" | tee -a "$LOG_FILE"
        fi
    fi
else
    echo "⚠️  Could not find npm audit results" | tee -a "$LOG_FILE"
fi
echo "" | tee -a "$LOG_FILE"

# Step 4: Auto-commit if enabled and safe
if [ "$AUTO_COMMIT" = "true" ]; then
    echo "▶ Step 4: Auto-commit enabled, checking for changes..." | tee -a "$LOG_FILE"

    # Add evidence directory
    git add _ttp/evidence/ 2>&1 | tee -a "$LOG_FILE" || true

    # Check if there are changes to commit
    if git diff --cached --quiet; then
        echo "ℹ️  No changes to commit" | tee -a "$LOG_FILE"
    else
        echo "Committing changes..." | tee -a "$LOG_FILE"
        git commit -m "$COMMIT_MESSAGE" 2>&1 | tee -a "$LOG_FILE"
        echo "✅ Changes committed successfully" | tee -a "$LOG_FILE"

        # Optionally push (disabled by default for safety)
        if [ "${AUTO_PUSH:-false}" = "true" ]; then
            echo "Pushing to remote..." | tee -a "$LOG_FILE"
            git push 2>&1 | tee -a "$LOG_FILE"
            echo "✅ Changes pushed successfully" | tee -a "$LOG_FILE"
        fi
    fi
else
    echo "ℹ️  Step 4: Auto-commit disabled (set AUTO_COMMIT=true to enable)" | tee -a "$LOG_FILE"
fi
echo "" | tee -a "$LOG_FILE"

# Summary
echo "=== RMGDRI Automated Check Completed ===" | tee -a "$LOG_FILE"
echo "Log saved to: $LOG_FILE" | tee -a "$LOG_FILE"
echo "Evidence: $LATEST_EVID" | tee -a "$LOG_FILE"

# Create status file for monitoring
cat > "_ttp/last-automated-check.status" <<EOF
timestamp: $TS
log: $LOG_FILE
evidence: $LATEST_EVID
auto_commit: $AUTO_COMMIT
status: completed
EOF

echo "✅ All checks complete!" | tee -a "$LOG_FILE"
