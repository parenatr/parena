package com.parena.bffserver.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.webtestclient.autoconfigure.AutoConfigureWebTestClient;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpHeaders;
import org.springframework.security.test.web.reactive.server.SecurityMockServerConfigurers;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.reactive.server.MockServerConfigurer;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

import java.net.URI;

import static org.assertj.core.api.Assertions.assertThat;

// bff-token-architecture.md §1: "MUST — Authorization Code Grant + PKCE is used...
// it is mandatory in bff-server" — confidential client olsa da bilinçli olarak
// zorunlu kılınıyor (CSRF'e ek koruma + authorization code injection savunması,
// RFC 9700 §2.1.1/§4.5.3.1). Aynı MOCK/@AutoConfigureWebTestClient/Testcontainers
// pattern'i LogoutSecurityConfigTest ile aynı (bkz. o dosyadaki gerekçe notları).
@Testcontainers
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureWebTestClient
class PkceAuthorizationRequestTest {

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
    void authorizationRequestToConfidentialClientIncludesPkceCodeChallenge() {
        String location = webTestClient
                .get().uri("/oauth2/authorization/keycloak")
                .exchange()
                .expectStatus().is3xxRedirection()
                .returnResult(Void.class)
                .getResponseHeaders()
                .getFirst(HttpHeaders.LOCATION);

        assertThat(location).as("login redirect'i bir Location header taşımalı").isNotNull();

        URI redirectUri = URI.create(location);
        assertThat(redirectUri.getQuery())
                .as("bff-token-architecture.md §1 MUST: PKCE confidential client için de zorunlu")
                .contains("code_challenge=")
                .contains("code_challenge_method=S256");
    }
}
