# CORS, CSRF, and Cookie Security

> Scope: `bff-server` CORS/CSRF configuration and any service that sets cookies. Belongs under `.claude/rules/`.
> Sources: `cors.md`, IETF draft-oauth-browser-based-apps §6.1.3.2 / §6.1.3.3, project memory — `bff-server-security-audit` (Step 1 completed).

## 1. CORS Policy

- **MUST** — Never use a wildcard (`*`) in `Access-Control-Allow-Origin`; only known origins (`https://app.parena.com.tr`, local dev ports) are explicitly allowlisted. Since credentials (cookies) are used, a wildcard is already technically impossible (`Access-Control-Allow-Credentials: true` cannot be combined with `*`), but this is also kept explicit as a rule.
- **MUST** — Use an explicit header list for `Access-Control-Allow-Headers` (`allowedHeaders`) instead of a wildcard (`*`) (e.g. `Content-Type`, `X-CSRF-TOKEN`, etc.). *(Status: flagged as an open finding in the audit — a wildcard is currently in use; fixing this is planned. Precision note, 2026-09: per the Fetch/CORS spec, `*` is not treated as a literal wildcard on a credentialed request — same category of incompatibility as `Access-Control-Allow-Origin: *` with credentials, noted above. Spring's `DefaultCorsProcessor` avoids the resulting breakage by echoing back the exact `Access-Control-Request-Headers` value instead of a literal `*` when `allowedHeaders` contains `"*"` and `allowCredentials` is true — so this is not currently a functional bug (preflights aren't failing). The real gap is that there is no actual allowlist enforcement: any header an attacker's preflight requests gets echoed back and permitted, which is a least-privilege gap, not a broken-CORS gap. Fixing this is still the right call, just for that reason.)*
- **MUST** — Set `Access-Control-Allow-Credentials: true` (required for cookie-based sessions), and the frontend must use `withCredentials`/`credentials: 'include'` on every request.
- **MUST** — For special/isolated scenarios like the registration endpoint, define a separate, narrowly scoped CORS bean — never mix it into the general CORS config. (Parena's example: `registerCorsConfigurationSource` — scoped only to `POST /api/v1/users/register`, separate from `defaultCorsConfigurationSource`; the `OPTIONS` preflight is handled separately in the `registerFilterChain` security matcher.) Reuse this pattern whenever adding a new "isolated, unauthenticated-access" endpoint.
- **MUST** — CORS is only supported on endpoints other than the Authorization Endpoint (the Token Endpoint, JWKS, etc., where needed) — the SPA never accesses the Authorization Endpoint directly, the browser redirects to it instead (RFC 9700 §2.6).

## 2. CSRF Architecture (Step 1 — completed and tested)

Because of Parena's cross-origin (`app.` / `api.` subdomain split) setup, the cookie-based CSRF token repository approach did not work, so the architecture was changed:

- **MUST** — Use `WebSessionServerCsrfTokenRepository` as the CSRF token repository (the old `CookieServerCsrfTokenRepository` **must not** be used — it was abandoned due to cross-origin cookie-reading issues).
- **MUST** — The `GET /api/csrf` endpoint returns JSON in the shape `{token, headerName, parameterName}`. On app startup, the frontend calls this endpoint and keeps the token in an **in-memory** store (`csrf.ts`) — never in a cookie or localStorage.
- **MUST** — On every state-changing request (`POST`/`PUT`/`PATCH`/`DELETE`), `api-client.ts` automatically attaches the CSRF header; on a `403` (CSRF mismatch), it refreshes the token **once** and retries the request.
- **MUST** — For flows that require a form submit (e.g. logout, in `auth.api.ts`), the CSRF token is added to the form using `parameterName` (as a form field, not a header).
- **MUST NOT** — Do not reintroduce the old `CsrfCookieWebFilter` or the cookie-reading helper; that approach did not work reliably in a cross-origin setup.
- **SHOULD** — Although `SameSite=Strict` (see §3) is already the first line of defense against CSRF, it is not sufficient on its own — token-based CSRF protection (double-submit-like, here session-bound) is kept as defense against subdomain-takeover scenarios (draft-oauth-browser-based-apps §6.1.3.3.1).

## 3. Cookie Security

Implemented, tested, and enforced via `SecurityConfig.java`'s `webSessionIdResolver()` bean (`SessionCookieSecurityTest`) — no longer backlog as of 2026-09:

- **MUST** — `Secure` flag enabled (sent only over HTTPS).
- **MUST** — `HttpOnly` flag enabled (inaccessible from JavaScript).
- **MUST** — `SameSite=Strict` is set.
- **MUST** — Cookie path is set to `/`.
- **MUST NOT** — Never set a `Domain` attribute on the cookie (see `bff-token-architecture.md` §4 — parent-domain sharing risk).
- **MUST** — Cookie name starts with the `__Host-` prefix (session cookie name: `__Host-session`) — this prefix enforces `Secure` + no-`Domain` + `path=/` at the browser level, and prevents subdomain sharing. *(Status: implemented, 2026-09 — `SecurityConfig.java`'s `webSessionIdResolver()` bean, tested in `SessionCookieSecurityTest`. Upgraded from SHOULD to MUST now that it's the actual, tested behavior — no longer backlog.)*
- **SHOULD** — If client-side session state is used (not applicable in Parena, since sessions are server-side and Redis-backed), the cookie contents are encrypted; for server-side sessions, this item is N/A.

## 4. Content Security Policy (CSP) — backlog

- **MUST (planned)** — Add a CSP header; explicitly allowlist the TradingView and Google embed origins used on the dashboard in `frame-src`/`script-src`. Also add `frame-ancestors` against clickjacking (RFC 9700 §4.16).
- Until this item is completed, legacy mechanisms like `X-Frame-Options` are relied upon, but completing CSP is kept as a backlog priority.

## 5. Checklist for adding a new endpoint/service

- [ ] CORS: does the origin need to be added to the allowlist, or does it need an isolated bean (the register pattern)?
- [ ] Is it a state-changing endpoint? → Is CSRF header validation required, or is it GET/idempotent?
- [ ] If a new cookie is being set: Secure + HttpOnly + SameSite=Strict + path=/ + no Domain + (where possible) `__Host-` prefix
