# Frontend URL Routing Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix 5 concrete URL routing problems in `frontend/app`'s SPA and Keycloak login theme, each as an isolated, atomic commit.

**Architecture:** No architectural change — this is a routing-layer cleanup within the existing `react-router-dom` SPA (`AppRouter.tsx`) plus one line in the Keycloak-themed login page. A new `ROUTES` constants module becomes the single source of truth for in-app path literals; everything else (a 404 page, a dead route removal, a cross-domain link fix) builds on or around it.

**Tech Stack:** React 19, react-router-dom, TypeScript, Vitest + React Testing Library, ESLint (flat config).

**Spec:** `docs/superpowers/specs/2026-09-19-frontend-routing-fixes-design.md`

## Global Constraints

- All work happens inside `frontend/app/` (the actual project root — run all commands from there).
- User-facing text stays in Turkish, matching the existing convention (see root `CLAUDE.md`).
- No `Co-Authored-By`/attribution trailers, and **do not run `git commit` yourself** — only suggest the commit message; the user reviews and commits (per `.claude/rules/git/commit-messages.md`, current version).
- Every task must leave `npm run lint` and `npm run build` passing.
- `AppLink` (`src/components/ui/app-link.tsx`) is required for in-app navigation — never a raw `<a href="/...">` (per `frontend/app/CLAUDE.md`).
- New `*PageMeta` exports must be added to `allowExportNames` in `eslint.config.js:26-40` or lint fails (`react-refresh/only-export-components`).
- Do not touch `src/components/auth/AuthShell.tsx`'s `legalHref`/`homeHref` — those build **absolute**, cross-origin URLs (shared with the Keycloak theme via `kcContext.properties.WEBSITE_URL`) and are intentionally different from the relative in-app `ROUTES` this plan introduces. Out of scope.
- Do not touch `?plan=`/`?plan=premium` query-string logic — only the path literal in front of it moves to `ROUTES`.

---

### Task 1: Central route constants (`ROUTES`)

**Files:**
- Create: `src/router/routes.ts`
- Create: `src/router/routes.test.ts`
- Modify: `src/router/AppRouter.tsx`

**Interfaces:**
- Produces: `ROUTES` — a `readonly` object exported from `@/router/routes`, with string keys `home | login | register | checkout | cerez | gizlilik | kullanimSartlari | kvkk | mesafeliSatis`, each a path string starting with `/`. Every later task imports this.

- [ ] **Step 1: Create `src/router/routes.ts`**

```ts
/** Uygulama içi route path'lerinin tek doğruluk kaynağı. */
export const ROUTES = {
  home: "/",
  login: "/giris",
  register: "/uye-ol",
  checkout: "/odeme",
  cerez: "/cerez",
  gizlilik: "/gizlilik",
  kullanimSartlari: "/kullanim-sartlari",
  kvkk: "/kvkk",
  mesafeliSatis: "/mesafeli-satis",
} as const;
```

- [ ] **Step 2: Write `src/router/routes.test.ts`**

```ts
import { describe, expect, it } from "vitest";

import { ROUTES } from "./routes";

describe("ROUTES", () => {
  it("her path '/' ile başlar", () => {
    for (const path of Object.values(ROUTES)) {
      expect(path.startsWith("/")).toBe(true);
    }
  });

  it("path değerleri birbirinin aynısı değildir (benzersiz)", () => {
    const paths = Object.values(ROUTES);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("AppRouter'daki 9 gerçek route ile bire bir eşleşir (sifremi-unuttum hariç, o kaldırılıyor)", () => {
    expect(Object.keys(ROUTES).sort()).toEqual(
      [
        "home",
        "login",
        "register",
        "checkout",
        "cerez",
        "gizlilik",
        "kullanimSartlari",
        "kvkk",
        "mesafeliSatis",
      ].sort(),
    );
  });
});
```

- [ ] **Step 3: Run the test to verify it passes**

Run: `npm run test -- routes.test.ts` (from `frontend/app`)
Expected: 3 passed.

