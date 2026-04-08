# Cloudflare CDN/WAF Setup

This project is now application-ready for Cloudflare. To actually enable CDN/WAF, you must apply the following in the Cloudflare dashboard for your domain.

## 1. DNS / Proxy

- Add your production domain to Cloudflare.
- Point your `A`/`CNAME` records to your hosting platform.
- Turn the orange cloud proxy on for the public records.
- Keep your origin hidden behind Cloudflare where possible.

## 2. SSL / Edge

- SSL/TLS mode: `Full (strict)`
- Always Use HTTPS: `On`
- Automatic HTTPS Rewrites: `On`
- HTTP/3: `On`
- Brotli: `On`

## 3. WAF Managed Rules

Enable:

- Cloudflare Managed Ruleset
- OWASP Core Ruleset
- Bot Fight Mode or Super Bot Fight Mode if your plan supports it

Recommended sensitivity:

- Start with default managed action.
- Review Security Events for 24-48 hours before tightening.

## 4. Custom WAF Rules

Create these custom rules in `Security -> WAF -> Custom rules`.

### Rule: Block obvious bad methods

Expression:

```txt
not http.request.method in {"GET" "HEAD" "POST" "OPTIONS"}
```

Action:

- Block

### Rule: Challenge suspicious admin access

Expression:

```txt
starts_with(http.request.uri.path, "/admin") and not cf.client.bot
```

Action:

- Managed Challenge

### Rule: Challenge XML-RPC / common exploit probes

Expression:

```txt
http.request.uri.path contains "wp-login" or
http.request.uri.path contains "xmlrpc" or
http.request.uri.path contains ".env" or
http.request.uri.path contains "phpmyadmin" or
http.request.uri.path contains "vendor/phpunit"
```

Action:

- Block

### Rule: Challenge high-risk API probing

Expression:

```txt
starts_with(http.request.uri.path, "/api/") and not cf.client.bot
```

Action:

- Managed Challenge

## 5. Rate Limiting Rules

Create these in `Security -> WAF -> Rate limiting rules`.

Cloudflare documents rate limiting rules here:
- [Rate limiting rules](https://developers.cloudflare.com/waf/rate-limiting-rules/)
- [Custom rules](https://developers.cloudflare.com/waf/custom-rules/)

### Rule: Admin login

- Match:

```txt
http.request.uri.path eq "/admin/login"
```

- Count by: IP
- Period: 60 seconds
- Requests per period: 10
- Mitigation timeout: 10 minutes
- Action: Managed Challenge

### Rule: Slots API

- Match:

```txt
http.request.uri.path eq "/api/slots"
```

- Count by: IP
- Period: 60 seconds
- Requests per period: 30
- Mitigation timeout: 5 minutes
- Action: Managed Challenge

### Rule: Public form-heavy pages

- Match:

```txt
http.request.uri.path in {"/appointment" "/contact" "/reviews"}
```

- Count by: IP
- Period: 60 seconds
- Requests per period: 40
- Mitigation timeout: 5 minutes
- Action: Managed Challenge

### Rule: Whole site burst protection

- Match:

```txt
http.host eq "YOUR_DOMAIN"
```

- Count by: IP
- Period: 60 seconds
- Requests per period: 180
- Mitigation timeout: 2 minutes
- Action: Managed Challenge

## 6. Cache Rules

Use Cloudflare cache rules carefully because this app contains dynamic pages.

Safe candidates:

- `/_next/static/*`
- static images under `/images/*`
- `robots.txt`
- `sitemap.xml`

Do not force-cache:

- `/admin/*`
- `/api/*`
- `/appointment`
- `/contact`
- `/reviews`

## 7. Origin Lockdown

If your platform allows it:

- Only allow origin traffic from Cloudflare IP ranges.
- Block direct-to-origin traffic at the host or firewall layer.

This is one of the biggest DDoS improvements because it prevents bypassing Cloudflare.

## 8. Bot Protection

This repo already supports optional Cloudflare Turnstile for forms.
Set these env vars:

- `TURNSTILE_SECRET_KEY`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`

## 9. Post-Deployment Checks

- Confirm `cf-connecting-ip` is reaching the app.
- Review Cloudflare Security Events after launch.
- Tune false positives before switching aggressive rules to `Block`.
- Keep high-risk rules on `Managed Challenge` first.

## 10. Important Note

Cloudflare cannot be fully enabled from the repository alone. It requires:

- Cloudflare account access
- Zone/DNS control for the domain
- Dashboard or API credentials

This file is the exact setup checklist to apply in Cloudflare.
