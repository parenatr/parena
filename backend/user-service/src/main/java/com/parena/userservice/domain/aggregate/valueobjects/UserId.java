package com.parena.userservice.domain.aggregate.valueobjects;

import java.util.Objects;
import java.util.UUID;

public record UserId(UUID value) {
    public UserId {
        Objects.requireNonNull(value, "userId cannot be null");
    }

    public static UserId generate() {
        return new UserId(UUID.randomUUID());
    }
}
