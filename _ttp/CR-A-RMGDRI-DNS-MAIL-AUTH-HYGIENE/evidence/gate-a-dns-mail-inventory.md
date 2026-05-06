# Gate A — DNS / Mail Inventory Summary

**Domain:** `rmgreatdane.org`
**CR:** CR-A — RMGDRI DNS / Mail Authentication Hygiene (Issue #139)
**Generated:** 2026-05-06 UTC
**Operator:** Claude Code, read-only DNS queries
**Mode:** Evidence-only — no DNS changes executed

## Authoritative DNS

- Provider: Cloudflare
- Nameservers: `lee.ns.cloudflare.com`, `olga.ns.cloudflare.com` (NS query confirmed)
- Web target: Vercel CDN (`216.198.79.1`, `64.29.17.1`); `www.rmgreatdane.org` CNAME-equivalent → `b3620531f70083b0.vercel-dns-017.com`
- *(Note: CR description listed `A 76.76.21.21` for the apex; current resolution returns `216.198.79.1`/`64.29.17.1`. This is a Vercel-side anycast/CDN update unrelated to mail. Out of CR-A scope.)*

## MX

| Source | Records |
|---|---|
| `@lee.ns.cloudflare.com` | `1 aspmx.l.google.com.`, `5 alt1`, `5 alt2`, `10 alt3`, `10 alt4` |
| `@olga.ns.cloudflare.com` | identical |
| `@1.1.1.1` (Cloudflare resolver) | identical |
| `@8.8.8.8` (Google resolver) | identical |

**Verdict:** ✅ Healthy. Standard 5-record Google Workspace MX set, consistent across authoritative + public resolvers.

## SPF

```
v=spf1 ip4:75.103.66.18 ip4:75.103.66.54 +a +mx +ip4:63.135.124.200 +ip4:74.86.152.99 ~all
```

Single record, dual-source verified. **Concerns:**

- 4 hardcoded IPs reverse-DNS to **Newtek shared hosting (IPM legacy)** and **SoftLayer/IBM Cloud** — likely stale post-cutover.
- `+a` authorizes Vercel A-record IPs (Vercel does not originate mail — mechanism inert).
- `+mx` authorizes Google Workspace MX hosts. Works today but brittle. Google recommends `include:_spf.google.com` instead.
- **Resend** transactional email sender (used in repo for volunteer-survey notifications, sending as `surveys@rmgreatdane.org`) is **NOT included** in SPF — outbound Resend mail SPF-fails today.

See `spf-cleanup-recommendation.md`.

## DKIM

| Selector | Result |
|---|---|
| `default._domainkey` | ✅ present, 2048-bit RSA, `v=DKIM1; k=rsa; p=…` |
| `google._domainkey` | ❌ absent |
| `google2024/2025/2026._domainkey` | ❌ absent |
| `selector1/selector2/mail/s1/s2._domainkey` | ❌ absent |

**Concerns:**

- The `default` selector is uncommon for Google Workspace, which uses a custom selector chosen at DKIM-key-generation time in Google Admin Console. The `default` key is most likely from the **legacy IPM/cPanel/Newtek mail server**, not Google Workspace.
- **Google Workspace DKIM is therefore likely NOT publishing for this domain** — outbound Google mail is unsigned at the domain level (which means DMARC alignment via DKIM cannot succeed for Google Workspace mail today).
- The `default._domainkey` record can stay until SPF cleanup is executed, after which it should be retired alongside the IPM legacy IPs.

**Lori-side action required:** generate a Google Workspace DKIM key in Google Admin → Apps → Google Workspace → Gmail → Authenticate email → Generate new record (2048-bit). Publish the resulting TXT at the selector Google provides (typically `google._domainkey.rmgreatdane.org` but can vary).

## DMARC

| Source | Result |
|---|---|
| `_dmarc.rmgreatdane.org` TXT @ all 4 resolvers | **ABSENT** |
| `_dmarc.rmgreatdane.org` CNAME | absent (not aliased) |

**Verdict:** No DMARC policy. Receivers default to per-receiver heuristics; RMGDRI has zero visibility into spoofing or auth failures.

See `dmarc-recommendation.md`.

## Other TXT records

- `google-site-verification=Grzq2Py3gAzzkDfhpC4jqEv9THclvUZxkevnUw_8qJI` — Google site/Workspace verification (keep).
- `google-site-verification=rxcnlOAHWFO8atdP3VUlj_e_zxgz_M5tlBYQyEV50XU` — second Google verification token, possibly redundant (different property?).
- *(No SiteVerification cleanup is in this CR's scope.)*

## Sender inventory snapshot

`sender-inventory.tsv` — full TSV. Summary counts:

- CONFIRMED-SENDER: **2** (Google Workspace, Resend)
- NOT-A-SENDER: **5** (Newtek/IPM legacy, Vercel, board personal Gmail aliases, non-Jotform contact forms, adoption/foster/intake forms)
- UNKNOWN: **5** (Supabase auth, Jotform, donation/payment, newsletter/marketing, CRM/automation)

**SPF cleanup is BLOCKED on the 5 UNKNOWNs**, all of which require Lori-side inventory (no in-repo evidence).

## Critical findings (summary)

1. **Resend (CONFIRMED-SENDER) is missing from SPF** — single highest-value defect; outbound transactional mail from `surveys@rmgreatdane.org` fails SPF today.
2. **Google Workspace DKIM is likely not configured for this domain** — `default._domainkey` is most likely IPM-legacy; no Google selector is present.
3. **DMARC absent** — no monitoring visibility, no spoofing protection.
4. **SPF references 4 legacy/unattributed IPs** — almost certainly stale; will be removable once sender inventory is closed.

## Disposition

`PASS-EVIDENCE-ONLY` — Gate A complete. Evidence captured, sender inventory generated, recommendations filed. No DNS changes executed. Gate B (DMARC `p=none` publish) is BLOCKED on Lori-side reporting-mailbox confirmation. Gate C (SPF tightening) is BLOCKED on Lori-side sender inventory completion.

## Next-step authorization gates

| Gate | Action | Blocker |
|---|---|---|
| **B** | publish `_dmarc TXT v=DMARC1; p=none; rua=mailto:dmarc-reports@rmgreatdane.org` | (a) Lori creates `dmarc-reports@rmgreatdane.org` mailbox/alias, (b) Ray authorization |
| **C** | publish simplified SPF | (a) sender inventory: 0 UNKNOWN rows, (b) ≥2 weeks of DMARC aggregate reports validate authorized-sender list, (c) Ray authorization, (d) Lori confirms Newtek/IPM mail off |
| (separate) | Google Workspace DKIM | Lori action in Google Admin Console |
