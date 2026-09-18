# BFF Architecture & Token Management

> Scope: `bff-server` and any frontend/backend code that interacts with it. This file belongs under `.claude/rules/`; it applies whenever bff-server or frontend auth code is changed.
> Sources: IETF draft-ietf-oauth-browser-based-apps (BFF Pattern, §6.1), IETF RFC 9700 (OAuth 2.0 Security BCP), project memory — `bff-server-security-audit` and `overview` notes (2026-09).

## 1. Architectural decision: BFF Pattern (mandatory)

Parena uses the **full Backend For Frontend (BFF) pattern**, not a browser-based OAuth client and not a token-mediating backend. Rationale: of the three architectures, BFF offers the strongest security guarantee — tokens never reach the browser, so XSS-based token exfiltration (single-execution / persistent token theft) and silent-flow token acquisition attacks are neutralized.

Rules:

- **MUST** — `bff-server` authenticates to Keycloak as a confidential client (with a client secret).
- **MUST** — Authorization Code Grant + PKCE is used (see RFC 9700 §2.1.1). PKCE is only RECOMMENDED for confidential clients per the RFC, but it is mandatory in bff-server; it also provides additional CSRF protection. *(Verified, 2026-09: no explicit PKCE-enabling code exists in `SecurityConfig.java`, which looks like a gap at first read — but Spring Security 7.0.2's `ClientRegistration.ClientSettings` defaults `requireProofKey` to `true` unconditionally (confirmed via bytecode inspection of the resolved dependency, then empirically), so `DefaultServerOAuth2AuthorizationRequestResolver` applies PKCE automatically regardless of client type. Guarded by `PkceAuthorizationRequestTest`. This is a framework-version-dependent guarantee, not an explicit architectural choice — if a custom `ClientRegistration`/`ClientSettings` bean is ever introduced, or the Spring Security major version changes, re-verify this default before assuming it still holds.)*
- **MUST NOT** — Access tokens, refresh tokens, or ID tokens are never exposed to `app.parena.com.tr` (the SPA) in any form — not in a response body, not in a cookie, not in a header, as plaintext tokens. The SPA only ever sees the BFF's session cookie.
- **MUST** — Tokens are kept inside `bff-server`, in a Redis-backed session (Spring Session + Redis). The only thing the SPA can access is the httpOnly session cookie.
- **MUST NOT** — The Implicit Grant and the Resource Owner Password Credentials Grant are not used (consistent with RFC 9700 §2.1.2, §2.4 — the architecture has no need for either).

## 2. GatewayProxyHandler (the BFF's proxy responsibility)

`bff-server` acts as an application-layer reverse proxy that forwards requests from the SPA to internal microservices (resource servers) (see draft-oauth-browser-based-apps §6.1.3.6, "Proxy Restrictions").

- **MUST** — The proxy only forwards requests to internal services on a predefined allowlist. If path-based dynamic routing is used (e.g. `/bff/orders/{id}`), the destination host/path is strictly validated. *(Status: flagged in the audit as "no per-endpoint authorization in the gateway proxy — everything just requires 'authenticated'"; to be addressed in Step 3.)*
- **MUST** — The raw `Cookie` header from the inbound request is never forwarded to internal microservices — the proxy resolves the cookie to a session and attaches the real `Authorization: Bearer <access_token>` header instead. *(Status: open finding from the audit — "GatewayProxyHandler currently forwards the raw Cookie header downstream" — Step 3.)*
- **SHOULD** — Allowed HTTP methods are restricted per endpoint to reduce attack surface.
- **MUST** — The proxy sanitizes any inbound `X-Forwarded-*`-style security headers before passing requests to internal services (see RFC 9700 §4.13, TLS Terminating Reverse Proxies: "A reverse proxy MUST sanitize any inbound requests to ensure the authenticity and integrity of all header values").

## 3. Forwarded-Headers-Strategy (Spring behind NPM)

In Parena's architecture, TLS is terminated by Nginx Proxy Manager (NPM); `bff-server` runs behind it over plain HTTP. Therefore:

- **MUST** — `bff-server` must correctly configure Spring's forward-headers-strategy (`server.forward-headers-strategy: framework` or native), otherwise Spring treats the request as insecure/HTTP and will not set the `Secure` cookie flag. *(Status: implemented, 2026-09 — set in `bff-server.yml` (base profile, applies to all environments).)*
- **MUST** — On the NPM side, the Advanced tab for the `auth.parena.com.tr` and `api.parena.com.tr` proxy hosts must include these three headers (see `keycloak-deployment-runbook.md`):
  ```nginx
  proxy_set_header X-Forwarded-Proto $scheme;
  proxy_set_header X-Forwarded-Host $host;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  ```
- **MUST NOT** — These headers must never be trusted if they arrive from the client; NPM/the reverse proxy always sets/overrides them itself and never passes through client-supplied values.

## 4. Cross-Origin and Subdomain Architecture

Parena uses a **subdomain split**: `app.parena.com.tr` (SPA) / `api.parena.com.tr` (BFF). These two origins are cross-origin (different host) but same-site (same eTLD+1: `parena.com.tr`).

- **MUST** — Because of this subdomain split, the browser still sends the session cookie even with `SameSite=Strict`, since it's same-site; CSRF protection is therefore still mandatory (see `cors-csrf-cookie-security.md`).
- **MUST** — `SameSite=Strict` on the session cookie does not break the OAuth login callback ONLY because Keycloak is also deployed on a `parena.com.tr` subdomain (`auth.parena.com.tr`). The full redirect chain (`app.parena.com.tr` → `api.parena.com.tr` → `auth.parena.com.tr` → back to `api.parena.com.tr`) stays same-site throughout, since "site" per the cookie spec means eTLD+1, not full origin — a `Strict` cookie would normally be withheld on the top-level navigation returning from a genuinely third-party redirect (the classic SameSite-vs-OAuth-callback gotcha), but that never happens here because every hop shares `parena.com.tr`. **This is a load-bearing architectural constant, not incidental** — if Keycloak (or any future IdP) is ever hosted outside `parena.com.tr`'s eTLD+1 (e.g. a third-party-hosted identity provider), the login callback breaks silently and the cookie policy for the login-callback path would need to change (e.g. `Lax`, or a redirect bridge). *(Added 2026-09, verified against draft-oauth-browser-based-apps §6.1.3.2's `SameSite=Strict` guidance and the `Site` definition it references — not previously documented here.)*
- **MUST NOT** — The session cookie must not set a `Domain` attribute that scopes it to the parent domain (`.parena.com.tr`) — doing so risks cookie sharing with other subdomains (e.g. `admin.parena.com.tr`); a subdomain-takeover scenario could then steal the BFF session. *(Roadmap item: "removal of the parent-domain cookie" — see `overview.md`.)*
- **MUST** — When adding a new subdomain/service (e.g. `admin-bff`), it gets its own separate client, its own separate session namespace (e.g. `admin:session`), and its own PKCE flow; BFF sessions are never shared across services.

