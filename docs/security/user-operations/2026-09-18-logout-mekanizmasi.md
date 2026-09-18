# Logout Mekanizması Tasarımı

- **Tarih:** 2026-09-18
- **Durum:** Taslak (review bekliyor)
- **İlgili alan:** bff-server, keycloak, app.parena.com.tr
- **İlişkili çalışma:** BFF security audit (Step 1: CSRF migrasyonu tamamlandı — bkz. `WebSessionServerCsrfTokenRepository`, `GET /api/csrf`), roadmap'teki "3 fazlı logout hardening" maddesi

---

## 1. Problem

Mevcut logout akışı RP-Initiated Logout üzerinden Spring Security ile yürütülüyor ve eski `LogoutController` dead code olarak temizlendi. Ancak akış üç ayrı katmanı (BFF session'ı, tarayıcı cookie'si, Keycloak SSO session'ı) tam senkron kapatmıyor ve şu bilinen eksikler var:

- Logout tetikleyicisi GET tabanlı olabilir → CSRF ile zorla oturum kapatma (logout CSRF) veya prefetch/crawler kaynaklı istemsiz oturum kapanmasına açık.
- Session cookie'sinde `Domain` attribute'unun set edilmiş olması (parent-domain cookie), subdomain-takeover senaryolarında cookie'nin gereğinden geniş kapsamda paylaşılmasına yol açıyor.
- Logout, sadece BFF/Redis session'ını mı temizliyor yoksa Keycloak'taki SSO session'ını da (`end_session_endpoint` + `id_token_hint`) sonlandırıyor mu, doğrulanmadı.
- Çoklu sekme (aynı tarayıcı) ve çoklu cihaz ("tüm cihazlardan çıkış") senaryoları tasarımda ele alınmadı.

## 2. Hedef davranış

- Logout, `POST /api/auth/logout` üzerinden, geçerli bir CSRF token ile tetiklenir; GET ile logout tetiklenemez.
- Logout tamamlandığında üç katman da senkron olarak kapanır: Keycloak SSO session'ı (RP-Initiated Logout ile), Redis'teki BFF `WebSession`'ı ve tarayıcıdaki session cookie'si.
- Session cookie temizlenirken `Domain` attribute'u set edilmez, `__Host-` prefix'i korunur; cookie yalnızca ilgili origin'e (`app.parena.com.tr` / `api.parena.com.tr`) bağlı kalır.
- Aynı tarayıcıda açık diğer `app.parena.com.tr` sekmeleri, logout sonrası otomatik olarak login ekranına yönlendirilir (multi-tab senkronizasyonu).
- Kullanıcı "tüm cihazlardan çıkış yap" seçeneğini kullandığında, Keycloak Admin API üzerinden kullanıcının tüm session'ları sonlandırılır (yalnızca mevcut cihazın Redis kaydı değil).
- Logout event'i, kişisel veri içermeyen audit log prensibine uygun şekilde loglanır (SPK/KVKK gereksinimi).

## 3. Mevcut durum

> **Not:** Bu bölüm 2026-09-18'de Claude Code ile kod tabanına karşı doğrulanmıştır (dosya/satır referanslarıyla) — önceki taslaktaki "proje hafızasından derlendi, doğrulanmalı" notu bu doğrulamayla çözülmüştür.

- **Login:** Authorization Code + PKCE (`bff-server` `SecurityConfig.java`, `oauth2Login`), token'lar Redis'te (`spring-session-data-redis`, namespace `parena:bff:session`, `spring.session.timeout: 30m` — Keycloak `ssoSessionIdleTimeout: 1800`sn ile tutarlı), httpOnly session cookie tarayıcıya gidiyor.
- **Logout endpoint'i** (`SecurityConfig.java:88-90`, chain 2 `.logout(...)` DSL'i):
  ```java
  .logout(logout -> logout
          .requiresLogout(ServerWebExchangeMatchers.pathMatchers("/api/auth/logout"))
          .logoutSuccessHandler(oidcLogoutSuccessHandler(clientRegistrationRepository)))
  ```
  **`requiresLogout` matcher HTTP metodu belirtmiyor** (register chain'deki `pathMatchers(HttpMethod.POST, ...)` pattern'inin aksine) → `/api/auth/logout` şu an **GET dahil her metodla tetiklenebiliyor**. Doc §2'nin "GET ile logout tetiklenemez" hedefi bugün karşılanmıyor.
