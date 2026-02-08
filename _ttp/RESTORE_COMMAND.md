# Restore Command

**One-word morning validation after hard shutdown or system restart.**

## Quick Usage

```bash
restore
```

## What It Does

Runs the full restoration validation protocol (Gates A/B/C):

1. **Gate A:** Host/toolchain snapshot (OS, Node, npm, git, network)
2. **Gate B:** Repo state validation (git status, clean working tree, deterministic install, cold prod build)
3. **Gate C:** Sanity + R2 connectivity checks

## When to Use

- **Every morning** after hard shutdown
- **After system restart**
- **After power loss recovery**
- **Before starting work** to certify dev+cms environment

## Output

Evidence saved to timestamped folder:
```
_ttp/evidence/EnvValidate_YYYY-MM-DD_HHMMSS/
```

**Success output:**
```
=== RESTORE VALIDATION COMPLETE ✅ ===
Evidence folder: /path/to/_ttp/evidence/EnvValidate_*/
```

**Failure output:**
```
❌ FAIL: [specific error message]
Evidence folder: /path/to/_ttp/evidence/EnvValidate_*/
```

## Recovery Paths

If Gate B fails with dirty working tree:

```bash
git status --porcelain
```

Then choose:
- **(a) stash** - exploratory/mid-flight work: `git stash`
- **(b) commit** - intentional changes: `git add . && git commit -m "..."`
- **(c) reset** - accidental drift: `git reset --hard HEAD`

Then run `restore` again.

## Daily Log Format

Capture only these two items:

1. **Evidence folder line:**
   ```
   Evidence folder: /Users/rayrichardson/ControlHub/RMGDRI_Website/rmgdri-site/_ttp/evidence/EnvValidate_2026-02-08_101829
   ```

2. **Any failure blocks (if present):**
   ```
   ❌ FAIL: Working tree is NOT clean. Commit/stash before certifying restore.
   ```

## Comparison: restore vs panic

| Command | When | Purpose | Shutdown |
|---------|------|---------|----------|
| `restore` | Morning/startup | Validate environment restored | No |
| `panic` | Emergency/end-of-day | Capture evidence + safe shutdown | Optional (y/N) |

## Installation

Already installed! The `restore` command is a symlink to:
```
~/ControlHub/RMGDRI_Website/rmgdri-site/_ttp/run-restore-validate.sh
```

Located at: `~/bin/restore`

## Troubleshooting

### "restore: command not found"

```bash
source ~/.zshrc
```

Or open a new terminal window.

### Build fails

Check the build log in the evidence folder:
```bash
tail -50 _ttp/evidence/EnvValidate_*/next.build.log
```

---

**Quick Reference:**

```bash
# Morning routine after hard shutdown
restore

# If successful: start working
npm run dev

# End of day
panic
# Press Enter (no shutdown) OR type 'y' (shutdown)
```
