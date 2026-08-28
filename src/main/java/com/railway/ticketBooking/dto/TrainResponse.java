package com.railway.ticketBooking.dto;

import com.railway.ticketBooking.entity.Train;
import java.math.BigDecimal;

public record TrainResponse(
        Long id,
        String trainNumber,
        String name,
        Integer totalCoaches,
        Integer seatsPerCoach,
        BigDecimal baseSeatPrice
) {
    public static TrainResponse fromEntity(Train train) {
        return new TrainResponse(
                train.getId(),
                train.getTrainNumber(),
                train.getName(),
                train.getTotalCoaches(),
                train.getSeatsPerCoach(),
                train.getBaseSeatPrice()
        );
    }
}
