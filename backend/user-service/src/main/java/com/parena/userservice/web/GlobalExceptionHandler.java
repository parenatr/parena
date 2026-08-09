package com.parena.userservice.web;

import com.parena.userservice.application.exception.UserRegistrationException;
import com.parena.userservice.infrastructure.keycloak.exception.EmailAlreadyRegisteredException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EmailAlreadyRegisteredException.class)
    public ResponseEntity<ApiErrorResponse> handleEmailExists(EmailAlreadyRegisteredException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ApiErrorResponse("EMAIL_ALREADY_REGISTERED", ex.getMessage(),
                        Map.of("email", "Bu email adresi zaten kayıtlı")));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = ex.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.toMap(
                        FieldError::getField,
                        err -> err.getDefaultMessage() != null ? err.getDefaultMessage() : "Geçersiz değer",
                        (existing, replacement) -> existing));
        return ResponseEntity.badRequest()
                .body(new ApiErrorResponse("VALIDATION_ERROR", "Girdi doğrulama hatası", fieldErrors));
    }

    @ExceptionHandler(UserRegistrationException.class)
    public ResponseEntity<ApiErrorResponse> handleRegistrationFailure(UserRegistrationException ex) {
        return ResponseEntity.internalServerError()
                .body(new ApiErrorResponse("REGISTRATION_FAILED", ex.getMessage()));
    }
    public record ApiErrorResponse(String code, String message, Map<String, String> fieldErrors) {
        public ApiErrorResponse(String code, String message) {
            this(code, message, null);
        }
    }}
