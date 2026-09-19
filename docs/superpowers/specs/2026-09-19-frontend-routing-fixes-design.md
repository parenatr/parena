# Frontend URL Routing Düzeltmeleri — Spec

**Durum:** Onaylandı, uygulamaya geçiliyor.
**Kapsam:** `frontend/app` — SPA'nın `react-router-dom` routing katmanı ve Keycloak login teması içindeki tek bir cross-domain link.

## 1. Amaç ve Kapsam

Bu spec, `frontend/app`'in URL routing katmanında tespit edilen 5 somut sorunu tanımlar ve her biri için izole, atomik bir çözüm önerir. Her madde bağımsız bir commit olarak uygulanacak.

**Kapsam dışı** (bilinçli olarak ertelendi, bu spec'in konusu değil):
- `?plan=` parametresinin register → checkout arasında sürekliliği (business logic'e dokunuyor).
- Auth-gated route/guard altyapısı (`RequireAuth` benzeri) — şu an hiçbir route korumalı değil, gerçek dashboard'a kadar ihtiyaç da yok.
- Geniş DNS/NPM/Vercel domain mimarisi gözden geçirmesi — bu spec'i hazırlarken yapılan Vercel sorgusu somut bir sorun göstermedi.
- Tasarım sistemi tutarsızlıkları (Button/ParenaButton adoption, token tutarsızlıkları, legacy CSS) — ayrı bir spec'in konusu.

## 2. Mevcut Durum (araştırma bulguları)

`AppRouter.tsx` uygulamanın tek routing yüzeyi (`react-router-dom`, flat route list, nesting yok, route-level guard yok). 10 route tanımlı: `/`, `/giris`, `/uye-ol`, `/sifremi-unuttum`, `/odeme`, `/cerez`, `/gizlilik`, `/kullanim-sartlari`, `/kvkk`, `/mesafeli-satis`, ve bir wildcard `*`.

Keycloak login teması (`src/keycloak-theme/`) ayrı bir mekanizma — `kcContext.pageId`'e göre dispatch eden, router kullanmayan bir switch yapısı. Bu spec'in 5. maddesi bu temanın içinde, SPA route'larıyla değil.

## 3. Değişiklikler

### 3.1 404 sayfası + wildcard route düzeltmesi

**Sorun:** `AppRouter.tsx:98` — `<Route path="*" element={<Navigate to="/" replace />} />`. Bilinmeyen bir URL'e gidildiğinde kullanıcı sessizce ana sayfaya düşüyor, "sayfa bulunamadı" bilgisi hiç görmüyor. `vercel.json`'daki catch-all rewrite (`"/(.*)" → "/index.html"`) da her isteği 200 ile dönüyor — hiçbir katmanda gerçek bir "bulunamadı" sinyali yok.

**Çözüm:**
- `src/pages/NotFound/NotFoundPage.tsx` oluştur — diğer sayfalar gibi co-located `notFoundPageMeta` (`*PageMeta` konvansiyonu) ile.
- İçerik: kısa bir "sayfa bulunamadı" mesajı + ana sayfaya/`AppLink` ile geri dönüş linki. Mevcut sayfaların (örn. `LaunchPage`) genel görsel diline (marka, tipografi) uysun; yeni bir tasarım sistemi çalışması gerektirmiyor, mevcut legacy stillerden (`LaunchPage.css` içindeki genel sayfa kabuğu gibi) faydalanılabilir.
- `AppRouter.tsx:98`'deki `<Navigate to="/" replace />`'i `<NotFoundRoute />`'a çevir (`withMeta(NotFoundPage, notFoundPageMeta)` ile, diğer route'larla tutarlı).
- `eslint.config.js`'teki `allowExportNames` listesine `notFoundPageMeta` eklenmesi gerekebilir (yeni bir `*PageMeta` export'u için proje konvansiyonu).

**Kapsam dışı not:** Gerçek HTTP 404 status kodu (sunucu seviyesinde) bu değişikliğin parçası değil — SPA sınırları dışında, `vercel.json` rewrite davranışına dokunmuyoruz.

