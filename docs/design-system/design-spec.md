# PARENA Frontend Design System — Spesifikasyon

**Durum:** Onaylandı (hedef mimari). Migration/geçiş adımları kapsam dışıdır — bkz. §10.

## 1. Amaç ve Kapsam

Bu doküman PARENA frontend'i (`frontend/app`) için tek doğruluk kaynağı olan design system'i tanımlar: klasör mimarisi, design token'lar, dark mode stratejisi, component envanteri ve dokümantasyon/test standartları.

**Kapsam dışı:** Mevcut sayfaların (RegisterPage, CheckoutPage, LaunchPage, Legal sayfaları, LeadCapture) bu sisteme geçiş adımları burada yer almaz — ayrı bir migration planı konusudur. Bu spec "nereye varmak istiyoruz"u tanımlar.

## 2. Mimari Prensipler

- **Konum:** Component kütüphanesi `frontend/app/src/components/ui/` altında yaşar. Ayrı paket/workspace yok (tek app var); ileride ikinci bir app eklenirse `ui/` bağımsız bir pakete taşınabilecek şekilde (framework-agnostic token dosyası, kendi kendine yeten component'ler) tasarlanır.
- **`ui/` vs domain klasörleri ayrımı:**
  - `src/components/ui/` → **generic, marka-nötr olabilecek kadar soyut primitive'ler** (Button, Input, Dialog...). Bir component'in burada olup olmayacağının testi: "Bu component'i PARENA'ya özgü hiçbir iş bilgisi olmadan başka bir projede kullanabilir miyim?" Cevap evetse `ui/`'dedir.
  - `src/components/{auth,landing,layout,legal,brand,dashboard}/` → **domain'e özgü, iş anlamı taşıyan bileşik component'ler** (KarneCard, AuthShell, SiteNav...). Bunlar `ui/` primitive'lerini kullanarak kurulur, tersi olmaz.
- **Temel teknik yaklaşım:** Karmaşık/etkileşimli component'ler (Dialog, Sheet, Select, Tabs, Dropdown Menu, Tooltip) **Radix UI primitive'leri** üzerine kurulur (erişilebilirlik — focus trap, klavye navigasyonu, ARIA — hazır gelir). Basit component'ler (Button, Input, Textarea, Label, Badge, Card) **tamamen custom**, `class-variance-authority` (cva) ile variant yönetimi.
- **Adlandırma:**
  - `ui/` içinde: **kebab-case** dosya adı (`button.tsx`, `dropdown-menu.tsx`). Karmaşık cva variant tanımları ayrı bir `*-variants.ts` dosyasında yaşar (`button.tsx` + `button-variants.ts`), ama **alt klasör açılmaz** — mevcut `parena-button/` deseni (tek `ui/` girdisi iç içe klasörlü) formalize edilmiyor, düzleştiriliyor.
  - Domain klasörlerinde: **PascalCase** `.tsx` (`AuthField.tsx`), birlikte gelen CSS dosyası **kebab-case** (`auth-shell.css`) — bu zaten baskın konvansiyon, resmileştiriliyor.
  - Her component dosyasının yanında (aynı klasörde) `*.stories.tsx` ve `*.test.tsx` co-located durur (Storybook config'i zaten `src/**/*.stories.@(...)` pattern'iyle bunu bekliyor).
  - Barrel/`index.ts` dosyası açılmaz — proje genelinde zaten yok, tutarlılık korunuyor; her component kendi dosya yolundan import edilir.

## 3. Hedef Klasör Yapısı

```
src/
  styles/
    tokens.css              # YENİ — tek design-token kaynağı (light + dark), SPA ve Keycloak teması buradan okur
  components/
    ui/                      # primitive component kütüphanesi (kebab-case, düz, alt klasörsüz)
      button.tsx
      button-variants.ts
      button.stories.tsx
      button.test.tsx
      input.tsx
      textarea.tsx
      checkbox.tsx
      radio-group.tsx
      select.tsx
      label.tsx
      field.tsx              # ortak label+hint+error wrapper (bkz. §7)
      dialog.tsx
      sheet.tsx
      toast.tsx
      tooltip.tsx
      card.tsx
      badge.tsx
      tabs.tsx
      dropdown-menu.tsx
      table.tsx
      avatar.tsx
      pagination.tsx
      app-link.tsx            # mevcut, korunuyor
      (+ her biri için .stories.tsx ve .test.tsx)
    auth/ landing/ layout/ legal/ brand/ dashboard/   # domain composite component'ler, PascalCase, mevcut desen
  pages/                      # mevcut desen formalize: her sayfa klasörü opsiyonel 1 CSS dosyası + zorunlu *PageMeta export
  features/                   # mevcut desen: her iş domaini için *.api.ts / *.queries.ts / *.types.ts
```

## 4. Design Tokens

### 4.1 Mevcut durum (tespit)

`src/index.css` zaten Tailwind v4'ün `@theme inline` mekanizmasıyla doğru kurulmuş, oklch tabanlı bir `:root` token katmanı içeriyor (`--background`, `--brand`, `--gold`, `--buy`, `--sell`, `--radius-*`, `--shadow-brand/card/drop`, `--font-sans/display/mono`). **Ancak** `auth-shell.css`, `legal.css`, `CheckoutPage.css` kendi **ayrı `:root` bloklarında aynı isimlerle (`--bg`, `--ink`, `--muted`, `--navy`...) farklı, eski hex tabanlı değerler** tanımlıyor — `index.css`'in oklch token'larıyla hiç bağlantısı yok. `LaunchPage.css` tek istisna: kendi custom property'lerini `index.css`'e alias'lıyor (`var(--background)` vb.) ve ayrıca kendi ek `--r`, `--shadow-s/m/l`, `--hold` token'larını tanımlıyor. `site-footer.css` hiç custom property kullanmıyor, her şey literal. Onlarca yerde `rgba(19, 41, 75, X)` gibi marka rengi opaklık varyasyonu literal olarak tekrarlanmış (30+ kullanım).

### 4.2 Hedef kural

**Tek kaynak: `src/styles/tokens.css`.** Bu dosya sadece ham CSS custom property'lerini içerir (framework-agnostic, Tailwind'e bağımlı değil), böylece hem SPA hem Keycloak teması import edebilir (bkz. §6). `src/index.css`, bu dosyayı `@import` eder ve üstüne kendi Tailwind v4 `@theme inline` eşlemesini (mevcut yapı) kurar.

