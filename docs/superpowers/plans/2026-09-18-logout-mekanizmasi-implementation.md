# Logout Mekanizması Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

## Context

`docs/security/user-operations/2026-09-18-logout-mekanizmasi.md`'nin "3. Mevcut durum" bölümü, önceki bir oturumun proje hafızasından (chat geçmişi + memory dosyaları) derlenmişti ve dosyanın kendi notunda "gerçek kod tabanına erişim yoktu, doğrulanmalı" uyarısı vardı. Bu oturumda üç paralel Explore agent'ı + doğrudan dosya okumalarıyla bff-server (`SecurityConfig.java`, `CsrfController.java`, `GatewayProxyHandler.java`), tüm `bff-server-*.yml` profilleri, `parena-realm.yaml` ve frontend (`csrf.ts`, `api-client.ts`, `auth.api.ts`, `App.tsx`) kod tabanına karşı doğrulandı. Sonuç: doc'un "Bilinen/varsayılan durum" listesindeki maddelerin bazıları doğrulandı (CSRF mimarisi, form-submit logout), bazıları **yanlış çıktı** (logout şu an GET dahil her metodla tetiklenebiliyor — doc'un kendi hedef davranışını ihlal ediyor) ve bazı yeni kritik bulgular ortaya çıktı (`bff-server-prod.yml` tamamen boş, cookie hardening hiç konfigüre edilmemiş, `OidcClientInitiatedServerLogoutSuccessHandler` server-to-server çağrı değil redirect-tabanlı çalışıyor).

Bu plan, doc'un "4. Tasarım" bölümünü (4.4 Back-Channel Logout **hariç** — o doc'un kendi "8. Kapsam dışı" maddesi) doğrulanmış mevcut koda uygulayacak adım adım implementasyonu tanımlar. Kullanıcının talebi üzerine doc'un "3. Mevcut durum" bölümü **yalnızca bu bölüm** güncellenecek şekilde Task 1'de ele alınıyor; doc'un diğer bölümlerine (4, 5, 6, ...) bu plan kapsamında dokunulmuyor — 4.1'deki teknik model hatası (aşağıda açıklanıyor) sadece bu planın Self-Review'ünde not ediliyor, doc metni değiştirilmiyor.

**Goal:** Logout'u `POST`'a kilitleyip explicit Redis-invalidation + audit log zinciriyle güçlendirmek, session cookie'sini `__Host-` prefix + Secure/HttpOnly/SameSite=Strict ile sabitlemek, eksik `app.website-base-url`/`forward-headers-strategy` konfigürasyon boşluklarını doldurmak ve frontend'e multi-tab logout senkronizasyonu eklemek — hepsini doc §8'in kapsam dışı bıraktığı alanlara (Back-Channel Logout, `admin-bff`, genel CSRF mimarisi, `GatewayProxyHandler`'ın genel cookie-stripping davranışı) dokunmadan.

**Architecture:** Logout akışının bileşenleri: (1) frontend `auth.api.ts::logout()` — gizli `<form>` POST + tam sayfa navigasyonu, (2) `bff-server` `SecurityConfig.java` chain 2 `.logout(...)` DSL'i — `requiresLogout` matcher + logout handler zinciri (Redis/WebSession + SecurityContext temizleme + audit log) + `OidcClientInitiatedServerLogoutSuccessHandler` (bu, BFF'den Keycloak'a server-to-server bir çağrı DEĞİL; tarayıcıya `id_token_hint`+`post_logout_redirect_uri` taşıyan 302 redirect döner), (3) Keycloak `end_session_endpoint` (tarayıcı tarafından takip edilir), (4) Keycloak → `post_logout_redirect_uri` (`app.website-base-url`). Bu planda değişen katmanlar: `SecurityConfig.java` (matcher + logout handler zinciri + yeni `WebSessionIdResolver` bean'i), yeni `LogoutAuditLogHandler.java`, `bff-server-{dev,docker,prod}.yml` (konfigürasyon boşlukları), frontend'de yeni `auth-broadcast.ts` + `auth.api.ts`/`App.tsx` üzerinde küçük eklemeler, ve (faz 2/opsiyonel) `user-service`'e yeni bir "tüm session'ları sonlandır" iç endpoint'i — bff-server'a yeni bir Keycloak admin yetkisi/service account AÇILMADAN, mevcut `user-service` service account'u (`manage-users`, `view-users`) yeniden kullanılarak.

**Tech Stack:** Spring WebFlux, Spring Security (`ServerHttpSecurity.LogoutSpec`, `OidcClientInitiatedServerLogoutSuccessHandler`, `DelegatingServerLogoutHandler`, `CookieWebSessionIdResolver`), Spring Session Data Redis, Testcontainers (Redis, test-only), Keycloak RP-Initiated Logout + Admin REST API (`keycloak-admin-client` Java kütüphanesi, `UserResource.logout()`), React 19 + `BroadcastChannel`/`storage` event.

**Spec:** /2026-09-18-logout-mekanizmasi.md

## Global Constraints

