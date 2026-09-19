# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The PARENA frontend: a Vite + React 19 SPA (marketing/landing site, registration/checkout flows, legal pages) that shares a single build with a **Keycloakify** login theme. Two independent React trees are compiled from one Vite config and mounted conditionally at runtime based on whether `window.kcContext` is present (set by Keycloak when it serves the themed login pages).

Turkish is the UI language throughout (copy, comments, error messages) — match it when touching user-facing text or comments in existing files.

## Commands

Run from `app/` (this directory is the actual project root — the parent `frontend/` folder has no package.json):

- `npm run dev` — Vite dev server on port 5173
- `npm run build` — `tsc -b` (project references, no emit) then `vite build`
- `npm run build-keycloak-theme` — full build + `keycloakify build`, producing the deployable Keycloak theme JAR/zip
- `npm run lint` — ESLint over the whole repo
- `npm run storybook` — Storybook on port 6006 (stories under `src/**/*.stories.tsx`)
- `npm run preview` — preview the production build

There is no test runner configured (no `test` script, no test files). Storybook is the primary component-verification tool.

## Environment variables

Read once in `src/config/env.ts` via `import.meta.env.VITE_API_BASE_URL` — never read `import.meta.env` directly elsewhere. Empty means same-origin relative requests (Vercel proxy setups). `.env` documents the local/prod pairs (`VITE_API_BASE_URL`, `VITE_FRONTEND_BASE_URL`, and the `*_PROD_URL` variants used for Vercel env config — Vite only reads the unsuffixed `VITE_*` names at build time).

Keycloakify has its own separate env surface (`APP_URL`, `WEBSITE_URL`), declared in `vite.config.ts` and consumed via the generated `src/keycloak-theme/kc.gen.tsx` (`kcEnvNames`/`kcEnvDefaults`) — unrelated to the Vite `VITE_*` vars above.

## Dual-entry architecture

