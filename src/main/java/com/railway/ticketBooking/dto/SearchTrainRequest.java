package com.railway.ticketBooking.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record SearchTrainRequest(

                @NotNull Long sourceStationId,

                @NotNull Long destinationStationId,

                @NotNull LocalDate journeyDate) {
}