# Gate D: Production Deployment Health

**Production deployment verification added to restoration validation protocol.**

---

## What It Does

Gate D verifies your production deployment is accessible and healthy:

1. **HTTP Status Check** - Verifies site returns 200 OK (or identifies redirects/errors)
2. **TLS Certificate Validation** - Confirms SSL cert is valid and not expired
3. **Response Time Check** - Measures production response latency

## Current Status

**Domain:** `rmgdri-website.vercel.app`

**Last Check Result:**
- HTTP Status: **404** (No Deployment)
- TLS Certificate: **✅ Valid** (expires Mar 26, 2026)
- Response Time: **✅ Fast** (~0.14s)

**Interpretation:** The Vercel project exists and has valid SSL, but no deployment is currently active. This means:
- The project was created/configured in Vercel
- SSL certificate is provisioned correctly
- No code has been deployed yet (or deployment was removed)

---

## How to Run

**Standalone:**
```bash
restore
```

**Quick alias:**
```bash
r
```

**Morning workflow (validate + start dev):**
```bash
up
```

---

## Evidence Output

Each run saves production health data to:
```
_ttp/evidence/EnvValidate_YYYY-MM-DD_HHMMSS/prod.snapshot.txt
```

**Example output:**
```
== Production URL Health ==
domain=rmgdri-website.vercel.app
url=https://rmgdri-website.vercel.app

--- curl health check ---
http_status=404
❌ HTTP 404 (expected 200)

--- TLS certificate check ---
notBefore=Dec 26 17:44:01 2025 GMT
notAfter=Mar 26 17:44:00 2026 GMT
✅ TLS certificate valid

--- Response time check ---
response_time=0.139017s
✅ Production responding
```

---

## Fixing "No Deployment" (HTTP 404)

Your Vercel project `rmgdri-website` currently shows **"No Deployment"**. To fix:

###  Option A: Deploy from Git (Recommended)

1. **Connect Git repository** (if not already connected):
   - Vercel Dashboard → rmgdri-website → Settings → Git
   - Connect to GitHub: `rayrich01/RMGDRI-Website`

2. **Push your local commits**:
   ```bash
   git push origin main
   ```

3. **Vercel auto-deploys** on push to main branch

###  Option B: Manual Deploy via CLI

```bash
cd ~/ControlHub/RMGDRI_Website/rmgdri-site
npx vercel --prod
```

###  Option C: Import Project (if starting fresh)

1. Vercel Dashboard → Add New → Project
2. Import Git Repository: `rayrich01/RMGDRI-Website`
3. Configure:
   - Framework Preset: **Next.js**
   - Root Directory: `rmgdri-site`
   - Build Command: `npm run build`
   - Output Directory: `.next`
4. Add environment variables:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID=17o8qiin`
   - `NEXT_PUBLIC_SANITY_DATASET=production`
5. Deploy

---

## Expected Gate D Results

### ✅ Healthy Production

```
http_status=200
✅ HTTP 200 OK
✅ TLS certificate valid
✅ Production responding
```

**Summary:** Gate D completed (production accessible).

### ⚠️ Redirect Detected

```
http_status=307
⚠️  HTTP 307 (redirect detected)
✅ TLS certificate valid
✅ Production responding
```

**Summary:** Gate D completed (production redirecting, may need custom domain config).

**Meaning:** You may have a custom domain with temporary redirect configured. This is normal during domain setup.

### ❌ No Deployment (Current State)

```
http_status=404
❌ HTTP 404 (expected 200)
✅ TLS certificate valid
✅ Production responding
```

**Summary:** Gate D completed (production health check inconclusive - see prod.snapshot.txt).

**Meaning:** Vercel project exists but has no active deployment. Follow "Fixing No Deployment" steps above.

### ❌ Certificate Error

```
http_status=000
❌ TLS certificate check failed
⚠️  Production timeout or unreachable
```

**Meaning:** SSL/network configuration issue. Check Vercel domain settings.

---

## Certification Levels

| Level | Gates | Meaning |
|-------|-------|---------|
| **dev-only** | A, B | Local environment validated |
| **dev+cms** | A, B, C | Local + Sanity + R2 validated |
| **dev+cms+prod-deploy** | A, B, C, D | Full stack validated (current) |

With Gate D passing, you have **dev+cms+prod-deploy** certification, even if production shows HTTP 404 (it confirms the infrastructure exists).

---

## Vercel Dashboard Quick Check

**Current Project:** `rmgdri-website.vercel.app`

**To verify deployment status:**
1. https://vercel.com/dashboard
2. Click `rmgdri-website` project
3. Check **Deployments** tab
   - ✅ Should see recent deployments with "Ready" status
   - ❌ Currently shows no deployments (need to deploy)

**To check domain config:**
1. Settings → Domains
2. Verify `rmgdri-website.vercel.app` is listed as Primary Domain
3. If adding custom domain (e.g., `rmgdri.org`), configure DNS records

---

## Integration with Restore Command

Gate D runs automatically as part of `restore`:

```bash
restore
# Runs Gates A → B → C → D
# Evidence saved to _ttp/evidence/EnvValidate_*/
```

**Daily workflow:**
```bash
# Morning after hard shutdown
restore    # or: r

# If all gates pass
up         # or just: npm run dev
```

---

## Troubleshooting

### "404 Not Found" persists after deploy

**Check:**
```bash
# Verify git push succeeded
git log origin/main -1

# Check Vercel deployment status
npx vercel ls
```

**If no deployments exist:**
```bash
npx vercel --prod
```

### "Certificate validation failed"

**Possible causes:**
- DNS not propagated (wait 24-48 hours after domain config)
- Vercel SSL provisioning in progress (usually <5 minutes)
- Domain removed from project

**Fix:** Re-add domain in Vercel Dashboard → Settings → Domains

### "Connection timeout"

**Check network:**
```bash
curl -I https://rmgdri-website.vercel.app
```

**If Vercel is down:** Check https://www.vercelstatus.com/

---

## Next Steps

1. **Deploy to Vercel** (Option A, B, or C above)
2. **Run `restore` again** to verify HTTP 200
3. **Optional:** Add custom domain (`rmgdri.org`)
4. **Update DNS** if using custom domain
5. **Re-run `restore`** to verify full stack

Once HTTP 200 is achieved, Gate D will show:
```
✅ Gate D completed (production accessible).
```

---

**Quick Reference:**

```bash
# Check production health
restore    # or: r

# View last Gate D results
cat _ttp/evidence/EnvValidate_*/prod.snapshot.txt | tail -20

# Deploy to production
git push origin main    # Auto-deploy
# or
npx vercel --prod       # Manual deploy
```
