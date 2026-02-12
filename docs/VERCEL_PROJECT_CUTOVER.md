# Vercel Project Cutover — rmgdri-website → rmgdri-site

**Date**: 2026-02-12
**Trigger Commit**: 5bfc4f4
**Status**: ⏳ Awaiting verification

---

## Background

The branch `feat/lori-review-fixes-2026-02-11` was deploying to the **old** `rmgdri-website` Vercel project instead of the **new** `rmgdri-site` project where we configured all environment variables.

## Actions Taken

1. ✅ **Disconnected** `rmgdri-website` project from GitHub (user action)
2. ✅ **Pushed** empty commit `5bfc4f4` to trigger fresh build
3. ⏳ **Waiting** for Vercel to rebuild on correct project

---

## Verification Checklist

After the build completes, check Vercel dashboard:

### Go to: Vercel → rmgdri-site → Deployments

**✅ Success Criteria:**

Latest deployment for `feat/lori-review-fixes-2026-02-11` shows domains like:
- `rmgdri-site-git-feat-l-XXXXXX-ray-richardsons-projects-XXXXX.vercel.app`
- `rmgdri-site-XXXXXXX-ray-richardsons-projects-XXXXX.vercel.app`

**❌ Failure (if you see):**
- `rmgdri-website-git-...` (means still using old project)

### Expected Build Result

With environment variables properly configured in `rmgdri-site`:
- ✅ Build should pass "Collecting page data" stage
- ✅ Build should complete successfully
- ✅ No "NEXT_PUBLIC_SANITY_PROJECT_ID is required" error

---

## Environment Variables (Configured in rmgdri-site)

Set via TTP-12A-04/05 on 2026-02-12:
- `NEXT_PUBLIC_SANITY_PROJECT_ID` = "17o8qiin" (Preview + Production)
- `NEXT_PUBLIC_SANITY_DATASET` = "production" (Preview + Production)
- `SANITY_API_TOKEN` = Encrypted (Preview + Production)

---

## Timeline

- **11:44 AM**: Set env vars in rmgdri-site (TTP-12A-04/05)
- **11:57 AM**: Successful manual redeploy (TTP-12A-06)
- **~1:00 PM**: Subsequent pushes deployed to wrong project (rmgdri-website)
- **2:03 PM**: Disconnected rmgdri-website from GitHub
- **2:03 PM**: Pushed trigger commit 5bfc4f4
- **~2:05 PM**: Expected clean build on rmgdri-site

---

## Next Steps

**Once verified:**
1. Confirm Lori's Preview URL is the new `rmgdri-site-git-...` domain
2. Update TTP-12A-08 Lori review packet if URL changed
3. Mark this cutover as complete

**If build still fails:**
1. Check which project received the deployment
2. If still wrong project, may need to check Vercel Git integration settings
3. Verify `.vercel/project.json` points to correct project

---

**Status**: ⏳ Awaiting Vercel rebuild
