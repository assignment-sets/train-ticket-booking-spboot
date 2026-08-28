package com.railway.ticketBooking.dto;

import com.railway.ticketBooking.entity.RouteStop;
import java.time.LocalTime;

public record RouteStopResponse(
        Long routeStopId,
        Integer stopOrder,
        Long stationId,
        String stationCode,
        String stationName,
        String city,
        String state,
        LocalTime arrivalTime,
        LocalTime departureTime
) {
    public static RouteStopResponse fromEntity(RouteStop stop) {
        return new RouteStopResponse(
                stop.getId(),
                stop.getStopOrder(),
                stop.getStation().getId(),
                stop.getStation().getCode(),
                stop.getStation().getName(),
                stop.getStation().getCity(),
                stop.getStation().getState(),
                stop.getArrivalTime(),
                stop.getDepartureTime()
        );
    }
}
