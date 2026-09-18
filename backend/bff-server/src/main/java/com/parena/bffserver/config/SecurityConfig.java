package com.parena.bffserver.config;

import com.parena.bffserver.security.EmailVerificationSyncHandler;
import com.parena.bffserver.security.LogoutAuditLogHandler;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.client.oidc.web.server.logout.OidcClientInitiatedServerLogoutSuccessHandler;
import org.springframework.security.oauth2.client.registration.ReactiveClientRegistrationRepository;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.authentication.logout.DelegatingServerLogoutHandler;
import org.springframework.security.web.server.authentication.logout.SecurityContextServerLogoutHandler;
import org.springframework.security.web.server.authentication.logout.ServerLogoutSuccessHandler;
import org.springframework.security.web.server.authentication.logout.WebSessionServerLogoutHandler;
import org.springframework.security.web.server.csrf.ServerCsrfTokenRequestAttributeHandler;
import org.springframework.security.web.server.csrf.WebSessionServerCsrfTokenRepository;
import org.springframework.security.web.server.util.matcher.OrServerWebExchangeMatcher;
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
                // ÖNEMLİ: Sadece POST eşlenirse tarayıcının CORS preflight'ı (OPTIONS metodu)
                // bu zincire hiç girmez, defaultFilterChain'e düşer ve orada
                // anyExchange().authenticated() kuralına takılıp 403 döner. Preflight
                // hiçbir zaman kimlik doğrulama bilgisi taşımaz, bu yüzden OPTIONS'ı da
                // burada, aynı permitAll zincirinde eşlemek zorunludur.
                .securityMatcher(new OrServerWebExchangeMatcher(
                        ServerWebExchangeMatchers.pathMatchers(HttpMethod.POST, "/api/v1/users/register"),
                        ServerWebExchangeMatchers.pathMatchers(HttpMethod.OPTIONS, "/api/v1/users/register")
                ))
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
            LogoutAuditLogHandler logoutAuditLogHandler,
            @Qualifier("defaultCorsConfigurationSource") CorsConfigurationSource defaultCorsConfigurationSource) {

        ServerCsrfTokenRequestAttributeHandler csrfAttributeHandler = new ServerCsrfTokenRequestAttributeHandler();

        return http
                .cors(cors -> cors
                        .configurationSource(defaultCorsConfigurationSource))
                .csrf(csrf -> csrf
                        .csrfTokenRepository(new WebSessionServerCsrfTokenRepository())
                        .csrfTokenRequestHandler(csrfAttributeHandler))
                .authorizeExchange(exchanges -> exchanges
                        .pathMatchers("/actuator/health", "/api/auth/me").permitAll()
                        .anyExchange().authenticated())
                .oauth2Login(oauth2 -> oauth2
                        .authenticationSuccessHandler(emailVerificationSyncHandler))
                .logout(logout -> logout
                        // ÖNEMLİ: metod belirtilmezse GET dahil her HTTP metodu logout'u
                        // tetikleyebilir (logout-CSRF / prefetch riski) — register chain'deki
                        // HttpMethod.POST pattern'iyle tutarlı hale getirildi.
                        .requiresLogout(ServerWebExchangeMatchers.pathMatchers(HttpMethod.POST, "/api/auth/logout"))
                        // Sıra kritik: audit log SecurityContext hâlâ mevcutken çalışmalı.
                        // NOT (brief'ten gerekçeli sapma): Planın orijinal Step 6'sı
                        // WebSessionServerLogoutHandler'ı BU zincirin (logoutHandler) içine,
                        // en sona koyuyordu. Test sırasında bulundu: ServerHttpSecurity'nin
                        // CsrfSpec'i (.csrf(...) bu zincirde aktif olduğu için), .build()
                        // zamanında KENDİ CsrfServerLogoutHandler'ını logout handler listesinin
                        // EN SONUNA, yazdığımız sıradan TAMAMEN BAĞIMSIZ OLARAK ekliyor
                        // (ServerHttpSecurity$CsrfSpec#configure — bkz. spring-security
                        // kaynağı). O handler, session'daki CSRF token'ını temizlemek için
                        // WebSessionServerCsrfTokenRepository.saveToken(exchange, null)
                        // çağırıyor; bu da KOŞULSUZ olarak WebSession.changeSessionId()
                        // tetikliyor. WebSessionServerLogoutHandler burada (bizim zincirimizde)
                        // olduğunda, CsrfSpec'in handler'ı ondan SONRA (session zaten invalidate
                        // edilmiş/Redis'ten silinmişken) çalışıyor ve
                        // ReactiveRedisSessionRepository "IllegalStateException: Session was
                        // invalidated" fırlatıp 500 döndürüyor — handler sırasını değiştirmek
                        // (brief'in kendi yorumunun önerdiği gibi) bunu ÇÖZMÜYOR, çünkü
                        // CsrfSpec'in eklediği handler HER ZAMAN bizim TÜM listemizden sonra
                        // çalışıyor (doğrulandı: WebSessionServerLogoutHandler tek başına,
                        // SecurityContextServerLogoutHandler ve LogoutAuditLogHandler
                        // olmadan bile denendi, aynı hata). Bu, framework seviyesinde bilinen
                        // bir sınırlama (bkz. spring-projects/spring-security#11271 — bir
                        // maintainer/rwinch tarafından "incorrect ordering" olarak
                        // etiketlenmiş ama gerçek kök neden sonraki yorumda/johnnywalker
                        // tarafından CsrfSpec'in eklediği handler olarak teşhis edilmiş,
                        // issue "invalid" kapatılmış ama düzeltilmemiş). ÇÖZÜM: WebSession
                        // invalidation'ı logoutHandler zincirinden ÇIKARIP logoutSuccessHandler
                        // aşamasına taşıdık (aşağıdaki invalidateWebSessionThenRedirect) —
                        // böylece SecurityContext + (CsrfSpec'in eklediği) Csrf temizliği
                        // TAMAMEN biterken session hâlâ geçerli, WebSession invalidation ise
                        // gerçekten hiçbir şeyin artık ona dokunmayacağı, logout akışının
                        // mantıksal EN SONUNDA çalışıyor — davranış (audit → context temizliği
                        // → Redis'ten silme, sonra yönlendirme) brief'in istediğiyle aynı.
                        .logoutHandler(new DelegatingServerLogoutHandler(
                                logoutAuditLogHandler,
                                new SecurityContextServerLogoutHandler()))
                        .logoutSuccessHandler(invalidateWebSessionThenRedirect(
                                oidcLogoutSuccessHandler(clientRegistrationRepository))))
                .build();
    }

    private ServerLogoutSuccessHandler oidcLogoutSuccessHandler(
            ReactiveClientRegistrationRepository clientRegistrationRepository) {

        var handler = new OidcClientInitiatedServerLogoutSuccessHandler(clientRegistrationRepository);

        // Keycloak oturumu kapandıktan sonra döneceği frontend adresi
        handler.setPostLogoutRedirectUri(this.websiteBaseUrl);

        return handler;
    }

    // Redis-backed WebSession'ı gerçekten invalidate eden adım — bkz. yukarıdaki
    // uzun NOT. Delege edilen success handler (OIDC redirect) WebSession'a hiç
    // dokunmadığı için (sadece Authentication parametresinden idToken okur ve
    // ClientRegistrationRepository'den bakar), invalidation'ı ondan hemen önce
    // yapmak güvenli — invalidation'dan SONRA session'a erişen hiçbir kod yok.
    private ServerLogoutSuccessHandler invalidateWebSessionThenRedirect(ServerLogoutSuccessHandler delegate) {
        WebSessionServerLogoutHandler webSessionServerLogoutHandler = new WebSessionServerLogoutHandler();
        return (exchange, authentication) -> webSessionServerLogoutHandler.logout(exchange, authentication)
                .then(delegate.onLogoutSuccess(exchange, authentication));
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