package com.parena.bffserver.api;

import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
public class SessionController {

    @GetMapping("/api/auth/me")
    public Mono<ResponseEntity<SessionUserResponse>> me(Mono<OAuth2User> principal) {
        return principal
                .map(user -> {
                    OidcUser oidcUser = (OidcUser) user;
                    List<String> roles = oidcUser.getClaimAsStringList("realm_access.roles") != null
                            ? oidcUser.getClaimAsStringList("realm_access.roles")
                            : List.of();
                    return ResponseEntity.ok(new SessionUserResponse(
                            oidcUser.getSubject(), oidcUser.getEmail(), roles));
                })
                .defaultIfEmpty(ResponseEntity.status(401).build());
    }

    public record SessionUserResponse(String id, String email, List<String> roles) {}
}