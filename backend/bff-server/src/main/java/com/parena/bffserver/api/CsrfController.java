package com.parena.bffserver.api;

import org.springframework.http.ResponseEntity;
import org.springframework.security.web.server.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

// SPA, session başında bunu çağırıp token'ı memory'de tutar ve her mutasyon
// isteğinde `headerName` ile belirtilen header'a koyar. Cookie'ye YAZILMAZ —
// çünkü frontend (app.parena.com.tr) ile bff-server (api.parena.com.tr) farklı
// origin'ler ve cookie tabanlı double-submit bu senaryoda çalışmaz.
@RestController
public class CsrfController {

    @GetMapping("/api/csrf")
    public Mono<ResponseEntity<CsrfTokenResponse>> csrf(ServerWebExchange exchange) {
        Mono<CsrfToken> tokenMono = exchange.getAttribute(CsrfToken.class.getName());
        if (tokenMono == null) {
            return Mono.just(ResponseEntity.status(500).build());
        }
        return tokenMono.map(token -> ResponseEntity.ok(
                new CsrfTokenResponse(token.getToken(), token.getHeaderName(), token.getParameterName())));
    }

    public record CsrfTokenResponse(String token, String headerName, String parameterName) {}
}