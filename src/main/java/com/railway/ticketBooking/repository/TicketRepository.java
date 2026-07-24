package com.railway.ticketBooking.repository;

import com.railway.ticketBooking.entity.Ticket;
import com.railway.ticketBooking.entity.TicketStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

        List<Ticket> findByJourney_Id(Long journeyId);

        List<Ticket> findByJourney_IdAndSeat_Id(Long journeyId, Long seatId);

        List<Ticket> findByUser_Id(Long userId);

        @Query("""
                            SELECT t FROM Ticket t
                            WHERE t.journey.id = :journeyId
                            AND t.seat.id IN :seatIds
                            AND (t.status = TicketStatus.PENDING_PAYMENT
                                 OR t.status = TicketStatus.CONFIRMED)
                        """)
        List<Ticket> findExistingActiveTickets(
                        @Param("journeyId") Long journeyId,
                        @Param("seatIds") List<Long> seatIds);

        List<Ticket> findByStatusAndBookingTimeBefore(TicketStatus status, LocalDateTime time);
}