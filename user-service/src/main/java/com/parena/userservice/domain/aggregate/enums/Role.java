package com.parena.userservice.domain.aggregate.enums;

public enum Role {
    STANDARD_USER,
    ADMIN;

    //domain Enum Role ile calısıyor -> formatı ona gore ayarlar.
    public static Role fromString(String roleStr) {
        if (roleStr == null) {
            return null;
        }

        String normalized = roleStr.toUpperCase();
        try {
            return Role.valueOf(normalized);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(String.format("Role '%s' is not a valid Role", normalized));
        }

    }

    //keycloak apisinin istediği format.
    public String toKeycloakRole() {
        return this.name().toLowerCase();
    }
}