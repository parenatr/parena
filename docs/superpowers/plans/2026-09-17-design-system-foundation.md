# Design System Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** PARENA design system'in temelini kur: tek kaynaklı design token'lar (`tokens.css`, SPA + Keycloak teması arasında paylaşılan), dashboard'a scope'lu dark mode altyapısı, Vitest+RTL test altyapısı ve bu deseni gösteren bir referans component (Button).

**Architecture:** `frontend/app/src/styles/tokens.css` framework-agnostic tek token kaynağı olur; `src/index.css` onu `@import` edip Tailwind v4 `@theme inline` eşlemesini üstüne kurar. Dark mode `[data-theme="dark"]` scoped selector + Tailwind `@custom-variant dark` ile çalışır, aktivasyon React `ThemeProvider`'ın sardığı elemente `data-theme` attribute'u basmasıyla olur (global değil, sadece o alt ağaç). Component kütüphanesi `src/components/ui/` altında kebab-case, Radix primitive (gerekiyorsa) + `class-variance-authority` (cva) deseniyle kurulur; her component zorunlu `*.stories.tsx` + `*.test.tsx` ile gelir.

**Tech Stack:** React 19, TypeScript ~6.0.2 (strict: `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`), Vite 8, Tailwind CSS v4 (CSS-first, `@theme`), Radix UI (`@radix-ui/react-slot` zaten dependency), `class-variance-authority`, Vitest + `@testing-library/react` + `@testing-library/jest-dom` + `@testing-library/user-event` (bu planda eklenecek), Storybook 10 (`@storybook/react-vite`, zaten kurulu).

**Spec:** `docs/design-system/design-spec.md`

## Global Constraints

- Tüm import'lar `@/` alias'ı ile yapılır, relative path (`../../..`) kullanılmaz (spec §6).
- `ui/` içinde dosya adları kebab-case; barrel/`index.ts` dosyası açılmaz (spec §2).
- Hiçbir yeni component/page CSS'i kendi `:root` bloğunu açıp token adı tekrar tanımlayamaz; renk/radius/shadow/spacing her zaman `var(--token-adı)` ile kullanılır (spec §4.2).
- Her `ui/` component'i zorunlu `*.stories.tsx` (tüm variant/size/state) + `*.test.tsx` (render + etkileşim + a11y rol assertion) ile gelir (spec §8).
- Kod içi yorumlar ve kullanıcıya dönük metinler Türkçe yazılır (mevcut proje konvansiyonu).
- `npm run lint` her görevin sonunda geçmelidir.
- `data-theme` attribute'u yalnızca dashboard alt ağacına set edilir; `<html>`/`<body>` seviyesine asla set edilmez (spec §5).

---

### Task 1: `tokens.css` — tek design-token kaynağı

**Files:**
- Create: `frontend/app/src/styles/tokens.css`
- Modify: `frontend/app/src/index.css` (tamamı aşağıdaki içerikle değiştirilir)

