package com.parena.userservice.domain.aggregate.enums;

import java.util.Set;

public enum Role {
    USER,
    ADMIN;

    //domain Enum Role ile calısıyor -> formatı ona gore ayarlar.
    public static Role fromString(String roleStr) {
        if (roleStr == null) {
            return null;
        }

        String normalizedRole = roleStr.toUpperCase().replace("-", "_");

        try {
            return Role.valueOf(normalizedRole);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(String.format("Role '%s' is not a valid Role", normalizedRole));
        }

    }

    //keycloak apisinin istediği format.
    public String toKeycloakRole() {
        return name().toLowerCase();
    }
    public static Set<Role> getDefault() {
        return Set.of(Role.USER);

    }
}