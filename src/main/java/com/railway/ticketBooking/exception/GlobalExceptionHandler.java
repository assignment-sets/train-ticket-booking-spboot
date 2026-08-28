package com.railway.ticketBooking.exception;

import com.railway.ticketBooking.dto.ApiErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

        @ExceptionHandler(AccessDeniedException.class)
        @ResponseStatus(HttpStatus.FORBIDDEN) // <--- Tells Springdoc this causes a 403
        public ResponseEntity<ApiErrorResponse> handleAccessDenied(AccessDeniedException ex) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ApiErrorResponse(
                                LocalDateTime.now().toString(),
                                HttpStatus.FORBIDDEN.value(),
                                "Forbidden",
                                "Access Denied: You do not have the required role for this resource."));
        }

        @ExceptionHandler(IllegalArgumentException.class)
        @ResponseStatus(HttpStatus.BAD_REQUEST) // <--- Tells Springdoc this causes a 400
        public ResponseEntity<ApiErrorResponse> handleIllegalArgument(IllegalArgumentException ex) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiErrorResponse(
                                LocalDateTime.now().toString(),
                                HttpStatus.BAD_REQUEST.value(),
                                "Bad Request",
                                ex.getMessage()));
        }

        @ExceptionHandler(ResourceNotFoundException.class)
        @ResponseStatus(HttpStatus.NOT_FOUND) // <--- Tells Springdoc this causes a 404
        public ResponseEntity<ApiErrorResponse> handleNotFound(ResourceNotFoundException ex) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiErrorResponse(
                                LocalDateTime.now().toString(),
                                HttpStatus.NOT_FOUND.value(),
                                "Not Found",
                                ex.getMessage()));
        }

        @ExceptionHandler(SeatAlreadyBookedException.class)
        @ResponseStatus(HttpStatus.CONFLICT) // <--- Tells Springdoc this causes a 409
        public ResponseEntity<ApiErrorResponse> handleSeatAlreadyBooked(SeatAlreadyBookedException ex) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(new ApiErrorResponse(
                                LocalDateTime.now().toString(),
                                HttpStatus.CONFLICT.value(),
                                "Conflict",
                                ex.getMessage()));
        }

        @ExceptionHandler(org.springframework.web.bind.MethodArgumentNotValidException.class)
        @ResponseStatus(HttpStatus.BAD_REQUEST)
        public ResponseEntity<ApiErrorResponse> handleValidationException(
                        org.springframework.web.bind.MethodArgumentNotValidException ex) {

                String message = ex.getBindingResult()
                                .getFieldErrors()
                                .stream()
                                .findFirst()
                                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                                .orElse("Validation failed.");

                return ResponseEntity.badRequest().body(new ApiErrorResponse(
                                LocalDateTime.now().toString(),
                                HttpStatus.BAD_REQUEST.value(),
                                "Bad Request",
                                message));
        }

        @ExceptionHandler(PaymentException.class)
        @ResponseStatus(HttpStatus.BAD_REQUEST)
        public ResponseEntity<ApiErrorResponse> handlePaymentException(PaymentException ex) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiErrorResponse(
                                LocalDateTime.now().toString(),
                                HttpStatus.BAD_REQUEST.value(),
                                "Payment Error",
                                ex.getMessage()));
        }

        @ExceptionHandler(AccountDeactivatedException.class)
        @ResponseStatus(HttpStatus.FORBIDDEN)
        public ResponseEntity<ApiErrorResponse> handleAccountDeactivated(AccountDeactivatedException ex) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ApiErrorResponse(
                                LocalDateTime.now().toString(),
                                HttpStatus.FORBIDDEN.value(),
                                "Account Deactivated",
                                ex.getMessage()));
        }

        @ExceptionHandler(com.stripe.exception.StripeException.class)
        @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR) // <--- Tells Springdoc this causes a 500
        public ResponseEntity<ApiErrorResponse> handleStripeException(com.stripe.exception.StripeException ex) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiErrorResponse(
                                LocalDateTime.now().toString(),
                                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                                "Payment Gateway Error",
                                "An error occurred while communicating with the payment processor: "
                                                + ex.getMessage()));
        }
}