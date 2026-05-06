# CR-B Gate A — Closeout

**CR:** Issue #140
**Branch:** `hotfix/140-cr-b-cloudflare-legacy-records-evidence` (off `origin/main` @ `44b9fb5`)
**Mode executed:** Gate A only — evidence + inventory
**Operator:** Claude Code
**Date:** 2026-05-06 UTC

## Final disposition

**`PASS-WITH-BLOCKERS`** — audit complete, multiple records blocked by unknown dependencies. **No DNS modifications were made. No Cloudflare UI/API operations were performed.**

## Headline finding

The legacy IPM/Newtek cPanel hosting account is **alive and serving** all the audited surfaces (cPanel admin, WHM, Roundcube webmail, CalDAV, CardDAV, WebDAV, mail-client autoconfig). All 10 audited records are currently **proxied** through Cloudflare. The original Newtek origin IP is masked but reachable behind the proxy.

## Disposition counts

| Disposition | Count | Hostnames |
|---|---|---|
| RETIRE_CANDIDATE | 2 | `ftp.rmgreatdane.org`, `mail.rmgreatdane.org` |
| UNKNOWN_BLOCKED | 8 | `autoconfig`, `autodiscover`, `cpanel`, `cpcalendars`, `cpcontacts`, `webdisk`, `webmail`, `whm` |
| KEEP / KEEP_DNS_ONLY / KEEP_PROXIED | 0 | (none — none confirmed as actively required) |

## Stop conditions encountered

| Stop condition | Triggering host(s) |
|---|---|
| Mail-related record in active use | `autoconfig` (XML being served), `autodiscover` (alive) |
| cPanel/admin service responds publicly over HTTPS | `cpanel`, `whm`, `webmail`, `webdisk`, `cpcalendars`, `cpcontacts` |
| Record proxied but represents non-HTTP service | `ftp`, `mail` |

Per packet rule, halt + surface required. **No execution recommendations are made for proxy changes or deletion** without Lori-side dependency confirmation and explicit Ray authorization.

## Cross-reference

- **CR-A Gate C SPF cleanup remains correctly blocked** — the live Newtek cPanel infrastructure means the SPF Newtek IPs may still be authorized senders. CR-A Gate C cannot be executed until both (a) cPanel mail dependency is resolved here in CR-B and (b) DMARC monitoring confirms no in-the-wild Newtek mail.
- **CR-A's `default._domainkey` DKIM** observation is consistent: that DKIM record is most likely the live Newtek cPanel server's DKIM. Removing it would break any cPanel-originated outbound mail.

## Evidence artifacts

| File | Purpose |
|---|---|
| `gate-a-cloudflare-record-inventory.md` | Executive inventory + per-host summary + Gate B follow-up matrix |
| `gate-a-dig-results.txt` | Raw `dig` output, 4 resolvers × 10 hostnames × 2 record types (A/CNAME) |
| `gate-a-http-results.txt` | Raw `curl -sI` output, HTTPS + HTTP per host |
| `legacy-record-disposition.tsv` | Per-host TSV with service_class, risk_class, recommended_disposition, evidence pointers |
| `gate-a-closeout.md` | This file |

## Gate B blockers (Lori-side dependency confirmation)

8 questions surfaced in `gate-a-cloudflare-record-inventory.md` — quoted summary:

1. cPanel login still in use? (`cpanel.rmgreatdane.org`)
2. WHM still used for reseller/host admin? (`whm.rmgreatdane.org`)
3. Roundcube webmail still used? (`webmail.rmgreatdane.org`)
4. Calendar/Contact sync from rmgreatdane.org? (`cpcalendars`, `cpcontacts`)
5. WebDAV/WebDisk file access? (`webdisk.rmgreatdane.org`)
6. Any mail client doing autoconfig against rmgreatdane.org? (`autoconfig`, `autodiscover`)
7. Any FTP or hostname-based SMTP/IMAP workflow? (`ftp`, `mail`)
8. Is the IPM/Newtek hosting account still actively billed/maintained?

## Gate C blockers (recommendation execution)

Cleanup execution requires:

- Resolution of all 8 UNKNOWN_BLOCKED records via Lori dependency confirmation.
- Decision on hardening for any KEEP_PROXIED records (Cloudflare Access / IP allowlist).
- Coordination with CR-A Gate C — SPF cleanup must reflect the IPM mail-on/off determination from this CR.
- Explicit Ray/Atlas authorization for each proxy-status change or deletion.

## Compliance with CR-B scope guards

- ✅ No DNS modifications
- ✅ No proxy-status changes
- ✅ No MX changes, no SPF changes, no DKIM changes, no DMARC changes
- ✅ No Cloudflare nameserver changes
- ✅ No Vercel domain or DNS changes
- ✅ No `rmgreatdane.org` apex web-record changes
- ✅ No `www` web-record changes
- ✅ No website code changes
- ✅ No Supabase middleware reconciliation
- ✅ No Google Workspace admin changes
- ✅ No IPM/cPanel admin changes
- ✅ No login attempts; no credentials submitted; no settings modified
- ✅ No CR-A or CR-C execution

## Recommended next packet

After Lori provides Gate B dependency answers, the natural next CR is **CR-B Gate B+C closeout packet** that converts the 8 UNKNOWN_BLOCKED rows into final dispositions and produces a single execution packet (proxy changes / deletions) for Ray's explicit authorization. **Not in this CR's scope to execute.**

## Recommendation before commit/push

This evidence is ready for commit + push + PR following the CR-A pattern. The evidence files document a non-trivial post-cutover finding (legacy hosting still alive), so durably recording it on `main` is high-value. Holding for Ray's authorization before commit.
