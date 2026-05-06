# DMARC Recommendation — rmgreatdane.org

## Current state (Gate A evidence)

- `_dmarc.rmgreatdane.org` TXT record: **ABSENT** (confirmed via lee.ns.cloudflare.com, olga.ns.cloudflare.com, 1.1.1.1, 8.8.8.8).
- `_dmarc.rmgreatdane.org` CNAME: ABSENT (no aliasing).
- DMARC policy is therefore **none implicit** — receivers apply their own defaults; no aggregate visibility into mail-auth failures.

## Decision blocker

Per the CR-A scope, `p=none` may be added in two forms:

| Form | Requires | Outcome |
|---|---|---|
| **Preferred** with reporting | confirmed `dmarc-reports@rmgreatdane.org` mailbox or alias | gives RMGDRI weekly aggregate XML reports of every system that sends as `@rmgreatdane.org` — invaluable for cleaning up SPF |
| **Conservative** without reporting | Ray-approved no-reporting-address option | publishes a policy posture but receives no visibility |

## Recommendation

**Preferred path:** ask Lori to create a Google Workspace alias or distribution list `dmarc-reports@rmgreatdane.org` pointing at her inbox or a shared inbox, then publish:

```
Type:    TXT
Name:    _dmarc
Content: v=DMARC1; p=none; rua=mailto:dmarc-reports@rmgreatdane.org
Proxy:   DNS only
TTL:     Auto
```

**Why preferred:** the SPF record contains 4 hardcoded IPs of unknown current usage (Newtek/IPM legacy + one IBM-SoftLayer IP), and a confirmed Resend sender that is not yet in SPF. Aggregate DMARC reports will quickly tell us:

1. Which legacy IPs (if any) are still actively sending as `@rmgreatdane.org` — informs CR-A Gate C SPF cleanup.
2. Whether Resend mail is currently SPF-failing.
3. Whether unknown senders (Jotform, donation platform, newsletter, etc.) are in use.

This is exactly the visibility CR-A Gate C needs to safely tighten SPF.

**Conservative path:** if a reporting mailbox cannot be set up quickly, publish:

```
Type:    TXT
Name:    _dmarc
Content: v=DMARC1; p=none
Proxy:   DNS only
TTL:     Auto
```

This is a less useful step (no visibility) but does declare the domain's posture and signals to receivers that the owner is mail-aware. Out of scope for autonomous execution under CR-A.

## What is explicitly NOT recommended in this CR

| Forbidden setting | Why |
|---|---|
| `p=quarantine` | Premature; would silently bucket Resend / unknown-sender mail to spam during inventory phase. |
| `p=reject` | Would actively block legitimate mail still mis-aligned during transition. |
| `sp=*` other than absent | Subdomain policy not in scope. |
| `ruf=` (forensic reports) | Privacy concerns + many recipient providers do not honor; not needed for monitoring. |
| `pct=<100` | Not needed at `p=none`. |
| `aspf=s` / `adkim=s` (strict alignment) | Would tighten alignment before SPF/DKIM are reconciled — premature. |

## Stop conditions

Per CR-A: **DO NOT publish any DMARC record yet.** This is a recommendation only. Gate B execution requires explicit Ray/Atlas authorization and a confirmed reporting mailbox (or explicit Ray approval of the no-reporting-mailbox conservative form).

## Disposition

`PASS-WITH-BLOCKERS` — DMARC recommendation produced; mailbox dependency surfaced; DNS unchanged.
