package com.railway.ticketBooking.dto;

import com.railway.ticketBooking.entity.SeatType;

public record AvailableSeatResponse(
                Long seatId,
                Integer coachNumber,
                Integer seatNumber,
                SeatType seatType) {
}
