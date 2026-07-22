package com.railway.ticketBooking.service;

import com.railway.ticketBooking.dto.*;
import com.railway.ticketBooking.entity.*;
import com.railway.ticketBooking.exception.ResourceNotFoundException;
import com.railway.ticketBooking.exception.SeatAlreadyBookedException;
import com.railway.ticketBooking.repository.*;
import com.railway.ticketBooking.security.UserPrincipal;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

        private final JourneyRepository journeyRepository;
        private final RouteStopRepository routeStopRepository;
        private final SeatRepository seatRepository;
        private final TicketRepository ticketRepository;
        private final UserRepository userRepository;

        // ==========================================================
        // SEARCH TRAINS
        // ==========================================================

        public List<TrainSearchResponse> searchTrains(SearchTrainRequest request) {
                return journeyRepository.searchTrains(
                                request.sourceStationId(),
                                request.destinationStationId(),
                                request.journeyDate(),
                                JourneyStatus.SCHEDULED);
        }

        // ==========================================================
        // AVAILABLE SEATS
        // ==========================================================

        public List<AvailableSeatResponse> getAvailableSeats(
                        Long journeyId,
                        Long sourceStationId,
                        Long destinationStationId) {

                Journey journey = findJourney(journeyId);
                RouteStop source = findRouteStop(journey.getRoute().getId(), sourceStationId);
                RouteStop destination = findRouteStop(journey.getRoute().getId(), destinationStationId);

                validateTravelDirection(source, destination);

                List<AvailableSeatResponse> availableSeats = new ArrayList<>();
                List<Seat> seats = seatRepository.findByTrain_Id(journey.getTrain().getId());

                for (Seat seat : seats) {
                        List<Ticket> existingTickets = ticketRepository.findByJourney_IdAndSeat_Id(journeyId,
                                        seat.getId());
                        boolean occupied = false;

                        for (Ticket ticket : existingTickets) {
                                if (detectOverlap(
                                                source.getStopOrder(),
                                                destination.getStopOrder(),
                                                ticket.getSourceStopOrder(),
                                                ticket.getDestinationStopOrder())) {

                                        occupied = true;
                                        break;
                                }
                        }

                        if (!occupied) {
                                availableSeats.add(new AvailableSeatResponse(
                                                seat.getId(),
                                                seat.getCoachNumber(),
                                                seat.getSeatNumber(),
                                                seat.getSeatType()));
                        }
                }

                return availableSeats;
        }

        // ==========================================================
        // BOOK TICKET
        // ==========================================================

        @Transactional
        public List<TicketResponse> bookTickets(UserPrincipal principal, BookTicketRequest request) {
                User user = userRepository.findById(principal.id())
                                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

                Journey journey = findJourney(request.journeyId());
                RouteStop source = findRouteStop(journey.getRoute().getId(), request.sourceStationId());
                RouteStop destination = findRouteStop(journey.getRoute().getId(), request.destinationStationId());

                validateTravelDirection(source, destination);

                List<TicketResponse> responses = new ArrayList<>();

                for (Long seatId : request.seatIds()) {
                        Seat seat = seatRepository.findById(seatId)
                                        .orElseThrow(() -> new ResourceNotFoundException("Seat not found."));

                        List<Ticket> existingTickets = ticketRepository.findByJourney_IdAndSeat_Id(journey.getId(),
                                        seatId);

                        for (Ticket ticket : existingTickets) {
                                if (detectOverlap(
                                                source.getStopOrder(),
                                                destination.getStopOrder(),
                                                ticket.getSourceStopOrder(),
                                                ticket.getDestinationStopOrder())) {

                                        throw new SeatAlreadyBookedException(
                                                        "Seat " + seat.getCoachNumber() + "-" + seat.getSeatNumber()
                                                                        + " is already booked.");
                                }
                        }

                        Ticket newTicket = Ticket.builder()
                                        .user(user)
                                        .journey(journey)
                                        .seat(seat)
                                        .sourceRouteStop(source)
                                        .destinationRouteStop(destination)
                                        .sourceStopOrder(source.getStopOrder())
                                        .destinationStopOrder(destination.getStopOrder())
                                        .fare(BigDecimal.valueOf(500))
                                        .status(TicketStatus.BOOKED)
                                        .build();

                        newTicket = ticketRepository.save(newTicket);

                        responses.add(new TicketResponse(
                                        newTicket.getId(),
                                        journey.getId(),
                                        journey.getTrain().getName(),
                                        seat.getCoachNumber() + "-" + seat.getSeatNumber(),
                                        source.getStation().getName(),
                                        destination.getStation().getName(),
                                        newTicket.getStatus(),
                                        newTicket.getFare()));
                }

                return responses;
        }

        // ==========================================================
        // HELPERS
        // ==========================================================

        private Journey findJourney(Long journeyId) {
                return journeyRepository.findById(journeyId)
                                .orElseThrow(() -> new ResourceNotFoundException("Journey not found."));
        }

        private RouteStop findRouteStop(Long routeId, Long stationId) {
                return routeStopRepository.findByRoute_IdAndStation_Id(routeId, stationId)
                                .orElseThrow(() -> new ResourceNotFoundException("Station not found on this route."));
        }

        private void validateTravelDirection(RouteStop source, RouteStop destination) {
                if (source.getId().equals(destination.getId())) {
                        throw new IllegalArgumentException("Source and destination cannot be the same.");
                }

                if (source.getStopOrder() >= destination.getStopOrder()) {
                        throw new IllegalArgumentException("Destination must come after source.");
                }
        }

        private boolean detectOverlap(int requestedFrom, int requestedTo, int bookedFrom, int bookedTo) {
                return requestedFrom < bookedTo && bookedFrom < requestedTo;
        }
}