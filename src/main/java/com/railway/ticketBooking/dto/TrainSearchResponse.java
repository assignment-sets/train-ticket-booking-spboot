package com.railway.ticketBooking.dto;

import java.time.LocalTime;

public record TrainSearchResponse(
                Long journeyId,
                Long trainId,
                String trainNumber,
                String trainName,
                LocalTime departureTime,
                LocalTime arrivalTime) {
}