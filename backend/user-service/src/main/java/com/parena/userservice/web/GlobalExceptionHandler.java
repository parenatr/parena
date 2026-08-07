package com.parena.userservice.web;

import com.parena.userservice.application.exception.UserRegistrationException;
import com.parena.userservice.infrastructure.keycloak.exception.EmailAlreadyRegisteredException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EmailAlreadyRegisteredException.class)
    public ResponseEntity<ApiErrorResponse> handleEmailExists(EmailAlreadyRegisteredException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ApiErrorResponse("EMAIL_ALREADY_REGISTERED", ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                .collect(Collectors.joining(", "));
        return ResponseEntity.badRequest().body(new ApiErrorResponse("VALIDATION_ERROR", message));
    }

    @ExceptionHandler(UserRegistrationException.class)
    public ResponseEntity<ApiErrorResponse> handleRegistrationFailure(UserRegistrationException ex) {
        return ResponseEntity.internalServerError()
                .body(new ApiErrorResponse("REGISTRATION_FAILED", ex.getMessage()));
    }
    public record ApiErrorResponse(String code, String message) {}
}
