package com.parena.bffserver.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.OAuth2AuthorizeRequest;
import org.springframework.security.oauth2.client.ReactiveOAuth2AuthorizedClientManager;
import org.springframework.security.web.server.WebFilterExchange;
import org.springframework.security.web.server.authentication.RedirectServerAuthenticationSuccessHandler;
import org.springframework.security.web.server.authentication.ServerAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Component
public class EmailVerificationSyncHandler implements ServerAuthenticationSuccessHandler {

    private static final Logger log = LoggerFactory.getLogger(EmailVerificationSyncHandler.class);

    private final WebClient webClient;
    private final ReactiveOAuth2AuthorizedClientManager authorizedClientManager;
    private final ServerAuthenticationSuccessHandler delegate;
    private final String gatewayBaseUrl;

    public EmailVerificationSyncHandler(WebClient.Builder webClientBuilder,
                                        ReactiveOAuth2AuthorizedClientManager authorizedClientManager,
                                        @Value("${app.frontend-base-url}") String frontendBaseUrl,
                                        @Value("${app.gateway-base-url}") String gatewayBaseUrl) {
        this.webClient = webClientBuilder.build();
        this.authorizedClientManager = authorizedClientManager;
        this.delegate = new RedirectServerAuthenticationSuccessHandler(frontendBaseUrl);
        this.gatewayBaseUrl = gatewayBaseUrl;
    }

    @Override
    public Mono<Void> onAuthenticationSuccess(WebFilterExchange exchange, Authentication authentication) {
        OAuth2AuthorizeRequest request = OAuth2AuthorizeRequest
                .withClientRegistrationId("keycloak")
                .principal(authentication)
                .build();

        return authorizedClientManager.authorize(request)
                .flatMap(client -> webClient.post()
                        .uri(gatewayBaseUrl + "/api/v1/users/me/sync-email-verification")
                        .headers(h -> h.setBearerAuth(client.getAccessToken().getTokenValue()))
                        .retrieve()
                        .toBodilessEntity())
                .doOnError(e -> log.warn("Email verification senkronizasyonu başarısız, login yine de devam ediyor", e))
                .onErrorResume(e -> Mono.empty())
                .then(delegate.onAuthenticationSuccess(exchange, authentication));
    }
}