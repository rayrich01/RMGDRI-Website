# Connect GitHub to rmgdri-site Vercel Project

## Issue
After disconnecting rmgdri-website, no deployments are triggering because the GitHub repository is not connected to rmgdri-site.

## Solution: Manual Connection via Vercel Dashboard

1. **Go to**: https://vercel.com/dashboard
2. **Select project**: `rmgdri-site`
3. **Go to**: Settings → Git
4. **Click**: "Connect Git Repository"
5. **Select**: 
   - Repository: `rayrich01/RMGDRI-Website`
   - Production Branch: `main`
6. **Save**

After connection, Vercel will:
- Auto-deploy when pushing to `main`
- Create Preview deployments for all other branches
- Show deployments under `rmgdri-site` project

## Alternative: CLI Method

```bash
# Link project (already done via .vercel/project.json)
npx vercel link --yes

# Check current git integration
npx vercel git status

# If needed, re-link git (may require dashboard)
```

## Verification

Once connected, push a commit and check:
1. Vercel → rmgdri-site → Deployments
2. Should see new deployment with domains: `rmgdri-site-git-...`

## Current Status
- ✅ Local project linked to rmgdri-site (via .vercel/project.json)
- ❌ GitHub repo not connected to rmgdri-site
- Action needed: Manual connection via dashboard

## After Connection
Push any commit to trigger first deployment:
```bash
git commit --allow-empty -m "test: verify Vercel deployment on rmgdri-site"
git push
```
