package com.parena.userservice.web.controller;

import com.parena.userservice.application.usecase.RegisterUserUseCase;
import com.parena.userservice.application.usecase.RevokeAllSessionsUseCase;
import com.parena.userservice.domain.aggregate.root.User;
import com.parena.userservice.web.dto.request.RegisterUserRequest;
import com.parena.userservice.web.dto.response.RegisteredUserResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@Validated
public class UserController {

    private final RegisterUserUseCase registerUserUseCase;
    private final RevokeAllSessionsUseCase revokeAllSessionsUseCase;

    public UserController(RegisterUserUseCase registerUserUseCase,
                          RevokeAllSessionsUseCase revokeAllSessionsUseCase) {
        this.registerUserUseCase = registerUserUseCase;
        this.revokeAllSessionsUseCase = revokeAllSessionsUseCase;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public RegisteredUserResponse register(@Valid @RequestBody RegisterUserRequest registerRequest) {
        User user = registerUserUseCase.register(
                registerRequest.firstName(),
                registerRequest.lastName(),
                registerRequest.email(),
                registerRequest.password());

        return new RegisteredUserResponse(
                user.getUserId().value(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName());
    }

    /**
     * Kullanıcının Keycloak'taki TÜM SSO session'larını ve refresh token'larını
     * sunucu tarafında geçersiz kılar (bkz. {@link RevokeAllSessionsUseCase}).
     *
     * ÖNEMLİ: Bu, ÇAĞIRAN cihazın kendi bff-server/Redis WebSession'ını
     * SONLANDIRMAZ — sadece Keycloak SSO session'larını/refresh token'larını
     * etkiler. Çağıran cihazın kendi oturumunu da kapatmak için bu endpoint'e
     * ek olarak normal logout akışı (POST /api/auth/logout) ayrıca
     * tetiklenmelidir. Bu endpoint'in frontend'den çağrılması bu görevin
     * kapsamı dışında bırakıldı (bkz. plan Task 6 Step 8).
     */
    @PostMapping("/me/sessions/revoke-all")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void revokeAllSessions(@AuthenticationPrincipal Jwt jwt) {
        // "sub" claim, JWT'yi doğrulayan resource server tarafından garanti
        // edilir — çağıran kullanıcı başka bir userId'yi HİÇBİR ŞEKİLDE
        // parametre olarak veremez, bu yüzden ek bir "kendi hesabı mı"
        // kontrolüne gerek yok.
        revokeAllSessionsUseCase.revokeAll(UUID.fromString(jwt.getSubject()));
    }
}
