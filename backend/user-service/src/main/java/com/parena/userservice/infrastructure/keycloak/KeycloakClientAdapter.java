package com.parena.userservice.infrastructure.keycloak;


import com.parena.userservice.domain.aggregate.enums.Role;
import com.parena.userservice.domain.aggregate.root.User;
import com.parena.userservice.domain.exception.KeycloakServiceException;
import com.parena.userservice.domain.port.KeycloakPort;
import com.parena.userservice.infrastructure.config.KeycloakProperties;
import jakarta.ws.rs.core.Response;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

/**
 * Keycloak adapter implementing KeycloakPort.
 * Handles all Keycloak Admin API and Token Endpoint interactions.
 */

@Component
@Slf4j
public class KeycloakClientAdapter implements KeycloakPort {

    private final Keycloak keycloakAdminClient;
    private final KeycloakProperties keycloakProperties;

    public KeycloakClientAdapter(Keycloak keycloakAdminClient, KeycloakProperties keycloakProperties) {
        this.keycloakAdminClient = keycloakAdminClient;
        this.keycloakProperties = keycloakProperties;
    }

    @Override
    public UUID createUser(String email, String username, String password) {
        log.info("Creating user with username: {} and email: {}", username, email);

        //Realm'e bağlan (GET /admin/realms/{realm})
        RealmResource realmResource = keycloakAdminClient.realm(keycloakProperties.getRealm());
        //O Realm içerisindeki kullanıcı endpointine erişir (GET /admin/realms/{realm}/users)
        UsersResource usersResource = realmResource.users();

        //Create user representation
        UserRepresentation user = getUserRepresentation(email, username, password);

        //User create edilip Response nesnesine atanır.
        //Bu Response nesnesinin Header kısmı Location bilgisi içerir.
        try (Response response = usersResource.create(user)) {

            if (response.getStatus() != 201) {
                String errorBody = response.readEntity(String.class);
                log.error("Failed to create user: status= {}, body= {}", response.getStatus(), errorBody);
                throw new KeycloakServiceException("Keycloak'ta kullanıcı oluşturulamadı: HTTP " + response.getStatus() + " - " + errorBody);
            }

            //Extract userID from Location Header
            //Location'dan kayıt olan kullanıcının uuid bilgisini alırız.
            String locationHeader = response.getHeaderString("Location");
            String userId = locationHeader.substring(locationHeader.lastIndexOf("/") + 1);

            log.info("User created successfully in Keycloak: userId= {}, email= {}", userId, email);
            return UUID.fromString(userId);
        }
    }

    @Override
    public User getUserById(String userId) {
        return null;
    }

    @Override
    public void assignRoleToUser(UUID userId, Role role) {

    }

    @Override
    public void deleteUser(UUID userId) {

    }

    //Helper methods
    private UserRepresentation getUserRepresentation(String email, String username, String password) {
        UserRepresentation user = new UserRepresentation();
        user.setEmail(email);
        user.setUsername(username);
        user.setEnabled(true);
        user.setEmailVerified(true);    //Auto-verify for MVP.
        // TODO: gerçek sistemde email verification flow olmalı bu otomatik true olmamalı

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

