package com.railway.ticketBooking.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public record ApiErrorResponse(
        @Schema(example = "2026-08-07T14:24:41") String timestamp,
        @Schema(example = "404") int status,
        @Schema(example = "Not Found") String error,
        @Schema(example = "Train with ID 123 not found") String message) {
}
