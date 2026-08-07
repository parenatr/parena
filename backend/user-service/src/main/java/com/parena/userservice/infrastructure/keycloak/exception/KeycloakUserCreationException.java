package com.parena.userservice.infrastructure.keycloak.exception;

public class KeycloakUserCreationException extends RuntimeException {
    public KeycloakUserCreationException(String message) {
        super(message);
    }
}
