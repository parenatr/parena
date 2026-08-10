package com.parena.userservice.web.controller;

import com.parena.userservice.application.usecase.SyncEmailVerificationUseCase;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users/me")
public class ProfileSyncController {

    private static final Logger log = LoggerFactory.getLogger(ProfileSyncController.class);

    private final SyncEmailVerificationUseCase syncEmailVerificationUseCase;

    public ProfileSyncController(SyncEmailVerificationUseCase syncEmailVerificationUseCase) {
        this.syncEmailVerificationUseCase = syncEmailVerificationUseCase;
    }

    @PostMapping("/sync-email-verification")
    public ResponseEntity<Void> sync() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (!(authentication instanceof JwtAuthenticationToken jwtAuth)) {
            log.warn("sync-email-verification: authentication JWT tipinde değil: {}",
                    authentication != null ? authentication.getClass() : "null");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Jwt jwt = jwtAuth.getToken();
        String sub = jwt.getSubject();

        if (sub == null) {
            log.error("sync-email-verification: JWT'de 'sub' claim'i yok. Ham token: {}", jwt.getTokenValue());
            return ResponseEntity.badRequest().build();
        }

        UUID keycloakId = UUID.fromString(sub);
        boolean emailVerified = Boolean.TRUE.equals(jwt.getClaim("email_verified"));
        syncEmailVerificationUseCase.sync(keycloakId, emailVerified);
        return ResponseEntity.noContent().build();
    }
}