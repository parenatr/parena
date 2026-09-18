package com.parena.bffserver.config;

import com.parena.bffserver.api.CsrfController.CsrfTokenResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.webtestclient.autoconfigure.AutoConfigureWebTestClient;
import org.springframework.context.annotation.Bean;
import org.springframework.data.redis.core.ReactiveStringRedisTemplate;
import org.springframework.http.ResponseCookie;
import org.springframework.security.test.web.reactive.server.SecurityMockServerConfigurers;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.reactive.server.EntityExchangeResult;
import org.springframework.test.web.reactive.server.MockServerConfigurer;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@Testcontainers
// NOT: Brief RANDOM_PORT ile yazılmıştı; ancak RANDOM_PORT + gerçek soket üzerinden
// çalışan WebTestClient ile SecurityMockServerConfigurers.mockOidcLogin() birlikte
// ÇALIŞMIYOR — mutator, mock authentication'ı yereldeki WebHttpHandlerBuilder filter
// zincirine enjekte ediyor, bu da SADECE bindToApplicationContext() (webEnvironment=MOCK)
// ile mevcut; RANDOM_PORT'ta httpHandlerBuilder null kalıyor ve NPE atıyor (doğrulandı).
// MOCK (default), context'i application-context-bound bir WebTestClient'a bağlıyor;
// DynamicPropertySource/Testcontainers ile ilgisi yok, sadece web ortamı seçimi.
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
// NOT: Spring Boot 4'te WebTestClient auto-configuration artık @SpringBootTest için
// otomatik değil, bu annotation'ı gerektiriyor (paket de değişti:
// org.springframework.boot.webtestclient.autoconfigure.AutoConfigureWebTestClient) —
// brief'in yazıldığı sıradaki varsayım Boot 3.x davranışıydı, düzeltildi.
@AutoConfigureWebTestClient
class LogoutSecurityConfigTest {

    // NOT: Brief'te yoktu, ama gerekli — SecurityMockServerConfigurers.mockOidcLogin()
    // gibi per-request mutator'lar sadece exchange attribute'una bir SecurityContext
    // supplier'ı YAZAR; bunu asıl ReactiveSecurityContextHolder'a yazan filtre
    // (MutatorFilter) YALNIZCA SecurityMockServerConfigurers.springSecurity() ile
    // kurulur. Boot'un WebTestClientAutoConfiguration'ı context'teki tüm
    // MockServerConfigurer bean'lerini otomatik toplayıp uyguluyor (bkz.
    // WebTestClientAutoConfiguration#webTestClient(..., List<MockServerConfigurer>)),
    // bu yüzden burada bir bean olarak expose etmek yeterli — onsuz mockOidcLogin()
    // sessizce hiçbir şey yapmıyor ve istekler anonymous olarak işleniyordu (doğrulandı).
    @TestConfiguration
    static class SecurityTestConfig {
        @Bean
        MockServerConfigurer springSecurity() {
            return SecurityMockServerConfigurers.springSecurity();
        }
    }

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
        // NOT: GET artık LogoutWebFilter tarafından yakalanmıyor (matcher POST-only),
        // ve eskiden bu yüzden /api/auth/logout GatewayProxyController'ın
        // @RequestMapping("/api/**") catch-all'ına düşüp (bkz. GatewayProxyController
        // — bilinçli olarak DOKUNULMADI, global kısıt gereği) izole test ortamında
        // (gateway-server/Eureka yok) load-balanced WebClient'ın bulamadığı bir
        // instance nedeniyle belirsiz bir 503 dönüyordu. Fix: SecurityConfig'in
        // authorizeExchange zincirine GET/PUT/PATCH/DELETE/HEAD /api/auth/logout için
        // açık .denyAll() kuralları eklendi (anyExchange().authenticated()'dan ÖNCE) —
        // artık bu istek proxy'ye HİÇ ULAŞMADAN authorizeExchange katmanında
        // deterministik olarak 403 ile reddediliyor (bkz. AuthorizationWebFilter log:
        // "Authorization failed: Access Denied"), gateway/Eureka'nın ayakta olup
        // olmamasından bağımsız. Bu yüzden artık kesin 403 doğrulanabiliyor.
        webTestClient
                .mutateWith(SecurityMockServerConfigurers.mockOidcLogin())
                .get().uri("/api/auth/logout")
                .exchange()
                .expectStatus().isForbidden();
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
        // NOT: Brief burada `.mutateWith(SecurityMockServerConfigurers.csrf())`
        // kullanıyordu. O mutator kendi BAĞIMSIZ bir CsrfWebFilter'ı zincire ekliyor
        // (app'in gerçek CsrfWebFilter'ından AYRI bir instance) — ikisi de aynı
        // WebSession'a eşzamanlı yazmaya çalışınca (WebSessionServerLogoutHandler'ın
        // invalidate() sonrası) ReactiveRedisSessionRepository "IllegalStateException:
        // Session was invalidated" fırlatıyor ve 500 dönüyordu (doğrulandı — bu, tam
        // olarak spring-projects/spring-session#1399'daki "iki ayrı saveDelta çağrısı
        // aynı delta referansını kullanıyor" sınıfından bir race, ama test'in KENDİ
        // mock CsrfWebFilter'ı ile app'in gerçek CsrfWebFilter'ı arasında). Bunun yerine
        // GERÇEK CSRF akışı kullanılıyor: /api/csrf'ten dönen token + session cookie'si
        // birlikte alınıp logout isteğine taşınıyor — tek bir CsrfWebFilter, tek bir
        // WebSession, race yok; ayrıca bu, testin kendi Türkçe yorumunun tarif ettiği
        // "gerçek" akışa brief'in orijinal koduna göre daha sadık.
        EntityExchangeResult<CsrfTokenResponse> csrfResult = webTestClient
                .mutateWith(SecurityMockServerConfigurers.mockOidcLogin())
                .get().uri("/api/csrf")
                .exchange()
                .expectStatus().isOk()
                .expectBody(CsrfTokenResponse.class)
                .returnResult();

