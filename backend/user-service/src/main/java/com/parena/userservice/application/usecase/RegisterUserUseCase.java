package com.parena.userservice.application.usecase;

import com.parena.userservice.application.LocalUserPersister;
import com.parena.userservice.application.exception.UserRegistrationException;
import com.parena.userservice.domain.aggregate.root.User;
import com.parena.userservice.domain.port.UserRepository;
import com.parena.userservice.infrastructure.keycloak.exception.EmailAlreadyRegisteredException;
import com.parena.userservice.infrastructure.keycloak.adapter.KeycloakAdminClientAdapter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@Slf4j
public class RegisterUserUseCase {

    private final UserRepository userRepository;
    private final KeycloakAdminClientAdapter keycloakAdminClientAdapter;
    private final LocalUserPersister localUserPersister;

    public RegisterUserUseCase(UserRepository userRepository, KeycloakAdminClientAdapter keycloakAdminClientAdapter, LocalUserPersister localUserPersister) {
        this.userRepository = userRepository;
        this.keycloakAdminClientAdapter = keycloakAdminClientAdapter;
        this.localUserPersister = localUserPersister;
    }

    public User register(String firstName, String lastName, String email, String password) {

        if (userRepository.existsByEmail(email)) {
            throw new EmailAlreadyRegisteredException(email);
        }

        User user = User.create(firstName, lastName, email, Instant.now());

        UUID keycloakId = keycloakAdminClientAdapter.createUser(firstName, lastName, email, password, user.getRoles());
        user.linkToKeycloakIdentity(keycloakId);

        // Rol atama ve local persist artık aynı telafi bloğu altında —
        // ikisinden biri başarısız olursa Keycloak kullanıcısı geri alınır.
        try {
            keycloakAdminClientAdapter.assignRealmRoles(keycloakId, user.getRoles());
            localUserPersister.persist(user);
        } catch (Exception e) {
            log.error("Rol atama veya local persist başarısız, Keycloak kullanıcısı geri alınıyor: keycloakId={}", keycloakId, e);
            try {
                keycloakAdminClientAdapter.deleteUser(keycloakId);
            } catch (Exception compensationFailure) {
                log.error("KRİTİK: Telafi eylemi de başarısız. Yetim Keycloak kullanıcısı: keycloakId={}",
                        keycloakId, compensationFailure);
            }
            throw new UserRegistrationException("Kayıt tamamlanamadı, lütfen tekrar deneyin.", e);
        }
        // Best-effort: başarısız olursa kaydı geri almıyoruz, sadece logluyoruz.
        try {
            keycloakAdminClientAdapter.sendVerificationEmail(keycloakId);
        } catch (Exception e) {
            log.warn("Doğrulama maili gönderilemedi, kullanıcı yine de kaydedildi: keycloakId={}", keycloakId, e);
        }

        return user;
    }
}

