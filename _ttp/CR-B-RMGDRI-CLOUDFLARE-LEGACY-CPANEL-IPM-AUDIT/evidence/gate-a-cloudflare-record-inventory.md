# Gate A — Cloudflare Legacy cPanel/IPM Record Inventory

**CR:** CR-B (Issue #140) — RMGDRI Cloudflare Legacy cPanel/IPM Service Record Audit
**Domain:** `rmgreatdane.org`
**Generated:** 2026-05-06 UTC
**Operator:** Claude Code, read-only DNS + HTTP/HTTPS probes
**Mode:** Evidence-only — no DNS, proxy, MX, SPF, DKIM, DMARC, apex, or `www` changes executed

## Methodology

- **Authoritative DNS:** `dig @lee.ns.cloudflare.com` and `@olga.ns.cloudflare.com` for A and CNAME against each of the 10 legacy hostnames.
- **Public resolvers:** `dig @1.1.1.1` and `@8.8.8.8` for the same.
- **HTTP/HTTPS behavior:** `curl -sI` (HEAD requests only; no credentials submitted, no settings changed; `-k` for HTTPS to tolerate origin-side certificate issues).
- **Cloudflare UI/API capture:** **NOT executed** — Claude Code does not have Cloudflare credentials and is bound by the standing rule "Do not touch Cloudflare." Proxy status inferred from observed behavior (Cloudflare anycast IPs in DNS responses + `server: cloudflare` headers + `cf-ray` headers).

## Headline finding

**The legacy IPM/Newtek cPanel hosting account is alive and serving cPanel admin, WHM admin, Roundcube webmail, CalDAV, CardDAV, WebDAV, and mail-client autoconfig surfaces. All 10 audited records are currently orange-clouded (proxied) through Cloudflare.**

This is materially different from the assumption that cutover retired Newtek hosting; the Newtek cPanel account is still online behind Cloudflare's proxy.

## Cloudflare proxy attribution

All 10 hostnames resolve to Cloudflare anycast IPs:

```
104.21.89.22
172.67.136.81
```

(Reverse DNS for these IPs is empty — Cloudflare does not publish PTRs for proxy IPs.) The `server: cloudflare` and `cf-ray:` headers in HTTPS responses confirm the requests reach the Cloudflare edge. The fact that real cPanel/Roundcube cookies are set on responses confirms the proxy is forwarding to a working IPM/Newtek origin.

## Per-host summary

| Hostname | HTTPS Status | Service | Proxied? | Notable evidence |
|---|---|---|---|---|
| `autoconfig` | 200 OK (XML) | mail-client autoconfig | YES | `content-type: application/xml` — actively serving config |
| `autodiscover` | 400 Bad Req | MS Outlook autodiscover | YES | 400 is protocol-expected for GET; endpoint alive |
| `cpanel` | 200 OK | cPanel login UI | YES | sets `cprelogin`, `cpsession` cookies |
| `cpcalendars` | 401 Unauth | CalDAV (cPanel calendar) | YES | Basic-auth challenge — alive |
| `cpcontacts` | 401 Unauth | CardDAV (cPanel contacts) | YES | Basic-auth challenge — alive |
| `ftp` | 525 (origin TLS fail) | FTP (intended) | YES | Cloudflare can't TLS to origin; **non-functional via proxy** |
| `mail` | 525 (origin TLS fail) | SMTP/IMAP (intended) | YES | Same — **non-functional via proxy** |
| `webdisk` | 401 Unauth | WebDAV (cPanel files) | YES | `www-authenticate: Basic realm="Restricted Area"` — alive |
| `webmail` | 200 OK | Roundcube webmail | YES | sets `webmailrelogin`, `roundcube_sessid` cookies |
| `whm` | 200 OK | WHM (host management) | YES | sets `whostmgrrelogin`, `whostmgrsession` cookies |

## Stop conditions encountered

Per the CR-B packet, the following stop conditions are triggered (halt + surface required):

| Stop condition | Triggering host(s) | Implication |
|---|---|---|
| "A mail-related record appears to be in active use" | `autoconfig` (live XML), `autodiscover` (400 protocol-aware) | Cannot recommend deletion until Lori confirms no mail-client autoconfig dependency |
| "Any cPanel/admin service responds publicly over HTTPS" | `cpanel`, `whm`, `webmail`, `webdisk`, `cpcalendars`, `cpcontacts` | Publicly-exposed admin surfaces; needs Lori dependency check + access-hardening recommendation |
| "Any record is proxied but appears to be non-HTTP service infrastructure" | `ftp`, `mail` | Orange-cloud on FTP/SMTP-intended hostnames is non-functional; safe RETIRE_CANDIDATE pending Lori confirmation |

No stop condition for "any record points to Vercel unexpectedly" — none of the 10 records resolve to Vercel.

## Cross-reference with CR-A findings

- **The Newtek IPs in CR-A's SPF (`75.103.66.18`, `75.103.66.54`) are likely still reachable** as the cPanel server is alive. SPF cleanup remains correctly blocked under CR-A Gate C.
- **The DKIM key at `default._domainkey`** observed in CR-A is most likely the cPanel/Newtek server's DKIM. If Lori has retired any outbound mail through cPanel, the DKIM record is orphan; if any mail still flows through cPanel, removing the DKIM record would break it.

## What this CR Gate A does NOT confirm

- Whether the IPM/Newtek hosting account is **billed** (Cloudflare can serve a stale 200 if Newtek hasn't disabled the account; or Newtek may keep it alive indefinitely).
- Whether Lori has cPanel/WHM credentials and uses them.
- Whether any board member or system actively uses webmail/CalDAV/CardDAV/WebDAV against rmgreatdane.org.
- Whether mail clients on @rmgreatdane.org addresses are still configured against IMAP/SMTP at the Newtek server.

These are the explicit Gate B (dependency confirmation) inputs, all currently UNKNOWN_BLOCKED.

## Disposition counts

From `legacy-record-disposition.tsv`:

| Disposition | Count | Hostnames |
|---|---|---|
| KEEP | 0 | (none) |
| KEEP_DNS_ONLY | 0 | (none) |
| KEEP_PROXIED | 0 | (none — pending Lori dependency check; HIGH-risk hosts are candidates IF used) |
| **RETIRE_CANDIDATE** | 2 | `ftp`, `mail` (non-functional via proxy) |
| **UNKNOWN_BLOCKED** | 8 | `autoconfig`, `autodiscover`, `cpanel`, `cpcalendars`, `cpcontacts`, `webdisk`, `webmail`, `whm` |

## Notable security observations (advisory only — no execution)

- **WHM publicly exposed:** WHM is a reseller/root-level cPanel admin interface. Best practice is to restrict access via Cloudflare Access policy, IP allowlist, or full retirement. **Surfaced for Ray/Lori awareness; not in CR-B execution scope.**
- **cPanel and webmail login forms publicly indexable:** could attract credential-stuffing or scraping. Same hardening recommendations apply.
- **`autoconfig` may silently misroute mail clients** to legacy IMAP/SMTP if anyone ever opens a new mail client and types an `@rmgreatdane.org` address — those messages may not flow through Google Workspace.

## Disposition

`PASS-WITH-BLOCKERS` — Gate A audit complete; no DNS changes; 8 of 10 records are UNKNOWN_BLOCKED pending Lori-side dependency confirmation; 2 are RETIRE_CANDIDATEs (`ftp`, `mail`) due to non-functional proxy/protocol mismatch.

## Required Gate B follow-ups (Lori-side)

1. Do you (or any board member) still use the **cPanel** login at `cpanel.rmgreatdane.org`?
2. Do you still use **WHM** at `whm.rmgreatdane.org` for reseller/host admin?
3. Do you (or anyone) read mail via **Roundcube webmail** at `webmail.rmgreatdane.org`?
4. Does anyone sync calendars (`cpcalendars`) or contacts (`cpcontacts`) from rmgreatdane.org?
5. Does anyone access files via **WebDAV/WebDisk** at `webdisk.rmgreatdane.org`?
6. Does anyone use a **mail client** (Thunderbird/Apple Mail/Outlook) configured for `@rmgreatdane.org` addresses that auto-discovers via `autoconfig` or `autodiscover`? (If yes, those clients are likely talking to legacy IMAP/SMTP, NOT Google Workspace — this needs reconciliation.)
7. Does any **system or workflow** connect to `ftp.rmgreatdane.org` or `mail.rmgreatdane.org` by hostname (e.g., for backups, scheduled FTP transfers, or as an SMTP relay)?
8. Is the IPM/Newtek **hosting account still being billed**? If retired, the Cloudflare proxy is serving a still-alive but untended cPanel — a known security risk pattern.

## Compliance with CR-B scope guards

- ✅ No DNS modifications (read-only `dig` + `curl -I` only)
- ✅ No proxy-status changes (no Cloudflare API/UI calls)
- ✅ No MX / SPF / DKIM / DMARC changes
- ✅ No Cloudflare nameserver changes
- ✅ No Vercel changes
- ✅ No apex / `www` changes
- ✅ No website code changes
- ✅ No Supabase / middleware changes
- ✅ No CR-A / CR-C execution
- ✅ No login attempts (HEAD requests only; no credentials submitted)
- ✅ No Cloudflare UI/API capture (deliberately abstained per "Do not touch Cloudflare")
