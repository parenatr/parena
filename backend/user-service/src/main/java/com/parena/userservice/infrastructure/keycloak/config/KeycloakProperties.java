package com.parena.userservice.infrastructure.keycloak.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Keycloak configuration properties.
 * Values provides by human via environment variables.
 */
@Configuration
@ConfigurationProperties(prefix = "keycloak")
public class KeycloakProperties {

    private String realm;
    private String authServerUrl;
    private String adminClientId;
    private String adminClientSecret;
    private String clientId = "bff-server";  // redirect doğrulaması için
    private String emailVerifiedRedirectUri; // ${SO_FRONTEND_BASE_URL}/email-dogrulandi

    public KeycloakProperties() {
    }

    public KeycloakProperties(String realm, String adminClientId, String adminClientSecret,
                              String authServerUrl, String clientId, String emailVerifiedRedirectUri) {
        this.realm = realm;
        this.adminClientId = adminClientId;
        this.adminClientSecret = adminClientSecret;
        this.authServerUrl = authServerUrl;
        this.clientId = clientId;
        this.emailVerifiedRedirectUri = emailVerifiedRedirectUri;
    }

    public String getRealm() {
        return realm;
    }

    public void setRealm(String realm) {
        this.realm = realm;
    }

    public String getAdminClientId() {
        return adminClientId;
    }

    public void setAdminClientId(String adminClientId) {
        this.adminClientId = adminClientId;
    }

    public String getAdminClientSecret() {
        return adminClientSecret;
    }

    public void setAdminClientSecret(String adminClientSecret) {
        this.adminClientSecret = adminClientSecret;
    }

    public String getAuthServerUrl() {
        return authServerUrl;
    }

    public void setAuthServerUrl(String authServerUrl) {
        this.authServerUrl = authServerUrl;
    }

    public String getClientId() {
        return clientId;
    }

    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    public String getEmailVerifiedRedirectUri() {
        return emailVerifiedRedirectUri;
    }

    public void setEmailVerifiedRedirectUri(String emailVerifiedRedirectUri) {
        this.emailVerifiedRedirectUri = emailVerifiedRedirectUri;
    }
}