## 5. Refresh Token Handling

- **MUST** — Refresh tokens are held only on the BFF side (as a confidential client), per RFC 9700 §2.2.2 and §4.14.
- **SHOULD** — The refresh token's lifetime is matched to the BFF session cookie's lifetime; when the refresh token becomes invalid, the session is also invalidated (draft-oauth-browser-based-apps §6.1.2.2).
- **MUST** — When the access token expires, the BFF silently obtains a new one via the refresh token in the background, transparently to the user.

## 6. Checklist for adding a new microservice/BFF

When adding a new user-facing service (e.g. `admin-bff`), apply every item in this file plus the following:

- [ ] Confidential client + PKCE + short token lifetime (the admin-bff plan also requires mandatory OTP — see the `overview.md` roadmap)
- [ ] Separate session namespace in Redis
- [ ] If a GatewayProxyHandler-style proxy is present, an outbound host allowlist is mandatory
- [ ] Cookie security — see `cors-csrf-cookie-security.md`
- [ ] Keycloak client settings — see `keycloak-realm-security.md`

## 7. Open / in-progress items (keep this file in sync)

This section should stay in sync with the `bff-server-security-audit` memory record:

- Step 2 (forward-headers-strategy) — **done** (2026-09, `bff-server.yml`)
- Step 3 (GatewayProxyHandler cookie stripping + per-endpoint authorization) — planned; still open, `GatewayProxyHandler.java` intentionally untouched by every fix so far, see §2 above
- Step 4 (`bff-server-dev.yml` missing `app.website-base-url`) — **done** (2026-09)
- `gateway-server-prod.yml` / `user-service-prod.yml` were also completely empty (same class of gap as Step 4, just on sibling services, discovered later) — **done** (2026-09, filled to mirror each service's `-docker.yml` profile, since the real production deployment runs the docker-compose stack)
- CSP header (allowlisting TradingView/Google embed origins) — backlog
- `bff-server-dev.yml` still lacks the Keycloak public/internal URL split that `-docker.yml`/`-prod.yml` have (single hardcoded `issuer-uri`) — open, tracked in `keycloak-realm-security.md` §1
- Audit finding, 2026-09: raw email logged in `KeycloakAdminClientAdapter.createUser` (register flow, not directly BFF, but the same KVKK principle) — **done**, removed
- `PkceAuthorizationRequestTest` added 2026-09 to guard PKCE staying enabled — see §1
