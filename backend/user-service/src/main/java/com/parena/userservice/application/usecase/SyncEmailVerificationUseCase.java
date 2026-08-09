package com.parena.userservice.application.usecase;

import com.parena.userservice.domain.port.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class SyncEmailVerificationUseCase {

    private final UserRepository userRepository;

    public SyncEmailVerificationUseCase(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public void sync(UUID keycloakId, boolean emailVerified) {
        userRepository.findByKeycloakId(keycloakId).ifPresent(user -> {
            if (emailVerified && !user.isEmailVerified()) {
                user.markEmailVerified();
                userRepository.save(user);
            }
        });
    }
}
