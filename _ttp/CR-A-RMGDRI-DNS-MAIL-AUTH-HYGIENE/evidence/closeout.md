# CR-A — RMGDRI DNS / Mail Authentication Hygiene — Closeout

**CR:** Issue #139
**Branch:** `hotfix/139-cr-a-dns-mail-hygiene-evidence` (off `origin/main` @ `0a54fe6`)
**Mode executed:** Gate A only (evidence-only)
**Operator:** Claude Code
**Date:** 2026-05-06 UTC

## Final disposition

**`PASS-WITH-BLOCKERS`** — evidence complete, DNS change blocked by missing mailbox/sender info. No DNS modifications were made.

## Gate completion

| Gate | Status | Notes |
|---|---|---|
| **A — Evidence** | PASS | MX/SPF/DKIM/DMARC dual-source verified; sender inventory built; legacy IP attribution via reverse DNS captured. |
| **B — DMARC `p=none`** | NOT EXECUTED — recommendation filed | Blocked on (a) Lori-side `dmarc-reports@rmgreatdane.org` mailbox/alias confirmation, (b) explicit Ray authorization. |
| **C — SPF cleanup** | NOT EXECUTED — recommendation filed | Blocked on (a) closing 5 UNKNOWN rows in sender inventory, (b) ≥2 weeks of DMARC aggregate report data, (c) Ray authorization, (d) Lori confirmation that Newtek/IPM mail is fully retired. |

## Critical findings (executive)

1. **Resend missing from SPF.** `src/app/api/forms/volunteer-survey/submit/route.ts` sends transactional mail via Resend as `surveys@rmgreatdane.org`. Current SPF does not include Resend. Single highest-value defect.
2. **Google Workspace DKIM appears not configured.** Only `default._domainkey` is present (most likely an IPM/Newtek legacy key). No Google standard selectors return a record. Outbound Google Workspace mail from this domain is therefore likely DKIM-unsigned at the domain level.
3. **DMARC absent.** No monitoring, no policy.
4. **SPF carries 4 legacy/unattributed IPs.** Two reverse-DNS to Newtek shared hosting (IPM legacy), one has no PTR, one resolves to a SoftLayer/IBM Cloud reverse — likely all stale post-cutover.

## Stop conditions encountered

- ✅ DMARC mailbox/alias not confirmed → Gate B blocked.
- ✅ Sender inventory has UNKNOWN entries (5) → Gate C blocked.
- ✅ SPF cleanup has not been executed.
- (No multi-SPF or malformed-DKIM blockers triggered — single SPF, valid DKIM record.)
- (No web-routing impact — A records and `www` left untouched.)

## Evidence artifacts

| File | Purpose |
|---|---|
| `gate-a-dns-mail-inventory.md` | Executive summary of DNS/mail state |
| `gate-a-dig-results.txt` | Raw `dig` output (16 sections, 4 resolvers, 9 selector probes, 4 reverse-DNS attributions) |
| `sender-inventory.tsv` | Full sender enumeration with status, evidence, required SPF mechanism |
| `dmarc-recommendation.md` | Proposed DMARC `p=none` records (preferred + conservative forms) |
| `spf-cleanup-recommendation.md` | Mechanism-by-mechanism analysis + proposed simplified SPF (NOT for execution yet) |
| `closeout.md` | This file |

## Out-of-scope items observed

These were noticed during Gate A but are **NOT in CR-A scope**:

- Apex A record migrated to Vercel anycast IPs (`216.198.79.1`, `64.29.17.1`) instead of the `76.76.21.21` listed in the CR description — Vercel-side infra change, not a defect.
- Two `google-site-verification` TXT records — possible redundancy.
- `default._domainkey` DKIM record will eventually need retirement alongside legacy IP cleanup (CR-B / SPF tightening territory).

## Required follow-ups

| Action | Owner | Blocking? |
|---|---|---|
| Confirm/create `dmarc-reports@rmgreatdane.org` mailbox or alias | Lori | Gate B |
| Inventory Supabase auth email config (SMTP relay or default Supabase sender) | Lori (Supabase Project Settings → Auth → Email) | Gate C |
| Inventory Jotform sender configuration (default vs custom from) | Lori | Gate C |
| Inventory donation/payment platform sender(s) | Lori | Gate C |
| Inventory newsletter/marketing sender(s) | Lori | Gate C |
| Inventory CRM/automation sender(s) | Lori | Gate C |
| Generate Google Workspace DKIM key + publish | Lori (Google Admin Console) | DKIM alignment for DMARC |
| Authorize Gate B DMARC publish | Ray | Gate B |
| Authorize Gate C SPF replacement (after inventory + ≥2 weeks DMARC reports) | Ray | Gate C |

## Compliance with CR-A scope guards

- ✅ No Cloudflare nameserver changes
- ✅ No Vercel DNS changes
- ✅ No apex or `www` record changes
- ✅ No deletion of cPanel/IPM legacy records (recommendation only, no execution)
- ✅ No SPF cleanup executed
- ✅ No DMARC `quarantine` or `reject`
- ✅ No DKIM rotation
- ✅ No Google Workspace admin changes
- ✅ No code changes
- ✅ No Supabase middleware work
- ✅ No CR-B execution
- ✅ No CR-C execution
