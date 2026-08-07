package com.parena.userservice.domain.port;

import com.parena.userservice.domain.aggregate.root.User;

public interface UserRepository {

    void save(User user);
    boolean existsByEmail(String email);
}
