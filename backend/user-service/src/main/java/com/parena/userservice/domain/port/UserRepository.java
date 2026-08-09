package com.parena.userservice.domain.port;

import com.parena.userservice.domain.aggregate.root.User;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository {

    void save(User user);
    boolean existsByEmail(String email);
    Optional<User> findByKeycloakId(UUID keycloakId);
}
