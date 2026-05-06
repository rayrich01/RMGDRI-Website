# SPF Cleanup Recommendation — rmgreatdane.org

## Current SPF (verbatim, dual-source verified)

```
v=spf1 ip4:75.103.66.18 ip4:75.103.66.54 +a +mx +ip4:63.135.124.200 +ip4:74.86.152.99 ~all
```

Source: dig @lee.ns.cloudflare.com / @olga.ns.cloudflare.com / @1.1.1.1 / @8.8.8.8 — all returned identical record. Single SPF record (no duplicates).

## Mechanism-by-mechanism analysis

| Mechanism | Authorizes | Reverse DNS / Attribution | Action |
|---|---|---|---|
| `ip4:75.103.66.18` | one IP | `cloudwebx16.newtekwebhosting.com` (Newtek shared hosting — IPM legacy) | **Remove pending Lori confirmation** that no Newtek-hosted scripts still send mail. |
| `ip4:75.103.66.54` | one IP | `sharedwebx102.newtekwebhosting.com` (Newtek shared hosting — IPM legacy) | **Remove pending Lori confirmation.** |
| `+a` | the A-record IPs of `rmgreatdane.org` (currently Vercel: 216.198.79.1, 64.29.17.1) | Vercel CDN — does not send mail | **Remove** — Vercel does not originate mail. Legacy holdover. |
| `+mx` | the MX hosts (Google Workspace `aspmx.l.google.com` etc.) | Google Workspace | **Replace** with explicit `include:_spf.google.com` (Google's recommended mechanism — survives MX changes). |
| `+ip4:63.135.124.200` | one IP | no PTR record | **Remove pending attribution research.** No reverse DNS — likely defunct. Risk: low. |
| `+ip4:74.86.152.99` | one IP | `63.98.564a.ip4.static.sl-reverse.com` (SoftLayer / IBM Cloud — possibly archaic IPM mail relay) | **Remove pending Lori confirmation.** |
| `~all` | softfail-everything-else | — | **Keep** at `~all` until DMARC `p=none` reports validate authorized senders are not omitted. Then can tighten to `-all`. |

## Missing senders (must be ADDED before tightening)

| Sender | Required mechanism | Source |
|---|---|---|
| **Resend** | `include:_spf.resend.com` *(or domain-verified equivalent)* | `src/app/api/forms/volunteer-survey/submit/route.ts` calls Resend API with from = `surveys@rmgreatdane.org`. |
| Jotform (if Lori has configured custom-from) | depends on Jotform's documented sender block | Lori-side check required |
| Donation/newsletter/CRM (if any) | depends | Lori-side inventory required |

## Proposed simplified SPF (NOT for execution yet)

If sender inventory is fully resolved AND only Google Workspace + Resend are confirmed:

```
v=spf1 include:_spf.google.com include:_spf.resend.com ~all
```

If only Google Workspace is confirmed (no Resend in use, e.g. RESEND_API_KEY unset and route unused):

```
v=spf1 include:_spf.google.com ~all
```

If additional senders confirmed, append their includes BEFORE `~all`. SPF allows up to 10 DNS lookups total; current proposal at 2 includes leaves headroom.

## Execution gating

Per CR-A scope, **no SPF change is executed in this CR**. Execution requires:

1. Sender inventory complete with **zero UNKNOWN** rows in `sender-inventory.tsv`.
2. DMARC `p=none` with reporting deployed and at least 2 weeks of aggregate reports collected — confirms no in-the-wild senders are being missed.
3. Lori-side confirmation of legacy IP retirement.
4. Explicit Ray authorization for SPF replacement.

Until those gate conditions are met:

```
SPF cleanup status: BLOCKED — sender inventory incomplete (5 UNKNOWN rows)
```

## Risk assessment of current SPF

| Risk | Severity | Notes |
|---|---|---|
| Legacy Newtek IPs in SPF | LOW | They allow but don't require mail; if Newtek hosts no longer exist they cannot impersonate; only risk is that DMARC alignment data will be noisy. |
| Resend missing from SPF | MEDIUM | Resend mail will **fail SPF** today. Receivers without DMARC honor SPF for delivery decisions; some providers may bucket as spam. Adding Resend's include is the single highest-value SPF change. |
| `+a` allowing Vercel CDN IPs | NEGLIGIBLE | Vercel doesn't originate mail; mechanism is inert in practice. |
| `+mx` instead of `include:_spf.google.com` | LOW | Works today (MX is Google), but brittle to MX changes. Google's recommended mechanism is the include. |

## Disposition

`PASS-EVIDENCE-ONLY` — SPF analysis complete; recommendation filed; no DNS changes executed.
