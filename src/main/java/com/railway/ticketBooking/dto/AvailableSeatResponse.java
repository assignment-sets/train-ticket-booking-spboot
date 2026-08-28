package com.railway.ticketBooking.dto;

import com.railway.ticketBooking.entity.SeatStatus;
import com.railway.ticketBooking.entity.SeatType;
import java.math.BigDecimal;

public record AvailableSeatResponse(
        Long seatId,
        Integer coachNumber,
        Integer seatNumber,
        SeatType seatType,
        SeatStatus status,
        BigDecimal fare) {
}
