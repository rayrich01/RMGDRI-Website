#!/usr/bin/env bash
set -euo pipefail

# === RMGDRI Automated Check Scheduler Installer ===
# Installs launchd jobs for 6am and 7:30pm Denver Time checks

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LAUNCHD_DIR="$HOME/Library/LaunchAgents"

echo "=== RMGDRI Automated Check Scheduler Installer ==="
echo ""
echo "This will install two launchd jobs:"
echo "  1. Morning check at 6:00 AM (Denver Time)"
echo "  2. Evening check at 7:30 PM (Denver Time)"
echo ""
echo "Jobs will run: $SCRIPT_DIR/run-automated-check.sh"
echo ""

# Create logs directory
mkdir -p "$SCRIPT_DIR/logs"
mkdir -p "$SCRIPT_DIR/evidence"

# Ensure LaunchAgents directory exists
mkdir -p "$LAUNCHD_DIR"

# Copy plist files
echo "Installing launchd plist files..."
cp "$SCRIPT_DIR/com.rmgdri.security-check.morning.plist" "$LAUNCHD_DIR/"
cp "$SCRIPT_DIR/com.rmgdri.security-check.evening.plist" "$LAUNCHD_DIR/"

# Set proper permissions
chmod 644 "$LAUNCHD_DIR/com.rmgdri.security-check.morning.plist"
chmod 644 "$LAUNCHD_DIR/com.rmgdri.security-check.evening.plist"

# Unload if already loaded (ignore errors)
launchctl unload "$LAUNCHD_DIR/com.rmgdri.security-check.morning.plist" 2>/dev/null || true
launchctl unload "$LAUNCHD_DIR/com.rmgdri.security-check.evening.plist" 2>/dev/null || true

# Load the new jobs
echo "Loading launchd jobs..."
launchctl load "$LAUNCHD_DIR/com.rmgdri.security-check.morning.plist"
launchctl load "$LAUNCHD_DIR/com.rmgdri.security-check.evening.plist"

echo ""
echo "✅ Installation complete!"
echo ""
echo "Scheduled jobs:"
echo "  • Morning: 6:00 AM Denver Time"
echo "  • Evening: 7:30 PM Denver Time"
echo ""
echo "Logs will be written to:"
echo "  $SCRIPT_DIR/logs/"
echo ""
echo "Evidence will be collected in:"
echo "  $SCRIPT_DIR/evidence/"
echo ""
echo "To check job status:"
echo "  launchctl list | grep rmgdri"
echo ""
echo "To view logs:"
echo "  tail -f $SCRIPT_DIR/logs/launchd-morning-stdout.log"
echo "  tail -f $SCRIPT_DIR/logs/launchd-evening-stdout.log"
echo ""
echo "To uninstall:"
echo "  launchctl unload $LAUNCHD_DIR/com.rmgdri.security-check.morning.plist"
echo "  launchctl unload $LAUNCHD_DIR/com.rmgdri.security-check.evening.plist"
echo "  rm $LAUNCHD_DIR/com.rmgdri.security-check.*.plist"
echo ""
echo "⚠️  NOTE: Times are in local system time (Denver Time)."
echo "   Make sure your system timezone is set to America/Denver or Mountain Time."
echo ""
