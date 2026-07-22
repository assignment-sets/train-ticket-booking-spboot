package com.railway.ticketBooking.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record BookTicketRequest(

        @NotNull Long journeyId,

        @NotEmpty List<Long> seatIds,

        @NotNull Long sourceStationId,

        @NotNull Long destinationStationId) {
}