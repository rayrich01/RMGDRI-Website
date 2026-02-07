# RMGDRI Automated Security Check Installation Guide

## Quick Start (TL;DR)

```bash
cd /Users/rayrichardson/ControlHub/RMGDRI_Website/rmgdri-site

# 1. Test the scripts manually
./_ttp/run-eod-preflight.sh

# 2. Install automated scheduling (6am & 7:30pm)
./_ttp/install-scheduler.sh

# 3. Verify installation
launchctl list | grep rmgdri
```

---

## Detailed Installation Steps

### Prerequisites

1. **macOS** (launchd scheduling)
2. **Node.js & npm** installed and in PATH
3. **Git** installed
4. **Correct timezone** set to America/Denver (Mountain Time)

Check timezone:
```bash
date
# Should show MST or MDT
```

Set timezone if needed:
```bash
sudo systemsetup -settimezone America/Denver
```

---

### Step 1: Test Scripts Manually

Before installing automated scheduling, test the scripts to ensure they work:

```bash
cd /Users/rayrichardson/ControlHub/RMGDRI_Website/rmgdri-site

# Test preflight checks
./_ttp/run-eod-preflight.sh

# Check the evidence
ls -lt _ttp/evidence/
cat _ttp/evidence/*/preflight.md
cat _ttp/evidence/*/security-scan.md

# Test automated check
./_ttp/run-automated-check.sh

# Check the logs
ls -lt _ttp/logs/
tail _ttp/logs/automated-check_*.log
```

If you see errors:
- **Permission denied**: Run `chmod +x _ttp/*.sh`
- **Node/npm not found**: Add Node to your PATH
- **Git errors**: Ensure you're in a git repository

---

### Step 2: Install Automated Scheduling

Run the installer:

```bash
./_ttp/install-scheduler.sh
```

This will:
1. Copy plist files to `~/Library/LaunchAgents/`
2. Set proper permissions
3. Load the scheduled jobs into launchd

Expected output:
```
✅ Installation complete!

Scheduled jobs:
  • Morning: 6:00 AM Denver Time
  • Evening: 7:30 PM Denver Time
```

---

### Step 3: Verify Installation

Check if jobs are loaded:
```bash
launchctl list | grep rmgdri
```

You should see:
```
-	0	com.rmgdri.security-check.morning
-	0	com.rmgdri.security-check.evening
```

View job details:
```bash
launchctl print gui/$(id -u)/com.rmgdri.security-check.morning
launchctl print gui/$(id -u)/com.rmgdri.security-check.evening
```

---

### Step 4: Wait for First Run or Test Manually

**Option A**: Wait for scheduled time (6am or 7:30pm)

**Option B**: Trigger manually for testing
```bash
# Start the morning job now (will run once then wait for schedule)
launchctl start com.rmgdri.security-check.morning

# Check logs immediately
tail -f _ttp/logs/launchd-morning-stdout.log
```

---

## What Gets Created

### Directory Structure
```
rmgdri-site/
└── _ttp/
    ├── run-eod-preflight.sh              ✅ Created
    ├── run-commit-untracked.sh           ✅ Created
    ├── run-automated-check.sh            ✅ Created
    ├── install-scheduler.sh              ✅ Created
    ├── com.rmgdri.security-check.morning.plist  ✅ Created
    ├── com.rmgdri.security-check.evening.plist  ✅ Created
    ├── README.md                         ✅ Created
    ├── INSTALLATION_GUIDE.md            ✅ Created (this file)
    ├── evidence/                         📁 Auto-created on first run
    │   └── YYYY-MM-DD_HHMMSS/
    │       ├── preflight.md
    │       ├── security-scan.md
    │       ├── npm-audit.txt
    │       └── lint.txt
    └── logs/                             📁 Auto-created on first run
        ├── automated-check_TIMESTAMP.log
        ├── launchd-morning-stdout.log
        ├── launchd-morning-stderr.log
        ├── launchd-evening-stdout.log
        └── launchd-evening-stderr.log
```

