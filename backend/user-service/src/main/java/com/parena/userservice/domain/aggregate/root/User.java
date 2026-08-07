package com.parena.userservice.domain.aggregate.root;

import com.parena.userservice.domain.aggregate.enums.Role;
import com.parena.userservice.domain.aggregate.valueobjects.UserId;

import java.time.Instant;
import java.util.EnumSet;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

public class User {

    private final UserId userId;
    private UUID keycloakId;
    private String firstName;
    private String lastName;
    private String email;
    private Set<Role> roles;
    private Instant createdAt;
    private boolean emailVerified;

    private User(UserId userId, UUID keycloakId, String firstName, String lastName,
                 String email, Set<Role> roles, Instant createdAt, boolean emailVerified) {
        this.userId = userId;
        this.keycloakId = keycloakId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.roles = roles;
        this.createdAt = createdAt;
        this.emailVerified = emailVerified;
    }

    public static User create(String firstName, String lastName, String email, Instant createdAt) {
        return new User(
                UserId.generate(),
                null,
                firstName,
                lastName,
                email,
                EnumSet.copyOf(Role.getDefault()),
                createdAt,
                false);
    }

    public static User rehydrate(UserId userId, UUID keycloakId, String firstName, String lastName,
                                 String email, Set<Role> roles, Instant createdAt, boolean emailVerified) {
        return new User(
                userId,
                keycloakId,
                firstName,
                lastName,
                email,
                roles,
                createdAt,
                emailVerified
        );
    }

    public void markEmailVerified() {
        this.emailVerified = true;
    }

    /** Keycloak Admin API ile kullanıcı oluşturulduktan SONRA çağrılır. Yalnızca bir kez bağlanabilir. */
    public void linkToKeycloakIdentity(UUID keycloakId) {
        Objects.requireNonNull(keycloakId, "keycloakId cannot be null");
        if (this.keycloakId != null) {
            throw new IllegalStateException(
                    "User " + userId + " zaten Keycloak kimliğine bağlı: " + this.keycloakId);
        }
        this.keycloakId = keycloakId;
    }

    public UserId getUserId() {
        return userId;
    }
    public UUID getKeycloakId() {
        return keycloakId;
    }
    public String getFirstName() {
        return firstName;
    }
    public String getLastName() {
        return lastName;
    }
    public String getEmail() {
        return email;
    }
    public Instant getCreatedAt() {
        return createdAt;
    }
    public boolean isEmailVerified() {
        return emailVerified;
    }
    public Set<Role> getRoles() {
        return Set.copyOf(roles);
    }
}
