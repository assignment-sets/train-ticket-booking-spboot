package com.railway.ticketBooking.repository;

import com.railway.ticketBooking.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    List<Ticket> findByJourney_Id(Long journeyId);

    List<Ticket> findByJourney_IdAndSeat_Id(Long journeyId, Long seatId);

    List<Ticket> findByUser_Id(Long userId);
}