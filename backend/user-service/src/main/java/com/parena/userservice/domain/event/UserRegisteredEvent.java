package com.parena.userservice.domain.event;

import com.parena.userservice.domain.aggregate.enums.Role;
import com.parena.userservice.domain.aggregate.valueobjects.UserId;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;

public record UserRegisteredEvent(
        UserId userId,
        UUID keycloakId,
        String email,
        String firstName,
        String lastName,
        Set<Role> roles,
        Instant occurredAt
) {
}
