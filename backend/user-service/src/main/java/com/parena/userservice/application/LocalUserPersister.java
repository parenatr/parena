package com.parena.userservice.application;

import com.parena.userservice.domain.aggregate.root.User;
import com.parena.userservice.domain.event.UserRegisteredEvent;
import com.parena.userservice.domain.port.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
public class LocalUserPersister {

    private final UserRepository userRepository;

    public LocalUserPersister(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public void persist(User user) {
        userRepository.save(user);
        UserRegisteredEvent event = new UserRegisteredEvent(
                user.getUserId(),
                user.getKeycloakId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRoles(),
                Instant.now()
        );

        //TODO: Outbox mekanizması kurulacak event yayınlanacak.
    }
}
