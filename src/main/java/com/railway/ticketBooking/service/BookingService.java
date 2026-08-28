package com.railway.ticketBooking.service;

import com.railway.ticketBooking.config.PricingProperties;
import com.railway.ticketBooking.dto.*;
import com.railway.ticketBooking.entity.*;
import com.railway.ticketBooking.exception.ResourceNotFoundException;
import com.railway.ticketBooking.exception.SeatAlreadyBookedException;
import com.railway.ticketBooking.repository.*;
import com.railway.ticketBooking.security.UserPrincipal;

import lombok.RequiredArgsConstructor;

import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

        private final JourneyRepository journeyRepository;
        private final RouteStopRepository routeStopRepository;
        private final SeatRepository seatRepository;
        private final TicketRepository ticketRepository;
        private final UserRepository userRepository;
        private final PricingProperties pricingProperties;
        private final BookingOrderRepository bookingOrderRepository;
        private final PaymentService paymentService;

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

        public SeatLayoutResponse getAvailableSeats(
                        Long journeyId,
                        Long sourceStationId,
                        Long destinationStationId,
                        Integer coachNumber) {

                Journey journey = findJourney(journeyId);
                RouteStop source = findRouteStop(journey.getRoute().getId(), sourceStationId);
                RouteStop destination = findRouteStop(journey.getRoute().getId(), destinationStationId);

                validateTravelDirection(source, destination);

                Train train = journey.getTrain();

                // 1. BULK FETCH: All seats ordered by coach and seat sequence (optionally filtered by coach)
                List<Seat> seats = (coachNumber != null)
                                ? seatRepository.findByTrain_IdAndCoachNumberOrderBySeatNumberAsc(train.getId(), coachNumber)
                                : seatRepository.findByTrain_IdOrderByCoachNumberAscSeatNumberAsc(train.getId());

                // 2. BULK FETCH: All active, non-cancelled tickets for this journey in ONE database hit
                List<Ticket> activeTickets = ticketRepository.findActiveTicketsByJourneyId(journeyId);

                // 3. IN-MEMORY MAPPING: Group tickets by seat ID for O(1) lookups during the loop
                Map<Long, List<Ticket>> ticketsBySeatId = activeTickets.stream()
                                .collect(Collectors.groupingBy(ticket -> ticket.getSeat().getId()));

                List<AvailableSeatResponse> seatResponses = new ArrayList<>();
                int reqFrom = source.getStopOrder();
                int reqTo = destination.getStopOrder();
                int availableCount = 0;
                int bookedCount = 0;

                // 4. PROCESS LOOP: Check segments and evaluate status for EVERY seat
                for (Seat seat : seats) {
                        List<Ticket> seatTickets = ticketsBySeatId.getOrDefault(seat.getId(), List.of());
                        boolean occupied = false;

                        for (Ticket ticket : seatTickets) {
                                if (detectOverlap(
                                                reqFrom,
                                                reqTo,
                                                ticket.getSourceStopOrder(),
                                                ticket.getDestinationStopOrder())) {

                                        occupied = true;
                                        break; // Segment is blocked, no need to check further tickets for this seat
                                }
                        }

                        SeatStatus status;
                        if (occupied) {
                                status = SeatStatus.BOOKED;
                                bookedCount++;
                        } else {
                                status = SeatStatus.AVAILABLE;
                                availableCount++;
                        }

                        BigDecimal fare = calculateFare(seat);

                        seatResponses.add(new AvailableSeatResponse(
                                        seat.getId(),
                                        seat.getCoachNumber(),
                                        seat.getSeatNumber(),
                                        seat.getSeatType(),
                                        status,
                                        fare));
                }

                return new SeatLayoutResponse(
                                journey.getId(),
                                train.getId(),
                                train.getName(),
                                train.getTotalCoaches(),
                                train.getSeatsPerCoach(),
                                coachNumber,
                                availableCount,
                                bookedCount,
                                seatResponses);
        }

        // ==========================================================
        // BOOK TICKET
        // ==========================================================

        @Transactional
        public BookingOrderResponse bookTickets(UserPrincipal principal, BookTicketRequest request) {
                // 0. IDEMPOTENCY CHECK: Intercept duplicate client retries early
                Optional<BookingOrder> existingOrder = bookingOrderRepository
                                .findByIdempotencyKey(request.idempotencyKey());
                if (existingOrder.isPresent()) {
                        BookingOrder order = existingOrder.get();
                        String existingCheckoutUrl = order.getStatus() == OrderStatus.PENDING
                                        ? paymentService.createCheckoutSession(order)
                                        : null;
                        return mapToBookingOrderResponse(order, existingCheckoutUrl);
                }

                // 1. Fetch user and the specific journey context
                User user = userRepository.findById(principal.id())
                                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

                if (!user.isActive()) {
                        throw new com.railway.ticketBooking.exception.AccountDeactivatedException(
                                        "Your account has been deactivated and cannot book tickets.");
                }

                Journey journey = findJourney(request.journeyId());

                // 2. Resolve stations and validate simple direction constraints
                RouteStop source = findRouteStop(journey.getRoute().getId(), request.sourceStationId());
                RouteStop destination = findRouteStop(journey.getRoute().getId(), request.destinationStationId());
                validateTravelDirection(source, destination);

                // 3. BULK FETCH: Get all requested seats in one database hit
                List<Seat> requestedSeats = seatRepository.findAllById(request.seatIds());
                if (requestedSeats.size() != request.seatIds().size()) {
                        throw new ResourceNotFoundException("One or more requested seats could not be found.");
                }

                // 4. DATA INTEGRITY CHECK: Ensure all requested seats belong to this journey's
                // train
                Long expectedTrainId = journey.getTrain().getId();
                for (Seat seat : requestedSeats) {
                        if (!seat.getTrain().getId().equals(expectedTrainId)) {
                                throw new IllegalArgumentException(String.format(
                                                "Seat %d does not belong to the train assigned to journey %d.",
                                                seat.getId(), journey.getId()));
                        }
                }

                // 5. BULK FETCH ACTIVE TICKETS: Get all current bookings for these specific
                // seats
                List<Ticket> activeTickets = ticketRepository.findExistingActiveTickets(journey.getId(),
                                request.seatIds());

                int reqFrom = source.getStopOrder();
                int reqTo = destination.getStopOrder();

                List<Ticket> ticketsToSave = new ArrayList<>();
                BigDecimal totalAmount = BigDecimal.ZERO;

                // 6. PROCESS LOOP: Segment validation and preparation
                for (Seat seat : requestedSeats) {
                        boolean hasOverlap = activeTickets.stream()
                                        .filter(t -> t.getSeat().getId().equals(seat.getId()))
                                        .anyMatch(t -> detectOverlap(reqFrom, reqTo, t.getSourceStopOrder(),
                                                        t.getDestinationStopOrder()));

                        if (hasOverlap) {
                                throw new SeatAlreadyBookedException(String.format(
                                                "Seat %d-%d is already booked for an overlapping segment of this journey.",
                                                seat.getCoachNumber(), seat.getSeatNumber()));
                        }

                        BigDecimal ticketFare = calculateFare(seat);
                        totalAmount = totalAmount.add(ticketFare);

                        Ticket newTicket = Ticket.builder()
                                        .user(user)
                                        .journey(journey)
                                        .seat(seat)
                                        .sourceRouteStop(source)
                                        .destinationRouteStop(destination)
                                        .sourceStopOrder(reqFrom)
                                        .destinationStopOrder(reqTo)
                                        .fare(ticketFare)
                                        .status(TicketStatus.PENDING_PAYMENT)
                                        .build();

                        ticketsToSave.add(newTicket);
                }

                // 7. ENVELOPE ASSEMBLY: Initialize parent BookingOrder and bind bi-directional
                // dependencies
                BookingOrder bookingOrder = BookingOrder.builder()
                                .user(user)
                                .totalAmount(totalAmount)
                                .status(OrderStatus.PENDING)
                                .idempotencyKey(request.idempotencyKey())
                                .tickets(ticketsToSave)
                                .build();

                // Link individual tickets to the parent order container
                for (Ticket ticket : ticketsToSave) {
                        ticket.setBookingOrder(bookingOrder);
                }

                // CascadeType.ALL will automatically save all child tickets along with the
                // master order record
                BookingOrder savedOrder = bookingOrderRepository.save(bookingOrder);

                // 8. Generate Stripe checkout session for this booking order
                String checkoutUrl = paymentService.createCheckoutSession(savedOrder);

                return mapToBookingOrderResponse(savedOrder, checkoutUrl);
        }

        // ==========================================================
        // GET MY BOOKING ORDERS (ORDER HISTORY)
        // ==========================================================

        @Transactional(readOnly = true)
        public List<BookingOrderResponse> getMyOrders(UserPrincipal principal) {
                List<BookingOrder> orders = bookingOrderRepository.findUserOrdersWithDetails(principal.id());
                return orders.stream()
                                .map(order -> mapToBookingOrderResponse(order, null))
                                .toList();
        }

        // ==========================================================
        // GET SINGLE BOOKING ORDER (RECEIPT / DETAILS)
        // ==========================================================

        @Transactional(readOnly = true)
        public BookingOrderResponse getOrderById(UserPrincipal principal, Long orderId) {
                BookingOrder order = bookingOrderRepository.findUserOrderByIdWithDetails(orderId, principal.id())
                                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));
                return mapToBookingOrderResponse(order, null);
        }

        /**
         * Clean helper mapping routine to safely unpack the stored domain tree into a
         * flat structural DTO.
         */
        private BookingOrderResponse mapToBookingOrderResponse(BookingOrder order, String checkoutUrl) {
                List<TicketResponse> ticketResponses = order.getTickets().stream()
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

                return new BookingOrderResponse(
                                order.getId(),
                                order.getIdempotencyKey(),
                                order.getTotalAmount(),
                                order.getStatus().name(),
                                checkoutUrl,
                                order.getCreatedAt(), // Pulled securely after saving or database initialization
                                ticketResponses);
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

        private BigDecimal calculateFare(Seat seat) {
                BigDecimal multiplier = pricingProperties.getMultipliers().get(seat.getSeatType());
                if (multiplier == null) {
                        throw new IllegalStateException(
                                        "Missing pricing multiplier for seat type: " + seat.getSeatType());
                }
                return seat.getTrain().getBaseSeatPrice().multiply(multiplier);
        }
}