- **`LogoutController.java`:** Repo'da yok; silinmesi **commit'li** (`772e579`, "add publicApiRequest for user register") — önceki taslağın "commit durumu netleştirilmeli" notu çözülmüştür, uncommitted bir durum değil.
- **Logout success handler:** `OidcClientInitiatedServerLogoutSuccessHandler` (Spring Security built-in), `handler.setPostLogoutRedirectUri(this.websiteBaseUrl)` (`SecurityConfig.java:97-102`). Bu handler **server-to-server bir çağrı yapmaz**; tarayıcıya `id_token_hint`+`post_logout_redirect_uri` query parametreleriyle Keycloak `end_session_endpoint`'ine 302 redirect döner, tarayıcı bu zinciri (BFF → Keycloak → website) native navigation ile takip eder.
- **Redis WebSession invalidation:** `.logout(...)` DSL'inde explicit bir `logoutHandler(...)` tanımlı değil; Spring Security'nin default logout handler zincirine güveniliyor — repo'da bunu doğrulayan hiçbir test yok, doğrulanmamış durumda.
- **CSRF (Step 1) — doğrulandı:** `WebSessionServerCsrfTokenRepository` (`SecurityConfig.java:81`), `GET /api/csrf` (`CsrfController.java`) `{token, headerName, parameterName}` döndürüyor, cookie'ye yazmıyor. Frontend `csrf.ts`: in-memory `cachedToken`, `getCsrfToken`/`clearCsrfToken`. `api-client.ts`: mutasyon isteklerinde CSRF header, 403'te tek seferlik refresh+retry, `credentials: "include"`. `auth.api.ts::logout()`: gizli `<form>` POST + `csrf.parameterName` form field — önceki taslağın iddiasıyla tam eşleşiyor.
- **`CsrfCookieWebFilter.java`:** Dosya silinmiş (git status: uncommitted `D`), kod tabanında hiçbir referansı yok (grep boş) — silinmesi henüz commit'lenmemiş ama zaten kullanımda değil.
- **Cookie güvenliği (Secure/HttpOnly/SameSite/Domain/`__Host-`):** Hiçbir yerde (ne `SecurityConfig.java`'da ne `bff-server-{dev,docker,prod}.yml`'de) explicit set edilmiyor — tamamen Spring Boot/WebFlux default'larına bırakılmış. `bff-server-prod.yml` **tamamen boş (0 byte)**.
- **`server.forward-headers-strategy`:** Hiçbir profilde set edilmiyor (`bff-token-architecture.md` §3 Step 2 hâlâ açık).
- **`GatewayProxyHandler.java` (`:71-80`):** `copyForwardableHeaders`, hop-by-hop header listesinde (`connection, keep-alive, transfer-encoding, upgrade, proxy-authenticate, proxy-authorization, te, trailer, host`) `cookie`'yi içermiyor → raw `Cookie` header'ı downstream'e forward ediliyor (Bearer token'a EK olarak, onun yerine değil). **Ancak `/api/auth/logout` bu handler'dan hiç geçmiyor** — logout, `SecurityConfig`'in kendi `.logout()` DSL'i tarafından bff-server içinde sonlandırılıyor, gateway'e proxy'lenmiyor; yani bu bilinen sorun (Step 3 kapsamı) logout akışının kendisini etkilemiyor.
- **`app.website-base-url` / Keycloak public-internal split:** `bff-server-docker.yml`'de `app.website-base-url` var, `bff-server-dev.yml`'de YOK (`SecurityConfig` constructor'ı bunu `@Value` ile zorunlu okuyor). `bff-server-prod.yml` boş. Keycloak split (`SO_KEYCLOAK_PUBLIC_URL`/`SO_KEYCLOAK_INTERNAL_URL`) sadece `bff-server-docker.yml`'de var (`issuer-uri`+`authorization-uri` → public, `token-uri`+`jwk-set-uri` → internal); `bff-server-dev.yml` tek bir hardcoded internal issuer-uri kullanıyor, split yok.
- **Multi-tab / multi-device:** Hiçbir mekanizma yok — grep sonucu sıfır `BroadcastChannel`/`storage` event kullanımı frontend'de (auth ile ilgili). Doğrulandı: yok.
- **`parena-realm.yaml`:** `bff-server` client'ı confidential (`publicClient: false`) + PKCE S256, `attributes.post.logout.redirect.uris: "$(env:SO_WEBSITE_BASE_URL)/"`. `serviceAccountsEnabled: false` — service account YOK, admin API çağrısı yapamıyor. `user-service` client'ında zaten `serviceAccountsEnabled: true` + `fullScopeAllowed: true` + `realm-management: [manage-users, view-users, view-realm]` mevcut (KVKK `DeleteUserUseCase` akışında kullanılan pattern). `backchannel.logout.url` hiçbir client'ta yok. Realm session ayarları: `ssoSessionIdleTimeout: 1800`, `ssoSessionMaxLifespan: 43200`, `offlineSessionIdleTimeout: 2592000`, `revokeRefreshToken: true`, `refreshTokenMaxReuse: 0`.

## 4. Tasarım

### 4.1 Akış

1. Frontend, `POST /api/auth/logout` isteğini CSRF header'ıyla (mevcut `api-client.ts` interceptor'ı üzerinden) gönderir.
2. BFF, CSRF token'ı doğrular (mevcut filtre zaten bunu yapıyor).
3. BFF, Redis'teki mevcut session'dan `id_token`'ı okuyup Keycloak `end_session_endpoint`'ine `id_token_hint` ile RP-Initiated Logout isteği yapar.
4. BFF, Redis'teki `WebSession`'ı invalidate eder (token'lar dahil tamamen silinir).
5. BFF, response'ta session cookie'sini `Max-Age=0` ile temizler; cookie'de `Domain` set edilmez, `__Host-` prefix korunur.
6. Frontend, başarılı response sonrası kendi in-memory CSRF store'unu (`csrf.ts`) temizler ve login/marketing sayfasına yönlendirir.

### 4.2 Multi-tab senkronizasyonu

- Logout tetiklendiğinde, `BroadcastChannel` (veya fallback olarak `storage` event) ile aynı origin'deki diğer açık sekmelere "session kapandı" sinyali yayınlanır; her sekme bunu dinleyip kendi state'ini temizler ve login'e yönlendirir.

### 4.3 "Tüm cihazlardan çıkış" (opsiyonel/faz 2)

- Kullanıcı bu seçeneği kullandığında, BFF Keycloak Admin API üzerinden `POST /admin/realms/{realm}/users/{id}/logout` çağrısı yapar; bu, kullanıcının tüm refresh token'larını ve session'larını sunucu tarafında geçersiz kılar.
- Bu, service account client'ın ilgili admin yetkisine (`fullScopeAllowed` + rol ataması, mevcut pattern'e uygun) sahip olmasını gerektirir.