### 3.2 Merkezi route sabitleri (`src/router/routes.ts`)

**Sorun:** Route path'leri hardcoded string literal olarak 10+ dosyada tekrarlanmış:
`Pricing.tsx:51,61,62,104,108,109`, `StickyCta.tsx:19`, `FinalCta.tsx:12`, `Faq.tsx:17,41,45`, `SiteFooter.tsx:130`, `SiteNav.tsx:54`, `LeadCapture.tsx:66,68`, `CheckoutPage.tsx:34,45,49,279-282`, `RegisterPage.tsx:135,235,269,280,321,328,337`, `AppRouter.tsx` (route tanımlarının kendisi). Merkezi bir sabitler dosyası olmadığı için bir path'te yazım hatası ya da yeniden adlandırma, derleme zamanında yakalanmadan navigasyonu sessizce kırabilir.

**Çözüm:**
- `src/router/routes.ts` oluştur, `ROUTES` adında salt-okunur bir sabit (`as const`) tanımla — `AppRouter.tsx`'teki 10 route ile birebir eşleşecek şekilde (`home`, `login`, `register`, `checkout`, `cerez`, `gizlilik`, `kullanimSartlari`, `kvkk`, `mesafeliSatis`, ve 3.4'te kaldırılacak `sifremiUnuttum` **hariç**).
- `AppRouter.tsx`'in kendisini de bu sabitlerden okuyacak şekilde güncelle (tek doğruluk kaynağı route tanımı ile eşleşsin).
- Yukarıda listelenen tüm dosyalardaki hardcoded path kullanımlarını `ROUTES.xxx` ile değiştir. `/uye-ol?plan=premium` gibi query-param'lı kullanımlar için `ROUTES.register` + ayrı bir query string birleştirme deseni (örn. `` `${ROUTES.register}?plan=premium` ``) kullanılır — query param mantığına dokunulmuyor, sadece path literal'i sabite taşınıyor.

**Not:** Mekanik bir refactor, çok sayıda dosya değişecek ama davranış değişmiyor — riski düşük.

### 3.3 Legal sayfalarda ham `<a>` → `AppLink`

**Sorun:** `frontend/app/CLAUDE.md`, `AppLink`'i in-app navigasyon için zorunlu kılıyor ("Prefer it over raw `<a>`/`<Link>` for in-app navigation"), ama 4 dosyada ihlal var:
- `KullanimSartlariPage.tsx:193` — `<a href="/kvkk">`
- `CerezPage.tsx:131` — `<a href="/kvkk">`, `<a href="/gizlilik">`
- `GizlilikPage.tsx:49,96,152` — `<a href="/kvkk">`, `<a href="/cerez">` ×2
- `MesafeliSatisPage.tsx:82` — `<a href="/kullanim-sartlari">`

Bu 7 kullanım full page reload'a yol açıyor (client-side navigation yerine).

**Çözüm:** Bu 7 kullanımı `AppLink`'e çevir, `href` değerlerini 3.2'de oluşturulan `ROUTES` sabitlerinden al. 3.2 ile aynı commit'te yapılabilir (ikisi de aynı dosyalara dokunuyor, route sabitleri zaten gerekli).

### 3.4 `/sifremi-unuttum` route'unu kaldır

**Sorun:** `AppRouter.tsx:33-38,91` — `ForgotPasswordRoute`, uygulamanın hiçbir yerinden linklenmiyor (kod tabanında `grep` ile tek geçtiği yer kendi tanımı). `getPasswordResetRedirectUrl()` (`auth.api.ts:24-26`) zaten sadece `getLoginRedirectUrl()`'u çağırıyor — yani biri doğrudan bu URL'e girerse reset-credentials ekranına değil, düz login ekranına düşüyor; route adının vaat ettiğini yapmıyor.