        CsrfTokenResponse csrfToken = csrfResult.getResponseBody();
        assertThat(csrfToken).as("CSRF endpoint bir token dönmeli").isNotNull();

        // NOT: Session cookie'si ham `Cookie` header string'i olarak DEĞİL,
        // WebTestClient'ın kendi `.cookie(name, value)` builder'ı ile taşınıyor —
        // MockServerHttpRequest (bindToApplicationContext ile kurulan bu test client'ı
        // için kullanılan mock request) `.header(HttpHeaders.COOKIE, "...")` ile
        // verilen ham header'ı `request.getCookies()`e PARSE ETMİYOR (gerçek bir HTTP
        // sunucusunun aksine); bu yüzden ham header ile session hiç bulunamıyor,
        // her seferinde YENİ bir WebSession oluşturuluyor ve CSRF kontrolü (yanlış/
        // eksik session nedeniyle) her zaman 403 ile başarısız oluyordu — Redis'te
        // doğru token'ın kayıtlı olduğu doğrulanarak bulundu. `.cookie(...)` builder'ı
        // mock request'e structured cookie olarak ekliyor ve session doğru çözülüyor.
        List<ResponseCookie> sessionCookies = csrfResult.getResponseCookies().values().stream()
                .flatMap(List::stream)
                .toList();
        assertThat(sessionCookies)
                .as("GET /api/csrf bir session cookie'si set etmeli")
                .isNotEmpty();

        WebTestClient.RequestHeadersSpec<?> logoutRequest = webTestClient
                .mutateWith(SecurityMockServerConfigurers.mockOidcLogin())
                .post().uri("/api/auth/logout")
                .header(csrfToken.headerName(), csrfToken.token());
        for (ResponseCookie cookie : sessionCookies) {
            logoutRequest = logoutRequest.cookie(cookie.getName(), cookie.getValue());
        }

        logoutRequest.exchange().expectStatus().is3xxRedirection();

        assertThat(redisTemplate.keys("parena:bff:session:*").collectList().block())
                .as("logout sonrası Redis'te bu session'a ait hiçbir key kalmamalı")
                .isEmpty();
    }

    // NOT (FIX 4 araştırması — final review sonrası düzeltme dalgası): Burada
    // "logout sonrası ESKİ session cookie'siyle korumalı bir endpoint'e artık
    // authenticate OLUNAMIYOR" iddiasını kanıtlayan bir test eklenmesi denendi,
    // ancak ampirik olarak doğrulandı ki bu test harness'inde YAPILAMAZ:
    // `SecurityMockServerConfigurers.mockOidcLogin()` mock authentication'ı
    // SADECE per-request reactor context'ine yazıyor; gerçek
    // WebSessionServerSecurityContextRepository.save() akışını TETİKLEMİYOR.
    // Doğrulama: mockOidcLogin() ile GET /api/csrf çağrıldıktan sonra dönen
    // session cookie'siyle (mockOidcLogin() OLMADAN) tekrar GET /api/csrf
    // çağrıldığında 302 (oauth2 authorization redirect'i, yani "unauthenticated")
    // dönüyor — yani mock harness'te WebSession'a hiçbir zaman GERÇEK bir
    // SecurityContext yazılmıyor, dolayısıyla "logout sonrası eski session
    // artık authenticate edemiyor" testi burada anlamsız olurdu: session zaten
    // (mock authentication kaldırıldığı anda) baştan authenticate edemiyor —
    // logout'un invalidation'ının bir sonucu değil. Bu nedenle FIX 4 bu PR'da
    // ADDRESSED EDİLMEDİ; gerçek bir kanıt için ya (a) gerçek bir
    // OAuth2AuthorizedClient/SecurityContext'i testte WebSession'a manuel olarak
    // yazan bir yardımcı, ya da (b) tam entegrasyon ortamı (gerçek Keycloak)
    // gerekir — ikisi de bu fix dalgasının kapsamı dışında bırakıldı.
}
