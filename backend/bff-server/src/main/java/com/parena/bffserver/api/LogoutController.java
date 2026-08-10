package com.parena.bffserver.api;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ReactiveClientRegistrationRepository;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.WebSession;
import reactor.core.publisher.Mono;

@RestController
public class LogoutController {

    private final ReactiveClientRegistrationRepository clientRegistrationRepository;
    private final String frontendBaseUrl;

    public LogoutController(ReactiveClientRegistrationRepository clientRegistrationRepository,
                            @Value("${app.frontend-base-url}") String frontendBaseUrl) {
        this.clientRegistrationRepository = clientRegistrationRepository;
        this.frontendBaseUrl = frontendBaseUrl;
    }

    @PostMapping("/api/auth/logout")
    public Mono<LogoutResponse> logout(WebSession session) {
        return ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .cast(OAuth2AuthenticationToken.class)
                .map(auth -> (OidcUser) auth.getPrincipal())
                .map(OidcUser::getIdToken)
                .flatMap(idToken -> clientRegistrationRepository.findByRegistrationId("keycloak")
                        .map(ClientRegistration::getProviderDetails)
                        .map(details -> details.getConfigurationMetadata().get("end_session_endpoint"))
                        .cast(String.class)
                        .map(endSessionEndpoint -> endSessionEndpoint
                                + "?id_token_hint=" + idToken.getTokenValue()
                                + "&post_logout_redirect_uri=" + frontendBaseUrl))
                .flatMap(keycloakLogoutUrl -> session.invalidate().thenReturn(new LogoutResponse(keycloakLogoutUrl)))
                .defaultIfEmpty(new LogoutResponse(frontendBaseUrl));
    }

    public record LogoutResponse(String redirectUrl) {}
}