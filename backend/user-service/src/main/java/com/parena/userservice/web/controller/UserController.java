package com.parena.userservice.web.controller;

import com.parena.userservice.application.usecase.RegisterUserUseCase;
import com.parena.userservice.domain.aggregate.root.User;
import com.parena.userservice.web.dto.request.RegisterUserRequest;
import com.parena.userservice.web.dto.response.RegisteredUserResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@Validated
public class UserController {

    private final RegisterUserUseCase registerUserUseCase;

    public UserController(RegisterUserUseCase registerUserUseCase) {
        this.registerUserUseCase = registerUserUseCase;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RegisteredUserResponse register(@Valid @RequestBody RegisterUserRequest registerRequest) {
        User user = registerUserUseCase.register(
                registerRequest.firstName(),
                registerRequest.lastName(),
                registerRequest.email(),
                registerRequest.password());

        return new RegisteredUserResponse(
                user.getUserId().value(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName()
        );
    }
}