- `GatewayProxyHandler.java`'ya HİÇ dokunulmayacak — logout bu handler'dan geçmiyor (kendi `.logout()` DSL'i bff-server içinde sonlanıyor), raw `Cookie` forward sorunu Step 3'ün ayrı kapsamı.
- Back-Channel Logout (doc §4.4), `admin-bff` logout tasarımı ve genel CSRF mimarisi (Step 1) bu plana girmiyor; `CsrfController`/`WebSessionServerCsrfTokenRepository` davranışı değişmiyor.
- Session cookie'sinde **`Domain` attribute'u hiçbir profilde, hiçbir task'ta set edilmeyecek** — `__Host-` prefix'in ön koşulu, doc §1/§2'nin en kritik güvenlik gereksinimi.
- Doc'un "3. Mevcut durum" bölümü DIŞINDA hiçbir bölümüne bu plan kapsamında yazma işlemi yapılmayacak (4.1'deki "BFF end_session_endpoint'e istek yapar" ifadesinin teknik olarak yanlış model kurduğu biliniyor — redirect-tabanlı, server-to-server değil — ama bu metin düzeltmesi kullanıcı talebiyle bu planın kapsamı dışında tutuluyor, bkz. Self-Review).
- Faz 2 ("tüm cihazlardan çıkış") için bff-server'a yeni bir Keycloak service account/`fullScopeAllowed` yetkisi AÇILMAYACAK; Keycloak'ta `manage-users`'dan daha dar taneli bir "sadece logout" rolü yok, bu yüzden mevcut `user-service` service account'u yeniden kullanılıyor.
- Audit log satırında PII olmayacak — yalnızca `sub` (Keycloak userId/UUID) + Redis session id + timestamp; email/ad-soyad/IP yok (repo'da IP çıkarma altyapısı da yok, bu plana eklenmiyor).
- Hiçbir task, register chain'in (chain 1, `@Order(1)`) CORS/CSRF izolasyonunu veya mevcut login akışını bozmayacak.

---

### Task 1: Doc §3 "Mevcut durum" bölümünü doğrulanmış bulgularla güncelle

**Dosyalar:**
- Modify: `docs/security/user-operations/2026-09-18-logout-mekanizmasi.md:28-44` (yalnızca "## 3. Mevcut durum" bölümü)

**Interfaces:** Yok — doc-only, kod değişikliği değil.

- [ ] **Step 1: Mevcut bölüm 3'ü şu içerikle değiştir**

`## 3. Mevcut durum` başlığından `## 4. Tasarım` başlığına kadar olan blok (satır 28-44) aşağıdakiyle **birebir** değiştirilir:

```markdown
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
```

- [ ] **Step 2: Diğer bölümlere (1, 2, 4, 5, 6, 7, 8, 9, 10) dokunulmadığını doğrula**

Run: `git diff docs/security/user-operations/2026-09-18-logout-mekanizmasi.md`
Expected: Diff yalnızca satır 28-44 aralığını (eski "## 3. Mevcut durum" bloğu) kapsıyor; `## 4. Tasarım` ve sonrası hiç değişmemiş.

- [ ] **Step 3: Commit**

```bash
git add docs/security/user-operations/2026-09-18-logout-mekanizmasi.md
git commit -m "docs: verify logout spec's current-state section against real bff-server/Keycloak/frontend code"
```

---

### Task 2: Konfigürasyon ön koşulları — `app.website-base-url`, `forward-headers-strategy`, boş `prod.yml`

**Dosyalar:**
- Modify: `backend/configurations/bff-server/bff-server-dev.yml`
- Modify: `backend/configurations/bff-server/bff-server-prod.yml` (şu an 0 byte)
- Modify: `backend/configurations/bff-server/bff-server.yml`

**Interfaces:**
- Produces: `app.website-base-url` property'si dev VE prod profilinde artık mevcut (Task 3/4'ün `SecurityConfig` constructor'ı bunu zorunlu okuyor); `server.forward-headers-strategy: framework` tüm profillerde aktif.

- [ ] **Step 1: `bff-server.yml` (base) içine `forward-headers-strategy` ekle**

`backend/configurations/bff-server/bff-server.yml` şu hale gelir:

```yaml
server:
  port: 8989
  forward-headers-strategy: framework

eureka:
  fetch-registry: true
  register-with-eureka: true
```

- [ ] **Step 2: `bff-server-dev.yml`'e `app.website-base-url` ekle**

`app:` bloğu şu hale gelir (mevcut `frontend-base-url`/`gateway-base-url`'in yanına eklenir):

```yaml
app:
  frontend-base-url: ${SO_FRONTEND_BASE_URL}
  gateway-base-url: http://localhost:8888
  website-base-url: ${SO_WEBSITE_BASE_URL}
```

- [ ] **Step 3: `bff-server-prod.yml`'i `bff-server-docker.yml` pattern'ine paralel doldur**

Şu an 0 byte olan dosya:

```yaml
eureka:
  client:
    service-url:
      defaultZone: http://discovery-server:8761/eureka

app:
  frontend-base-url: ${SO_FRONTEND_BASE_URL}
  gateway-base-url: http://gateway-server:8888
  website-base-url: ${SO_WEBSITE_BASE_URL}

spring:
  security:
    oauth2:
      client:
        provider:
          keycloak:
            issuer-uri: ${SO_KEYCLOAK_PUBLIC_URL}/realms/parena
            authorization-uri: ${SO_KEYCLOAK_PUBLIC_URL}/realms/parena/protocol/openid-connect/auth
            token-uri: ${SO_KEYCLOAK_INTERNAL_URL}/realms/parena/protocol/openid-connect/token
            jwk-set-uri: ${SO_KEYCLOAK_INTERNAL_URL}/realms/parena/protocol/openid-connect/certs
            user-name-attribute: preferred_username
        registration:
          keycloak:
            client-id: bff-server
            client-secret: ${SO_BFF_CLIENT_SECRET}
            redirect-uri: "${SO_BFF_BASE_URL}/login/oauth2/code/{registrationId}"
            authorization-grant-type: authorization_code
            scope:
              - openid
              - profile
              - email
              - roles
  session:
    redis:
      namespace: parena:bff:session
    timeout: 30m
  data:
    redis:
      host: redis
      port: 6379
      password: ${SO_REDIS_PASSWORD}

logging:
  level:
    org.springframework.security: WARN
```

(`docker` profilinden farkı: prod'da güvenlik log seviyesi `INFO` değil `WARN` — prod'da DEBUG/INFO seviyesindeki security logları KVKK/audit kuralı `audit-kvkk-compliance.md` §5'in "PII sızdırma riski taşıyan log seviyeleri prod'da kapatılmalı" ilkesiyle tutarlı hale getiriliyor.)

- [ ] **Step 4: Context'in her üç profilde de başladığını doğrula**

Run: `cd /Users/nursultanaslan/Documents/parena/backend && ./mvnw -pl bff-server -am compile`
Expected: `BUILD SUCCESS` (compile seviyesinde YAML syntax hatası olmadığı doğrulanır).

Run (dev profili, config-server/discovery-server/Redis/Keycloak `docker compose up -d` ile ayakta iken): `SPRING_PROFILES_ACTIVE=dev ./mvnw -pl bff-server spring-boot:run`
Expected: `Started BffServerApplication` log satırı görülür, `IllegalArgumentException`/`UnsatisfiedDependencyException` (eksik `${SO_WEBSITE_BASE_URL}` nedeniyle `app.website-base-url` çözümlenemediği için) fırlamaz.

- [ ] **Step 5: Commit**

```bash
git add backend/configurations/bff-server/bff-server.yml backend/configurations/bff-server/bff-server-dev.yml backend/configurations/bff-server/bff-server-prod.yml
git commit -m "fix(bff-server): fill missing app.website-base-url and forward-headers-strategy config gaps across profiles"
```

---

### Task 3: Logout'u POST'a kilitle + explicit Redis-invalidation/audit-log zinciri

**Bağımlılık:** Yok (Task 1/2'den bağımsız, ama Task 4 bu task'ın üstüne aynı dosyada inşa ediliyor — sırayla uygulanmalı).

**Dosyalar:**
- Create: `backend/bff-server/src/main/java/com/parena/bffserver/security/LogoutAuditLogHandler.java`
- Modify: `backend/bff-server/src/main/java/com/parena/bffserver/config/SecurityConfig.java:9-22` (import'lar), `:69-92` (`defaultFilterChain`)
- Create: `backend/bff-server/src/test/resources/application.yml`
- Test: `backend/bff-server/src/test/java/com/parena/bffserver/config/LogoutSecurityConfigTest.java`
- Modify: `backend/bff-server/pom.xml` (Testcontainers test dependency'leri)

**Interfaces:**
- Consumes: `SecurityConfig`'in mevcut `frontendBaseUrl`/`websiteBaseUrl` alanları, `ReactiveClientRegistrationRepository clientRegistrationRepository`, `oidcLogoutSuccessHandler(...)` metodu — değişmiyor.
- Produces: `LogoutAuditLogHandler` (`@Component`, `com.parena.bffserver.security` paketi) — `defaultFilterChain(...)` bean metoduna yeni bir parametre olarak enjekte edilir.

- [ ] **Step 1: Test altyapısı — Testcontainers Redis bağımlılıklarını ekle**

`backend/bff-server/pom.xml`'deki `<dependencies>` bloğunun sonuna (mevcut `spring-security-test` bağımlılığından sonra) ekle:

```xml
<!-- Testcontainers (Redis) - integration testleri için -->
<dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>junit-jupiter</artifactId>
    <scope>test</scope>
</dependency>
```

(Spring Boot'un yönettiği BOM zaten `testcontainers` versiyonunu sabitliyor, ek bir `<version>` gerekmez — `./mvnw -pl bff-server dependency:tree | grep testcontainers` ile versiyon çakışması olmadığı Step 6'da doğrulanacak.)

- [ ] **Step 2: Test'in bootstrap edebilmesi için `src/test/resources/application.yml` oluştur**

Bu modülde şu ana kadar hiç test kaynağı yoktu (`spring-cloud-starter-config`/`eureka-client` test sırasında gerçek config-server/discovery-server'a bağlanmaya çalışır, bu da testi ortamdan bağımlı kılar) — bunu devre dışı bırakan bir test-profili config dosyası eklenir:

```yaml
spring:
  cloud:
    config:
      enabled: false
  main:
    web-application-type: reactive

eureka:
  client:
    enabled: false

app:
  frontend-base-url: https://app.parena.com.tr
  website-base-url: https://parena.com.tr
  gateway-base-url: http://localhost:8888

logging:
  level:
    org.springframework.security: DEBUG
```

- [ ] **Step 3: Önce başarısız olacak testi yaz**

`backend/bff-server/src/test/java/com/parena/bffserver/config/LogoutSecurityConfigTest.java`:

```java
package com.parena.bffserver.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.ReactiveStringRedisTemplate;
import org.springframework.security.test.web.reactive.server.SecurityMockServerConfigurers;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

import static org.assertj.core.api.Assertions.assertThat;

@Testcontainers
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class LogoutSecurityConfigTest {

    @Container
    static GenericContainer<?> redis = new GenericContainer<>(DockerImageName.parse("redis:7-alpine"))
            .withExposedPorts(6379);

    @DynamicPropertySource
    static void redisProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.data.redis.host", redis::getHost);
        registry.add("spring.data.redis.port", () -> redis.getMappedPort(6379));
    }

    @Autowired
    private WebTestClient webTestClient;

    @Autowired
    private ReactiveStringRedisTemplate redisTemplate;

    @Test
    void getRequestToLogoutIsNotAcceptedAsLogout() {
        webTestClient
                .mutateWith(SecurityMockServerConfigurers.mockOidcLogin())
                .get().uri("/api/auth/logout")
                .exchange()
                .expectStatus().is4xxClientError();
    }

    @Test
    void postLogoutWithoutCsrfTokenIsForbidden() {
        webTestClient
                .mutateWith(SecurityMockServerConfigurers.mockOidcLogin())
                .post().uri("/api/auth/logout")
                .exchange()
                .expectStatus().isForbidden();
    }

    @Test
    void postLogoutWithValidCsrfInvalidatesRedisSession() {
        WebTestClient.ResponseSpec csrfResponse = webTestClient
                .mutateWith(SecurityMockServerConfigurers.mockOidcLogin())
                .get().uri("/api/csrf")
                .exchange();
        csrfResponse.expectStatus().isOk();

        // CSRF token + session cookie birlikte alınıp logout'a taşınıyor;
        // WebTestClient CSRF token'ı response body'sinden okuyup ikinci
        // istekte header olarak ekliyor (spring-security-test'in
        // SecurityMockServerConfigurers.csrf() yardımcı mutator'ı burada
        // WebSessionServerCsrfTokenRepository ile birlikte kullanılıyor).
        webTestClient
                .mutateWith(SecurityMockServerConfigurers.mockOidcLogin())
                .mutateWith(SecurityMockServerConfigurers.csrf())
                .post().uri("/api/auth/logout")
                .exchange()
                .expectStatus().is3xxRedirection();

        assertThat(redisTemplate.keys("parena:bff:session:*").collectList().block())
                .as("logout sonrası Redis'te bu session'a ait hiçbir key kalmamalı")
                .isEmpty();
    }
}
```

- [ ] **Step 4: Testi çalıştır, derleme/başarısızlık nedenini doğrula**

Run: `./mvnw -pl backend/bff-server test -Dtest=LogoutSecurityConfigTest`
Expected: `postLogoutWithValidCsrfInvalidatesRedisSession` **FAIL** olur (ya `is3xxRedirection()` beklentisi karşılanmaz çünkü GET matcher hâlâ her metodu kabul ediyor ve davranış farklı, ya da Redis key'i hâlâ mevcut). `getRequestToLogoutIsNotAcceptedAsLogout` de muhtemelen FAIL olur çünkü şu an GET zaten logout matcher'ına giriyor ve 3xx/200 dönebilir (4xx beklenirken). Bu, Task 1'de doc'a yazılan bulgunun test-seviyesinde doğrulanmasıdır.

- [ ] **Step 5: `LogoutAuditLogHandler`'ı oluştur**

`backend/bff-server/src/main/java/com/parena/bffserver/security/LogoutAuditLogHandler.java`:

```java
package com.parena.bffserver.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.web.server.WebFilterExchange;
import org.springframework.security.web.server.authentication.logout.ServerLogoutHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.server.WebSession;
import reactor.core.publisher.Mono;

// KVKK/SPK audit kuralı: logout event'i loglanır ama PII TAŞIMAZ — yalnızca
// Keycloak sub (UUID) + Redis WebSession id + zaman damgası. Bu handler,
// SecurityContext ve WebSession HALA MEVCUTKEN (invalidation'dan ÖNCE)
// zincirin ilk halkası olarak çalışmalı; aksi halde loglanacak userId kaybolur.
@Component
public class LogoutAuditLogHandler implements ServerLogoutHandler {

    private static final Logger log = LoggerFactory.getLogger(LogoutAuditLogHandler.class);

    @Override
    public Mono<Void> logout(WebFilterExchange exchange, Authentication authentication) {
        return exchange.getExchange().getSession()
                .map(WebSession::getId)
                .defaultIfEmpty("unknown")
                .doOnNext(sessionId -> log.info("logout event: userId={} sessionId={}",
                        resolveUserId(authentication), sessionId))
                .then();
    }

    private String resolveUserId(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof OidcUser oidcUser) {
            return oidcUser.getSubject();
        }
        return "unknown";
    }
}
```

- [ ] **Step 6: `SecurityConfig.java`'yı güncelle**

Import bloğuna (satır 9-22 civarı, mevcut import'ların arasına alfabetik/mantıksal olarak) ekle:

```java
import com.parena.bffserver.security.LogoutAuditLogHandler;
import org.springframework.security.web.server.authentication.logout.DelegatingServerLogoutHandler;
import org.springframework.security.web.server.authentication.logout.SecurityContextServerLogoutHandler;
import org.springframework.security.web.server.authentication.logout.WebSessionServerLogoutHandler;
```

`defaultFilterChain(...)` metod imzasına yeni bir parametre ekle ve `.logout(...)` bloğunu değiştir:

```java
    @Bean
    @Order(2)
    public SecurityWebFilterChain defaultFilterChain(
            ServerHttpSecurity http,
            ReactiveClientRegistrationRepository clientRegistrationRepository,
            EmailVerificationSyncHandler emailVerificationSyncHandler,
            LogoutAuditLogHandler logoutAuditLogHandler,
            @Qualifier("defaultCorsConfigurationSource") CorsConfigurationSource defaultCorsConfigurationSource) {

        ServerCsrfTokenRequestAttributeHandler csrfAttributeHandler = new ServerCsrfTokenRequestAttributeHandler();

        return http
                .cors(cors -> cors
                        .configurationSource(defaultCorsConfigurationSource))
                .csrf(csrf -> csrf
                        .csrfTokenRepository(new WebSessionServerCsrfTokenRepository())
                        .csrfTokenRequestHandler(csrfAttributeHandler))
                .authorizeExchange(exchanges -> exchanges
                        .pathMatchers("/actuator/health", "/api/auth/me").permitAll()
                        .anyExchange().authenticated())
                .oauth2Login(oauth2 -> oauth2
                        .authenticationSuccessHandler(emailVerificationSyncHandler))
                .logout(logout -> logout
                        // ÖNEMLİ: metod belirtilmezse GET dahil her HTTP metodu logout'u
                        // tetikleyebilir (logout-CSRF / prefetch riski) — register chain'deki
                        // HttpMethod.POST pattern'iyle tutarlı hale getirildi.
                        .requiresLogout(ServerWebExchangeMatchers.pathMatchers(HttpMethod.POST, "/api/auth/logout"))
                        // Sıra kritik: audit log SecurityContext/WebSession hâlâ mevcutken
                        // çalışmalı, WebSession invalidation zincirin EN SONUNDA olmalı.
                        .logoutHandler(new DelegatingServerLogoutHandler(
                                logoutAuditLogHandler,
                                new SecurityContextServerLogoutHandler(),
                                new WebSessionServerLogoutHandler()))
                        .logoutSuccessHandler(oidcLogoutSuccessHandler(clientRegistrationRepository)))
                .build();
    }
```

- [ ] **Step 7: Testi tekrar çalıştır, geçtiğini doğrula**

Run: `./mvnw -pl backend/bff-server test -Dtest=LogoutSecurityConfigTest`
Expected: 3 test de **PASS**. `WebSessionServerLogoutHandler`/`DelegatingServerLogoutHandler` sınıf adlarının kullanılan Spring Security sürümünde mevcut olmadığı bir derleme hatasıyla karşılaşılırsa (Spring Boot 4 API'si teyit edilmemiş), `./mvnw -pl backend/bff-server dependency:tree | grep spring-security-core` ile sürüm tespit edilip Spring Security'nin o sürümdeki reaktif logout handler paket/sınıf adları (`org.springframework.security.web.server.authentication.logout.*`) IDE "go to symbol" ile doğrulanır ve import'lar buna göre düzeltilir.

- [ ] **Step 8: Commit**

```bash
git add backend/bff-server/pom.xml backend/bff-server/src/main/java/com/parena/bffserver/security/LogoutAuditLogHandler.java backend/bff-server/src/main/java/com/parena/bffserver/config/SecurityConfig.java backend/bff-server/src/test/resources/application.yml backend/bff-server/src/test/java/com/parena/bffserver/config/LogoutSecurityConfigTest.java
git commit -m "fix(bff-server): restrict logout to POST and make Redis session invalidation + PII-free audit logging explicit"
```

---

### Task 4: Session cookie hardening — `__Host-` prefix + Secure/HttpOnly/SameSite=Strict

**Bağımlılık:** Task 2 (`forward-headers-strategy`) — NPM arkasında Secure flag'in tarayıcıya doğru ulaşması, Spring'in şema bilgisini `X-Forwarded-Proto`'dan doğru okumasına bağlı.

**Dosyalar:**
- Modify: `backend/bff-server/src/main/java/com/parena/bffserver/config/SecurityConfig.java` (yeni `@Bean webSessionIdResolver`)
- Test: `backend/bff-server/src/test/java/com/parena/bffserver/config/SessionCookieSecurityTest.java`

**Interfaces:**
- Produces: `WebSessionIdResolver` bean'i — Spring Boot'un auto-configure ettiği default `CookieWebSessionIdResolver`'ın yerine geçer, `spring.session.redis.*` konfigürasyonunu etkilemez (session ID taşıma mekanizması ile session store birbirinden bağımsız).

- [ ] **Step 1: Önce başarısız olacak testi yaz**

`backend/bff-server/src/test/java/com/parena/bffserver/config/SessionCookieSecurityTest.java`:

```java
package com.parena.bffserver.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.web.reactive.server.SecurityMockServerConfigurers;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

import static org.assertj.core.api.Assertions.assertThat;

@Testcontainers
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class SessionCookieSecurityTest {

    @Container
    static GenericContainer<?> redis = new GenericContainer<>(DockerImageName.parse("redis:7-alpine"))
            .withExposedPorts(6379);

    @DynamicPropertySource
    static void redisProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.data.redis.host", redis::getHost);
        registry.add("spring.data.redis.port", () -> redis.getMappedPort(6379));
    }

    @Autowired
    private WebTestClient webTestClient;

    @Test
    void sessionCookieHasHardenedAttributesAndNoDomain() {
        String setCookie = webTestClient
                .mutateWith(SecurityMockServerConfigurers.mockOidcLogin())
                .get().uri("/api/csrf")
                .exchange()
                .expectStatus().isOk()
                .returnResult(String.class)
                .getResponseHeaders()
                .getFirst("Set-Cookie");

        assertThat(setCookie).isNotNull();
        assertThat(setCookie).startsWith("__Host-session=");
        assertThat(setCookie).containsIgnoringCase("Secure");
        assertThat(setCookie).containsIgnoringCase("HttpOnly");
        assertThat(setCookie).containsIgnoringCase("SameSite=Strict");
        assertThat(setCookie).doesNotContainIgnoringCase("Domain=");
        assertThat(setCookie).containsIgnoringCase("Path=/");
    }
}
```

- [ ] **Step 2: Testi çalıştır, `__Host-session` cookie adı olmadığı için FAIL olduğunu doğrula**

Run: `./mvnw -pl backend/bff-server test -Dtest=SessionCookieSecurityTest`
Expected: FAIL — `setCookie` şu an default `SESSION=...` adıyla geliyor, `Secure`/`SameSite` yok (mockOidcLogin test ortamında HTTPS simüle edilmediği için `Secure` özniteliği de muhtemelen eksik).

- [ ] **Step 3: `SecurityConfig.java`'ya `WebSessionIdResolver` bean'i ekle**

Import'lara ekle:

```java
import org.springframework.web.server.session.CookieWebSessionIdResolver;
import org.springframework.web.server.session.WebSessionIdResolver;
```

Sınıfın sonuna (`defaultCorsConfigurationSource()` metodundan sonra, kapanış `}` öncesine) ekle:

```java
    // __Host- prefix, tarayıcı seviyesinde Secure + Domain-yok + Path=/ şartını
    // ZORUNLU kılar — subdomain-takeover senaryosunda cookie'nin başka bir
    // subdomain'e (örn. admin.parena.com.tr) sızmasına karşı en güçlü garanti.
    // Domain BİLEREK set edilmiyor (bkz. bff-token-architecture.md §4).
    @Bean
    public WebSessionIdResolver webSessionIdResolver() {
        CookieWebSessionIdResolver resolver = new CookieWebSessionIdResolver();
        resolver.setCookieName("__Host-session");
        resolver.addCookieInitializer(builder -> builder
                .secure(true)
                .httpOnly(true)
                .sameSite("Strict")
                .path("/"));
        return resolver;
    }
```

- [ ] **Step 4: Testi tekrar çalıştır, geçtiğini doğrula**

Run: `./mvnw -pl backend/bff-server test -Dtest=SessionCookieSecurityTest`
Expected: PASS. `CookieWebSessionIdResolver.addCookieInitializer` metodunun kullanılan Spring sürümünde farklı bir imzada olduğu bir derleme hatası çıkarsa (`ResponseCookie.ResponseCookieBuilder` parametre tipini IDE'de kontrol et), imza buna göre düzeltilir.

- [ ] **Step 5: Deploy notuna tek-seferlik breaking-change uyarısı ekle**

Cookie adı `SESSION` → `__Host-session` değiştiği için, deploy anında aktif tüm tarayıcı session'ları geçersiz kalır (kullanıcılar yeniden login olur). Koda ek bir geçiş mekanizması eklenmez; bu, PR açıklamasına ve deploy runbook'una tek satır not olarak eklenir (kod değişikliği değil, PR/deploy metni).

- [ ] **Step 6: Commit**

```bash
git add backend/bff-server/src/main/java/com/parena/bffserver/config/SecurityConfig.java backend/bff-server/src/test/java/com/parena/bffserver/config/SessionCookieSecurityTest.java
git commit -m "fix(bff-server): harden session cookie with __Host- prefix, Secure, HttpOnly, SameSite=Strict"
```

---

### Task 5: Frontend multi-tab logout senkronizasyonu

**Bağımlılık:** Yok — backend task'larından bağımsız, paralel yürütülebilir.

**Not:** `frontend/app/CLAUDE.md`'ye göre bu projede hiç test runner'ı yok ("no test script, no test files, Storybook is the primary component-verification tool") — bu task, mevcut proje konvansiyonuna uyarak otomatik test yazmaz; doğrulama adımı manuel tarayıcı testidir (Task 7'de "iki sekme" senaryosu olarak da tekrar edilir).

**Dosyalar:**
- Create: `frontend/app/src/features/auth/auth-broadcast.ts`
- Modify: `frontend/app/src/features/auth/auth.api.ts:45-61` (`logout` fonksiyonu)
- Modify: `frontend/app/src/App.tsx`

**Interfaces:**
- Produces: `broadcastLogout(): void`, `onRemoteLogout(callback: () => void): () => void` (cleanup fonksiyonu döner).
- Consumes: `App.tsx` → `getLoginRedirectUrl()` (`auth.api.ts`'de zaten var, satır 16-18).

- [ ] **Step 1: `auth-broadcast.ts`'i oluştur**

`frontend/app/src/features/auth/auth-broadcast.ts`:

```ts
const CHANNEL_NAME = "parena-auth";
const STORAGE_KEY = "parena:auth:logout-at";

let channel: BroadcastChannel | null = null;
try {
  channel = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel(CHANNEL_NAME) : null;
} catch {
  channel = null;
}

/**
 * Diğer açık `app.parena.com.tr` sekmelerine "oturum kapandı" sinyali yayınlar.
 * `localStorage` birincil kanal (storage event, BroadcastChannel'dan daha
 * evrensel desteklenir — private mode davranışı daha öngörülebilir);
 * `BroadcastChannel` varsa ek/daha hızlı bir kanal olarak kullanılır.
 * Logout'un `form.submit()`'inden (tam sayfa navigasyon) ÖNCE çağrılmalı.
 */
export function broadcastLogout(): void {
  try {
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
  } catch {
    // localStorage kapalıysa (private mode) sessizce yut — bu sekme zaten
    // form-submit ile ayrılacak, kendi state'i için bir sorun değil.
  }

  try {
    channel?.postMessage("logout");
  } catch {
    // BroadcastChannel desteklenmiyor/kapanmışsa localStorage fallback yeterli.
  }
}

/**
 * Diğer sekmelerde çalışır: logout sinyalini dinler ve `callback`'i tetikler.
 * Cleanup fonksiyonu döner (React `useEffect` ile kullanım için).
 */
export function onRemoteLogout(callback: () => void): () => void {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY && event.newValue) callback();
  };
  window.addEventListener("storage", handleStorage);

  const handleMessage = () => callback();
  channel?.addEventListener("message", handleMessage);

  return () => {
    window.removeEventListener("storage", handleStorage);
    channel?.removeEventListener("message", handleMessage);
  };
}
```

- [ ] **Step 2: `auth.api.ts::logout()`'u güncelle**

Import bloğuna ekle (satır 1-3 civarı):

```ts
import { broadcastLogout } from "./auth-broadcast";
```

`logout` fonksiyonunu (satır 45-61) güncelle:

```ts
export const logout = async (): Promise<void> => {
  const csrf = await getCsrfToken();
  broadcastLogout();

  const form = document.createElement("form");
  form.method = "POST";
  form.action = `${env.apiBaseUrl}${AUTH_ENDPOINTS.logout}`;
  form.style.display = "none";

  const csrfInput = document.createElement("input");
  csrfInput.type = "hidden";
  csrfInput.name = csrf.parameterName;
  csrfInput.value = csrf.token;

  form.appendChild(csrfInput);
  document.body.appendChild(form);
  form.submit();
};
```

- [ ] **Step 3: `App.tsx`'e remote-logout listener'ı mount et**

`frontend/app/src/App.tsx`'i güncelle:

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";

import { getLoginRedirectUrl } from "./features/auth/auth.api";
import { onRemoteLogout } from "./features/auth/auth-broadcast";
import { AppRouter } from "./router/AppRouter";

/**
 * App.tsx
 * Asıl uygulama
 * Fast Refresh kuralı aktif
 * 
 * Uygulama kabuğu.
 * Mimari: React -> react-router-dom -> Pages
 *         React Components -> React Query -> API Client -> BFF
 */
export default function App() {
  // QueryClient bileşen ömrü boyunca tek örnek kalsın (StrictMode remount güvenli).
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: false, refetchOnWindowFocus: false },
        },
      }),
  );

  // Başka bir sekmede logout olduğunda bu sekme de aynı şekilde kapanır
  // (multi-tab senkronizasyonu) — login sayfası React tarafında render
  // edilmediği için (bkz. AppRouter, /giris zaten window.location.href ile
  // Keycloak'a redirect ediyor) doğrudan aynı redirect kullanılır.
  useEffect(() => {
    return onRemoteLogout(() => {
      queryClient.clear();
      window.location.href = getLoginRedirectUrl();
    });
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
```

- [ ] **Step 4: Manuel doğrulama (bu projede otomatik frontend testi yok)**

`npm run dev` ile SPA'yı ayağa kaldır, aynı origin'de iki sekme aç, ikisinde de login ol, birinde `logout()`'u tetikle (örn. bir hesap menüsünden), diğer sekmenin DevTools Console'da hata vermeden `window.location.href` üzerinden Keycloak login'e yönlendiğini doğrula. Chrome DevTools → Application → Storage → "Block third-party cookies"/gizli mod simülasyonuyla `BroadcastChannel`'ın devre dışı bırakıldığı bir senaryoda da (örn. `channel = null` olacak şekilde `window.BroadcastChannel` DevTools Console'dan silinerek) `storage` event fallback'inin tek başına çalıştığı doğrulanır.

- [ ] **Step 5: Commit**

```bash
git add frontend/app/src/features/auth/auth-broadcast.ts frontend/app/src/features/auth/auth.api.ts frontend/app/src/App.tsx
git commit -m "feat(frontend): broadcast logout across open tabs via BroadcastChannel with localStorage fallback"
```

---

### Task 6 (Faz 2): "Tüm cihazlardan çıkış" — kullanıcı onayıyla bu plana dahil edildi

**Bağımlılık:** Task 1-4 production'a alınmış olmalı (aksi halde bu özellik çalışır ama mevcut cihazın kendi Redis session'ı hâlâ GET-tetiklenebilir logout açığına maruz kalır).

**Tasarım tavsiyesi (doc §4.3'ün literal okumasından bilinçli sapma):** Doc §4.3, "BFF Keycloak Admin API'sini çağırır" diyor. Bu, bff-server'a yeni bir `serviceAccountsEnabled: true` + `fullScopeAllowed` + `manage-users` rolü açmayı gerektirir — bff-server'ın (şu an hiçbir admin yetkisi olmayan, salt oturum-yönetimi bileşeni) saldırı yüzeyini kalıcı olarak büyütür. Keycloak'ta `manage-users`'dan daha dar taneli bir "sadece logout" rolü yok. `user-service` zaten aynı admin yetkisine sahip ve KVKK silme akışında (`DeleteUserUseCase`) aynı Keycloak Admin API pattern'ini kullanıyor — bu task, yeni bir yetki yüzeyi açmadan mevcut pattern'i tekrar kullanır.

**Dosyalar:**
- Modify: `backend/user-service/src/main/java/com/parena/userservice/domain/port/KeycloakPort.java`
- Modify: `backend/user-service/src/main/java/com/parena/userservice/infrastructure/keycloak/adapter/KeycloakAdminClientAdapter.java`
- Create: `backend/user-service/src/main/java/com/parena/userservice/application/usecase/RevokeAllSessionsUseCase.java`
- Modify: `backend/user-service/src/main/java/com/parena/userservice/web/controller/UserController.java`
- Test: `backend/user-service/src/test/java/com/parena/userservice/application/usecase/RevokeAllSessionsUseCaseTest.java`
- Modify (faz 2 devreye alınırsa): `frontend/app/src/features/auth/auth.api.ts`, `backend/configurations/keycloak/parena-realm.yaml` **DEĞİŞMİYOR** (mevcut `user-service` yetkisi zaten yeterli — bu tasarımın ana avantajı).

**Interfaces:**
- Produces: `KeycloakPort.logoutAllSessions(UUID keycloakId)`, `RevokeAllSessionsUseCase.revokeAll(UUID keycloakId)`.
- Consumes: `KeycloakPort`'un mevcut `deleteUser`/`assignRealmRoles` metodlarıyla aynı `keycloakAdminClient` (`org.keycloak.admin.client.Keycloak`) enjeksiyonu.

- [ ] **Step 1: `KeycloakPort`'a yeni metod ekle**

`KeycloakPort.java`'ya (mevcut `deleteUser`'ın yanına) ekle:

```java
    /**
     * logoutAllSessions: Kullanıcının Keycloak'taki TÜM aktif session'larını
     * (tüm cihaz/tarayıcı) ve refresh token'larını sunucu tarafında geçersiz
     * kılar. Yalnızca çağıran kullanıcının KENDİ hesabı için kullanılabilir —
     * yetki kontrolü use case seviyesinde yapılır.
     */
    void logoutAllSessions(UUID keycloakId);
```

- [ ] **Step 2: `KeycloakAdminClientAdapter`'da implemente et**

`KeycloakAdminClientAdapter.java`'ya (mevcut `deleteUser`'ın yanına) ekle:

```java
    @Override
    public void logoutAllSessions(UUID keycloakId) {
        keycloakAdminClient.realm(keycloakProperties.getRealm())
                .users().get(keycloakId.toString())
                .logout();
        log.info("All sessions revoked for keycloakId={}", keycloakId);
    }
```

- [ ] **Step 3: Önce başarısız olacak use case testini yaz**

`backend/user-service/src/test/java/com/parena/userservice/application/usecase/RevokeAllSessionsUseCaseTest.java`:

```java
package com.parena.userservice.application.usecase;

import com.parena.userservice.domain.port.KeycloakPort;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.UUID;

import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class RevokeAllSessionsUseCaseTest {

    @Mock
    private KeycloakPort keycloakPort;

    @Test
    void revokeAllCallsKeycloakPortWithGivenUserId() {
        RevokeAllSessionsUseCase useCase = new RevokeAllSessionsUseCase(keycloakPort);
        UUID keycloakId = UUID.randomUUID();

        useCase.revokeAll(keycloakId);

        verify(keycloakPort).logoutAllSessions(keycloakId);
    }
}
```

- [ ] **Step 4: Testi çalıştır, derleme hatasıyla FAIL olduğunu doğrula**

Run: `./mvnw -pl backend/user-service test -Dtest=RevokeAllSessionsUseCaseTest`
Expected: FAIL — `RevokeAllSessionsUseCase` sınıfı henüz yok.

- [ ] **Step 5: `RevokeAllSessionsUseCase`'i oluştur**

`backend/user-service/src/main/java/com/parena/userservice/application/usecase/RevokeAllSessionsUseCase.java`:

```java
package com.parena.userservice.application.usecase;

import com.parena.userservice.domain.port.KeycloakPort;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class RevokeAllSessionsUseCase {

    private final KeycloakPort keycloakPort;

    public RevokeAllSessionsUseCase(KeycloakPort keycloakPort) {
        this.keycloakPort = keycloakPort;
    }

    public void revokeAll(UUID keycloakId) {
        keycloakPort.logoutAllSessions(keycloakId);
    }
}
```

- [ ] **Step 6: Testi tekrar çalıştır, geçtiğini doğrula**

Run: `./mvnw -pl backend/user-service test -Dtest=RevokeAllSessionsUseCaseTest`
Expected: PASS.

- [ ] **Step 7: Endpoint'i `UserController`'a ekle**

`UserController.java`'ya import ekle:

```java
import com.parena.userservice.application.usecase.RevokeAllSessionsUseCase;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import java.util.UUID;
```

Constructor ve yeni endpoint ekle:

```java
    private final RegisterUserUseCase registerUserUseCase;
    private final RevokeAllSessionsUseCase revokeAllSessionsUseCase;

    public UserController(RegisterUserUseCase registerUserUseCase,
                           RevokeAllSessionsUseCase revokeAllSessionsUseCase) {
        this.registerUserUseCase = registerUserUseCase;
        this.revokeAllSessionsUseCase = revokeAllSessionsUseCase;
    }

    // ...

    @PostMapping("/me/sessions/revoke-all")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void revokeAllSessions(@AuthenticationPrincipal Jwt jwt) {
        // "sub" claim, JWT'yi doğrulayan resource server tarafından garanti
        // edilir — çağıran kullanıcı başka bir userId'yi HİÇBİR ŞEKİLDE
        // parametre olarak veremez, bu yüzden ek bir "kendi hesabı mı"
        // kontrolüne gerek yok.
        revokeAllSessionsUseCase.revokeAll(UUID.fromString(jwt.getSubject()));
    }
```

Gateway route değişikliği gerekmez — mevcut `Path=/api/v1/users/**` predicate'i (`gateway-server-*.yml`) bu yeni path'i zaten kapsar; `bff-server`'ın `GatewayProxyHandler`'ı da bu isteği (Global Constraints'e uygun şekilde, kod DEĞİŞMEDEN) mevcut davranışıyla proxy'ler.

- [ ] **Step 8: Frontend'e çağrıyı ekle (devreye alınırsa)**

`auth.api.ts`'e yeni bir endpoint + fonksiyon eklenir (mevcut `AUTH_ENDPOINTS` pattern'ine uygun); UI'da "tüm cihazlardan çıkış yap" aksiyonu tetiklendiğinde önce bu endpoint (`apiRequest("/api/v1/users/me/sessions/revoke-all", { method: "POST" })`), ardından normal `logout()` çağrılır (mevcut cihazın kendi Redis session'ı da kapanır). Kullanıcıya, bu aksiyonun sonucunun (diğer cihazlarda oturumun düşeceği) net şekilde gösterilmesi gerekir (doc §6 son madde) — bu UI metni bu plan kapsamında yazılmıyor, ayrı bir küçük iş.

- [ ] **Step 9: Commit**

```bash
git add backend/user-service/src/main/java/com/parena/userservice/domain/port/KeycloakPort.java backend/user-service/src/main/java/com/parena/userservice/infrastructure/keycloak/adapter/KeycloakAdminClientAdapter.java backend/user-service/src/main/java/com/parena/userservice/application/usecase/RevokeAllSessionsUseCase.java backend/user-service/src/main/java/com/parena/userservice/web/controller/UserController.java backend/user-service/src/test/java/com/parena/userservice/application/usecase/RevokeAllSessionsUseCaseTest.java
git commit -m "feat(user-service): add revoke-all-sessions endpoint reusing existing Keycloak admin service account"
```

---

### Task 7: Kalan doc §5 test kapsamı — manuel/cross-origin/prod-config doğrulama

**Bağımlılık:** Task 1-5 tamamlanmış olmalı (Task 6 opsiyonel, bu task'ın son maddesi hariç ondan bağımsız).

Bu task, Task 3/4/5'in kendi içine gömülü birim/entegrasyon testlerinin KAPSAMADIĞI, doc §5'teki geniş/manuel doğrulama maddelerini kapsar:

- [ ] **Step 1: Cross-origin uçtan uca manuel test**

CSRF audit'inde kullanılan localhost multi-port kurulumuyla (`app.parena.com.tr` ve `api.parena.com.tr`'yi taklit eden ayrı portlar/host dosyası girdileri) `docker compose up -d` ile tam stack'i ayağa kaldır, login → logout akışını tarayıcıda uçtan uca çalıştır. Beklenen: form-submit → 302 zinciri → Keycloak → website'e döner, tarayıcı adres çubuğunda hata yok.

- [ ] **Step 2: Keycloak admin console doğrulaması**

`https://<KC_HOSTNAME>/admin` (Tailscale IP aralığından) → ilgili kullanıcının "Sessions" sekmesinde, logout sonrası active session listesinden gerçekten düştüğünü doğrula (yalnızca BFF/Redis değil, Keycloak SSO session'ı da kontrol edilir).

- [ ] **Step 3: Cookie dev-tools doğrulaması (Task 4'ün production-benzeri ortamda tekrarı)**

`docker compose` ile NPM benzeri bir reverse-proxy (veya en azından `forward-headers-strategy: framework` aktif docker profili) arkasında, tarayıcı DevTools → Application → Cookies'te `__Host-session`'ın `Secure: true`, `HttpOnly: true`, `SameSite: Strict`, `Domain` sütununun BOŞ olduğunu doğrula (Task 4'ün test-ortamı mock'unun gerçek TLS/proxy zincirinde de geçerli olduğunun kanıtı).

- [ ] **Step 4: Bölgesel/prod config tutarlılık kontrolü**

`bff-server.yml`, `bff-server-dev.yml`, `bff-server-docker.yml`, `bff-server-prod.yml` arasında `app.website-base-url`, `app.frontend-base-url` ve Keycloak issuer/authorization/token/jwk-set-uri split'inin her profilde tutarlı olduğunu manuel diff ile doğrula (Task 2'nin çıktısı).

- [ ] **Step 5: Multi-tab iki-sekme senaryosu (Task 5'in tekrarı, ayrı bir gözden geçiren tarafından)**

Task 5 Step 4'teki manuel senaryoyu, planı uygulayan kişiden farklı bir gözden geçiren tekrar eder (bağımsız doğrulama).

- [ ] **Step 6 (Task 6 devreye alınmışsa): Yetki testi**

`POST /api/v1/users/me/sessions/revoke-all`'ı, kullanıcı A'nın token'ıyla çağırıp Keycloak admin console'da kullanıcı A'nın TÜM session'larının düştüğünü, kullanıcı B'nin session'larının ETKİLENMEDİĞİNİ doğrula (JWT `sub` claim'inden userId çıkarma mantığının başka bir kullanıcıyı hedefleyemediğinin kanıtı).

---

## Self-Review

- **Spec kapsaması:** Doc §4.1 (POST + CSRF + üç katman senkron kapanış) → Task 3+4. §4.2 (multi-tab) → Task 5. §4.3 (tüm cihazlardan çıkış, faz 2) → Task 6. §4.5 (cookie güvenliği) → Task 4. §4.4 (Back-Channel Logout) → **bilerek hiçbir task'a girmedi** (doc §8 kapsam dışı). §5 (test planı) → Task 3/4/5'in gömülü testleri + Task 7'nin manuel/geniş kapsamlı maddeleri. §6 (veri güvenliği) → Task 3'ün `LogoutAuditLogHandler`'ı (PII yok) + Task 6 Step 8'in UI-bilgilendirme notu (kod dışı, ayrı iş olarak bırakıldı). §9 (açık riskler) → aşağıda madde madde ele alınıyor.

- **Doc §10 "Kararlar" bölümündeki karar bekleyen maddelerden bu plana VARSAYIMLA girenler (kullanıcı/review onayı gerekiyor):**
  1. **`end_session_endpoint` hata davranışı (best-effort vs fail-closed):** Bu plan, bu sorunun büyük ölçüde **moot** olduğunu varsayıyor — çünkü `OidcClientInitiatedServerLogoutSuccessHandler` server-to-server bir çağrı yapmıyor, sadece bir redirect response üretiyor; BFF açısından bu adım "başarısız olma" riski taşımıyor. Plan bunun yerine gerçek riski (Redis invalidation'ın ne zaman/nasıl garanti edileceği) Task 3'e taşıdı. **Bu bir varsayımdır — doc'un kendi Kararlar maddesini teknik gerekçeyle "cevapsız" bırakıyor, review'da bu gerekçenin kabul edilip edilmediği teyit edilmeli.**
  2. **"Tüm cihazlardan çıkış" bu faza mı faz 2'ye mi:** Doc'un kendi §4.3 başlığı "(opsiyonel/faz 2)" diyor; kullanıcıyla netleştirildi ve **user-service üzerinden, bu plana dahil** edilmesi onaylandı (bff-server'a yeni admin yetkisi açılmadan — tasarım tavsiyesi kabul edildi). Task 6, Task 1-5 ile birlikte uygulanır.
  3. **Multi-tab senkronizasyonu bu spec'e mi ayrı takip mi:** Doc §4.2 zaten bunu tasarıma dahil etmişti; plan bunu **dahil etti** (Task 5) ama bağımsız/paralel bir task olarak izole tuttu (backend task'larından ayrı onaylanabilir/reddedilebilir).
  4. **Logout event'inin formal audit-log şemasına eklenip eklenmeyeceği:** Repo'da hiçbir audit-log altyapısı/tablosu yok (grep sonucu sıfır `AuditLog` entity). Plan (Task 3) yalnızca **tek satır SLF4J log** ekledi, formal şema kararını **açık bıraktı**. Formal bir audit-log tablosu/servisi gerekiyorsa bu ayrı bir iş.

- **KVKK/audit kurallarına aykırılık kontrolü:** `LogoutAuditLogHandler` (Task 3) yalnızca `sub` (UUID) + Redis session id + timestamp logluyor — email/ad-soyad/IP yok, `audit-kvkk-compliance.md` §5 ile uyumlu. Task 2'nin prod log seviyesi `WARN`'a çekilmesi de aynı kuralın "PII sızdırma riski taşıyan log seviyeleri prod'da kapatılmalı" ilkesiyle uyumlu. Task 6'nın yetki modeli (yalnızca kendi JWT `sub`'ından userId çıkarma, hiçbir client-supplied id kabul etmeme) başka bir kullanıcının verisine/session'ına erişimi yapı itibariyle engelliyor. Hiçbir task, terms-of-service/consent kayıtlarına dokunmuyor (kapsam dışı).

- **Global Constraints uyumu:** `GatewayProxyHandler.java` hiçbir task'ta değişmedi (Task 6'nın yeni endpoint'i mevcut proxy davranışını olduğu gibi kullanıyor). `CsrfController`/`WebSessionServerCsrfTokenRepository` hiçbir task'ta değişmedi. `Domain` cookie attribute'u hiçbir task'ta set edilmedi (Task 4'ün merkezi kısıtı, testle de doğrulanıyor — `doesNotContainIgnoringCase("Domain=")`). Back-Channel Logout ve `admin-bff` hiçbir task'a girmedi. Doc'un yalnızca §3 bölümü değişti (Task 1), §4 ve sonrası hiç yazılmadı — 4.1'in teknik model hatası yalnızca bu Self-Review'de not edildi, doc metnine dokunulmadı (kullanıcı talebiyle bilinçli bir sınırlama).

- **Tip/isim tutarlılığı:** `KeycloakPort.logoutAllSessions(UUID)` → `KeycloakAdminClientAdapter.logoutAllSessions(UUID)` → `RevokeAllSessionsUseCase.revokeAll(UUID)` → `UserController.revokeAllSessions(Jwt)` zincirinde isimler ve tipler tutarlı. `LogoutAuditLogHandler` → `SecurityConfig.defaultFilterChain(...)` parametre adı (`logoutAuditLogHandler`) ve `DelegatingServerLogoutHandler` constructor sırası (audit log → SecurityContext → WebSession) Task 3'ün "Neden" notuyla (sıra kritik) tutarlı.

- **Sıralama/bağımlılık özeti:** Task 1 (doc) ve Task 2 (config) bağımsız, paralel yapılabilir → Task 3, Task 2'den bağımsız ama Task 4'ün ön koşulu (aynı dosya, sıralı uygulanmalı) → Task 4, Task 2'ye (forward-headers-strategy) bağımlı → Task 5, tüm backend task'larından bağımsız → Task 6 (kullanıcı onayıyla plana dahil), Task 1-4 prod'a alınmadan devreye açılmamalı → Task 7 hepsinden sonra, Task 6 dahil olduğu için Step 6'yı da kapsar.

- **Açık nokta (task olarak eklenmedi, kapsam dışı kuralına aykırı olurdu):** `CsrfCookieWebFilter.java`'nın uncommitted silinmesinin bağımsız olarak commit'lenmesi öneriliyor ama bu plana dahil edilmedi (genel CSRF mimarisi Step 1'in sahibi tarafından ayrıca ele alınmalı).

---

**Plan complete and saved to `/Users/nursultanaslan/.claude/plans/docs-alt-ndaki-logout-mekanizmas-md-dosy-magical-wilkinson.md`.**

Onay sonrası, önce (a) doc §3 güncellemesi (Task 1) ve config ön koşulları (Task 2) uygulanmalı, ardından ilgili sahibiyle Self-Review'deki 4 varsayım maddesi teyit edilmeli (özellikle Task 6'nın bu iterasyona dahil edilip edilmeyeceği), sonra Task 3-5 sırayla yürütülmeli.
