package com.parena.bffserver.api;

import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ReactiveClientRegistrationRepository;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.WebSession;
import reactor.core.publisher.Mono;

@RestController
public class LogoutController {

    private final ReactiveClientRegistrationRepository clientRegistrationRepository;
    private final String frontendBaseUrl;

    public LogoutController(ReactiveClientRegistrationRepository clientRegistrationRepository,
                            @org.springframework.beans.factory.annotation.Value("${app.frontend-base-url}") String frontendBaseUrl) {
        this.clientRegistrationRepository = clientRegistrationRepository;
        this.frontendBaseUrl = frontendBaseUrl;
    }

    @PostMapping("/api/auth/logout")
    public Mono<LogoutResponse> logout(Mono<OAuth2User> principal, WebSession session) {
        return principal
                .cast(OidcUser.class)
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