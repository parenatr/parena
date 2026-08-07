package com.parena.userservice.infrastructure.persistence.adapter;

import com.parena.userservice.domain.aggregate.root.User;
import com.parena.userservice.domain.port.UserRepository;
import com.parena.userservice.infrastructure.persistence.entity.UserJpaEntity;
import com.parena.userservice.infrastructure.persistence.repository.UserJpaRepository;
import org.springframework.stereotype.Repository;

/**
 * OUTBOUND ADAPTER
 * */

@Repository
public class UserRepositoryAdapter implements UserRepository {

    private final UserJpaRepository userJpaRepository;

    public UserRepositoryAdapter(UserJpaRepository userJpaRepository) {
        this.userJpaRepository = userJpaRepository;
    }

    @Override
    public void save(User user) {
        UserJpaEntity entity = new UserJpaEntity();
        entity.setId(user.getUserId().value());
        entity.setKeycloakId(user.getKeycloakId());
        entity.setFirstName(user.getFirstName());
        entity.setLastName(user.getLastName());
        entity.setEmail(user.getEmail());
        entity.setEmailVerified(user.isEmailVerified());
        entity.setCreatedAt(user.getCreatedAt());
        entity.setRoles(user.getRoles());

        userJpaRepository.save(entity);

    }

    @Override
    public boolean existsByEmail(String email) {
        return userJpaRepository.existsByEmailIgnoreCase(email);
    }
}
