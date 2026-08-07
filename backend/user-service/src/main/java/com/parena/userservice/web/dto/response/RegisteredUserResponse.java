package com.parena.userservice.web.dto.response;

import java.util.UUID;

public record RegisteredUserResponse(UUID userId, String email, String firstName, String lastName) {
}
