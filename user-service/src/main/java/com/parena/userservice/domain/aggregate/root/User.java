package com.parena.userservice.domain.aggregate.root;

import com.parena.userservice.domain.aggregate.enums.Role;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public class User {

    private UUID userId;
    private String email;
    private String username;
    private List<Role> roles;
    private Instant createdAt;
    private boolean emailVerified;

    private User(UUID userId, String email, String username, List<Role> roles, Instant createdAt, boolean emailVerified) {
        this.userId = userId;
        this.email = email;
        this.username = username;
        this.roles = roles;
        this.createdAt = createdAt;
        this.emailVerified = emailVerified;
    }

    public static User create(UUID userId, String email, String username, List<Role> roles, Instant createdAt, boolean emailVerified) {
        return new User(userId, email, username, roles, createdAt, emailVerified);
    }


    public UUID getUserId() {
        return userId;
    }

    public String getEmail() {
        return email;
    }

    public String getUsername() {
        return username;
    }

    public List<Role> getRoles() {
        return roles;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public boolean isEmailVerified() {
        return emailVerified;
    }
}
