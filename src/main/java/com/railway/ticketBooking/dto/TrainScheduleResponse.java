package com.railway.ticketBooking.dto;

import java.math.BigDecimal;
import java.util.List;

public record TrainScheduleResponse(
        Long trainId,
        String trainNumber,
        String trainName,
        Long routeId,
        String routeName,
        Integer totalCoaches,
        Integer seatsPerCoach,
        BigDecimal baseSeatPrice,
        List<RouteStopResponse> stops
) {
}