- [ ] **Step 4: Wire `AppRouter.tsx` to `ROUTES`**

In `src/router/AppRouter.tsx`, add the import (with the other `@/` imports, after the `useDocumentMeta` import):

```ts
import { ROUTES } from "@/router/routes";
```

Replace the `<Routes>` block's path literals (leave `/sifremi-unuttum` as a literal — it's removed in Task 7 — and leave the wildcard `*` as-is):

```tsx
      <Routes>
        <Route path={ROUTES.home} element={<LaunchRoute />} />
        <Route path={ROUTES.login} element={<LoginRoute />} />
        <Route path={ROUTES.register} element={<RegisterRoute />} />
        <Route path="/sifremi-unuttum" element={<ForgotPasswordRoute />} />
        <Route path={ROUTES.checkout} element={<CheckoutRoute />} />
        <Route path={ROUTES.cerez} element={<CerezRoute />} />
        <Route path={ROUTES.gizlilik} element={<GizlilikRoute />} />
        <Route path={ROUTES.kullanimSartlari} element={<KullanimSartlariRoute />} />
        <Route path={ROUTES.kvkk} element={<KvkkRoute />} />
        <Route path={ROUTES.mesafeliSatis} element={<MesafeliSatisRoute />} />
        <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
      </Routes>
```

(Only the `to="/"` → `to={ROUTES.home}` on the wildcard row changes behaviorally-neutral; every other row just swaps a string literal for the matching constant.)

- [ ] **Step 5: Verify lint and build**

Run: `npm run lint && npm run build` (from `frontend/app`)
Expected: both exit 0.

- [ ] **Step 6: Commit (suggested message — user runs this)**

```
refactor(frontend): introduce central ROUTES constant for AppRouter
```

---

### Task 2: 404 page

**Files:**
- Create: `src/pages/NotFound/NotFoundPage.tsx`
- Create: `src/pages/NotFound/NotFoundPage.css`
- Create: `src/pages/NotFound/NotFoundPage.test.tsx`
- Modify: `src/router/AppRouter.tsx`
- Modify: `eslint.config.js`

**Interfaces:**
- Consumes: `ROUTES.home` from Task 1 (`@/router/routes`).
- Produces: `NotFoundPage` (default export) and `notFoundPageMeta` (named export) from `@/pages/NotFound/NotFoundPage`.

