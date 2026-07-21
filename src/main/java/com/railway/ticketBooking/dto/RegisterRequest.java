package com.railway.ticketBooking.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "Name cannot be blank") @Size(max = 100) String name,

        @NotBlank(message = "Email cannot be blank") @Email(message = "Invalid email format") @Size(max = 255) String email,

        @NotBlank(message = "Password cannot be blank") @Size(min = 6, message = "Password must be at least 6 characters") String password) {
}