package com.parena.bffserver.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.webtestclient.autoconfigure.AutoConfigureWebTestClient;
import org.springframework.context.annotation.Bean;
import org.springframework.security.test.web.reactive.server.SecurityMockServerConfigurers;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.reactive.server.MockServerConfigurer;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

import static org.assertj.core.api.Assertions.assertThat;

@Testcontainers
// NOT: Brief RANDOM_PORT ile yazılmıştı; Task 3'te (LogoutSecurityConfigTest) doğrulandığı
// üzere RANDOM_PORT + gerçek soket üzerinden çalışan WebTestClient ile
// SecurityMockServerConfigurers.mockOidcLogin() birlikte ÇALIŞMIYOR (NPE) — mutator sadece
// bindToApplicationContext() (webEnvironment=MOCK) ile kurulan WebTestClient'ta çalışıyor.
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
// NOT: Spring Boot 4'te WebTestClient auto-configuration'ı @SpringBootTest için otomatik
// değil, bu annotation gerekiyor (paket de değişti — bkz. LogoutSecurityConfigTest).
@AutoConfigureWebTestClient
class SessionCookieSecurityTest {

    // NOT: LogoutSecurityConfigTest'te olduğu gibi gerekli — mockOidcLogin() gibi
    // per-request mutator'ların asıl ReactiveSecurityContextHolder'a yazılması için
    // SecurityMockServerConfigurers.springSecurity() context'e bean olarak eklenmeli.
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
