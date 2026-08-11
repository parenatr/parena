package com.parena.bffserver.api;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.OAuth2AuthorizeRequest;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.ReactiveOAuth2AuthorizedClientManager;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.net.URI;
import java.util.Set;

@Component
public class GatewayProxyHandler {

    private static final Set<String> HOP_BY_HOP_HEADERS = Set.of(
            "connection", "keep-alive", "transfer-encoding", "upgrade",
            "proxy-authenticate", "proxy-authorization", "te", "trailer", "host");

    private final WebClient webClient;
    private final ReactiveOAuth2AuthorizedClientManager authorizedClientManager;
    private final String gatewayBaseUrl;

    public GatewayProxyHandler(WebClient.Builder webClientBuilder,
                               ReactiveOAuth2AuthorizedClientManager authorizedClientManager,
                               @Value("${app.gateway-base-url}") String gatewayBaseUrl) {
        this.webClient = webClientBuilder.build();
        this.authorizedClientManager = authorizedClientManager;
        this.gatewayBaseUrl = gatewayBaseUrl;
    }

    public Mono<ResponseEntity<byte[]>> forward(ServerWebExchange exchange, Mono<Authentication> authenticationMono) {
        URI targetUri = buildTargetUri(exchange);
        HttpMethod method = exchange.getRequest().getMethod();

        return authenticationMono
                .flatMap(this::resolveAccessToken)
                .defaultIfEmpty("")
                .flatMap(token -> webClient.method(method)
                        .uri(targetUri)
                        .headers(headers -> copyForwardableHeaders(exchange.getRequest().getHeaders(), headers, token))
                        .body(BodyInserters.fromDataBuffers(exchange.getRequest().getBody()))
                        .exchangeToMono(response -> response.toEntity(byte[].class)));
    }

    private URI buildTargetUri(ServerWebExchange exchange) {
        String path = exchange.getRequest().getURI().getRawPath();
        String query = exchange.getRequest().getURI().getRawQuery();
        return URI.create(gatewayBaseUrl + path + (query != null ? "?" + query : ""));
    }

    private Mono<String> resolveAccessToken(Authentication authentication) {
        OAuth2AuthorizeRequest request = OAuth2AuthorizeRequest
                .withClientRegistrationId("keycloak")
                .principal(authentication)
                .build();
        return authorizedClientManager.authorize(request)
                .map(OAuth2AuthorizedClient::getAccessToken)
                .map(token -> token.getTokenValue());
    }

    private void copyForwardableHeaders(HttpHeaders source, HttpHeaders target, String bearerToken) {
        source.forEach((name, values) -> {
            if (!HOP_BY_HOP_HEADERS.contains(name.toLowerCase())) {
                target.addAll(name, values);
            }
        });
        if (!bearerToken.isBlank()) {
            target.setBearerAuth(bearerToken);
        }
    }
}