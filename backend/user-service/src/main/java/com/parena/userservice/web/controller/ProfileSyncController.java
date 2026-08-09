package com.parena.userservice.web.controller;

import com.parena.userservice.application.usecase.SyncEmailVerificationUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users/me")
public class ProfileSyncController {

    private final SyncEmailVerificationUseCase syncEmailVerificationUseCase;

    public ProfileSyncController(SyncEmailVerificationUseCase syncEmailVerificationUseCase) {
        this.syncEmailVerificationUseCase = syncEmailVerificationUseCase;
    }

    @PostMapping("/sync-email-verification")
    public ResponseEntity<Void> sync(@AuthenticationPrincipal Jwt jwt) {
        UUID keycloakId = UUID.fromString(jwt.getSubject());
        boolean emailVerified = Boolean.TRUE.equals(jwt.getClaim("email_verified"));
        syncEmailVerificationUseCase.sync(keycloakId, emailVerified);
        return ResponseEntity.noContent().build();
    }
}