# Panic Command Installation

## What It Does

The `panic` command is an emergency shutdown protocol that:

1. **Captures evidence** (host, toolchain, repo state, security audit)
2. **Kills port 3000** (Next.js dev server)
3. **Runs cold production build** (validates build integrity)
4. **Prompts for shutdown** (only shuts down on explicit "y")

## Installation (Choose One)

### Option A: Global Command (Recommended)

Run this **once** in your Terminal to install `panic` as a global command:

```bash
sudo ln -sf ~/ControlHub/RMGDRI_Website/rmgdri-site/_ttp/panic-shutdown.sh /usr/local/bin/panic
```

Then from anywhere, just type:
```bash
panic
```

### Option B: Direct Script Execution

If you prefer not to use sudo, run directly:

```bash
~/ControlHub/RMGDRI_Website/rmgdri-site/_ttp/panic-shutdown.sh
```

Or add an alias to your `~/.zshrc` or `~/.bashrc`:

```bash
echo 'alias panic="~/ControlHub/RMGDRI_Website/rmgdri-site/_ttp/panic-shutdown.sh"' >> ~/.zshrc
source ~/.zshrc
```

## Usage

### Normal Panic (Evidence + Prompt)

```bash
panic
```

**Behavior:**
1. Captures all evidence to `_ttp/evidence/PanicShutdown_YYYY-MM-DD_HHMMSS/`
2. Kills dev server on port 3000
3. Runs npm audit
4. Runs cold production build
5. Prompts: `Shutdown now? (y/N)`
   - Type `y` + Enter → Immediate shutdown
   - Type `N` or just Enter → No shutdown, exit

### Evidence Only (No Shutdown Risk)

If you want to capture evidence but **never** shut down:

```bash
panic
# When prompted "Shutdown now? (y/N):"
# Press Enter (defaults to N)
```

## Evidence Collected

Each panic run creates a timestamped folder:

```
_ttp/evidence/PanicShutdown_YYYY-MM-DD_HHMMSS/
├── transcript.log          # Full terminal output
├── env.snapshot.txt        # Host/toolchain state
├── repo.snapshot.txt       # Git status, branch, commits
├── npm.audit.txt           # Security vulnerabilities
├── next.build.log          # Production build output
└── summary.json            # Structured evidence metadata
```

## When to Use

**Emergency situations:**
- System instability detected
- Need to capture evidence before hard shutdown
- Suspect security issue
- Before leaving machine unattended
- After detecting suspicious activity

**Routine use:**
- End-of-day shutdown with evidence capture
- Before system maintenance
- After major changes to verify build integrity

## Safety Features

1. **Explicit confirmation required** - Won't shut down without typing "y"
2. **Evidence always captured** - Even if you don't shut down
3. **Non-destructive** - Only kills dev server (port 3000)
4. **Build validation** - Confirms production build works before shutdown
5. **Security audit** - Captures npm vulnerabilities

## Testing the Command

To verify installation without shutting down:

```bash
panic
# Wait for all evidence collection
# When prompted "Shutdown now? (y/N):"
# Press Enter (do NOT type 'y')
```

Check the evidence folder location printed at the end.

## Troubleshooting

### "panic: command not found"

If using Option A, run the installation command again with sudo.

If using Option B, use the full path:
```bash
~/ControlHub/RMGDRI_Website/rmgdri-site/_ttp/panic-shutdown.sh
```

### "lsof not found"

The script will skip killing port 3000 but continue with evidence collection.

### Build fails

Evidence is still captured. Check `next.build.log` in the evidence folder for details.

## Commit the Script

After verifying the panic command works:

```bash
cd ~/ControlHub/RMGDRI_Website/rmgdri-site
git add _ttp/panic-shutdown.sh _ttp/PANIC_COMMAND_INSTALL.md
git commit -m "feat(ttp): add panic shutdown command with evidence capture

- kills :3000 dev server
- captures evidence (host, repo, security, build)
- prompts before shutdown (y/N)
- writes to _ttp/evidence/PanicShutdown_*/

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

**Quick Reference:**

```bash
# Install globally (one-time)
sudo ln -sf ~/ControlHub/RMGDRI_Website/rmgdri-site/_ttp/panic-shutdown.sh /usr/local/bin/panic

# Use anytime
panic

# At prompt: Press Enter (no shutdown) OR type 'y' (immediate shutdown)
```
