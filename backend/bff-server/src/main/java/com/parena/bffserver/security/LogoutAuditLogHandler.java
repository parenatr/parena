package com.parena.bffserver.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.web.server.WebFilterExchange;
import org.springframework.security.web.server.authentication.logout.ServerLogoutHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.server.WebSession;
import reactor.core.publisher.Mono;

// KVKK/SPK audit kuralı: logout event'i loglanır ama PII TAŞIMAZ — yalnızca
// Keycloak sub (UUID) + Redis WebSession id + zaman damgası. Bu handler,
// SecurityContext ve WebSession HALA MEVCUTKEN (invalidation'dan ÖNCE)
// zincirin ilk halkası olarak çalışmalı; aksi halde loglanacak userId kaybolur.
@Component
public class LogoutAuditLogHandler implements ServerLogoutHandler {

    private static final Logger log = LoggerFactory.getLogger(LogoutAuditLogHandler.class);

    @Override
    public Mono<Void> logout(WebFilterExchange exchange, Authentication authentication) {
        return exchange.getExchange().getSession()
                .map(WebSession::getId)
                .defaultIfEmpty("unknown")
                .doOnNext(sessionId -> log.info("logout event: userId={} sessionId={}",
                        resolveUserId(authentication), sessionId))
                .then();
    }

    private String resolveUserId(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof OidcUser oidcUser) {
            return oidcUser.getSubject();
        }
        return "unknown";
    }
}
