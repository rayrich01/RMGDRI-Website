# Vercel Settings Checklist — RMGDRI Website

## 1) Stop email spam (duplicate project)
- Open **rmgdri-website-project** in Vercel
- Settings → Git → Disconnect repo OR delete project
- Keep only **rmgdri-website**

## 2) Root Directory (must be repo root)
- Open **rmgdri-website**
- Settings → General → Root Directory
- Must be empty or `.`
- Must NOT be `src/` or anything else

## 3) Required environment variables
Settings → Environment Variables (set for Production + Preview + Development):
- NEXT_PUBLIC_SANITY_PROJECT_ID = 17o8qiin
- NEXT_PUBLIC_SANITY_DATASET = production

## 4) Force clean deployment
Deployments → latest → Redeploy → enable **Clear Cache**
