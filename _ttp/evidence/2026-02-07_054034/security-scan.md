## token scan (excluding node_modules/.git/.next/.sanity)
./.env.local.example:16:SANITY_API_TOKEN=your_sanity_token
./SECURITY_GUIDELINES.md:17:SANITY_AUTH_TOKEN=your-token-here
./SECURITY_GUIDELINES.md:36:SANITY_AUTH_TOKEN=$(npx sanity debug 2>&1 | grep "Auth token" | sed 's/.*Auth token: //' | sed "s/\x1b\[[0-9;]*m//g") \
./SECURITY_GUIDELINES.md:42:1. **Immediately revoke the token:**
./SECURITY_GUIDELINES.md:81:TOKEN=$(npx sanity debug 2>&1 | grep "Auth token" | sed 's/.*Auth token: //' | sed "s/\x1b\[[0-9;]*m//g")
./SECURITY_GUIDELINES.md:84:SANITY_AUTH_TOKEN="$TOKEN" node scripts/upload-image-secure.js "$1" "$2"
./package-lock.json:5114:      "integrity": "sha512-U9Qpc9JefEXb1ykflZoYdFskAfVemCHNzTwKoG7nyRnO0DMmvitsoQwYl9JCcFVU2tR8MGmJu5cs4jVMiyOEPQ==",
./package-lock.json:7708:      "integrity": "sha512-cYpCpp29z6EJHa5T9WL0KAlq3SOKUQkcgSoeRfRVwjGgSFl7Uh32eYGt7IDYCX20skiEdRffyDpvF2efEZPC0A==",
./package-lock.json:8750:      "integrity": "sha512-BUwcskRaPvTk6fzVWgDPdUndLjB87KYDrN5EYGetnktoeAvPtO4ONHlAZDnj5VFnUANg0Sjm7j4usBlnoVMHwA==",
./package-lock.json:13016:      "integrity": "sha512-Tpp60P6IUJDTuOq/5Z8cdskzJujfwqfOTkrwIwj7IRISpnkJnT6SyJ4PCPnGMoFjC9ddhal5KVIYtAt97ix05A==",
./package-lock.json:14615:      "integrity": "sha512-p3EcsicXjit7SaskXHs1hA91QxgTw46Fv6EFKKGS5DRFLD8yKnohjF3hxoju94b/OcMZoQukzpPpBE9uLVKzgQ==",
./package-lock.json:16716:      "integrity": "sha512-LDJzPVEEEPR+y48z93A0Ed0yXb8pAByGWo/k5YYdYgpY2/2EsOsksJrq7lOHxryrVOn1ejG6oAp8ahvOIQD8sw==",
./package-lock.json:16770:      "integrity": "sha512-07z8uv2wMyS51kKhD1KsdXJg5WQ6t93RneqRxUHnskXVtlYYkLqM0gqStQZ3pj073g687jPCHrqNfCzawLYh5g==",
./package-lock.json:17298:      "integrity": "sha512-07z8uv2wMyS51kKhD1KsdXJg5WQ6t93RneqRxUHnskXVtlYYkLqM0gqStQZ3pj073g687jPCHrqNfCzawLYh5g==",
./package-lock.json:18617:      "integrity": "sha512-BR7VvDCVHO+q2xBEWskxS6DJE1qRnb7DxzUrogb71CWoSficBxYsiAGd+Kl0mmq/MprG9yArRkyrQxTO6XjMzA==",
./package-lock.json:19397:      "integrity": "sha512-i/n8VsZydrugj3Iuzll8+x/00GH2vnYsk1eomD8QiRrSAeW6ItbCQDtfXCeJHd0iwiNagqjQkvpvREEPtW3IoQ==",
./package-lock.json:19493:      "integrity": "sha512-DhuTmvZWux4H1UOnWMB3sk0sbaCVOoQZjv8u1rDoTV0HTdGem9hkAZtl4JZy8P2z4Bg0nT+YMeOFyVr4zcG5Tw==",
./scripts/README.md:17:SANITY_AUTH_TOKEN=$(npx sanity debug 2>&1 | grep "Auth token" | sed 's/.*Auth token: //' | sed "s/\x1b\[[0-9;]*m//g") \
./scripts/README.md:21:export SANITY_AUTH_TOKEN=$(npx sanity debug 2>&1 | grep "Auth token" | sed 's/.*Auth token: //' | sed "s/\x1b\[[0-9;]*m//g")
./scripts/README.md:29:SANITY_AUTH_TOKEN=$(npx sanity debug 2>&1 | grep "Auth token" | sed 's/.*Auth token: //' | sed "s/\x1b\[[0-9;]*m//g") \
./scripts/rmgdri/import_dog_images.js:35:    token: process.env.SANITY_API_TOKEN,
./scripts/rmgdri/PREFLIGHT.md:82:SANITY_API_TOKEN="your-write-token"
./scripts/rmgdri/PREFLIGHT.md:91:**To generate API token:**
./scripts/rmgdri/PREFLIGHT.md:438:echo 'SANITY_API_TOKEN="your-token-here"' >> .env.local
./scripts/rmgdri/import_dog_images.ts:150:  token: process.env.SANITY_API_TOKEN,
./scripts/rmgdri/README_IMPORT.md:51:SANITY_API_TOKEN="your-api-token-with-write-permissions"
./_ttp/evidence/2026-02-07_054021/security-scan.md:2:./.env.local.example:16:SANITY_API_TOKEN=your_sanity_token
./_ttp/evidence/2026-02-07_054021/security-scan.md:3:./SECURITY_GUIDELINES.md:17:SANITY_AUTH_TOKEN=your-token-here
./_ttp/evidence/2026-02-07_054021/security-scan.md:4:./SECURITY_GUIDELINES.md:36:SANITY_AUTH_TOKEN=$(npx sanity debug 2>&1 | grep "Auth token" | sed 's/.*Auth token: //' | sed "s/\x1b\[[0-9;]*m//g") \
./_ttp/evidence/2026-02-07_054021/security-scan.md:5:./SECURITY_GUIDELINES.md:42:1. **Immediately revoke the token:**
./_ttp/evidence/2026-02-07_054021/security-scan.md:6:./SECURITY_GUIDELINES.md:81:TOKEN=$(npx sanity debug 2>&1 | grep "Auth token" | sed 's/.*Auth token: //' | sed "s/\x1b\[[0-9;]*m//g")
./_ttp/evidence/2026-02-07_054021/security-scan.md:7:./SECURITY_GUIDELINES.md:84:SANITY_AUTH_TOKEN="$TOKEN" node scripts/upload-image-secure.js "$1" "$2"
./_ttp/evidence/2026-02-07_054021/security-scan.md:8:./package-lock.json:5114:      "integrity": "sha512-U9Qpc9JefEXb1ykflZoYdFskAfVemCHNzTwKoG7nyRnO0DMmvitsoQwYl9JCcFVU2tR8MGmJu5cs4jVMiyOEPQ==",
./_ttp/evidence/2026-02-07_054021/security-scan.md:9:./package-lock.json:7708:      "integrity": "sha512-cYpCpp29z6EJHa5T9WL0KAlq3SOKUQkcgSoeRfRVwjGgSFl7Uh32eYGt7IDYCX20skiEdRffyDpvF2efEZPC0A==",
./_ttp/evidence/2026-02-07_054021/security-scan.md:10:./package-lock.json:8750:      "integrity": "sha512-BUwcskRaPvTk6fzVWgDPdUndLjB87KYDrN5EYGetnktoeAvPtO4ONHlAZDnj5VFnUANg0Sjm7j4usBlnoVMHwA==",
./_ttp/evidence/2026-02-07_054021/security-scan.md:11:./package-lock.json:13016:      "integrity": "sha512-Tpp60P6IUJDTuOq/5Z8cdskzJujfwqfOTkrwIwj7IRISpnkJnT6SyJ4PCPnGMoFjC9ddhal5KVIYtAt97ix05A==",
./_ttp/evidence/2026-02-07_054021/security-scan.md:12:./package-lock.json:14615:      "integrity": "sha512-p3EcsicXjit7SaskXHs1hA91QxgTw46Fv6EFKKGS5DRFLD8yKnohjF3hxoju94b/OcMZoQukzpPpBE9uLVKzgQ==",
./_ttp/evidence/2026-02-07_054021/security-scan.md:13:./package-lock.json:16716:      "integrity": "sha512-LDJzPVEEEPR+y48z93A0Ed0yXb8pAByGWo/k5YYdYgpY2/2EsOsksJrq7lOHxryrVOn1ejG6oAp8ahvOIQD8sw==",
./_ttp/evidence/2026-02-07_054021/security-scan.md:14:./package-lock.json:16770:      "integrity": "sha512-07z8uv2wMyS51kKhD1KsdXJg5WQ6t93RneqRxUHnskXVtlYYkLqM0gqStQZ3pj073g687jPCHrqNfCzawLYh5g==",
./_ttp/evidence/2026-02-07_054021/security-scan.md:15:./package-lock.json:17298:      "integrity": "sha512-07z8uv2wMyS51kKhD1KsdXJg5WQ6t93RneqRxUHnskXVtlYYkLqM0gqStQZ3pj073g687jPCHrqNfCzawLYh5g==",
./_ttp/evidence/2026-02-07_054021/security-scan.md:16:./package-lock.json:18617:      "integrity": "sha512-BR7VvDCVHO+q2xBEWskxS6DJE1qRnb7DxzUrogb71CWoSficBxYsiAGd+Kl0mmq/MprG9yArRkyrQxTO6XjMzA==",
./_ttp/evidence/2026-02-07_054021/security-scan.md:17:./package-lock.json:19397:      "integrity": "sha512-i/n8VsZydrugj3Iuzll8+x/00GH2vnYsk1eomD8QiRrSAeW6ItbCQDtfXCeJHd0iwiNagqjQkvpvREEPtW3IoQ==",
./_ttp/evidence/2026-02-07_054021/security-scan.md:18:./package-lock.json:19493:      "integrity": "sha512-DhuTmvZWux4H1UOnWMB3sk0sbaCVOoQZjv8u1rDoTV0HTdGem9hkAZtl4JZy8P2z4Bg0nT+YMeOFyVr4zcG5Tw==",
./_ttp/evidence/2026-02-07_054021/security-scan.md:19:./scripts/README.md:17:SANITY_AUTH_TOKEN=$(npx sanity debug 2>&1 | grep "Auth token" | sed 's/.*Auth token: //' | sed "s/\x1b\[[0-9;]*m//g") \
./_ttp/evidence/2026-02-07_054021/security-scan.md:20:./scripts/README.md:21:export SANITY_AUTH_TOKEN=$(npx sanity debug 2>&1 | grep "Auth token" | sed 's/.*Auth token: //' | sed "s/\x1b\[[0-9;]*m//g")
./_ttp/evidence/2026-02-07_054021/security-scan.md:21:./scripts/README.md:29:SANITY_AUTH_TOKEN=$(npx sanity debug 2>&1 | grep "Auth token" | sed 's/.*Auth token: //' | sed "s/\x1b\[[0-9;]*m//g") \
./_ttp/evidence/2026-02-07_054021/security-scan.md:22:./scripts/rmgdri/import_dog_images.js:35:    token: process.env.SANITY_API_TOKEN,
./_ttp/evidence/2026-02-07_054021/security-scan.md:23:./scripts/rmgdri/PREFLIGHT.md:82:SANITY_API_TOKEN="your-write-token"
./_ttp/evidence/2026-02-07_054021/security-scan.md:24:./scripts/rmgdri/PREFLIGHT.md:91:**To generate API token:**
./_ttp/evidence/2026-02-07_054021/security-scan.md:25:./scripts/rmgdri/PREFLIGHT.md:438:echo 'SANITY_API_TOKEN="your-token-here"' >> .env.local
./_ttp/evidence/2026-02-07_054021/security-scan.md:26:./scripts/rmgdri/import_dog_images.ts:150:  token: process.env.SANITY_API_TOKEN,
./_ttp/evidence/2026-02-07_054021/security-scan.md:27:./scripts/rmgdri/README_IMPORT.md:51:SANITY_API_TOKEN="your-api-token-with-write-permissions"
./_ttp/evidence/2026-02-07_054021/security-scan.md:28:./_ttp/README.md:179:- Bearer tokens: `Bearer[[:space:]]+`
./_ttp/evidence/2026-02-07_054021/security-scan.md:29:./src/lib/sanity/client.ts:25:  token: process.env.SANITY_API_TOKEN,
./_ttp/evidence/2026-02-07_054021/security-scan.md:30:./src/lib/ai/client.ts:76:        'Authorization': `Bearer ${AI_CONFIG.apiKey}`,
./_ttp/evidence/2026-02-07_054021/security-scan.md:31:./src/lib/ai/client.ts:103:        'Authorization': `Bearer ${AI_CONFIG.openaiApiKey}`,
./_ttp/evidence/2026-02-07_054021/security-scan.md:32:./src/lib/ai/client.ts:231:        'Authorization': `Bearer ${AI_CONFIG.apiKey}`,
./_ttp/README.md:179:- Bearer tokens: `Bearer[[:space:]]+`
./src/lib/sanity/client.ts:25:  token: process.env.SANITY_API_TOKEN,
./src/lib/ai/client.ts:76:        'Authorization': `Bearer ${AI_CONFIG.apiKey}`,
./src/lib/ai/client.ts:103:        'Authorization': `Bearer ${AI_CONFIG.openaiApiKey}`,
./src/lib/ai/client.ts:231:        'Authorization': `Bearer ${AI_CONFIG.apiKey}`,
✅ No token-like strings found in scanned files

## .env.local presence (should be ignored)
-rw------- 1 brave-kind-ritchie brave-kind-ritchie 380 Feb  3 19:03 .env.local
