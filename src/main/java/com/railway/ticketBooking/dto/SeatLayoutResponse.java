package com.railway.ticketBooking.dto;

import java.util.List;

public record SeatLayoutResponse(
        Long journeyId,
        Long trainId,
        String trainName,
        Integer totalCoaches,
        Integer seatsPerCoach,
        Integer currentCoach,
        int totalAvailableSeats,
        int totalBookedSeats,
        List<AvailableSeatResponse> seats) {
}
