package com.parena.userservice.infrastructure.keycloak.adapter;


import com.parena.userservice.domain.aggregate.enums.Role;
import com.parena.userservice.domain.aggregate.root.User;
import com.parena.userservice.domain.exception.KeycloakServiceException;
import com.parena.userservice.domain.port.KeycloakPort;
import com.parena.userservice.infrastructure.keycloak.config.KeycloakProperties;
import com.parena.userservice.infrastructure.keycloak.exception.EmailAlreadyRegisteredException;
import jakarta.ws.rs.core.Response;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;
import java.util.UUID;

/**
 * Keycloak adapter implementing KeycloakPort.
 * Handles all Keycloak Admin API and Token Endpoint interactions.
 */

@Component
@Slf4j
public class KeycloakAdminClientAdapter implements KeycloakPort {

    private final Keycloak keycloakAdminClient;
    private final KeycloakProperties keycloakProperties;

    public KeycloakAdminClientAdapter(Keycloak keycloakAdminClient, KeycloakProperties keycloakProperties) {
        this.keycloakAdminClient = keycloakAdminClient;
        this.keycloakProperties = keycloakProperties;
    }

    @Override
    public UUID createUser(String firstName, String lastName, String email, String password, Set<Role> roles) {
        log.info("Creating user with email: {}", email);

        RealmResource realmResource = keycloakAdminClient.realm(keycloakProperties.getRealm());
        UsersResource usersResource = realmResource.users();
        UserRepresentation user = getUserRepresentation(firstName, lastName, email, password);

        try (Response response = usersResource.create(user)) {
            if (response.getStatus() == 409) {
                throw new EmailAlreadyRegisteredException(email);
            }
            if (response.getStatus() != 201) {
                String errorBody = response.readEntity(String.class);
                log.error("Failed to create user: status= {}, body= {}", response.getStatus(), errorBody);
                throw new KeycloakServiceException("Keycloak'ta kullanıcı oluşturulamadı: HTTP " +
                        response.getStatus() + " - " + errorBody);
            }

            String location = response.getLocation().getPath();
            UUID keycloakId = UUID.fromString(location.substring(location.lastIndexOf("/") + 1));
            log.info("User created successfully in Keycloak: keycloakId= {}, email= {}", keycloakId, email);
            return keycloakId;
            // NOT: assignRoleToUser buradan bilerek kaldırıldı. Burada kalsaydı,
            // rol atama hatası register()'a keycloakId hiç ulaşmadan fırlar ve
            // telafi eylemi (Keycloak kullanıcısını silme) devreye giremezdi.
        }
    }

    @Override
    public User getUserById(String userId) {
        return null;
    }


    @Override
    public void deleteUser(UUID keycloakId) {
        keycloakAdminClient.realm(keycloakProperties.getRealm())
                .users()
                .delete(keycloakId.toString())
                .close();

    }

    @Override
    public void assignRealmRoles(UUID keycloakId, Set<Role> roles) {
        UserResource userResource = keycloakAdminClient.realm(keycloakProperties.getRealm())
                .users().get(keycloakId.toString());

        List<RoleRepresentation> roleRepresentations = roles.stream()
                .map(role -> keycloakAdminClient.realm(keycloakProperties.getRealm())
                        .roles().get(role.toKeycloakRole()).toRepresentation())
                .toList();
        userResource.roles().realmLevel().add(roleRepresentations);
    }

    private void assignRoleToUser(UUID keycloakId, Set<Role> roles) {
        UserResource userResource = keycloakAdminClient.realm(keycloakProperties.getRealm()).users().get(keycloakId.toString());

        List<RoleRepresentation> roleRepresentations = roles.stream()
                .map(role -> keycloakAdminClient.realm(keycloakProperties.getRealm())
                        .roles()
                        .get(role.toKeycloakRole())
                        .toRepresentation())
                        .toList();
        userResource.roles().realmLevel().add(roleRepresentations);

    }

    //Helper methods
    private UserRepresentation getUserRepresentation(
            String firstName, String lastName,
            String email, String password)
    {
        //Create User with Keycloak Admin Api
        UserRepresentation user = new UserRepresentation();
        user.setUsername(email);
        user.setEmail(email);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEnabled(true);
        user.setEmailVerified(false);
        // TODO: email verification flow ayarlayacağım.

        //Set Password
        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue(password);
        credential.setTemporary(false);

        //UserRepresentation içerisine password bilgisi eklenir.
        user.setCredentials(List.of(credential));
        return user;
    }
}