- [ ] **Step 1: Write `NotFoundPage.test.tsx` (fails first — component doesn't exist yet)**

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import NotFoundPage from "./NotFoundPage";

describe("NotFoundPage", () => {
  it("404 mesajını ve ana sayfaya dönüş linkini gösterir", () => {
    render(<NotFoundPage />);

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Sayfa bulunamadı" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ana sayfaya dön" })).toHaveAttribute("href", "/");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- NotFoundPage.test.tsx`
Expected: FAIL — `Failed to resolve import "./NotFoundPage"`.

- [ ] **Step 3: Create `src/pages/NotFound/NotFoundPage.css`**

```css
.not-found-page {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 24px;
  text-align: center;
  background: var(--background);
  color: var(--foreground);
}

.not-found-page .not-found-code {
  font-size: 56px;
  font-weight: 700;
  color: var(--brand);
  margin: 0;
  line-height: 1;
}

.not-found-page h1 {
  margin: 0;
  font-size: 22px;
}

.not-found-page p {
  margin: 0;
  color: var(--muted-foreground);
  max-width: 42ch;
}

.not-found-page .btn {
  margin-top: 10px;
}
```

- [ ] **Step 4: Create `src/pages/NotFound/NotFoundPage.tsx`**

```tsx
import { AppLink } from "@/components/ui/app-link";
import { ParenaMark } from "@/components/brand/ParenaMark";
import { ROUTES } from "@/router/routes";

import "./NotFoundPage.css";

export const notFoundPageMeta = {
  title: "Sayfa Bulunamadı | Parena",
  description: "Aradığınız sayfa bulunamadı. PARENA ana sayfasına dönebilirsiniz.",
  ogTitle: "Sayfa Bulunamadı | Parena",
  ogDescription: "Aradığınız sayfa bulunamadı. PARENA ana sayfasına dönebilirsiniz.",
};

export default function NotFoundPage() {
  return (
    <div className="not-found-page">
      <ParenaMark size={48} />
      <p className="not-found-code">404</p>
      <h1>Sayfa bulunamadı</h1>
      <p>Aradığın sayfa taşınmış ya da hiç var olmamış olabilir.</p>
      <AppLink className="btn btn-primary" href={ROUTES.home}>
        Ana sayfaya dön
      </AppLink>
    </div>
  );
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test -- NotFoundPage.test.tsx`
Expected: PASS.

- [ ] **Step 6: Wire the wildcard route to `NotFoundPage` in `AppRouter.tsx`**

Add the import (alongside the other page imports, alphabetically near `LaunchPage`):

```ts
import NotFoundPage, { notFoundPageMeta } from "@/pages/NotFound/NotFoundPage";
```

Remove `Navigate` from the `react-router-dom` import (now unused):

```ts
import { Route, Routes, useSearchParams, useLocation } from "react-router-dom";
```

Add the route constant next to the other `withMeta(...)` consts:

```ts
const NotFoundRoute = withMeta(NotFoundPage, notFoundPageMeta);
```

Change the wildcard route's element:

```tsx
        <Route path="*" element={<NotFoundRoute />} />
```

- [ ] **Step 7: Add `notFoundPageMeta` to ESLint's `allowExportNames`**

In `eslint.config.js`, inside the `allowExportNames` array (after `'mesafeliSatisPageMeta',`):

```js
            'mesafeliSatisPageMeta',
            'notFoundPageMeta',
```

- [ ] **Step 8: Verify lint, tests, and build**

Run: `npm run lint && npm run test -- --run && npm run build`
Expected: all pass.

- [ ] **Step 9: Manual check**

Run: `npm run dev`, then visit `http://localhost:5173/does-not-exist` in a browser. Expected: the new 404 page renders (not the launch page), and "Ana sayfaya dön" navigates to `/` without a full page reload (check the Network tab — no new HTML document request).

- [ ] **Step 10: Commit (suggested message — user runs this)**

```
feat(frontend): add 404 page for unknown routes
```

---

### Task 3: Migrate landing components to `ROUTES`

**Files:**
- Modify: `src/components/landing/Pricing.tsx`
- Modify: `src/components/landing/StickyCta.tsx`
- Modify: `src/components/landing/FinalCta.tsx`
- Modify: `src/components/landing/Faq.tsx`
- Modify: `src/components/landing/LeadCapture.tsx`

**Interfaces:**
- Consumes: `ROUTES` from Task 1.

No new tests — these are presentational components with no existing test coverage (consistent with current project convention: only `ui/` primitives and hooks have `.test.tsx` files). Verification is lint + build + manual check (Step 6/7).

- [ ] **Step 1: `Pricing.tsx`** — add `import { ROUTES } from "@/router/routes";` under the existing `AppLink` import, then:

```tsx
                <AppLink
                  className="btn btn-primary"
                  href={`${ROUTES.register}?plan=ucretsiz`}
                  data-cta="plan-free"
                >
                  Ücretsiz kayıt ol
                </AppLink>
```
```tsx
                  <AppLink href={ROUTES.kullanimSartlari}>Kullanım Şartları</AppLink> ve{" "}
                  <AppLink href={ROUTES.gizlilik}>Gizlilik Politikası</AppLink> geçerlidir.
```
```tsx
              <AppLink className="btn btn-primary btn-block btn-lg" href={`${ROUTES.register}?plan=premium`} data-cta="plan-premium">Kurucu üye ol · 149 ₺/ay</AppLink>
              <p className="pfoot">
                🔒 Ödeme iyzico'nun güvenli sayfasında tamamlanır; kart bilgilerin PARENA'da saklanmaz.<br />
                Kurucu kontenjanı dolduğunda üyelik 249 ₺/ay olarak devam eder.<br />
                Üyelik <AppLink href={ROUTES.kullanimSartlari}>Kullanım Şartları</AppLink> ve
                <AppLink href={ROUTES.mesafeliSatis}> Mesafeli Satış Sözleşmesi</AppLink>'ne tabidir.
              </p>
```

- [ ] **Step 2: `StickyCta.tsx`** — add `import { ROUTES } from "@/router/routes";` under the `PRICING_CONFIG` import, then:

```tsx
      <AppLink className="btn btn-primary" href={`${ROUTES.register}?plan=premium`} data-cta="sticky">
```

- [ ] **Step 3: `FinalCta.tsx`** — add `import { ROUTES } from "@/router/routes";` under the `AppLink` import, then:

```tsx
              <AppLink className="btn btn-gold btn-lg" href={`${ROUTES.register}?plan=premium`} data-cta="final-primary">Kurucu üye ol · 149 ₺/ay</AppLink>
```

- [ ] **Step 4: `Faq.tsx`** — add `import { ROUTES } from "@/router/routes";` under the `AppLink` import, then:

```tsx
              <div className="ans">Hayır. PARENA, SPK lisanslı aracı kurumların kamuya açık raporlarındaki borsa görüşlerini derler, karşılaştırır ve sonuçlarını raporlar. Kendi adına hiçbir alım-satım önerisi veya derecelendirme üretmez. Yatırım danışmanlığı, yetkili kuruluşlarla imzalanan sözleşme çerçevesinde sunulur. Ayrıntı: <AppLink href={`${ROUTES.kullanimSartlari}#m3`}>Kullanım Şartları, madde 3</AppLink>.</div>
```
```tsx
              <div className="ans">Portföyünü elle girersin. PARENA hiçbir aracı kurum hesabına, paranıza veya emir iletim sistemine erişmez; API bağlantısı istemez. Yalnızca girdiğin hisse, adet ve maliyet bilgisiyle takip ve karne hesaplaması yapar. Verilerinin nasıl işlendiğini <AppLink href={ROUTES.gizlilik}>Gizlilik Politikası</AppLink>'nda bulabilirsin.</div>
```
```tsx
              <div className="ans">Ödemeler iyzico'nun güvenli sayfası üzerinden alınır. Kart bilgilerin PARENA sunucularında saklanmaz. Yıllık ödemede iki ay hediye edilir. Ödeme, ifa ve cayma koşulları <AppLink href={ROUTES.mesafeliSatis}>Mesafeli Satış Sözleşmesi</AppLink>'nde düzenlenmiştir.</div>
```

- [ ] **Step 5: `LeadCapture.tsx`** — add `import { ROUTES } from "@/router/routes";` under the `isValidEmail` import, then:

```tsx
          <p className="cap-note">
            E-posta adresin <AppLink href={ROUTES.kvkk}>KVKK Aydınlatma Metni</AppLink> kapsamında
            işlenir. Sohbete katılmak istersen{" "}
            <AppLink href={`${ROUTES.register}?plan=ucretsiz`}>ücretsiz hesap açıp</AppLink> PARENA Telegram
            topluluğuna girebilirsin.
          </p>
```

- [ ] **Step 6: Verify lint and build**

Run: `npm run lint && npm run build`
Expected: both exit 0.

- [ ] **Step 7: Manual check**

Run: `npm run dev`, open `/`, click through: "Ücretsiz kayıt ol" and "Kurucu üye ol" buttons in the pricing section, the sticky CTA, the final CTA, an FAQ answer link, and the lead-capture note link. Expected: each still lands on the same page as before (`/uye-ol?plan=...`, `/kullanim-sartlari`, `/gizlilik`, `/mesafeli-satis`, `/kvkk`) — behavior unchanged, only the source of the literal changed.

- [ ] **Step 8: Commit (suggested message — user runs this)**

```
refactor(frontend): migrate landing components to ROUTES constants
```

---

### Task 4: Migrate layout components to `ROUTES`

**Files:**
- Modify: `src/components/layout/SiteFooter.tsx`
- Modify: `src/components/layout/SiteNav.tsx`
- Modify: `src/components/legal/LegalFooter.tsx`

**Interfaces:**
- Consumes: `ROUTES` from Task 1.

- [ ] **Step 1: `SiteFooter.tsx`** — add `import { ROUTES } from "@/router/routes";` under the `AppLink` import, then replace the `LEGAL_LINKS` array:

```tsx
const LEGAL_LINKS = [
  { href: ROUTES.kullanimSartlari, label: "Kullanım şartları" },
  { href: ROUTES.gizlilik, label: "Gizlilik politikası" },
  { href: ROUTES.kvkk, label: "KVKK aydınlatma metni" },
  { href: ROUTES.mesafeliSatis, label: "Mesafeli satış sözleşmesi" },
  { href: ROUTES.cerez, label: "Çerez politikası" },
];
```

and the single inline link near the bottom:

```tsx
          <AppLink href={ROUTES.kullanimSartlari}>Kullanım Şartları</AppLink>'na bakınız.
```

(The `/#ozellikler`, `/#karne`, `/#fiyat`, `/#sss` hash links stay as-is — they're anchors on the home page, not part of `ROUTES`.)

- [ ] **Step 2: `SiteNav.tsx`** — add `import { ROUTES } from "@/router/routes";` under the `logout` import, then:

```tsx
      href={ROUTES.login}
```

(the `AppLink` around line 54 that currently has `href="/giris"`).

- [ ] **Step 3: `LegalFooter.tsx`** — add `import { ROUTES } from "@/router/routes";` under the `AppLink` import, then replace the `LINKS` array:

```tsx
const LINKS = [
  { href: ROUTES.home, label: "Ana sayfa" },
  { href: ROUTES.kullanimSartlari, label: "Kullanım şartları" },
  { href: ROUTES.gizlilik, label: "Gizlilik politikası" },
  { href: ROUTES.kvkk, label: "KVKK aydınlatma metni" },
  { href: ROUTES.mesafeliSatis, label: "Mesafeli satış sözleşmesi" },
  { href: ROUTES.cerez, label: "Çerez politikası" },
];
```

- [ ] **Step 4: Verify lint and build**

Run: `npm run lint && npm run build`
Expected: both exit 0.

- [ ] **Step 5: Manual check**

Run: `npm run dev`. On `/`, check the top nav's "Giriş yap" link and the footer's legal links. On any legal page (e.g. `/kvkk`), check `LegalFooter`'s links. Expected: identical destinations to before.

- [ ] **Step 6: Commit (suggested message — user runs this)**

```
refactor(frontend): migrate layout/footer components to ROUTES constants
```

---

### Task 5: Migrate `CheckoutPage` and `RegisterPage` to `ROUTES`

**Files:**
- Modify: `src/pages/Checkout/CheckoutPage.tsx`
- Modify: `src/pages/Register/RegisterPage.tsx`

**Interfaces:**
- Consumes: `ROUTES` from Task 1.

- [ ] **Step 1: `CheckoutPage.tsx`** — add `import { ROUTES } from "@/router/routes";` under the `FOUNDER_QUOTA` import, then:

```tsx
        <AppLink href={ROUTES.mesafeliSatis} target="_blank" rel="noopener">
          Ön Bilgilendirme Formu
        </AppLink>
```
```tsx
        <AppLink href={ROUTES.mesafeliSatis} target="_blank" rel="noopener">
          Mesafeli Satış Sözleşmesi
        </AppLink>
        'ni ve{" "}
        <AppLink href={ROUTES.kullanimSartlari} target="_blank" rel="noopener">
          Kullanım Şartları
        </AppLink>
```

and the footer link block near the end of the file:

```tsx
            <AppLink href={ROUTES.home}>Ana sayfa</AppLink>
            <AppLink href={ROUTES.kullanimSartlari}>Kullanım şartları</AppLink>
            <AppLink href={ROUTES.mesafeliSatis}>Mesafeli satış sözleşmesi</AppLink>
            <AppLink href={ROUTES.gizlilik}>Gizlilik politikası</AppLink>
            <AppLink href={ROUTES.kvkk}>KVKK</AppLink>
```

- [ ] **Step 2: `RegisterPage.tsx`** — add `import { ROUTES } from "@/router/routes";` under the `AppLink` import, then:

```tsx
  const paymentHref = `${ROUTES.checkout}?plan=premium`;
```
```tsx
          Zaten hesabın var mı? <AppLink href={ROUTES.login}>Giriş yap</AppLink>
```
```tsx
                <AppLink
                  href={ROUTES.kullanimSartlari}
                  target="_blank"
                  rel="noopener"
                  className="font-semibold underline! decoration-brand/30 underline-offset-2 hover:decoration-brand"
                >
                  Kullanım Şartları
                </AppLink>
```
```tsx
            <AppLink
              href={ROUTES.kvkk}
              target="_blank"
              rel="noopener"
              className="font-semibold underline! decoration-brand/30 underline-offset-2 hover:decoration-brand"
            >
              Kvkk Aydınlatma Metni
            </AppLink>
```
```tsx
            <AppLink
              href={ROUTES.gizlilik}
              target="_blank"
              rel="noopener"
              className="font-semibold underline! decoration-brand/30 underline-offset-2 hover:decoration-brand"
            >
              Gizlilik Politikası
            </AppLink>
```
```tsx
              <AppLink className="btn" href={paymentHref}>
                Premium üyeliğe devam et
              </AppLink>
              <p style={{ fontSize: "12.5px", color: "var(--muted)", marginTop: 14 }}>
                Ödemeyi sonra da tamamlayabilirsin;{" "}
                <AppLink href={ROUTES.login} style={{ fontWeight: 600 }}>
                  giriş yap
                </AppLink>{" "}
                ve hesabından devam et.
              </p>
            </>
          ) : (
            <AppLink className="btn" href={ROUTES.login}>
              Giriş sayfasına dön
            </AppLink>
```
```tsx
      <p className="legal-note">
        Ücretli üyeliğe geçtiğinde{" "}
        <AppLink href={ROUTES.mesafeliSatis} target="_blank" rel="noopener">
          Mesafeli Satış Sözleşmesi
        </AppLink>{" "}
        de geçerli olur.
      </p>
```

- [ ] **Step 3: Verify lint and build**

Run: `npm run lint && npm run build`
Expected: both exit 0.

- [ ] **Step 4: Manual check**

Run: `npm run dev`. Visit `/uye-ol?plan=premium`, submit the form (or just check links render correctly without submitting), check the legal links and "Giriş yap" link. Visit `/odeme` and check its footer/consent links. Expected: identical destinations to before.

- [ ] **Step 5: Commit (suggested message — user runs this)**

```
refactor(frontend): migrate CheckoutPage and RegisterPage to ROUTES constants
```

---

### Task 6: Legal pages — raw `<a>` → `AppLink`

**Files:**
- Modify: `src/pages/Legal/MesafeliSatisPage.tsx`
- Modify: `src/pages/Legal/CerezPage.tsx`
- Modify: `src/pages/Legal/KullanimSartlariPage.tsx`
- Modify: `src/pages/Legal/GizlilikPage.tsx`

**Interfaces:**
- Consumes: `ROUTES` from Task 1, `AppLink` from `@/components/ui/app-link`.

- [ ] **Step 1: `MesafeliSatisPage.tsx`** — change the import line to:

```tsx
import { AppLink } from "@/components/ui/app-link";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { ROUTES } from "@/router/routes";
```

then (line 82):

```tsx
      <p><strong>Hizmetin niteliğine ilişkin uyarı:</strong> Platform yatırım danışmanlığı, portföy yöneticiliği veya yatırım tavsiyesi hizmeti sunmaz. Sunulan içerik yalnızca bilgilendirme amaçlıdır ve yatırım kararlarının sorumluluğu münhasıran Alıcı'ya aittir. Ayrıntı için <AppLink href={ROUTES.kullanimSartlari}>Kullanım Şartları</AppLink>'nın 3. maddesine bakınız.</p>
```

- [ ] **Step 2: `CerezPage.tsx`** — change the import line to:

```tsx
import { AppLink } from "@/components/ui/app-link";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { ROUTES } from "@/router/routes";
```

then (line 131):

```tsx
      <p>Çerezler aracılığıyla işlenen kişisel verilere ilişkin ayrıntılı bilgilendirme için <AppLink href={ROUTES.kvkk}>KVKK Aydınlatma Metni</AppLink>'ni, genel gizlilik uygulamalarımız için <AppLink href={ROUTES.gizlilik}>Gizlilik Politikası</AppLink>'nı inceleyebilirsiniz.</p>
```

- [ ] **Step 3: `KullanimSartlariPage.tsx`** — change the import line to:

```tsx
import { AppLink } from "@/components/ui/app-link";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { ROUTES } from "@/router/routes";
```

then (line 193):

```tsx
      <p>Üye'ye ait kişisel veriler, 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında, <AppLink href={ROUTES.kvkk}>KVKK Aydınlatma Metni</AppLink>'nde belirtilen amaç, hukuki sebep ve saklama süreleri çerçevesinde işlenir.</p>
```

- [ ] **Step 4: `GizlilikPage.tsx`** — change the import line to:

```tsx
import { AppLink } from "@/components/ui/app-link";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { ROUTES } from "@/router/routes";
```

then (line 49):

```tsx
      <p>Kişisel verilerin işlenmesine ilişkin hukuki dayanaklar ve ayrıntılı bilgilendirme için <AppLink href={ROUTES.kvkk}>KVKK Aydınlatma Metni</AppLink>'ni; çerez kullanımı için <AppLink href={ROUTES.cerez}>Çerez Politikası</AppLink>'nı inceleyebilirsiniz. Bu üç metin birbirini tamamlar.</p>
```

(line 96):

```tsx
      <p>Kullanılan çerezlerin tam listesi, süreleri ve tercihlerinizi nasıl değiştireceğiniz <AppLink href={ROUTES.cerez}>Çerez Politikası</AppLink>'nda açıklanmıştır.</p>
```

(line 152):

```tsx
      <p>Hakların tam listesi ve başvuru usulü <AppLink href={ROUTES.kvkk}>KVKK Aydınlatma Metni</AppLink>'nde ayrıntılı olarak açıklanmıştır. Başvurularınızı destek@parena.com.tr adresine iletebilirsiniz; talepler en geç 30 gün içinde sonuçlandırılır.</p>
```

- [ ] **Step 5: Verify lint and build**

Run: `npm run lint && npm run build`
Expected: both exit 0. (`AppLink` renders a plain `<a>` under the hood when outside router context or external, so this is a safe drop-in — see `src/components/ui/app-link.tsx:22-28`.)

- [ ] **Step 6: Manual check**

Run: `npm run dev`. Open `/mesafeli-satis`, `/cerez`, `/kullanim-sartlari`, `/gizlilik` and click each converted link. Expected: navigates client-side (no full page reload — check the Network tab shows no new document request) to the correct target page.

- [ ] **Step 7: Commit (suggested message — user runs this)**

```
fix(frontend): use AppLink instead of raw <a> for in-app links on legal pages
```

---

### Task 7: Remove the dead `/sifremi-unuttum` route

**Files:**
- Modify: `src/router/AppRouter.tsx`
- Modify: `src/features/auth/auth.api.ts`

**Interfaces:**
- Removes: `getPasswordResetRedirectUrl` (was exported from `@/features/auth/auth.api`) — confirm nothing else imports it first.

- [ ] **Step 1: Confirm no other consumer exists**

Run: `grep -rn "getPasswordResetRedirectUrl" src` (from `frontend/app`)
Expected: only the two lines being removed in this task (the export in `auth.api.ts` and the usage in `AppRouter.tsx`) — no third caller.

- [ ] **Step 2: Remove from `AppRouter.tsx`**

Remove the `ForgotPasswordRoute` function:

```tsx
function ForgotPasswordRoute() {
  useEffect(() => {
    window.location.href = getPasswordResetRedirectUrl();
  }, []);
  return null;
}
```

Remove the route row:

```tsx
        <Route path="/sifremi-unuttum" element={<ForgotPasswordRoute />} />
```

Update the `auth.api` import to drop `getPasswordResetRedirectUrl`:

```ts
import { getLoginRedirectUrl } from "@/features/auth/auth.api";
```

- [ ] **Step 3: Remove from `auth.api.ts`**

Remove:

```ts
export function getPasswordResetRedirectUrl(): string {
  return getLoginRedirectUrl();
}
```

- [ ] **Step 4: Verify lint and build**

Run: `npm run lint && npm run build`
Expected: both exit 0 (no leftover unused imports/references).

- [ ] **Step 5: Manual check**

Run: `npm run dev`, visit `http://localhost:5173/sifremi-unuttum`. Expected: renders the Task 2 404 page (route no longer exists, falls through to the wildcard).

- [ ] **Step 6: Commit (suggested message — user runs this)**

```
fix(frontend): remove unreferenced /sifremi-unuttum route

The route silently redirected straight to the plain login screen
(getPasswordResetRedirectUrl() only aliased getLoginRedirectUrl()) and
nothing in the app linked to it. The working "forgot password" flow
lives entirely in the Keycloak-themed login page's own
url.loginResetCredentialsUrl link.
```

---

### Task 8: Fix the Keycloak login page's register link (`APP_URL` → `WEBSITE_URL`)

**Files:**
- Modify: `src/keycloak-theme/login/pages/Login.tsx`

- [ ] **Step 1: Change the URL source**

In `src/keycloak-theme/login/pages/Login.tsx:13`:

```ts
    const FRONTEND_REGISTER_URL = `${kcContext.properties.WEBSITE_URL}/uye-ol`;
```

- [ ] **Step 2: Verify lint and build**

Run: `npm run lint && npm run build`
Expected: both exit 0.

- [ ] **Step 3: Verification note (manual, deferred)**

This line only executes inside the Keycloak-rendered theme, which requires `docker build -f Dockerfile.keycloak -t parena-keycloak .` (from the repo root) and a Keycloak redeploy to observe in a browser — a large/slow step. Check with the user when to run this; a code-level review (confirming `WEBSITE_URL` matches `AuthShell.tsx:48-54`'s pattern) can stand in for now.

- [ ] **Step 4: Commit (suggested message — user runs this)**

```
fix(frontend): use WEBSITE_URL for Keycloak login page's register link

Login.tsx built the "Ücretsiz oluştur" link from APP_URL
(app.parena.com.tr) while every other link on the same page
(AuthShell's logo/home and legal links) uses WEBSITE_URL
(parena.com.tr). /uye-ol is a route of the same SPA those other
links point to, not a separate app.parena.com.tr deployment.
Both domains currently alias the same Vercel project so this wasn't
broken yet, but it would break once app.parena.com.tr is split off
for the dashboard.
```

---

## Self-Review

**Spec coverage:** Spec §3.1→Task 2, §3.2→Task 1/3/4/5, §3.3→Task 6, §3.4→Task 7, §3.5→Task 8. All 5 spec items have a task.

**Placeholder scan:** No TBD/TODO markers; every step has literal code. Task 8 Step 3 explicitly defers a *manual verification*, not implementation — the code change itself is fully specified in Step 1.

**Type consistency:** `ROUTES` keys (`home, login, register, checkout, cerez, gizlilik, kullanimSartlari, kvkk, mesafeliSatis`) are used identically across Tasks 1, 3, 4, 5, 6 — no renamed/mismatched keys. `notFoundPageMeta`/`NotFoundPage` names match between Task 2's creation and its `AppRouter.tsx`/`eslint.config.js` wiring.
