# Security Guidelines for RMGDRI Website Development

## 🔒 Never Hardcode Secrets

**NEVER include these in code or chat:**
- Sanity API tokens
- API keys
- Database credentials
- Auth tokens
- Private keys

## ✅ Safe Practices

### 1. Use Environment Variables
Store secrets in `.env.local` (which is gitignored):
```bash
SANITY_AUTH_TOKEN=your-token-here
```

Access in code:
```javascript
const token = process.env.SANITY_AUTH_TOKEN;
```

### 2. Retrieve Tokens When Needed
Instead of storing tokens, retrieve them on-demand:
```bash
# Get token temporarily
npx sanity debug
```

### 3. Use Secure Scripts
Use the provided secure scripts in `scripts/` directory:
```bash
# Upload image securely
SANITY_AUTH_TOKEN=$(npx sanity debug 2>&1 | grep "Auth token" | sed 's/.*Auth token: //' | sed "s/\x1b\[[0-9;]*m//g") \
node scripts/upload-image-secure.js ./image.jpg document-id
```

## 🚨 If a Token is Exposed

1. **Immediately revoke the token:**
   - Go to https://www.sanity.io/manage
   - Navigate to: Your Project → API → Tokens
   - Delete the exposed token

2. **Create a new token if needed:**
   - Same location in Sanity Manage
   - Give it minimal required permissions
   - Store securely in `.env.local`

3. **Check for exposure:**
   - Search git history: `git log -S "token-string"`
   - Check chat transcripts
   - Review any shared documentation

## 📋 Pre-Commit Checklist

Before committing or sharing code:
- [ ] No hardcoded tokens or API keys
- [ ] `.env.local` is in `.gitignore`
- [ ] No sensitive data in comments
- [ ] Secrets use environment variables
- [ ] No tokens in screenshot/demo data

## 🛡️ AI Coding Assistant Guidelines

When using Claude Code or similar AI assistants:
- **DO NOT** paste tokens directly in chat
- **DO** use environment variables in code examples
- **DO** retrieve tokens dynamically when needed
- **DO** redact sensitive info before sharing logs
- **DO** remind the AI to use secure practices

## 📝 Secure Script Templates

### Image Upload (Secure)
```bash
#!/bin/bash
# Get token from Sanity CLI (not hardcoded)
TOKEN=$(npx sanity debug 2>&1 | grep "Auth token" | sed 's/.*Auth token: //' | sed "s/\x1b\[[0-9;]*m//g")

# Use token in environment variable
SANITY_AUTH_TOKEN="$TOKEN" node scripts/upload-image-secure.js "$1" "$2"
```

### Document Creation (Secure)
```bash
#!/bin/bash
# Use Sanity CLI which handles auth automatically
npx sanity documents create document.json --dataset production
```

## 🔍 Monitoring

Regularly check:
- `.gitignore` includes `.env*`
- No `.env.local` in git history
- No tokens in public repositories
- Sanity token usage logs (in Sanity Manage)

## 📚 Resources

- [Sanity Security Best Practices](https://www.sanity.io/docs/security)
- [Environment Variables in Next.js](https://nextjs.org/docs/basic-features/environment-variables)
- [Git Secret Management](https://github.com/git-secret/git-secret)

---

**Last Updated:** February 6, 2026
**Maintainer:** RMGDRI Development Team
