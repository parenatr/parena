# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Parena backend: a multi-module Maven/Spring Boot 4 microservices system (Java 21, Spring Cloud 2025.1.1). This directory (`backend/`) is one module tree inside a larger `parena/` repo that also contains `frontend/`, `docker-compose.yml`, and `docs/` one level up — infra config (docker-compose, `.env`) lives at the parent level, not here.

Modules (all children of the root `pom.xml`):
- **config-server** (8787) — Spring Cloud Config Server. Backed by this same git repo (`spring.cloud.config.server.git`), reading YAML from `backend/configurations/{application}` in the `docker` profile. Basic-auth protected.
- **discovery-server** (8761) — Eureka service registry.
- **gateway-server** (8888) — Spring Cloud Gateway (WebFlux). Routes to downstream services by explicit path predicate, e.g. `Path=/api/v1/users/**` → `lb://user-service`. New services must be added here explicitly (no auto-discovery routing).
- **bff-server** (8989) — Backend-for-Frontend, WebFlux + Spring Session (Redis-backed) + OAuth2 login (Keycloak) + CSRF. Terminates the browser session, then proxies `/api/**` to the gateway (`GatewayProxyController` → `GatewayProxyHandler`), forwarding the authenticated identity. This is the only component that holds session state / cookies.
- **user-service** (8080) — owns user identity/profile. Resource server (validates Keycloak JWTs), talks to Keycloak Admin API to create/manage users, Postgres via JPA/Flyway.
- **institution-service** — brokerage firm management, hexagonal architecture, own Postgres DB, not yet wired into the gateway/docker-compose (in progress).
- **subscription-service** — membership/subscription domain, currently domain-layer only (no persistence/web layers yet).

## Authentication/session model

Keycloak is the identity provider. The browser only ever talks to **bff-server**, which does OAuth2 Authorization Code login against Keycloak and stores the session server-side in Redis (Spring Session). `bff-server` then proxies API calls through **gateway-server** to backend services, which independently validate the Keycloak-issued JWT as OAuth2 resource servers (see `user-service`'s `infrastructure/security/SecurityConfig`). Backend services never see the session cookie — only the bearer token forwarded by the BFF.

`bff-server`'s `SecurityConfig` uses **two ordered filter chains**: chain 1 permits only `POST /api/v1/users/register` (+ its OPTIONS preflight) with a narrow CORS source scoped to the marketing site origin and no credentials; chain 2 covers everything else with CSRF, session-based auth, and a separate credentialed CORS source scoped to the app frontend origin. Registration is intentionally unauthenticated (no session exists yet), so it's isolated into its own chain/CORS policy rather than relaxing the authenticated chain.

## Configuration

Per-service YAML lives in `configurations/<service-name>/`, one file per profile: `<service>.yml` (base), `<service>-dev.yml`, `<service>-docker.yml`, `<service>-prod.yml`. These are served by config-server to every other service at startup (each service is a Spring Cloud Config *client*) — don't put runtime config directly in a module's `src/main/resources/application.yml`; put it in `configurations/`.

Secrets/environment values follow an `SO_*` naming convention (e.g. `SO_USER_SERVICE_DB_PASSWORD`, `SO_KEYCLOAK_ADMIN_PASSWORD`) and are injected via the parent repo's `.env` (see `../.env.example`) — not committed.

Comments throughout the codebase (config YAML, security config, domain code) are frequently written in Turkish, particularly where they explain a non-obvious security or architectural decision — read them, they usually carry the "why".

## Service internal architecture

`user-service` and `institution-service` follow a hexagonal/DDD layering; use it as the template for new services or new features in these two:

```
domain/
  aggregate/root/        # aggregate root entities (plain Java, no framework annotations)
  aggregate/valueobjects/ # small immutable VOs (typed IDs, codes, etc.)
  aggregate/enums/
  event/                  # domain events (institution-service also has ResultWithDomainEvents wrapper)
  port/                   # outbound interfaces the domain depends on (repository, publisher, keycloak client)
  exception/
application/
  usecase/                # one class per use case, orchestrates domain + ports
  mapper/, result/         # (institution-service) DTOs returned from use cases
  exception/
infrastructure/
  persistence/entity/      # JPA entities — separate from domain aggregates
  persistence/repository/  # Spring Data repositories
  persistence/adapter/     # implements domain `port` interfaces using the JPA repository
  persistence/mapper/      # domain <-> JPA entity mapping
  keycloak/                # (user-service) Keycloak admin client adapter/config
  security/                # SecurityConfig (resource server)
  event/                   # (institution-service) domain event publisher adapter
web/
  controller/, dto/request/, dto/response/
  GlobalExceptionHandler
```

Domain aggregates are constructed only via static factories (`User.create(...)`, `User.rehydrate(...)` for reloading from persistence) with private constructors — keep this pattern for new aggregates rather than exposing public constructors or setters.

`bff-server` is flat (`api/`, `config/`, `security/`) since it has no domain logic — it's a routing/session layer, not a DDD service.

## Build & run

Multi-module Maven, Java 21 required. Use the wrapper (`./mvnw`) from the `backend/` root.

```bash
./mvnw -pl user-service -am package          # build one module (and its dependencies)
./mvnw -pl user-service -am test             # run tests for one module
./mvnw test                                  # run all tests across modules
./mvnw -pl user-service spring-boot:run       # run a single service directly (needs config-server/discovery-server/Postgres/Keycloak reachable)
```

There are currently no test source files in any module — when adding tests, they go under `<module>/src/test/java/...` mirroring the main package structure.

Full local stack (Keycloak, Postgres per service, Redis, Mailpit, config/discovery/gateway/bff/user-service) is defined in `../docker-compose.yml` and built via the shared multi-stage `Dockerfile` (root of `backend/`), parameterized by `--build-arg MODULE=<service-name>`. Run it from the parent `parena/` directory:

```bash
docker compose up -d
```

Startup order matters and is encoded via `depends_on`/healthchecks in that compose file: infra (Postgres/Keycloak/Redis) → config-server → discovery-server → gateway-server/bff-server → business services.
