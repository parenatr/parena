package com.parena.userservice.domain.aggregate.enums;

import java.util.List;

public enum Role {
    STANDARD_USER,
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
        return this.name().toLowerCase().replace("-", "_");
    }

    public static List<Role> getDefault() {
        return List.of(STANDARD_USER);

    }
}