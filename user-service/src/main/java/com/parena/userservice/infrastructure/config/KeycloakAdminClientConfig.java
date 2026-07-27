package com.parena.userservice.infrastructure.config;

import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * keycloak sunucusuna bağlandık.
 * Keycloak sunucusuyla iletişim kurmak için kullanılan bir
 * Keycloak client builder sağlar.
 */
@Configuration
public class KeycloakAdminClientConfig {

    @Bean
    public Keycloak keycloakAdminClient(KeycloakProperties properties) {
        return KeycloakBuilder.builder()
                .serverUrl(properties.getAuthServerUrl())
                .realm(properties.getRealm())
                .grantType(OAuth2Constants.CLIENT_CREDENTIALS)
                .clientId(properties.getAdminClientId())
                .clientSecret(properties.getAdminClientSecret())
                .build();

    }
}