**Interfaces:**
- Produces: CSS custom property'leri — `--background`, `--surface`, `--foreground`, `--foreground-strong`, `--muted`, `--muted-foreground`, `--divider`, `--brand`, `--brand-foreground`, `--deep`, `--gold`, `--gold-foreground`, `--buy`, `--buy-foreground`, `--sell`, `--sell-foreground`, `--radius`, `--radius-full`, `--text-xs/sm/base/md/lg/xl/display-sm/display-md`, `--space-section-y`, `--space-hero-y`, `--shadow-xs/sm/md/lg/gold`, `--breakpoint-sm/md/lg` — light değerler `:root`'ta, dark değerler `[data-theme="dark"]` altında. Task 2, 3, 4 bunları tüketir.
- Consumes: Yok (bu, zincirin ilk task'ı).

Bu task CSS-only olduğu için klasik TDD kırmızı/yeşil döngüsü uygulanamaz; doğrulama derleme + görsel kontrol ile yapılır (adım 4).

- [ ] **Step 1: `src/styles/tokens.css` dosyasını oluştur**

```css
/*
 * PARENA design token kaynağı.
 * SPA (src/index.css) ve Keycloak login teması bu dosyayı @import eder.
 * Framework-agnostic: Tailwind'e bağımlı değildir, sadece CSS custom property tanımlar.
 * Light değerler :root altında, dark değerler [data-theme="dark"] altında tanımlıdır.
 * data-theme attribute'unun NEREYE set edileceği bu dosyanın sorumluluğunda DEĞİLDİR
 * — bkz. src/features/dashboard/theme-provider.tsx (Task 2).
 */

:root {
  --radius: 0.625rem;
  --radius-full: 9999px;

  --background: oklch(0.973 0.007 268.55);
  --surface: oklch(1 0 0);
  --foreground: oklch(0.32 0.03 265);
  --foreground-strong: oklch(0 0 0);
  --muted: oklch(0.95 0.008 268.55);
  --muted-foreground: oklch(0.5529 0.0307 269.39);
  --divider: oklch(0.931 0.0113 269.55);
  --brand: oklch(0.2829 0.0688 258.85);
  --brand-foreground: oklch(1 0 0);
  --deep: oklch(0.2328 0.0571 259.29);
  --gold: oklch(0.7925 0.1295 86.2);
  --buy: oklch(0.6428 0.1372 161.52);
  --sell: oklch(0.627 0.1821 24.01);

  --gold-foreground: color-mix(in oklch, var(--gold) 65%, black);
  --buy-foreground: color-mix(in oklch, var(--buy) 65%, black);
  --sell-foreground: color-mix(in oklch, var(--sell) 65%, black);

  --text-xs: 0.75rem;
  --text-sm: 0.8125rem;
  --text-base: 0.875rem;
  --text-md: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.375rem;
  --text-display-sm: clamp(1.3rem, 2.5vw, 1.78rem);
  --text-display-md: clamp(1.78rem, 3.9vw, 2.55rem);

  --space-section-y: clamp(64px, 9vw, 110px);
  --space-hero-y: clamp(46px, 6vw, 78px);

  --shadow-xs: 0 2px 8px -3px rgba(19, 41, 75, .14);
  --shadow-sm: 0 10px 26px -12px rgba(19, 41, 75, .7);
  --shadow-md: 0 14px 40px -18px rgba(19, 41, 75, .28);
  --shadow-lg: 0 30px 70px -30px rgba(12, 29, 56, .45);
  --shadow-gold: 0 10px 26px -12px rgba(224, 181, 78, .9);

  --breakpoint-sm: 640px;
  --breakpoint-md: 900px;
  --breakpoint-lg: 980px;
}

[data-theme="dark"] {
  --background: oklch(0.16 0.02 259);
  --surface: oklch(0.21 0.025 259);
  --foreground: oklch(0.92 0.01 260);
  --foreground-strong: oklch(1 0 0);
  --muted: oklch(0.26 0.02 259);
  --muted-foreground: oklch(0.68 0.02 260);
  --divider: oklch(0.32 0.02 259);
  --brand: oklch(0.75 0.06 258);
  --brand-foreground: oklch(0.16 0.02 259);
  --deep: oklch(0.85 0.04 258);
  --gold: oklch(0.82 0.12 86);
  --buy: oklch(0.7 0.14 161);
  --sell: oklch(0.68 0.18 24);

  --gold-foreground: oklch(0.16 0.02 259);
  --buy-foreground: oklch(0.16 0.02 259);
  --sell-foreground: oklch(0.98 0 0);

  --shadow-xs: 0 2px 8px -3px rgba(0, 0, 0, .5);
  --shadow-sm: 0 10px 26px -12px rgba(0, 0, 0, .7);
  --shadow-md: 0 14px 40px -18px rgba(0, 0, 0, .55);
  --shadow-lg: 0 30px 70px -30px rgba(0, 0, 0, .7);
  --shadow-gold: 0 10px 26px -12px rgba(224, 181, 78, .55);
}
```

- [ ] **Step 2: `src/index.css`'i tamamen aşağıdaki içerikle değiştir**

```css
@import "tailwindcss";
@import "./styles/tokens.css";
@source "../src";
@import "tw-animate-css";

@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));

@theme inline {
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --radius-2xl: calc(var(--radius) + 8px);
  --radius-full: var(--radius-full);

  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Unbounded", "Inter", sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;

  --text-xs: var(--text-xs);
  --text-sm: var(--text-sm);
  --text-base: var(--text-base);
  --text-md: var(--text-md);
  --text-lg: var(--text-lg);
  --text-xl: var(--text-xl);
  --text-display-sm: var(--text-display-sm);
  --text-display-md: var(--text-display-md);

  --breakpoint-sm: var(--breakpoint-sm);
  --breakpoint-md: var(--breakpoint-md);
  --breakpoint-lg: var(--breakpoint-lg);

  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-foreground-strong: var(--foreground-strong);
  --color-surface: var(--surface);
  --color-card: var(--surface);
  --color-card-foreground: var(--foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-divider: var(--divider);
  --color-border: var(--divider);
  --color-input: var(--divider);
  --color-brand: var(--brand);
  --color-brand-foreground: var(--brand-foreground);
  --color-deep: var(--deep);
  --color-gold: var(--gold);
  --color-gold-foreground: var(--gold-foreground);
  --color-buy: var(--buy);
  --color-buy-foreground: var(--buy-foreground);
  --color-sell: var(--sell);
  --color-sell-foreground: var(--sell-foreground);
  --color-primary: var(--brand);
  --color-primary-foreground: var(--brand-foreground);
  --color-ring: var(--brand);

  /* shadcn/ui sözleşmesi: marka tokenlarına eşlenmiş semantik roller. */
  --color-secondary: var(--background);
  --color-secondary-foreground: var(--brand);
  --color-accent: var(--background);
  --color-accent-foreground: var(--brand);
  --color-destructive: var(--sell);
  --color-destructive-foreground: var(--brand-foreground);
  --color-popover: var(--surface);
  --color-popover-foreground: var(--foreground);

  --shadow-xs: var(--shadow-xs);
  --shadow-sm: var(--shadow-sm);
  --shadow-md: var(--shadow-md);
  --shadow-lg: var(--shadow-lg);
  --shadow-gold: var(--shadow-gold);
}

@layer base {
  * {
    border-color: var(--divider);
    box-sizing: border-box;
  }

  body {
    background-color: var(--background);
    color: var(--foreground);
    font-family: var(--font-sans);
    line-height: 1.6;
  }

  h1,
  h2,
  h3 {
    line-height: 1.25;
    font-weight: 650;
    letter-spacing: -0.3px;
    color: var(--brand);
  }
}

@utility font-tabular {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
}
```

- [ ] **Step 3: Global breakpoint çakışması kontrolü**

`--breakpoint-md`/`--breakpoint-lg` yeniden tanımlandığı için Tailwind'in varsayılan `md:`/`lg:` varyantları artık 768px/1024px yerine 900px/980px'te tetiklenir. Mevcut kodda bu varyantların kullanılıp kullanılmadığını kontrol et:

Run: `cd frontend/app && grep -rn '"[^"]*\bmd:\|"[^"]*\blg:' src --include=*.tsx`
Expected: Sonuç boş veya bulunan kullanımlar gözden geçirilip yeni breakpoint değerleriyle uyumlu olduğu teyit edilir (mevcut kod büyük ölçüde el yazımı CSS media query kullanıyor, Tailwind `md:`/`lg:` class'ı değil — bu denetim bulgusuyla tutarlı bir sonuç bekleniyor).

- [ ] **Step 4: Derleme ve görsel doğrulama**

Run: `cd frontend/app && npm run build`
Expected: Hatasız tamamlanır.

Run: `cd frontend/app && npm run dev`, tarayıcıda `/` adresini aç.
Expected: Sayfa görsel olarak önceki haliyle aynı render olur. Not: `--foreground` ve `--muted` değerleri değişti ama hiçbir aktif sayfa CSS'i şu an `var(--foreground)`/`var(--muted)`'ı doğrudan referans almıyor (önceki denetimde tespit edildi) — bu yüzden görünür bir fark beklenmiyor; token'lar sadece bundan sonra yazılacak yeni component'leri etkileyecek.

- [ ] **Step 5: Commit**

```bash
cd frontend/app && git add src/styles/tokens.css src/index.css
git commit -m "feat(design-system): tek kaynaklı design token dosyası (tokens.css) ve dark mode altyapısı ekle"
```

---

### Task 2: Vitest + Testing Library kurulumu ve `ThemeProvider`

**Files:**
- Modify: `frontend/app/package.json` (devDependencies + `test`/`test:watch` script)
- Create: `frontend/app/vitest.config.ts`
- Create: `frontend/app/src/test/setup.ts`
- Create: `frontend/app/src/features/dashboard/theme-provider.tsx`
- Test: `frontend/app/src/features/dashboard/theme-provider.test.tsx`

**Interfaces:**
- Consumes: Task 1'in `[data-theme="dark"]` selector sözleşmesi (dark token'lar bu attribute altında aktive olur).
- Produces: `ThemeProvider` (React component, `children: ReactNode` prop'u alır, sardığı içeriği `<div data-theme={theme}>` ile bir alt ağaç oluşturur), `useTheme(): { theme: "light" | "dark"; setTheme: (t: "light" | "dark") => void; toggleTheme: () => void }` hook'u — Task 3 ve dashboard'un kendisi bunu tüketecek. Ayrıca `vitest.config.ts` + `src/test/setup.ts` + `npm run test` script'i — Task 4 bunu tüketir.

- [ ] **Step 1: Test bağımlılıklarını kur**

Run: `cd frontend/app && npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event`
Expected: `package.json`'ın `devDependencies`'ine bu paketler eklenir.

- [ ] **Step 2: `package.json`'a test script'lerini ekle**

`frontend/app/package.json`'daki `"scripts"` bloğuna ekle:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 3: `vitest.config.ts` oluştur**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: false,
  },
});
```

- [ ] **Step 4: `src/test/setup.ts` oluştur**

```ts
import "@testing-library/jest-dom/vitest";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
```

- [ ] **Step 5: Başarısız testi yaz — `theme-provider.test.tsx`**

```tsx
import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";

