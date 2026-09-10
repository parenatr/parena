package com.parena.bffserver.config;

import com.parena.bffserver.security.EmailVerificationSyncHandler;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.client.oidc.web.server.logout.OidcClientInitiatedServerLogoutSuccessHandler;
import org.springframework.security.oauth2.client.registration.ReactiveClientRegistrationRepository;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.authentication.logout.ServerLogoutSuccessHandler;
import org.springframework.security.web.server.csrf.CookieServerCsrfTokenRepository;
import org.springframework.security.web.server.csrf.ServerCsrfTokenRequestAttributeHandler;
import org.springframework.security.web.server.util.matcher.ServerWebExchangeMatchers;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    private final String frontendBaseUrl;
    private final String websiteBaseUrl;

    public SecurityConfig(@Value("${app.frontend-base-url}") String frontendBaseUrl,
                          @Value("${app.website-base-url}") String websiteBaseUrl) {
        this.frontendBaseUrl = frontendBaseUrl;
        this.websiteBaseUrl = websiteBaseUrl;
    }

    // Zincir 1: SADECE register path'i. CSRF ve authentication tamamen kapalı —
    // kimliksiz bir kullanıcının çalınacak bir session'ı yok, koruma anlamsız.
    // ÖNEMLİ: Bu zincir kendi dar kapsamlı CORS kaynağını (registerCors) kullanır,
    // authenticated akışın CORS kaynağıyla (defaultCors) KARIŞTIRILMAZ. Böylece
    // marketing origin'i (parena.com.tr) sadece register'a güvenilir olur; session/
    // cookie/credential taşıyan hiçbir endpoint'e bu origin'den erişim açılmaz.
    @Bean
    @Order(1)
    public SecurityWebFilterChain registerFilterChain(
            ServerHttpSecurity http,
            @Qualifier("registerCorsConfigurationSource") CorsConfigurationSource registerCorsConfigurationSource) {
        return http
                .securityMatcher(ServerWebExchangeMatchers.pathMatchers(HttpMethod.POST, "/api/v1/users/register"))
                .cors(cors -> cors.configurationSource(registerCorsConfigurationSource))
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .authorizeExchange(exchange -> exchange.anyExchange().permitAll())
                .build();
    }

    // Zincir 2: geri kalan HER ŞEY. CSRF açık, login/logout/authorization burada.
    @Bean
    @Order(2)
    public SecurityWebFilterChain defaultFilterChain(
            ServerHttpSecurity http,
            ReactiveClientRegistrationRepository clientRegistrationRepository,
            EmailVerificationSyncHandler emailVerificationSyncHandler,
            @Qualifier("defaultCorsConfigurationSource") CorsConfigurationSource defaultCorsConfigurationSource) {

        ServerCsrfTokenRequestAttributeHandler csrfAttributeHandler = new ServerCsrfTokenRequestAttributeHandler();

        return http
                .cors(cors -> cors.configurationSource(defaultCorsConfigurationSource))
                .csrf(csrf -> csrf
                        .csrfTokenRepository(CookieServerCsrfTokenRepository.withHttpOnlyFalse())
                        .csrfTokenRequestHandler(csrfAttributeHandler))
                .addFilterAfter(new CsrfCookieWebFilter(), SecurityWebFiltersOrder.CSRF)
                .authorizeExchange(exchanges -> exchanges
                        .pathMatchers("/actuator/health", "/api/auth/me").permitAll()
                        .anyExchange().authenticated())
                .oauth2Login(oauth2 -> oauth2.authenticationSuccessHandler(emailVerificationSyncHandler))
                .logout(logout -> logout
                        .requiresLogout(ServerWebExchangeMatchers.pathMatchers("/api/auth/logout"))
                        .logoutSuccessHandler(oidcLogoutSuccessHandler(clientRegistrationRepository)))
                .build();
    }

    private ServerLogoutSuccessHandler oidcLogoutSuccessHandler(
            ReactiveClientRegistrationRepository clientRegistrationRepository) {

        var handler = new OidcClientInitiatedServerLogoutSuccessHandler(clientRegistrationRepository);

        // Keycloak oturumu kapandıktan sonra döneceği frontend adresi
        handler.setPostLogoutRedirectUri(this.frontendBaseUrl + "/giris");

        return handler;
    }

    // Sadece register endpoint'i için: marketing origin (parena.com.tr) güvenilir,
    // credential YOK (register'da henüz cookie/session söz konusu değil), method
    // sadece POST+OPTIONS. Bilinçli olarak dar tutuldu.
    @Bean
    public CorsConfigurationSource registerCorsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(this.websiteBaseUrl));
        config.setAllowedMethods(List.of("POST", "OPTIONS"));
        config.setAllowedHeaders(List.of("Content-Type"));
        config.setAllowCredentials(false);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/v1/users/register", config);
        return source;
    }

    // Authenticated akışın tamamı için: SADECE app.parena.com.tr güvenilir,
    // credential VAR (session cookie taşınır). Bu kaynak marketing origin'i
    // TANIMAZ — register dışındaki hiçbir endpoint'e parena.com.tr'den
    // credential'lı erişim açılmaz.
    @Bean
    public CorsConfigurationSource defaultCorsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(this.frontendBaseUrl));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}