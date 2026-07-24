package com.railway.ticketBooking.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record BookingOrderResponse(
        Long orderId,
        String idempotencyKey,
        BigDecimal totalAmount,
        String status,
        LocalDateTime createdAt,
        List<TicketResponse> tickets) {
}