import { ThemeProvider, useTheme } from "./theme-provider";

function Consumer() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme} data-testid="toggle">
      {theme}
    </button>
  );
}

function mockMatchMedia(matches: boolean) {
  vi.spyOn(window, "matchMedia").mockReturnValue({
    matches,
    media: "",
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  } as unknown as MediaQueryList);
}

describe("ThemeProvider", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("localStorage boşsa sistem tercihini (dark) varsayılan alır", () => {
    mockMatchMedia(true);

    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("toggle")).toHaveTextContent("dark");
  });

  it("localStorage'daki kayıtlı tercih sistem tercihinden önceliklidir", () => {
    window.localStorage.setItem("parena-dashboard-theme", "light");
    mockMatchMedia(true);

    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("toggle")).toHaveTextContent("light");
  });

  it("toggleTheme temayı değiştirir ve localStorage'a yazar", async () => {
    mockMatchMedia(false);

    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>,
    );

    const toggle = screen.getByTestId("toggle");
    expect(toggle).toHaveTextContent("light");

    await act(async () => {
      toggle.click();
    });

    expect(toggle).toHaveTextContent("dark");
    expect(window.localStorage.getItem("parena-dashboard-theme")).toBe("dark");
  });

  it("data-theme attribute'unu sardığı elemente set eder", () => {
    mockMatchMedia(false);

    const { container } = render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>,
    );

    expect(container.querySelector('[data-theme="light"]')).not.toBeNull();
  });
});
```

- [ ] **Step 6: Testin doğru sebeple başarısız olduğunu doğrula**

Run: `cd frontend/app && npm run test -- theme-provider`
Expected: FAIL — `Failed to resolve import "./theme-provider"` (dosya henüz yok).

- [ ] **Step 7: `theme-provider.tsx`'i implemente et**

```tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const STORAGE_KEY = "parena-dashboard-theme";

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getInitialTheme(): Theme {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return getSystemTheme();
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  function setTheme(next: Theme) {
    setThemeState(next);
  }

  function toggleTheme() {
    setThemeState((current) => (current === "dark" ? "light" : "dark"));
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      <div data-theme={theme}>{children}</div>
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme, ThemeProvider içinde kullanılmalı.");
  return ctx;
}
```

- [ ] **Step 8: Testleri çalıştır, geçtiğini doğrula**

Run: `cd frontend/app && npm run test -- theme-provider`
Expected: PASS — 4/4 test.

- [ ] **Step 9: Lint**

Run: `cd frontend/app && npm run lint`
Expected: Hatasız.

- [ ] **Step 10: Commit**

```bash
cd frontend/app && git add package.json package-lock.json vitest.config.ts src/test/setup.ts src/features/dashboard/theme-provider.tsx src/features/dashboard/theme-provider.test.tsx
git commit -m "feat(design-system): Vitest+RTL test altyapısı ve dashboard ThemeProvider ekle"
```

---

### Task 3: Storybook dark mode toolbar toggle

**Files:**
- Modify: `frontend/app/.storybook/preview.ts`

**Interfaces:**
- Consumes: Task 1'in `[data-theme="dark"]` selector sözleşmesi.
- Produces: Storybook toolbar'da "Theme" toggle'ı — her story'nin preview iframe kökünde `data-theme` attribute'unu manuel set eder (React `ThemeProvider`'a bağımlı değildir, Storybook'un kendi decorator mekanizmasıyla çalışır). Bundan sonra yazılacak her component story'si iki temada da görsel olarak doğrulanabilir.

Bu task'ın otomatik testi yoktur (Storybook konfigürasyonu); doğrulama manuel + Task 4'ün story'siyle birlikte yapılır.

- [ ] **Step 1: `.storybook/preview.ts`'i güncelle**

```ts
import type { Preview } from "@storybook/react";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  globalTypes: {
    theme: {
      description: "Renk teması",
      toolbar: {
        title: "Tema",
        icon: "circlehollow",
        items: [
          { value: "light", icon: "sun", title: "Light" },
          { value: "dark", icon: "moon", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "light",
  },
  decorators: [
    (Story, context) => {
      document.documentElement.setAttribute("data-theme", context.globals.theme ?? "light");
      return Story();
    },
  ],
};

export default preview;
```

- [ ] **Step 2: Storybook'u başlat ve toggle'ı doğrula**

Run: `cd frontend/app && npm run storybook`
Expected: Storybook açılır, toolbar'da "Tema" dropdown'ı görünür (henüz story olmadığı için boş bir galeri gösterir — bu Task 4'te doğrulanacak).

- [ ] **Step 3: Commit**

```bash
cd frontend/app && git add .storybook/preview.ts
git commit -m "feat(design-system): Storybook'a dark mode tema toggle'ı ekle"
```

---

### Task 4: Referans component — `Button`

**Files:**
- Create: `frontend/app/src/components/ui/button-variants.ts`
- Create: `frontend/app/src/components/ui/button.tsx`
- Create: `frontend/app/src/components/ui/button.stories.tsx`
- Test: `frontend/app/src/components/ui/button.test.tsx`

**Interfaces:**
- Consumes: Task 1'in Tailwind utility'leri (`bg-brand`, `text-brand-foreground`, `shadow-gold` vb. — `index.css`'in `@theme inline` eşlemesinden üretilir), Task 2'nin Vitest harness'i, Task 3'ün Storybook tema toggle'ı, mevcut `cn` (`@/lib/utils`) ve mevcut `@radix-ui/react-slot` dependency'si.
- Produces: `Button` component + `ButtonProps` tipi + `buttonVariants` (cva fonksiyonu) — spec §7.1'deki `variant`/`size`/`loading`/`asChild` API'sini uygular. Sonraki component-set planları (Input, Checkbox, vb.) bu dosyanın deseinini (cva + Radix + co-located stories/test) birebir takip edecek.

- [ ] **Step 1: Başarısız testi yaz — `button.test.tsx`**

```tsx
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Button } from "./button";

describe("Button", () => {
  it("children'ı render eder ve tıklamaya tepki verir", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Kaydet</Button>);

    const button = screen.getByRole("button", { name: "Kaydet" });
    await userEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("loading durumunda tıklamayı engeller ve aria-busy set eder", async () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Gönder
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Gönder" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");

    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("disabled prop'u varsayılan HTML davranışıyla çalışır", () => {
    render(<Button disabled>Devre dışı</Button>);
    expect(screen.getByRole("button", { name: "Devre dışı" })).toBeDisabled();
  });
});
```

- [ ] **Step 2: Testin doğru sebeple başarısız olduğunu doğrula**

Run: `cd frontend/app && npm run test -- button.test`
Expected: FAIL — `Failed to resolve import "./button"` (dosya henüz yok).

- [ ] **Step 3: `button-variants.ts`'i implemente et**

```ts
import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium " +
    "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
    "disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-brand text-brand-foreground shadow-sm hover:bg-deep",
        secondary: "bg-secondary text-secondary-foreground border border-divider hover:bg-muted",
        ghost: "bg-transparent text-brand hover:bg-muted",
        destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
        gold: "bg-gold text-gold-foreground shadow-gold hover:brightness-95",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);
```

- [ ] **Step 4: `button.tsx`'i implemente et**

```tsx
import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import type { VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

import { buttonVariants } from "./button-variants";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
  };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, loading, disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading ? (
          <span
            className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden="true"
          />
        ) : null}
        {children}
      </Comp>
    );
  },
);
Button.displayName = "Button";
```

- [ ] **Step 5: Testleri çalıştır, geçtiğini doğrula**

Run: `cd frontend/app && npm run test -- button.test`
Expected: PASS — 3/3 test.

- [ ] **Step 6: `button.stories.tsx`'i oluştur**

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./button";

const meta: Meta<typeof Button> = {
  title: "ui/Button",
  component: Button,
  args: {
    children: "Devam et",
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = { args: { variant: "primary" } };
export const Secondary: Story = { args: { variant: "secondary" } };
export const Ghost: Story = { args: { variant: "ghost" } };
export const Destructive: Story = { args: { variant: "destructive" } };
export const Gold: Story = { args: { variant: "gold" } };
export const Loading: Story = { args: { loading: true } };
export const Disabled: Story = { args: { disabled: true } };
export const Small: Story = { args: { size: "sm" } };
export const Large: Story = { args: { size: "lg" } };
```

