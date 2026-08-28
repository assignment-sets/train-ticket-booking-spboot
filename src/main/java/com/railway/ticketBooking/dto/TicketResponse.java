package com.railway.ticketBooking.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.railway.ticketBooking.entity.TicketStatus;

public record TicketResponse(
        Long ticketId,
        Long journeyId,
        String trainNumber,
        String trainName,
        LocalDate journeyDate,
        String seatNumber,
        String sourceStation,
        String destinationStation,
        TicketStatus status,
        BigDecimal fare) {
}