- `src/main.tsx` is the *only* HTML entry point (`index.html` loads it directly). It checks `window.kcContext`: if set, renders `KcPage` (Keycloak theme) synchronously; otherwise lazy-loads `src/main.app.tsx` → `src/App.tsx` (the marketing SPA), wrapped in `Suspense`.
- `src/main.app.tsx` exists solely so `src/App.tsx` can stay a Fast-Refresh-friendly component export — don't collapse the two files.
- `src/App.tsx` wires `QueryClientProvider` (React Query, single `QueryClient` instance kept via `useState` so `StrictMode` remounts don't recreate it) → `BrowserRouter` → `AppRouter`.
- `src/router/AppRouter.tsx` is the single routing surface (`react-router-dom`). The `/giris` (login) route doesn't render React — it redirects (`window.location.href`) straight to the BFF's Keycloak OAuth2 authorization endpoint (see `auth.api.ts`). Actual login UI is server-rendered by Keycloak using the theme in `src/keycloak-theme/`, not by this router; the "forgot password" flow lives entirely there too, via `url.loginResetCredentialsUrl` in `src/keycloak-theme/login/pages/Login.tsx` — there is no `/sifremi-unuttum` route in the SPA.
- Page components declare a co-located `*PageMeta` object (title/description/OG tags) consumed by `useDocumentMeta` (`src/hooks/use-document-meta.ts`) via the `withMeta()` HOC in `AppRouter.tsx` — this is the SPA's substitute for SSR `<head>` management. New page-level exports that aren't components (like `*PageMeta`) must be added to the `allowExportNames` allowlist in `eslint.config.js` or `react-refresh/only-export-components` will fail lint.

## Keycloak theme (`src/keycloak-theme/`)

Generated/managed by `keycloakify`. `kc.gen.tsx` is **auto-generated** (`update-kc-gen` command) — never hand-edit it; it's `@ts-nocheck`'d and regenerated from the theme structure. Custom page overrides live in `login/pages/*.tsx` (Login, LoginResetPassword, LoginUpdatePassword, LoginVerifyEmail, LoginPageExpired, Error, Info) and are wired into `login/KcPage.tsx`'s switch on `kcContext.pageId`; anything not explicitly listed falls through to Keycloakify's `DefaultPage`. Email templates (`.ftl` + per-locale `.properties`) under `keycloak-theme/email/` are also part of the shipped theme, not dead template files.

## BFF / auth architecture

The frontend never talks to Keycloak directly for session use — everything goes through a Backend-for-Frontend (BFF) that owns the session cookie and CSRF token. Two HTTP clients in `src/lib/http/api-client.ts`, chosen per-endpoint by trust boundary:

- **`apiRequest`** — for session-authenticated endpoints. Sends `credentials: "include"` (HttpOnly session cookie; token never touches JS). On any mutating request (non-GET) it attaches a CSRF header sourced from `src/lib/http/csrf.ts` (in-memory cache, fetched from `/api/csrf`, **not** read from a cookie). A `403` on first attempt triggers one forced CSRF refresh + retry. A `401` clears the cached CSRF token.
- **`publicApiRequest`** — for unauthenticated public endpoints (e.g. register). Deliberately omits credentials/CSRF — the backend CORS policy for these endpoints is credential-less and narrowly scoped; calling them with `apiRequest` gets the preflight rejected. Don't "fix" this by switching a public endpoint to `apiRequest`.

Both funnel through `handleResponse`, which also guards against a subtle failure mode: if the BFF is down and static hosting falls back to serving `index.html` with a 200, the client detects an HTML payload where JSON was expected and throws rather than treating it as success (would otherwise look like a silent fake-login).

`src/features/auth/auth.api.ts` holds the auth endpoint map and helpers. Login and password reset are full-page redirects to `{apiBaseUrl}/oauth2/authorization/keycloak`, not fetch calls. Logout is a hidden native `<form>` POST (not `fetch`) because RP-initiated logout needs a real navigation to follow Keycloak's redirect chain; the CSRF value goes in as a form field (`parameterName`), matching what the BFF expects for form-encoded submissions.

`src/lib/http/api-error.ts`'s `ApiError` carries `status`/`code`/`fieldErrors`; `toUserMessage()` maps it to short Turkish user-facing strings. Backend field-validation errors (`fieldErrors`) get remapped from backend field names to frontend form field names via a local `BACKEND_FIELD_MAP` in each form component (see `RegisterPage.tsx`) — there's no shared mapping, each form defines its own.

## Path aliases & structure conventions

- `@/*` → `src/*` (configured in both `vite.config.ts` and `tsconfig.app.json` — keep them in sync if changed).
- `src/components/ui/` — low-level primitives (Radix-based dialog/sheet/label wrappers, `parena-button`, `text-field`, `toast`). Styling via `cn()` (`src/lib/utils.ts`, `clsx` + `tailwind-merge`) and `class-variance-authority` for variants (see `parena-button-variants.ts`). No shadcn `components.json` — these are hand-rolled, not CLI-generated.
- `src/components/{auth,landing,layout,legal,brand}/` — feature/domain-grouped composite components, each domain often pairs a `.tsx` with a hand-written `.css` file (not Tailwind-only) alongside Tailwind classes.
- `src/features/<domain>/` — API calls (`*.api.ts`), React Query hooks (`*.queries.ts`), types (`*.types.ts`) per domain; currently only `auth`.
- `src/pages/<PageName>/` — route-level components, each typically with a co-located `.css` file and a `*PageMeta` export.
- `AppLink` (`src/components/ui/app-link.tsx`) is the router-aware link: renders a plain `<a>` for external/`mailto:`/`tel:`/hash URLs or when used outside a Router context, otherwise a React Router `<Link>`. Prefer it over raw `<a>`/`<Link>` for in-app navigation.

## Styling

Tailwind CSS v4 via `@tailwindcss/vite` (no separate `tailwind.config.js` — v4 is CSS-first, check `src/index.css` for `@theme`/config if adjusting design tokens). Fonts (`Unbounded`, `Inter`, `JetBrains Mono`) are loaded via Google Fonts `<link>` in `index.html`.