- [ ] **Step 7: Storybook'ta görsel doğrulama**

Run: `cd frontend/app && npm run storybook`
Expected: `ui/Button` grubu altında 9 story görünür; toolbar'daki "Tema" toggle'ı Light/Dark arasında geçince Button'ın renkleri (`bg-brand`, `text-gold-foreground` vb.) görünür şekilde değişir.

- [ ] **Step 8: Lint**

Run: `cd frontend/app && npm run lint`
Expected: Hatasız.

- [ ] **Step 9: Commit**

```bash
cd frontend/app && git add src/components/ui/button.tsx src/components/ui/button-variants.ts src/components/ui/button.stories.tsx src/components/ui/button.test.tsx
git commit -m "feat(design-system): referans component olarak Button ekle (cva + Radix Slot + Storybook + Vitest)"
```

---

## Self-Review Notu

- **Spec kapsaması:** §4 (token'lar) → Task 1; §5 (dark mode) → Task 1 + Task 2; §6 (Keycloak paylaşımı) → `tokens.css`'in framework-agnostic tasarımı Task 1'de kuruldu, Keycloak tarafının `@import` etmesi migration kapsamında (spec §10); §7/§8 (component + test/story zorunluluğu) → Task 4, desen olarak. Kalan 18 component ayrı takip planlarına bırakıldı (spec §10, orijinal plan dosyasındaki Execution Steps).
- **Placeholder taraması:** Yok — her adımda çalıştırılabilir kod/komut var, "TODO"/"sonra eklenecek" yok.
- **Tip tutarlılığı:** `useTheme()` dönüş tipi Task 2'de tanımlandı ve aynı isimlerle (`theme`, `setTheme`, `toggleTheme`) tüm adımlarda kullanıldı; `ButtonProps`/`buttonVariants` isimleri Task 4 içinde tutarlı.
- **Kapsam:** Bu plan sadece foundation'ı kapsıyor (token'lar, test altyapısı, dark mode altyapısı, 1 referans component) — 18 component + migration kasıtlı olarak dışarıda, ayrı planlar gerektirir.
