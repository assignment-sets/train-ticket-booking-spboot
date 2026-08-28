package com.railway.ticketBooking.dto;

import com.railway.ticketBooking.entity.Station;

public record StationResponse(
        Long id,
        String code,
        String name,
        String city,
        String state
) {
    public static StationResponse fromEntity(Station station) {
        return new StationResponse(
                station.getId(),
                station.getCode(),
                station.getName(),
                station.getCity(),
                station.getState()
        );
    }
}
