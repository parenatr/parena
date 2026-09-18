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
