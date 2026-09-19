# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

PARENA: a Keycloak-fronted microservices platform with a Spring Boot/Spring Cloud backend and a Vite/React frontend that also builds a Keycloakify login theme deployed into a custom Keycloak image. This root covers the whole system; each side has its own detailed CLAUDE.md — read them before working in that tree:

- `backend/CLAUDE.md` — module map, hexagonal/DDD service layout, config-server conventions, build/test commands.
- `frontend/app/CLAUDE.md` — dual-entry SPA/Keycloak-theme build, BFF auth client, styling/structure conventions.

This file only covers what spans both: system topology, orchestration, and cross-cutting conventions.

## Repository layout

```
backend/                 Maven multi-module Spring Boot system (see backend/CLAUDE.md)
backend/configurations/  Per-service Spring Cloud Config YAML, served by config-server
frontend/app/            Vite + React SPA and Keycloakify theme (see frontend/app/CLAUDE.md)
docs/contracts/          OpenAPI contracts (e.g. identity-service-v1.yml)
docker-compose.yml       Local dev stack
docker-compose-prod.yml  Production stack
Dockerfile.keycloak      Multi-stage build: compiles the frontend's Keycloakify theme jar, then bakes it into a custom Keycloak 26.5.5 image
.env / .env.example      Shared secrets/config for the compose stacks (SO_* convention, see backend/CLAUDE.md)
```

## System topology

Browser → **bff-server** (session/CSRF, OAuth2 login against Keycloak) → **gateway-server** (routing) → business services (`user-service`, `institution-service`, ...), which validate the Keycloak JWT independently. Keycloak itself serves its login/registration UI using the theme built from `frontend/app/src/keycloak-theme/`, so a frontend change under that path only takes effect for the actual login pages after rebuilding `Dockerfile.keycloak` and redeploying Keycloak — not via the SPA's own dev server or build. Full detail on the auth/session model and service responsibilities is in `backend/CLAUDE.md`; the frontend's HTTP client split (`apiRequest` vs `publicApiRequest`) and CSRF handling is in `frontend/app/CLAUDE.md`.

## Running the stack locally

```bash
docker compose up -d          # from repo root: full stack (Keycloak, Postgres per service, Redis, Mailpit, config/discovery/gateway/bff/user-service)
```

Startup order is enforced via `depends_on`/healthchecks: infra (Postgres/Keycloak/Redis) → config-server → discovery-server → gateway-server/bff-server → business services. Secrets come from `.env` (copy `.env.example`, `SO_*` names). For iterating on a single backend service or the frontend SPA outside Docker, see the run commands in the respective sub-CLAUDE.md files — the frontend dev server (`npm run dev`, port 5173) and Keycloak's served theme are two different things and are not interchangeable for testing login-page changes.

To rebuild the custom Keycloak image (theme + Keycloak) after touching `frontend/app/src/keycloak-theme/`:

```bash
docker build -f Dockerfile.keycloak -t parena-keycloak .   # run from repo root; build context must be repo root, not frontend/app
```

CI (`.github/workflows/build-keycloak.yml`) does this automatically on push to `main` when `frontend/app/**`, `Dockerfile.keycloak`, or the workflow itself changes, pushing to `ghcr.io/<owner>/parena-keycloak`.

## Cross-cutting conventions

- Config for backend services lives in `backend/configurations/<service>/`, not in each module's `src/main/resources` — served by config-server at startup.
- Environment/secret variables follow the `SO_*` naming convention across `.env`, docker-compose, and Spring config placeholders.
- User-facing text and many explanatory comments are in Turkish on both sides of the stack (frontend copy, backend config/security comments) — match the existing language when editing nearby text rather than switching to English.
- `docs/contracts/` holds OpenAPI specs for cross-service contracts (e.g. identity-service) — check these when changing a service's public API shape.
