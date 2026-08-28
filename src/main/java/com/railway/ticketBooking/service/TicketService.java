package com.railway.ticketBooking.service;

import com.railway.ticketBooking.dto.TicketDetailResponse;
import com.railway.ticketBooking.dto.TicketResponse;
import com.railway.ticketBooking.entity.Ticket;
import com.railway.ticketBooking.exception.ResourceNotFoundException;
import com.railway.ticketBooking.repository.TicketRepository;
import com.railway.ticketBooking.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TicketService {

    private final TicketRepository ticketRepository;

    public TicketDetailResponse getTicketById(Long ticketId) {
        Ticket ticket = ticketRepository.findTicketWithDetailsById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with ID: " + ticketId));

        return TicketDetailResponse.fromEntity(ticket);
    }

    public List<TicketResponse> getMyTickets(UserPrincipal principal) {
        List<Ticket> tickets = ticketRepository.findUserTicketsWithDetails(principal.id());

        return tickets.stream()
                .map(t -> new TicketResponse(
                        t.getId(),
                        t.getJourney().getId(),
                        t.getJourney().getTrain().getTrainNumber(),
                        t.getJourney().getTrain().getName(),
                        t.getJourney().getJourneyDate(),
                        t.getSeat().getCoachNumber() + "-" + t.getSeat().getSeatNumber(),
                        t.getSourceRouteStop().getStation().getName(),
                        t.getDestinationRouteStop().getStation().getName(),
                        t.getStatus(),
                        t.getFare()))
                .toList();
    }
}
