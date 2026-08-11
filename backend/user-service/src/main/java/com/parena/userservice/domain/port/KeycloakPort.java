package com.parena.userservice.domain.port;

import com.parena.userservice.domain.aggregate.enums.Role;
import com.parena.userservice.domain.aggregate.root.User;

import java.util.Set;
import java.util.UUID;

/**
 * Port interface for Keycloak integration.
 * Infrastructure layer implements this interface.
 * Application layer depends on this port (hexagonal architecture).
 */
public interface KeycloakPort {
    /**
     * createUser: Create new user in Keycloak
     * getUserById: Get user information by user ID
     * assignRoleToUser: Assign role to user
     * deleteUser: Delete user registration from keycloak when role assignment fails
     */
    UUID createUser(String firstName, String lastName, String email, String password, Set<Role> roles);

    void deleteUser(UUID keycloakId);

    void assignRealmRoles(UUID keycloakId, Set<Role> roles);

    void sendVerificationEmail(UUID keycloakId);

}
