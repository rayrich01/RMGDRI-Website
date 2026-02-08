# Vercel De-spam Status

**Date:** 2026-02-08
**Status:** ✅ COMPLETE

## Canonical Configuration (Locked In)

- **Canonical Project:** `rmgdri-site`
- **Canonical Production Domain:** `https://rmgdri-site.vercel.app`
- **Status:** HTTP 200 ✅
- **TLS:** Valid until 2026-03-26 ✅

## De-spam Actions Completed

### 1. ✅ Removed Confusing Cross-Project Alias
- **Action:** Removed `rmgdri-website.vercel.app` alias that was pointing to `rmgdri-site` deployment
- **Result:** Eliminated cross-project domain confusion
- **Command:** `npx vercel alias rm rmgdri-website.vercel.app --yes`

### 2. ✅ Verified Canonical Project Domains
**Project: `rmgdri-site`** - Clean aliases:
- `rmgdri-site.vercel.app` (primary production)
- `rmgdri-site-git-main-ray-richardsons-projects-4591755e.vercel.app` (git branch preview)
- `rmgdri-site-ray-richardsons-projects-4591755e.vercel.app` (team namespace)

### 3. ✅ Verified Redundant Project Status
**Project: `rmgdri-website`** - Harmless state:
- Only has git-branch preview aliases (no production aliases)
- Latest production URL: `https://rmgdri-website-ray-richardsons-projects-4591755e.vercel.app`
- Status: Inert (not causing notification spam)

## Remaining Manual Actions (Dashboard)

### Priority 1: Disconnect Git Integration from `rmgdri-website`
**Path:** Vercel Dashboard → Project: `rmgdri-website` → Settings → Git
**Action:** Disconnect Git integration or remove repo link
**Why:** Prevents auto-deploys and build notifications from redundant project

### Priority 2: Disable Notifications for `rmgdri-website`
**Path:** Vercel Dashboard → Project: `rmgdri-website` → Settings → Notifications
**Action:** Disable all build/deploy notifications
**Why:** Stops email spam from redundant project

### Priority 3 (After 24h Stable): Delete `rmgdri-website` Project
**Path:** Vercel Dashboard → Project: `rmgdri-website` → Settings → Advanced → Delete Project
**When:** After 24 hours of stable deploys on `rmgdri-site`
**Why:** Permanent de-spam and cleanup

## Verification Commands

```bash
# Verify canonical production URL
curl -I https://rmgdri-site.vercel.app | head -15

# Run restoration validation
restore  # or: r

# Check alias configuration
npx vercel alias ls | grep rmgdri
```

## Production Health (Latest Check)

```
HTTP/2 200
content-type: text/html; charset=utf-8
server: Vercel
x-vercel-cache: PRERENDER
```

## Important Note: vercel.json Configuration

**Current Reality:** `vercel.json` is **required** for this deployment configuration.

Testing confirmed:
- **WITH vercel.json:** HTTP 200 ✅
- **WITHOUT vercel.json:** HTTP 404 ❌

This appears specific to the current project configuration with Next.js 16.1.6 + Turbopack.

**Status:** Treat as "currently required for this deployment configuration" (not a universal Next.js rule).

## Git History

All de-spam actions committed with proper attribution:
- `7a0bb49` - feat: restore vercel.json (required for Next.js 16 + Turbopack)
- `b209161` - revert: remove vercel.json (restore default Next.js detection)
- `fa486be` - docs(ttp): update Gate D with correct production domain
- `fc90d8e` - chore: add explicit vercel.json configuration
