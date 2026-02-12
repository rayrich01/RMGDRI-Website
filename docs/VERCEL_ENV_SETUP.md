# Vercel Environment Variable Configuration

**Date:** February 11, 2026
**Purpose:** Ensure Vercel builds succeed with proper Sanity configuration

---

## Required Environment Variables

Configure these in Vercel Project Settings → Environment Variables:

### **1. Sanity CMS Configuration**

#### `NEXT_PUBLIC_SANITY_PROJECT_ID` (Required)
- **Value:** `17o8qiin`
- **Scope:** Production, Preview, Development
- **Visibility:** Public (NEXT_PUBLIC prefix exposes to client)
- **Purpose:** Sanity project identifier for fetching content

#### `NEXT_PUBLIC_SANITY_DATASET` (Required)
- **Value:** `production`
- **Scope:** Production, Preview, Development
- **Visibility:** Public
- **Purpose:** Sanity dataset to query (production/staging/development)

#### `NEXT_PUBLIC_SANITY_API_VERSION` (Optional - uses default)
- **Value:** `2024-01-01` or current date
- **Scope:** Production, Preview, Development
- **Visibility:** Public
- **Purpose:** API version for Sanity queries (defaults to 2024-01-01 in code)

---

### **2. Sanity Write Token (Server-Side Only)**

#### `SANITY_API_TOKEN` (Optional - for mutations only)
- **Value:** `<your-sanity-write-token>`
- **Scope:** Production, Preview (NOT Development - use local .env.local)
- **Visibility:** **Secret** (server-side only, no NEXT_PUBLIC prefix)
- **Purpose:** Authentication for creating/updating Sanity content
- **Security:** Never expose in client code or commit to git

---

### **3. Cloudflare R2 Configuration (Optional)**

If using R2 for asset storage:

#### `R2_ACCOUNT_ID`
- **Value:** `a0e38ddcd3982e7cf60a00a64f901dac`
- **Scope:** Production, Preview, Development
- **Visibility:** Secret

#### `R2_ACCESS_KEY_ID`
- **Value:** `ba210a9688984df5d4b1c45861d0f808`
- **Scope:** Production, Preview, Development
- **Visibility:** Secret

#### `R2_SECRET_ACCESS_KEY`
- **Value:** `cf2537a511860733a3ca80a680fd3d042348856dae9810eaaa42410cd478e217`
- **Scope:** Production, Preview, Development
- **Visibility:** Secret

#### `R2_BUCKET_NAME`
- **Value:** `rmgdri`
- **Scope:** Production, Preview, Development
- **Visibility:** Secret

#### `R2_ENDPOINT`
- **Value:** `https://a0e38ddcd3982e7cf60a00a64f901dac.r2.cloudflarestorage.com`
- **Scope:** Production, Preview, Development
- **Visibility:** Secret

---

## Production-Strict Enforcement

### How It Works

The Sanity client (`src/lib/sanity/client.ts`) now enforces strict configuration:

**Production/Vercel Builds:**
- `NEXT_PUBLIC_SANITY_PROJECT_ID` **MUST** be set
- Build **WILL FAIL** with clear error if missing:
  ```
  Error: NEXT_PUBLIC_SANITY_PROJECT_ID is required in production.
  Configure it in Vercel environment variables.
  ```

**Local Development:**
- Falls back to `17o8qiin` if not in `.env.local`
- Allows development without explicit configuration
- Convenient for local testing

### Why This Matters

**Prevents:**
- Silent config drift
- Publishing wrong content source
- Accidental production builds with dev data

**Ensures:**
- Explicit configuration in production
- Clear error messages when misconfigured
- No "accidentally succeeding" scenarios

---

## Setup Steps

### 1. Access Vercel Project Settings

```bash
# Navigate to your project
https://vercel.com/[your-team]/rmgdri-website

# Go to Settings → Environment Variables
```

### 2. Add Required Variables

For each variable above:

1. Click **"Add New"**
2. Enter **Key** (e.g., `NEXT_PUBLIC_SANITY_PROJECT_ID`)
3. Enter **Value** (e.g., `17o8qiin`)
4. Select **Environments:**
   - ✅ Production
   - ✅ Preview
   - ✅ Development
5. Click **"Save"**

### 3. Redeploy to Apply Changes

After adding variables:

```bash
# Option 1: Push a new commit (triggers automatic deployment)
git push

# Option 2: Manually redeploy from Vercel dashboard
# Deployments → [...] Menu → Redeploy
```

### 4. Verify Build Logs

Check deployment logs for:

✅ **Success indicators:**
```
Creating an optimized production build ...
✓ Compiled successfully
✓ Generating static pages (26/26)
```

❌ **Failure indicators (if env vars missing):**
```
Error: NEXT_PUBLIC_SANITY_PROJECT_ID is required in production.
Configure it in Vercel environment variables.
```

---

## Verification Checklist

After setup, verify:

- [ ] All required env vars exist in Vercel settings
- [ ] Variables are scoped to Production, Preview, Development
- [ ] Public vars use `NEXT_PUBLIC_` prefix
- [ ] Secret vars (tokens) do NOT use `NEXT_PUBLIC_` prefix
- [ ] Build succeeds without fallback warnings
- [ ] Content loads correctly from Sanity
- [ ] No 404s or data fetch errors on deployed site

---

## Troubleshooting

### Build Fails: "Configuration must contain projectId"

**Cause:** `NEXT_PUBLIC_SANITY_PROJECT_ID` not set in Vercel

**Fix:**
1. Add `NEXT_PUBLIC_SANITY_PROJECT_ID=17o8qiin` in Vercel settings
2. Ensure it's enabled for the deployment environment
3. Redeploy

### Build Succeeds but Shows Wrong Content

**Cause:** Using incorrect project ID or dataset

**Fix:**
1. Verify `NEXT_PUBLIC_SANITY_PROJECT_ID=17o8qiin`
2. Verify `NEXT_PUBLIC_SANITY_DATASET=production`
3. Check Sanity Studio matches expected project

### Local Dev Works, Vercel Fails

**Cause:** Local uses `.env.local`, Vercel needs explicit config

**Fix:**
1. Copy values from `.env.local` to Vercel settings
2. Ensure variable names match exactly (including `NEXT_PUBLIC_` prefix)

---

## Security Best Practices

### ✅ DO:
- Use `NEXT_PUBLIC_` for client-side env vars (project ID, dataset)
- Use server-only vars (no prefix) for tokens/secrets
- Scope secrets to Production/Preview only (not Development)
- Rotate tokens regularly
- Use read-only tokens when possible

### ❌ DON'T:
- Commit `.env.local` to git (already in `.gitignore`)
- Expose write tokens in client code
- Use the same token across environments
- Share tokens in public channels

---

## References

- **Vercel Environment Variables:** https://vercel.com/docs/concepts/projects/environment-variables
- **Next.js Environment Variables:** https://nextjs.org/docs/basic-features/environment-variables
- **Sanity API Tokens:** https://www.sanity.io/docs/http-auth

---

## Current Configuration Status

**Last Updated:** February 11, 2026

| Variable | Required | Configured | Notes |
|----------|----------|------------|-------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | ✅ | ⏳ Pending | Set to `17o8qiin` |
| `NEXT_PUBLIC_SANITY_DATASET` | ✅ | ⏳ Pending | Set to `production` |
| `SANITY_API_TOKEN` | ⚠️ Optional | ⏳ Pending | Only if mutations needed |
| R2 Variables | ⚠️ Optional | ⏳ Pending | Only if using R2 storage |

**Action Required:** Configure Sanity variables in Vercel before next deployment
