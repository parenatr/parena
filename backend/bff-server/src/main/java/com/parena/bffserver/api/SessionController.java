package com.parena.bffserver.api;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
public class SessionController {

    @GetMapping("/api/auth/me")
    public Mono<ResponseEntity<SessionUserResponse>> me() {
        return ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .cast(OAuth2AuthenticationToken.class)
                .map(auth -> (OidcUser) auth.getPrincipal())
                .map(oidcUser -> {
                    List<String> roles = extractRealmRoles(oidcUser);
                    return ResponseEntity.ok(
                            new SessionUserResponse(oidcUser.getSubject(), oidcUser.getEmail(), roles));
                })
                .defaultIfEmpty(ResponseEntity.status(401).build());
    }

    @SuppressWarnings("unchecked")
    private List<String> extractRealmRoles(OidcUser oidcUser) {
        Object realmAccess = oidcUser.getClaims().get("realm_access");
        if (realmAccess instanceof java.util.Map<?, ?> map) {
            Object roles = map.get("roles");
            if (roles instanceof List<?> list) {
                return (List<String>) list;
            }
        }
        return List.of();
    }

    public record SessionUserResponse(String id, String email, List<String> roles) {}
}