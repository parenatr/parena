package com.parena.bffserver.api;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@RestController
public class GatewayProxyController {

    private final GatewayProxyHandler gatewayProxyHandler;

    public GatewayProxyController(GatewayProxyHandler gatewayProxyHandler) {
        this.gatewayProxyHandler = gatewayProxyHandler;
    }

    @RequestMapping("/api/**")
    public Mono<ResponseEntity<byte[]>> proxy(ServerWebExchange exchange, Mono<Authentication> authenticationMono) {
        return gatewayProxyHandler.forward(exchange, authenticationMono);
    }
}