Gerçek "Parolamı unuttum" akışı zaten doğru çalışıyor, ama bu route üzerinden değil: Keycloak'ın kendi login sayfasında (`src/keycloak-theme/login/pages/Login.tsx:111`) gerçek bir link var — `<a href={url.loginResetCredentialsUrl}>Parolamı unuttum</a>` — Keycloak'ın sağladığı gerçek reset-credentials URL'ini kullanıyor ve doğru çalışıyor.

**Çözüm:**
- `AppRouter.tsx`'ten `/sifremi-unuttum` route tanımını, `ForgotPasswordRoute` fonksiyonunu kaldır.
- `auth.api.ts`'ten `getPasswordResetRedirectUrl()`'u kaldır.
- İlgili import'ları (`AppRouter.tsx`'te `getPasswordResetRedirectUrl` import'u) temizle.
- 3.2'de oluşturulacak `ROUTES` sabitine bu route dahil edilmez.

### 3.5 Keycloak login sayfasındaki register linkini düzelt

**Sorun:** `src/keycloak-theme/login/pages/Login.tsx:13`:
```ts
const FRONTEND_REGISTER_URL = `${kcContext.properties.APP_URL}/uye-ol`;
```
`APP_URL` kullanıyor (build-time varsayılanı `https://app.parena.com.tr`, `vite.config.ts:15-16`). Ama aynı sayfadaki diğer tüm linkler — `AuthShell.tsx:48-54`'teki logo/ana sayfa linki ve legal linkler — `WEBSITE_URL` kullanıyor (`https://parena.com.tr`). `/uye-ol`, `AppRouter.tsx`'te tanımlı, `WEBSITE_URL`'de barınan aynı SPA'nın bir route'u; `APP_URL`'e ait ayrı bir uygulama değil.

Vercel proje sorgusuyla doğrulandı (2026-09-19): `app.parena.com.tr`, `parena.com.tr` ve `www.parena.com.tr` şu an **aynı Vercel projesine** bağlı, yani bugün link teknik olarak kırık değil. Ama kullanıcının planına göre `app.parena.com.tr` ileride ayrı bir dashboard deployment'ına ayrılacak — o noktada bu register linki, artık authenticated-only bir domain'e düşüp kırılacak. Önleyici bir düzeltme.

**Çözüm:**
```ts
const FRONTEND_REGISTER_URL = `${kcContext.properties.WEBSITE_URL}/uye-ol`;
```
Tek satırlık, izole değişiklik. `AuthShell.tsx` ile tutarlı hale gelir.

**Doğrulama notu:** Bu değişikliğin gerçek etkisini görmek için Keycloak theme build'i gerekir (`docker build -f Dockerfile.keycloak`, repo kökünden) — büyük/yavaş bir adım. Kod incelemesiyle yetinilip gerçek doğrulama sonraki bir Keycloak deploy'unda yapılabilir; bu, kullanıcı ile ne zaman netleştirilecek.

## 4. Uygulama Sırası (atomik commit'ler)

1. 404 sayfası (3.1) — bağımsız.
2. Route sabitleri + legal sayfalarda AppLink (3.2 + 3.3) — birlikte, aynı dosyalara dokunduğu için tek commit.
3. `/sifremi-unuttum` kaldırma (3.4) — bağımsız.
4. Keycloak login register linki düzeltmesi (3.5) — bağımsız, farklı bir alt sisteme (Keycloak teması) dokunuyor.

## 5. Doğrulama

- Her commit sonrası `npm run lint` ve `npm run build` (`frontend/app` dizininden) temiz geçmeli.
- `npm run dev` ile tarayıcıda manuel kontrol:
  - Bilinmeyen bir path'e gidip yeni 404 sayfasının göründüğünü doğrula.
  - Legal sayfalardaki linklere tıklayıp client-side navigate olduğunu (full reload olmadığını, Network tab'de doğrulanabilir) kontrol et.
  - `/sifremi-unuttum`'a gidip artık 404'e düştüğünü doğrula.
- 3.5 için gerçek doğrulama Keycloak theme build/deploy gerektirir — bkz. §3.5 doğrulama notu.
