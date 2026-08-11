package com.parena.bffserver.config;

import com.parena.bffserver.security.EmailVerificationSyncHandler;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.client.oidc.web.server.logout.OidcClientInitiatedServerLogoutSuccessHandler;
import org.springframework.security.oauth2.client.registration.ReactiveClientRegistrationRepository;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.authentication.logout.ServerLogoutSuccessHandler;
import org.springframework.security.web.server.csrf.CookieServerCsrfTokenRepository;
import org.springframework.security.web.server.util.matcher.ServerWebExchangeMatchers;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Value("${app.frontend-base-url}")
    private String frontendBaseUrl;

    // Zincir 1: SADECE register path'i. CSRF ve authentication tamamen kapalı.
    // kimliksiz bir kullanıcının çalınacak bir session'ı yok, koruma anlamsız.
    @Bean
    @Order(1)
    public SecurityWebFilterChain registerFilterChain(
            ServerHttpSecurity http,
            CorsConfigurationSource corsConfigurationSource) {
        http
                .securityMatcher(ServerWebExchangeMatchers.pathMatchers(HttpMethod.POST, "/api/v1/users/register"))
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .authorizeExchange(exchange -> exchange.anyExchange().permitAll());
        return http.build();
    }

    // Zincir 2: geri kalan HER ŞEY. CSRF açık, login/logout/authorization burada.
    @Bean
    @Order(2)
    public SecurityWebFilterChain defaultFilterChain(
            ServerHttpSecurity http,
            ReactiveClientRegistrationRepository clientRegistrationRepository,
            EmailVerificationSyncHandler emailVerificationSyncHandler,
            CorsConfigurationSource corsConfigurationSource ) {

        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .csrf(csrf -> csrf.csrfTokenRepository(CookieServerCsrfTokenRepository.withHttpOnlyFalse()))
                .authorizeExchange(exchanges -> exchanges
                        .pathMatchers("/actuator/health", "/api/auth/me").permitAll()
                        .anyExchange().authenticated())
                .oauth2Login(oauth2 -> oauth2.authenticationSuccessHandler(emailVerificationSyncHandler))
                .logout(logout -> logout
                        .logoutSuccessHandler(oidcLogoutSuccessHandler(clientRegistrationRepository)));

        return http.build();
    }

    // Logout success → redirect to frontendBaseUrl -> ileride login ekranına göndersin
    private ServerLogoutSuccessHandler oidcLogoutSuccessHandler(
            ReactiveClientRegistrationRepository clientRegistrationRepository) {
        var handler = new OidcClientInitiatedServerLogoutSuccessHandler(clientRegistrationRepository);
        handler.setPostLogoutRedirectUri(frontendBaseUrl);
        return handler;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource(@Value("${app.frontend-base-url}") String frontendBaseUrl) {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(frontendBaseUrl));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true); // cookie tabanlı session için ZORUNLU

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}