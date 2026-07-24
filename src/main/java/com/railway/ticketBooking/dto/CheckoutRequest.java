package com.railway.ticketBooking.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

public record CheckoutRequest(
                @NotNull(message = "Booking Order ID is required") Long bookingOrderId,

                @NotNull(message = "Expected total amount is required") @Positive(message = "Amount must be greater than zero") BigDecimal expectedAmount) {
}