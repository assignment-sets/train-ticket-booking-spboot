package com.railway.ticketBooking.dto;

public record AuthResponse(
        String token,
        String email,
        String role) {
}