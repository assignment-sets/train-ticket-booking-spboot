package com.railway.ticketBooking.dto;

import java.math.BigDecimal;

import com.railway.ticketBooking.entity.TicketStatus;

public record TicketResponse(
        Long ticketId,
        Long journeyId,
        String trainName,
        String seatNumber,
        String sourceStation,
        String destinationStation,
        TicketStatus status,
        BigDecimal fare) {
}
