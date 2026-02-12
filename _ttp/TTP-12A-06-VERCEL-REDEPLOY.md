# TTP-12A-06 — Vercel Redeploy + Build Gate Verification

**Date**: 2026-02-12
**Status**: Awaiting redeploy execution
**Priority**: 1 (Critical path to Lori review)

---

## Objective

Produce one green Preview deploy and capture proof that the previously failing build stage now passes.

---

## Prerequisites

✅ **Completed**:
- Vercel environment variables set (TTP-12A-04/05)
- NEXT_PUBLIC_SANITY_PROJECT_ID = "17o8qiin" (Preview + Production)
- NEXT_PUBLIC_SANITY_DATASET = "production" (Preview + Production)
- SANITY_API_TOKEN set (Preview + Production)

---

## Manual Execution Steps

### Step 1: Navigate to Vercel Deployments

1. Open: https://vercel.com/dashboard
2. Select project: **rmgdri-site**
3. Go to **Deployments** tab
4. Filter by branch: `feat/lori-review-fixes-2026-02-11`

### Step 2: Redeploy Latest Preview

1. Find the most recent Preview deployment
2. Click **"..."** menu (three dots)
3. Click **"Redeploy"**
4. Confirm redeploy

### Step 3: Monitor Build Logs

Watch for the previously failing stage:

**Previous Failure** (Expected to pass now):
```
Error: Collecting page data ...
Error: NEXT_PUBLIC_SANITY_PROJECT_ID is required
```

**Expected Success** (What we want to see):
```
✓ Collecting page data
✓ Generating static pages (26/26)
✓ Finalizing page optimization
```

### Step 4: Capture Evidence

Once deployment completes, capture:

1. **Deployment URL**: Copy the Preview URL (e.g., `rmgdri-site-git-feat-lori-review-fixes-*.vercel.app`)
2. **Build Log Excerpt**: Copy the section showing "Collecting page data" completion
3. **Deployment Status**: Success ✅ or Failure ❌

---

## Evidence Capture Template

Create evidence folder:
```bash
mkdir -p _ttp/evidence/2026-02-12__VERCEL_REDEPLOY_VERIFY__HHMMSS
```

**File 1: `preview_url.txt`**
```
https://rmgdri-site-git-feat-lori-review-fixes-XXXXX.vercel.app
```

**File 2: `buildlog_pass_excerpt.md`**
```markdown
## Vercel Build Log - Collecting Page Data Stage

### Previous Failure (Before env vars)
```
Error: Collecting page data ...
Error: NEXT_PUBLIC_SANITY_PROJECT_ID is required
```

### Current Result (After env vars)
```
✓ Collecting page data
✓ Generating static pages (26/26)
✓ Finalizing page optimization
```

**Status**: ✅ PASS
**Timestamp**: 2026-02-12T11:XX:XX
**Deployment URL**: [see preview_url.txt]
```

**File 3: `deployment_summary.md`**
```markdown
# Vercel Deployment Summary

**Branch**: feat/lori-review-fixes-2026-02-11
**Deployment**: [ID from Vercel]
**Status**: ✅ Success
**Duration**: XX seconds
**Preview URL**: [see preview_url.txt]

## Changes Since Last Deploy
- Set NEXT_PUBLIC_SANITY_PROJECT_ID (Preview + Production)
- Set NEXT_PUBLIC_SANITY_DATASET (Preview + Production)
- Set SANITY_API_TOKEN (Preview + Production)

## Build Verification
- ✅ Collecting page data: PASS (previously failed)
- ✅ Static page generation: 26/26 pages
- ✅ Page optimization: Complete

## Next Steps
1. Share Preview URL with Lori (TTP-12A-08)
2. Monitor for feedback on PR#3
3. Prepare for merge if no blockers
```

---

## Success Criteria

- ✅ Vercel deployment status: "Ready" (green checkmark)
- ✅ Build log shows: "✓ Collecting page data"
- ✅ Build log shows: "✓ Generating static pages (26/26)"
- ✅ Preview URL is accessible
- ✅ No errors in deployment logs

---

## Failure Scenarios

### Scenario A: Same Error (Missing env vars)
```
Error: NEXT_PUBLIC_SANITY_PROJECT_ID is required
```

**Action**: Verify env vars in Vercel dashboard:
```bash
vercel env ls
```

**Expected**: All 6 vars should show "Encrypted" status

### Scenario B: New Error (Route-level issue)
```
Error: [slug] route failed to generate
```

**Action**: Proceed to TTP-12A-07 (route-level hardening)

### Scenario C: Timeout or Network Error
**Action**: Wait 2 minutes, retry redeploy

---

## Paste Back Format

After redeploy completes, paste **ONE** of these:

### ✅ Success Format
```
✅ Success
Preview URL: https://rmgdri-site-git-feat-lori-review-fixes-XXXXX.vercel.app
Build log excerpt:
[paste the section showing "Collecting page data" completion]
```

### ❌ Failure Format
```
❌ Failure
First error block:
[paste the error from Vercel logs]
```

---

## Ready to Execute

**Manual Steps**:
1. Open Vercel dashboard
2. Navigate to rmgdri-site → Deployments
3. Redeploy latest Preview for feat/lori-review-fixes-2026-02-11
4. Monitor build logs
5. Paste result back here

**Browser**: https://vercel.com/dashboard