### 4.4 Back-Channel Logout (ileri faz, admin panel ile birlikte)

- Admin panel (`admin-bff`) devreye girdiğinde, Keycloak'ın Back-Channel Logout desteği değerlendirilebilir: Keycloak bir session'ı başka bir yerden (ör. admin zorla logout) sonlandırdığında bff-server'daki bir bildirim endpoint'ine haber verir, bff-server ilgili Redis kaydını temizler. Bu spec kapsamı dışında, ayrı bir spec olarak ele alınmalı.

### 4.5 Cookie güvenliği

- `Secure`, `HttpOnly` flag'leri korunur.
- `SameSite=Strict`.
- `Domain` attribute'u set edilmez (yalnızca ilgili origin'e bağlı).
- `__Host-` prefix kullanılır (ör. `__Host-session`).

## 5. Test planı

- **Birim/entegrasyon testleri:**
  - `POST /api/auth/logout` CSRF token'sız çağrıldığında 403 dönüyor mu.
  - Logout sonrası Redis'teki ilgili session key'i gerçekten silinmiş mi.
  - Logout sonrası aynı session cookie'siyle korumalı bir endpoint'e istek atıldığında 401 dönüyor mu.
- **Manuel / cross-origin doğrulama:**
  - Gerçek prod subdomain yapısını taklit eden localhost port kurulumunda (CSRF audit'inde kullanılan yöntemle aynı) uçtan uca logout testi.
  - Keycloak admin console'da, logout sonrası kullanıcının active session listesinden gerçekten düştüğünün doğrulanması (yalnızca BFF/Redis değil, Keycloak tarafı da kontrol edilmeli).
  - Aynı tarayıcıda iki sekme açıp birinde logout yapıldığında diğer sekmenin de düştüğünün doğrulanması.
- **Güvenlik testleri:**
  - GET ile `/api/auth/logout`'a istek atılmaya çalışıldığında endpoint'in reddettiğinin doğrulanması (method not allowed / CSRF hatası).
  - Cookie'nin `Domain` attribute'u içermediğinin ve `__Host-` prefix'inin tarayıcı dev tools üzerinden doğrulanması.
- **Bölgesel/prod farkı:** `bff-server-dev.yml`, `bff-server-docker.yml`, `bff-server-prod.yml` arasında `app.website-base-url` ve post-logout-redirect-uri konfigürasyonlarının tutarlılığının kontrolü.

## 6. Veri güvenliği kontrolü

- Logout event'i audit log'a yazılırken kişisel veri (email, ad-soyad, IP dışında hassas alan) içermemeli — mevcut "audit log'lar kişisel veri içermemeli" prensibiyle uyumlu olmalı.
- Redis'ten silinen token'ların (access/refresh) gerçekten temizlendiği, hiçbir kopyanın (ör. log satırlarında, error trace'lerde) sızmadığı kontrol edilmeli.
- `end_session_endpoint`'e giden istekte `id_token_hint` dışında gereksiz PII taşınmamalı.
- KVKK kapsamında, logout işleminin kendisi bir "veri işleme" olayı olmadığından ayrıca bir yasal onay gerektirmiyor; ancak "tüm cihazlardan çıkış" özelliği eklenirse kullanıcıya bu aksiyonun sonucu (diğer cihazlarda oturum düşecek) net şekilde belirtilmeli.

## 7. Dokunulan dosyalar

> Aşağıdaki liste tahminidir; gerçek dosya adları/konumları proje reposunda Claude Code ile doğrulanmalı.

- `bff-server` — logout controller/handler (Spring Security logout success handler konfigürasyonu)
- `bff-server` — `SecurityConfig` (cookie ayarları, post-logout-redirect-uri, CSRF konfigürasyonu)
- `bff-server` — `GatewayProxyHandler` (Cookie header stripping, Step 3 ile birlikte)
- `configurations/bff-server/bff-server-dev.yml`, `bff-server-docker.yml`, `bff-server-prod.yml` (varsa) — `app.website-base-url` ve ilgili Keycloak issuer/redirect ayarları
- Frontend — `auth.api.ts` (logout çağrısı), `api-client.ts` (CSRF header), yeni: multi-tab broadcast handler
- `parena-realm.yaml` — Keycloak client'ın post-logout-redirect-uri listesi, gerekiyorsa admin API yetkisi (service account rolü)

## 8. Kapsam dışı

- Back-Channel Logout implementasyonu (admin panel ile birlikte ayrı spec).
- `admin-bff` için ayrı logout tasarımı (kısa token ömrü + OTP zaten farklı bir güvenlik modeli gerektiriyor).
- Genel CSRF mimarisi (Step 1'de zaten tamamlandı, bu spec'te yalnızca logout'a özel kullanımı kapsanıyor).
- `GatewayProxyHandler` cookie stripping'in logout dışındaki tüm istekler için genel davranışı (Step 3 kendi kapsamında ele alınacak).

## 9. Açık riskler

- Keycloak `end_session_endpoint`'e giden istek başarısız olursa (ör. Keycloak geçici olarak erişilemezse), BFF yine de local session'ı mı temizlemeli, yoksa kullanıcıyı "logout başarısız" durumunda mı bırakmalı — best-effort mü, yoksa fail-closed mı olacağına karar verilmeli (bkz. Kararlar).
- Multi-tab broadcast mekanizması (`BroadcastChannel`) tarayıcı desteği ve private/incognito mod davranışı açısından doğrulanmalı.
- "Tüm cihazlardan çıkış" özelliği, service account client'a ek admin yetkisi vermeyi gerektiriyor; bu yetkinin scope'u dar tutulmalı (yalnızca `logout` aksiyonu, başka admin API'lerine erişim olmamalı).
- `bff-server-dev.yml`'deki eksik `app.website-base-url` düzeltilmeden bu spec'in dev ortamında uçtan uca test edilmesi mümkün olmayabilir — Step 4 bu spec'ten önce veya bu spec ile birlikte tamamlanmalı.

## 10. Kararlar

> Bu bölüm review sürecinde doldurulacak — aşağıdakiler karar bekleyen maddeler:

- [ ] Keycloak `end_session_endpoint` hatası durumunda davranış: best-effort (local session yine temizlenir) mi, fail-closed (kullanıcıya hata gösterilir, tekrar denemesi istenir) mi?
- [ ] "Tüm cihazlardan çıkış" bu faza mı dahil, yoksa faz 2'ye mi ertelenecek?
- [ ] Multi-tab senkronizasyon önceliği: bu spec'e mi dahil, yoksa ayrı küçük bir takip işi mi?
- [ ] Logout event'inin audit log şemasına eklenip eklenmeyeceği (mevcut audit log altyapısı kullanıcı işlemlerini zaten kaydediyor mu, yoksa yeni bir alan mı gerekiyor)?
