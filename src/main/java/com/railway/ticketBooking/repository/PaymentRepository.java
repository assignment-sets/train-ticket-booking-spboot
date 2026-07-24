package com.railway.ticketBooking.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.railway.ticketBooking.entity.Payment;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByTicketId(Long ticketId);

    List<Payment> findByStripePaymentId(String stripePaymentId);
}