### System Files
```
~/Library/LaunchAgents/
├── com.rmgdri.security-check.morning.plist  ✅ Installed
└── com.rmgdri.security-check.evening.plist  ✅ Installed
```

---

## Configuration Options

### 1. Enable Auto-Commit (Optional)

⚠️ **Warning**: This will automatically commit evidence files. Review carefully before enabling.

Edit the plist files:
```bash
nano ~/Library/LaunchAgents/com.rmgdri.security-check.morning.plist
```

Change:
```xml
<key>AUTO_COMMIT</key>
<string>false</string>
```

To:
```xml
<key>AUTO_COMMIT</key>
<string>true</string>
```

Then reload:
```bash
launchctl unload ~/Library/LaunchAgents/com.rmgdri.security-check.morning.plist
launchctl load ~/Library/LaunchAgents/com.rmgdri.security-check.morning.plist

launchctl unload ~/Library/LaunchAgents/com.rmgdri.security-check.evening.plist
launchctl load ~/Library/LaunchAgents/com.rmgdri.security-check.evening.plist
```

### 2. Customize Commit Message

Edit `_ttp/run-automated-check.sh`:
```bash
nano _ttp/run-automated-check.sh
```

Change:
```bash
COMMIT_MESSAGE="${COMMIT_MESSAGE:-chore: automated security check and cleanup [skip ci]}"
```

### 3. Change Schedule Times

Edit the plist files to change run times:
```bash
nano ~/Library/LaunchAgents/com.rmgdri.security-check.morning.plist
```

Modify the hour/minute:
```xml
<key>StartCalendarInterval</key>
<dict>
    <key>Hour</key>
    <integer>6</integer>  <!-- 0-23 -->
    <key>Minute</key>
    <integer>0</integer>  <!-- 0-59 -->
</dict>
```

Then reload (see above).

---

## Monitoring & Logs

### Check Last Run Status
```bash
cat _ttp/last-automated-check.status
```

### View Recent Logs
```bash
# Morning run
tail -f _ttp/logs/launchd-morning-stdout.log

# Evening run
tail -f _ttp/logs/launchd-evening-stdout.log

# All automated checks
ls -lt _ttp/logs/automated-check_*.log | head -5
tail _ttp/logs/automated-check_*.log
```

### View Recent Evidence
```bash
# List evidence directories
ls -lt _ttp/evidence/ | head -5

# View latest security scan
LATEST=$(ls -t _ttp/evidence/ | head -1)
cat "_ttp/evidence/$LATEST/security-scan.md"

# View latest npm audit
cat "_ttp/evidence/$LATEST/npm-audit.txt"
```

### Check for Security Issues
```bash
# Scan all evidence for actual tokens (not documentation)
grep -r "sk[A-Za-z0-9]\{25,\}" _ttp/evidence/*/security-scan.md || echo "No real tokens found"
```

---

## Troubleshooting

### Jobs Not Running

**Problem**: Jobs don't execute at scheduled time

**Check**:
1. Verify jobs are loaded: `launchctl list | grep rmgdri`
2. Check system time: `date`
3. Check error logs: `cat _ttp/logs/launchd-*-stderr.log`
4. Check permissions: `ls -l _ttp/*.sh` (should show `-rwx------`)

**Fix**:
```bash
# Reload jobs
launchctl unload ~/Library/LaunchAgents/com.rmgdri.security-check.*.plist
launchctl load ~/Library/LaunchAgents/com.rmgdri.security-check.morning.plist
launchctl load ~/Library/LaunchAgents/com.rmgdri.security-check.evening.plist

# Make scripts executable
chmod +x _ttp/*.sh

# Test manually
./_ttp/run-automated-check.sh
```

---

### Node/npm Not Found

**Problem**: "node: command not found" in logs

**Check**: Node.js PATH
```bash
which node
which npm
```

