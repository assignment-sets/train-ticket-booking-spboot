package com.railway.ticketBooking.repository;

import com.railway.ticketBooking.entity.BookingOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BookingOrderRepository extends JpaRepository<BookingOrder, Long> {

    // Used to detect duplicate requests before execution loops fire
    Optional<BookingOrder> findByIdempotencyKey(String idempotencyKey);
}