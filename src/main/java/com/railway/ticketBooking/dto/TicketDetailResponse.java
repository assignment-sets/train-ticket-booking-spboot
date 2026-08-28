package com.railway.ticketBooking.dto;

import com.railway.ticketBooking.entity.Ticket;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public record TicketDetailResponse(
        Long ticketId,
        Long orderId,
        String bookedByName,
        String bookedByEmail,
        Long journeyId,
        String trainNumber,
        String trainName,
        LocalDate journeyDate,
        Integer coachNumber,
        Integer seatNumber,
        String seatType,
        Long sourceStationId,
        String sourceStationCode,
        String sourceStationName,
        String sourceCity,
        LocalTime departureTime,
        Long destinationStationId,
        String destinationStationCode,
        String destinationStationName,
        String destinationCity,
        LocalTime arrivalTime,
        LocalDateTime bookingTime,
        BigDecimal fare,
        String status
) {
    public static TicketDetailResponse fromEntity(Ticket ticket) {
        return new TicketDetailResponse(
                ticket.getId(),
                ticket.getBookingOrder() != null ? ticket.getBookingOrder().getId() : null,
                ticket.getUser().getName(),
                ticket.getUser().getEmail(),
                ticket.getJourney().getId(),
                ticket.getJourney().getTrain().getTrainNumber(),
                ticket.getJourney().getTrain().getName(),
                ticket.getJourney().getJourneyDate(),
                ticket.getSeat().getCoachNumber(),
                ticket.getSeat().getSeatNumber(),
                ticket.getSeat().getSeatType().name(),
                ticket.getSourceRouteStop().getStation().getId(),
                ticket.getSourceRouteStop().getStation().getCode(),
                ticket.getSourceRouteStop().getStation().getName(),
                ticket.getSourceRouteStop().getStation().getCity(),
                ticket.getSourceRouteStop().getDepartureTime(),
                ticket.getDestinationRouteStop().getStation().getId(),
                ticket.getDestinationRouteStop().getStation().getCode(),
                ticket.getDestinationRouteStop().getStation().getName(),
                ticket.getDestinationRouteStop().getStation().getCity(),
                ticket.getDestinationRouteStop().getArrivalTime(),
                ticket.getBookingTime(),
                ticket.getFare(),
                ticket.getStatus().name()
        );
    }
}
