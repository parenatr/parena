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