**Fix**: Update PATH in plist files
```bash
nano ~/Library/LaunchAgents/com.rmgdri.security-check.morning.plist
```

Add your Node.js path:
```xml
<key>PATH</key>
<string>/usr/local/bin:/usr/bin:/bin:/opt/homebrew/bin:/Users/rayrichardson/.nvm/versions/node/vXX.XX.X/bin</string>
```

Then reload.

---

### Git Permission Errors

**Problem**: "unable to unlink .git/index.lock"

This is usually harmless and happens when another git process is running.

**Fix**: If persistent:
```bash
cd /Users/rayrichardson/ControlHub/RMGDRI_Website/rmgdri-site
rm -f .git/index.lock
```

---

### Security Scan False Positives

**Problem**: Documentation files triggering security warnings

This is expected! The scan will flag:
- Example tokens in `.env.local.example`
- Documentation in `SECURITY_GUIDELINES.md`
- README files with code examples

**What to check**: Look for actual token values in:
- `.env.local` (should NOT exist or be in .gitignore)
- Source code files (`.js`, `.ts`, `.tsx`)
- Config files

**Real tokens look like**:
```
SANITY_API_TOKEN=skAbc123Def456Ghi789012345678901234
```

**Documentation examples look like**:
```
SANITY_API_TOKEN=your_sanity_token
SANITY_AUTH_TOKEN="your-token-here"
```

---

## Uninstallation

To completely remove the automated checks:

```bash
# 1. Unload and remove launchd jobs
launchctl unload ~/Library/LaunchAgents/com.rmgdri.security-check.morning.plist
launchctl unload ~/Library/LaunchAgents/com.rmgdri.security-check.evening.plist
rm ~/Library/LaunchAgents/com.rmgdri.security-check.*.plist

# 2. (Optional) Remove evidence and logs
cd /Users/rayrichardson/ControlHub/RMGDRI_Website/rmgdri-site
rm -rf _ttp/evidence _ttp/logs

# 3. (Optional) Remove all _ttp scripts
rm -rf _ttp/
```

---

## Advanced Usage

### Run with Custom Settings

```bash
# Enable auto-commit for one run
AUTO_COMMIT=true ./_ttp/run-automated-check.sh

# Change commit message
COMMIT_MESSAGE="docs: add security evidence" AUTO_COMMIT=true ./_ttp/run-automated-check.sh

# Enable auto-push (use with extreme caution!)
AUTO_COMMIT=true AUTO_PUSH=true ./_ttp/run-automated-check.sh
```

### Create a Git Pre-Push Hook

Add security checks before every push:

```bash
cat > .git/hooks/pre-push <<'EOF'
#!/usr/bin/env bash
echo "Running security checks..."
./_ttp/run-eod-preflight.sh

# Check for real tokens
if grep -r "sk[A-Za-z0-9]\{25,\}" _ttp/evidence/*/security-scan.md 2>/dev/null; then
    echo "❌ ERROR: Potential security tokens detected!"
    echo "Review _ttp/evidence/*/security-scan.md"
    exit 1
fi

echo "✅ Security checks passed"
EOF

chmod +x .git/hooks/pre-push
```

### Integrate with CI/CD

Add to `.github/workflows/security-check.yml`:

```yaml
name: Security Check
on: [push, pull_request]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: ./_ttp/run-eod-preflight.sh
      - name: Check for security issues
        run: |
          if grep -r "sk[A-Za-z0-9]\{25,\}" _ttp/evidence/*/security-scan.md; then
            echo "Security tokens detected!"
            exit 1
          fi
```

---

## Support & Questions

- **Documentation**: See `_ttp/README.md` for detailed usage
- **Scripts**: All scripts are in `_ttp/` directory
- **Logs**: Check `_ttp/logs/` for execution logs
- **Evidence**: Review `_ttp/evidence/` for scan results

---

**Last Updated**: 2026-02-07
**Version**: 1.0.0
**Maintainer**: Ray Richardson
**Project**: RMGDRI Website
