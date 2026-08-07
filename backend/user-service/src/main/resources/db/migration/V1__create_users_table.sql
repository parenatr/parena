CREATE TABLE users (
                       id             UUID PRIMARY KEY,
                       keycloak_id    UUID UNIQUE,
                       first_name     VARCHAR(100) NOT NULL,
                       last_name      VARCHAR(100) NOT NULL,
                       email          VARCHAR(255) NOT NULL UNIQUE,
                       email_verified BOOLEAN NOT NULL DEFAULT FALSE,
                       created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE user_roles (
                            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                            role    VARCHAR(50) NOT NULL,
                            PRIMARY KEY (user_id, role)
);

CREATE INDEX idx_users_email ON users (email);