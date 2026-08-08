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

    public KeycloakProperties() {
    }

    public KeycloakProperties(String realm, String adminClientId, String adminClientSecret, String authServerUrl) {
        this.realm = realm;
        this.adminClientId = adminClientId;
        this.adminClientSecret = adminClientSecret;
        this.authServerUrl = authServerUrl;
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
}
