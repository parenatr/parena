package com.parena.userservice.infrastructure.keycloak.exception;

public class EmailAlreadyRegisteredException extends RuntimeException {
    public EmailAlreadyRegisteredException(String email) {
        super("Bu email adresi zaten kayıtlı: " + email);
    }
}
