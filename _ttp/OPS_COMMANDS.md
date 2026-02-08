# RMGDRI Ops Commands

**One-word commands for deterministic operations under normal and emergency conditions.**

---

## Command Reference

### `restore` (alias: `r`)

**Purpose:** Morning validation / post-restart certification

**What it does:**
- Gate A: Host/toolchain snapshot
- Gate B: Repo state validation + cold production build
- Gate C: Sanity + R2 connectivity checks
- Evidence saved to `_ttp/evidence/EnvValidate_*/`

**When to use:**
- Every morning after hard shutdown
- After system restart
- After power loss recovery
- Before starting work

**Usage:**
```bash
restore
# or
r
```

**Output:**
```
Evidence folder: /path/to/_ttp/evidence/EnvValidate_YYYY-MM-DD_HHMMSS
```

---

### `panic` (alias: `p`)

**Purpose:** Emergency evidence capture + optional shutdown

**What it does:**
- Kills dev server on :3000
- Captures system/repo state
- Runs npm audit (security)
- Runs cold production build
- Prompts: `Shutdown now? (y/N)`
- Evidence saved to `_ttp/evidence/PanicShutdown_*/`

**When to use:**
- End of day shutdown
- Emergency/under duress
- System instability detected
- Before leaving machine unattended

**Usage:**
```bash
panic
# or
p
```

**At prompt:**
- Press **Enter** or type **N** → No shutdown (safe)
- Type **y** → Immediate system shutdown

---

### `up`

**Purpose:** Validate + start dev server (morning workflow)

**What it does:**
1. Runs `restore` (Gates A/B/C)
2. If successful, starts dev server with LAN access
3. If restore fails, aborts without starting server

**When to use:**
- Morning routine (replaces `restore` + `npm run dev`)
- After hard shutdown when you want to start working immediately

**Usage:**
```bash
up
```

**Output:**
```
=== Running restore validation ===
[restore output...]
✅ Gate A/B/C PASS

=== Starting dev server ===
▲ Next.js 16.1.6
- Local:    http://localhost:3000
- Network:  http://192.168.1.xxx:3000
```

---

### `ops`

**Purpose:** Quick help / command reference

**Usage:**
```bash
ops
```

**Output:**
```
RMGDRI ops:
  restore  (or: r)  -> validate dev+cms restore
  panic    (or: p)  -> capture evidence + prompt shutdown
  up               -> restore + start dev server with LAN access
```

---

## Daily Workflows

### Morning Routine (After Hard Shutdown)

**Option A: Validate, then decide**
```bash
restore
# Review evidence
npm run dev
```

**Option B: Validate + auto-start**
```bash
up
# If restore passes, dev server starts automatically
```

### Normal Day Workflow

```bash
# Start work
npm run dev

# During work
# ... make changes, test, commit ...

# End of day (no shutdown)
# Just close terminal or Ctrl+C dev server
```

### End of Day with Shutdown

```bash
panic
# When prompted "Shutdown now? (y/N):"
# Type 'y' + Enter
```

### Emergency Shutdown

```bash
panic
# or just: p
# When prompted, type 'y'
```

---

## Evidence Locations

All evidence is timestamped and saved locally:

**Restore validation:**
```
_ttp/evidence/EnvValidate_YYYY-MM-DD_HHMMSS/
├── transcript.log
├── env.snapshot.txt
├── net.snapshot.txt
├── repo.snapshot.txt
├── sanity.snapshot.txt
├── r2.snapshot.txt
├── next.build.log
└── summary.json
```

**Panic shutdown:**
```
_ttp/evidence/PanicShutdown_YYYY-MM-DD_HHMMSS/
├── transcript.log
├── env.snapshot.txt
├── repo.snapshot.txt
├── npm.audit.txt
├── next.build.log
└── summary.json
```

---

## Troubleshooting

### Commands not found

```bash
source ~/.zshrc
```

Or open a new terminal window.

### Verify installation

```bash
which restore
which panic
# Should show: /Users/rayrichardson/bin/restore
# Should show: /Users/rayrichardson/bin/panic
```

### restore fails (dirty working tree)

```bash
git status --porcelain
```

Then choose recovery path:
- **(a) stash** - exploratory work: `git stash`
- **(b) commit** - intentional changes: `git commit -am "..."`
- **(c) reset** - accidental drift: `git reset --hard HEAD`

Then run `restore` again.

### panic kills wrong port

The script only kills `:3000`. If your dev server runs on a different port, edit:
```
_ttp/panic-shutdown.sh
```

---

## Installation Reference

**Already installed!** Commands are symlinked from:

```
~/bin/restore  -> ~/ControlHub/RMGDRI_Website/rmgdri-site/_ttp/run-restore-validate.sh
~/bin/panic    -> ~/ControlHub/RMGDRI_Website/rmgdri-site/_ttp/panic-shutdown.sh
```

**Aliases defined in `~/.zshrc`:**
```bash
alias r='restore'
alias p='panic'

up() {
  restore || return 1
  cd ~/ControlHub/RMGDRI_Website/rmgdri-site
  npm run dev:network
}

ops() {
  echo "RMGDRI ops:"
  echo "  restore  (or: r)  -> validate dev+cms restore"
  echo "  panic    (or: p)  -> capture evidence + prompt shutdown"
  echo "  up               -> restore + start dev server with LAN access"
}
```

---

## Quick Reference Card

| Command | Alias | Purpose | Evidence | Shutdown |
|---------|-------|---------|----------|----------|
| `restore` | `r` | Morning validation | EnvValidate_* | No |
| `panic` | `p` | Emergency evidence | PanicShutdown_* | y/N prompt |
| `up` | - | Validate + start dev | EnvValidate_* | No |
| `ops` | - | Show help | - | No |

**Most common:**
```bash
# Morning
up

# End of day (no shutdown)
# Just close terminal

# End of day (with shutdown)
panic
y
```