**Kural:** Hiçbir component/page CSS dosyası kendi `:root` bloğunu açıp token adlarını yeniden tanımlayamaz. Renk/radius/shadow/spacing için her zaman `var(--token-adı)` kullanılır; yeni bir değer gerekiyorsa `tokens.css`'e eklenir, yerelde literal yazılmaz.

### 4.3 Renk token'ları (konsolide edilmiş)

Mevcut oklch `:root` seti korunur (kaynak `index.css`), üstüne şu **eksik/çakışan** noktalar çözülür:

| Sorun | Çözüm |
|---|---|
| `--foreground` şu an saf siyah (`oklch(0 0 0)`), ama gerçek paragraf metni tüm sayfalarda `#3B4256` (yumuşak lacivert-gri) literal olarak kullanılıyor | `--foreground` saf siyah olarak korunur (mevcut codebase'le uyum, değiştirilmedi); `#3B4256` eşdeğeri yumuşak ton, ayrı ve varsayılan olmayan bir token olan `--foreground-muted`'e taşınır — bunu isteyen component'ler açıkça `text-foreground-muted` kullanır. |
| `--muted`, `--background` ile aynı değere sahip (muhtemelen kopyala-yapıştır hatası) | `--muted` gerçek bir "hafif dolgu" rengi olarak ayrıştırılır (background'dan görsel olarak ayrışan bir ton). |
| Durum renkleri (`--buy`, `--sell`, `--gold`) için "üzerine yazılacak metin" varyantı yok — literal `#0E7A50`, `#8E6B12`, `#FF9C9C` gibi değerler dağınık | `--color-buy-foreground`, `--color-sell-foreground`, `--color-gold-foreground` eklenir; kontrast erişilebilirlik hedefiyle (WCAG AA, 4.5:1) merkezi olarak türetilir. |
| `rgba(19,41,75,X)` deseni 30+ yerde literal | Tailwind v4'ün opacity-modifier söz dizimi kullanılır: `bg-(--color-brand)/10`, `text-(--color-brand)/70` gibi — ayrı bir token gerekmez, kural olarak literal rgba yazımı yasaklanır. |

### 4.4 Tipografi

Font aileleri zaten `--font-sans` (Inter), `--font-display` (Unbounded), `--font-mono` (JetBrains Mono) olarak tanımlı ama hiçbir component dosyası bu token'ları referans almıyor — hepsi kendi fallback zincirini hardcode ediyor (4 farklı fallback varyasyonu tespit edildi). **Kural:** font-family her zaman `var(--font-sans|display|mono)` ile set edilir, literal string yazılmaz.

Font boyutu için tutarsız, ~30 farklı ad-hoc px/rem değeri yerine formel bir tip skalası tanımlanır (`tokens.css`'e eklenir):

```
--text-xs: 0.75rem;    /* 12px — küçük etiket/yardımcı metin */
--text-sm: 0.8125rem;  /* 13px — ikincil metin */
--text-base: 0.875rem; /* 14px — gövde metni (varsayılan) */
--text-md: 1rem;       /* 16px — vurgulu gövde */
--text-lg: 1.125rem;   /* 18px — alt başlık */
--text-xl: 1.375rem;   /* 22px — bölüm başlığı */
--text-display-sm: clamp(1.3rem, 2.5vw, 1.78rem);
--text-display-md: clamp(1.78rem, 3.9vw, 2.55rem);  /* hero h1 */
```

Yeni component'ler bu skaladan seçer; sayfa özelinde tek seferlik font-size literal'i yazılmaz.

### 4.5 Spacing

Ayrı bir spacing token seti gerekmiyor — Tailwind v4'ün yerleşik `0.25rem` (4px) adımlı skalası (`p-1`…`p-32` vb.) zaten mevcut ve kullanılabilir; **kural, hardcoded px margin/padding yerine Tailwind utility class'larının kullanılmasıdır.** Tekrarlayan akışkan section-padding değerleri (`clamp(64px,9vw,110px)` gibi) için `tokens.css`'e adlandırılmış birkaç semantik token eklenir:

```
--space-section-y: clamp(64px, 9vw, 110px);
--space-hero-y: clamp(46px, 6vw, 78px);
```

### 4.6 Radius

Mevcut `--radius-sm/md/lg/xl/2xl` skalası (6/8/10/14/18px, `--radius: 0.625rem` üzerinden türetilmiş) zaten empirik olarak gözlenen üç kümeyle (focus/küçük elemanlar ~6px, buton/input ~10px, kart/panel ~14-18px) örtüşüyor — **korunuyor, sadece zorunlu kılınıyor.** Eklenecek tek yeni token: `--radius-full: 9999px` (pill/badge şekilleri için — şu an literal `20px`/`30px` olarak yazılmış).

### 4.7 Shadow

İki paralel, örtüşen shadow sistemi var: `index.css`'in oklch tabanlı `--shadow-brand/card/drop`'u (hiç kullanılmıyor) ve `LaunchPage.css`'in kendi rgba tabanlı `--shadow-s/m/l`'i (en çok kullanılan). Ayrıca birincil buton gölgesi (`0 10px 26px -12px rgba(19,41,75,.7)`) 3 dosyada literal olarak birebir tekrarlanmış. **Konsolidasyon:** tek skala, `tokens.css`'te:

```
--shadow-xs: 0 2px 8px -3px rgba(19, 41, 75, .14);   /* focus/subtle */
--shadow-sm: 0 10px 26px -12px rgba(19, 41, 75, .7); /* buton varsayılan */
--shadow-md: 0 14px 40px -18px rgba(19, 41, 75, .28);/* hover/kart */
--shadow-lg: 0 30px 70px -30px rgba(12, 29, 56, .45);/* panel/modal */
--shadow-gold: 0 10px 26px -12px rgba(224, 181, 78, .9); /* altın CTA varyantı */
```

### 4.8 Breakpoint'ler

Şu an 5 farklı ad-hoc breakpoint (640/700/880/900/980/981px) dosya başına bağımsız tanımlı, hiçbiri token değil. Tailwind v4'ün `@theme` `--breakpoint-*` override mekanizmasıyla 3 isimlendirilmiş breakpoint'e konsolide edilir:

```
--breakpoint-sm: 640px;   /* mevcut 640 kümesi */
--breakpoint-md: 900px;   /* 880/900 kümesi birleştirilir */
--breakpoint-lg: 980px;   /* 980/981 kümesi birleştirilir */
```

Bu tanımlandıktan sonra `sm:`/`md:`/`lg:` Tailwind varyantları proje genelinde tutarlı çalışır; el yazımı `@media (max-width: ...)` blokları yeni kodda yasaklanır.

## 5. Dark Mode Stratejisi

**Kapsam:** Marketing sayfaları (Launch, Legal, Register, Checkout) hiçbir zaman dark mode tetiklemez. Dashboard (login sonrası ekran) dark/light destekler. **Ama** component kütüphanesindeki her primitive (Button, Card, Input...) dark token'larını destekleyecek şekilde yazılır — çünkü aynı primitive'ler dashboard içinde de kullanılacak; aktivasyon scope'lanır, component implementasyonu scope'lanmaz.

**Mekanizma (Tailwind v4 önerilen deseni):**
1. `tokens.css`'te light değerler `:root` altında, dark değerler `[data-theme="dark"]` scoped selector altında tanımlanır (global `prefers-color-scheme` media query'si **değil** — çünkü aktivasyon dashboard'a scope'lu olmalı, `<html>`/`<body>` seviyesinde değil).
2. `index.css`'e şu custom variant eklenir: `@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));` — bu, `dark:` Tailwind utility varyantının sadece `[data-theme="dark"]` attribute'unu taşıyan element ile onun altındaki alt ağaçta çalışmasını sağlar.
3. `data-theme` attribute'u **sadece dashboard shell'in kök elementine** set edilir (örn. `<div data-theme={theme}>` — dashboard route'unun en üst wrapper'ı), `<html>` veya `<body>`'ye değil. Bu, marketing sayfalarının hiçbir zaman dark mode'a maruz kalmamasını garanti eder.
4. **Tema seçimi:** bir `ThemeProvider` (React context, dashboard feature'ı içinde) ilk yüklemede `localStorage`'daki kayıtlı tercihi okur; yoksa `prefers-color-scheme: dark` media query sonucunu varsayılan alır. Dashboard içindeki bir toggle bileşeni context'i günceller ve `localStorage`'a yazar.
5. Tailwind'in inline `@theme` eşlemesi (`--color-background: var(--background)` vb.) zaten CSS custom property'lerine yönlendirdiği için, `[data-theme="dark"]` altında `--background` vb. yeniden tanımlandığında **hiçbir ek Tailwind konfigürasyonu gerekmeden** tüm `bg-background`, `text-foreground` gibi utility class'lar otomatik doğru rengi alır.

## 6. Keycloak Login Teması ile Token Paylaşımı

Şu an `src/keycloak-theme/login/components/AuthErrorShell.tsx`, relative path (`../../../components/auth/auth-shell.css`) ile SPA'nın `auth/` klasörüne doğrudan erişiyor — tema/SPA sınırı resmi değil, gizli bir bağımlılık.

**Hedef:** `src/styles/tokens.css` (§4.2), SPA ve Keycloak teması için **tek ortak kaynak** olur:
- `src/index.css` (SPA girişi) → `@import "./styles/tokens.css";` sonra kendi `@theme inline` eşlemesini kurar.
- Keycloak login temasının kendi CSS girişi (bugün `auth-shell.css` bu rolü fiilen üstleniyor) → aynı `@import "@/styles/tokens.css";` satırını ekler, `@theme` bloğuna ihtiyaç duymaz (Tailwind utility class'ları kullanmıyor, sadece `var(--token)` referans ediyor).
- `@/` path alias'ı zaten hem SPA hem keycloak-theme kodunda tanımlı (`tsconfig.app.json`, `vite.config.ts`) — relative path yerine **her yerde `@/` alias'ı kullanılması** zorunlu kılınır; `AuthErrorShell.tsx`'teki relative import bu kuralın ihlali olarak işaretlenir (düzeltmesi migration kapsamında).

Böylece iki yüzey de aynı marka renklerini/tipografiyi/radius'u okur, görsel tutarlılık kod seviyesinde garanti edilir.

## 7. Component Envanteri (V1 — 19 component)

Her component: Radix primitive kullanımı, variant/size seti, ve zorunlu Storybook + Vitest kapsamı ile birlikte tanımlanır.

### 7.1 Form seti

| Component | Radix primitive | Variant/Size | Notlar |
|---|---|---|---|
| **Button** | — (custom, cva) | `variant`: primary / secondary / ghost / destructive / gold · `size`: sm / md / lg · `loading`, `disabled`, `asChild` (Radix `Slot`) | Mevcut 3 paralel `.btn` sistemini tek kaynağa indirir. `loading` prop dahili spinner + `aria-busy` yönetir — sayfa bazlı ad-hoc disabled/opacity/aria-disabled kombinasyonları burada tek bir API'ye toplanır. |
| **Input** | — (custom) | `type`: text/email/password (görünürlük toggle'lı) · `invalid` state | Register/Checkout/LeadCapture'daki üç ayrı ham `<input>` implementasyonunu birleştirir. |
| **Textarea** | — (custom) | `invalid` state | Şu an hiç kullanılmıyor ama dashboard formları için gerekecek. |
| **Checkbox** | Radix `Checkbox` | checked/indeterminate/disabled | RegisterPage'de tespit edilen "checkbox class'ı `<input>` olmadan kullanılmış" hatasını yapısal olarak imkansız kılar — component her zaman gerçek bir kontrol render eder. |
| **Radio Group** | Radix `RadioGroup` | — | Checkout'taki ham radio input'ların yerini alır. |
| **Select** | Radix `Select` | — | Şu an yok, dashboard filtre/form ihtiyaçları için. |
| **Label** | Radix `Label` | required indicator | Mevcut kullanılmayan `label.tsx`'in yerini alır. |
| **Field** | — (compose) | `label`, `hint`, `error` (role="alert"), `required` | Register/Checkout/LeadCapture'ın 3 farklı hata gösterim desenini (LeadCapture'da hiç hata metni yoktu) **tek** deseninde birleştirir: her form alanı `<Field>` ile sarılır. |

### 7.2 Overlay / feedback seti

| Component | Radix primitive | Notlar |
|---|---|---|
| **Dialog** | Radix `Dialog` | Mevcut kullanılmayan `dialog.tsx`'in formalize edilmiş hali. |
| **Sheet** | Radix `Dialog` (side panel variant) | Mevcut kullanılmayan `sheet.tsx`'in formalize edilmiş hali. |
| **Toast** | Radix `Toast` | Mevcut kullanılmayan `toast.tsx` + `use-toast.ts` hook'unun formalize edilmiş hali. |
| **Tooltip** | Radix `Tooltip` | Şu an hiç yok. |

### 7.3 Dashboard seti

| Component | Radix primitive | Notlar |
|---|---|---|
| **Card** | — (custom) | Genel amaçlı içerik kabı; `variant`: default / elevated. |
| **Badge** | — (custom) | `variant`: neutral / buy / sell / gold — mevcut durum renklerini semantik olarak taşır. |
| **Tabs** | Radix `Tabs` | — |
| **Dropdown Menu** | Radix `DropdownMenu` | — |
| **Table** | — (custom, semantic `<table>` + cva) | Dashboard veri listeleri için. |
| **Avatar** | Radix `Avatar` | Fallback/initials desteği. |
| **Pagination** | — (custom) | Table ile birlikte kullanılır. |

## 8. Dokümantasyon ve Test Standartları

- **Storybook zorunlu:** Her `ui/` component'i, tüm variant/size/state kombinasyonlarını (default, hover/focus, disabled, invalid/error, loading — ilgili olanlar) gösteren bir `*.stories.tsx` ile gelir. Storybook zaten kurulu (`npm run storybook`) ama şu an hiç `.stories.tsx` dosyası yok — bu kuralla ilk kez fiilen kullanılmaya başlar.
- **Test zorunlu:** Vitest + React Testing Library eklenir (şu an proje genelinde hiçbir test runner yok — `package.json`'a `vitest`, `@testing-library/react`, `jsdom` eklenmesi gerekir). Her component en az: doğru render olma, temel klavye/etkileşim davranışı (ör. Button `onClick`, Checkbox toggle), ve erişilebilirlik rolü assertion'ı (ör. `role="dialog"`, `role="alert"`) içeren bir `*.test.tsx` ile gelir.
- **"Definition of Done" (yeni/değişen component için):**
  1. `src/components/ui/<kebab-ad>.tsx` (+ gerekiyorsa `*-variants.ts`) — Radix primitive (uygunsa) + cva.
  2. Dark mode: `[data-theme="dark"]` altında görsel doğrulama (Storybook'ta iki tema arasında geçiş yapılabilir toolbar eklentisiyle).
  3. `*.stories.tsx` — tüm variant/size/state.
  4. `*.test.tsx` — render + etkileşim + a11y rol assertion.
  5. Yeni/değişen token varsa `tokens.css` güncellenir ve bu dokümanın ilgili tablosuna eklenir.
  6. `npm run lint` geçer.

## 9. Governance

- Her component'in üstünde kısa bir durum notu tutulur: `draft` (henüz Storybook/test tamamlanmamış) / `stable` / `deprecated`. Bu doküman component tablolarının yanına bu durumu ekleyerek güncel tutulur.
- API değişikliği yapan her PR, ilgili component'in Storybook story'sini, testini ve bu spec dosyasındaki tablo satırını aynı PR içinde günceller — spec'in koddan kopması engellenir.

## 10. Bu Spec'in Kapsam Dışı Bıraktıkları

- Mevcut sayfaların (RegisterPage, CheckoutPage, LaunchPage, Legal sayfaları, LeadCapture, LogoutButton) yeni sisteme geçiş adımları — ayrı bir migration planı.
- Mevcut ölü kodun (`ui/input.tsx`, `text-field.tsx`, `label.tsx`, `dialog.tsx`, `sheet.tsx`, `toast.tsx`, `parena-button/*`, boş `Dashboard/` klasörü, 0-byte `DashboardShell.tsx`) silinmesi/yeniden yazılması — migration kapsamında ele alınacak; bu dosyalar bu spec'in **önceki bir taslağı** olarak görülüp üzerine yazılacak.
- Dashboard'un kendisinin (henüz kodu yok) implementasyonu.
- `AuthErrorShell.tsx`'teki relative-path ihlalinin düzeltilmesi (kural burada tanımlandı, uygulanması migration'da).

## İlgili Dokümanlar

- Foundation implementasyon planı: `docs/superpowers/plans/2026-09-17-design-system-foundation.md`
