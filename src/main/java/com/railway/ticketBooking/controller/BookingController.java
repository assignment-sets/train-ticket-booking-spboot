package com.railway.ticketBooking.controller;

import com.railway.ticketBooking.dto.AvailableSeatResponse;
import com.railway.ticketBooking.dto.BookTicketRequest;
import com.railway.ticketBooking.dto.SearchTrainRequest;
import com.railway.ticketBooking.dto.TicketResponse;
import com.railway.ticketBooking.dto.TrainSearchResponse;
import com.railway.ticketBooking.security.UserPrincipal;
import com.railway.ticketBooking.service.BookingService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    // ==========================================================
    // SEARCH TRAINS
    // ==========================================================

    @PostMapping("/search")
    public ResponseEntity<List<TrainSearchResponse>> searchTrains(
            @Valid @RequestBody SearchTrainRequest request) {

        return ResponseEntity.ok(
                bookingService.searchTrains(request));
    }

    // ==========================================================
    // AVAILABLE SEATS
    // ==========================================================

    @GetMapping("/{journeyId}/available-seats")
    public ResponseEntity<List<AvailableSeatResponse>> getAvailableSeats(

            @PathVariable Long journeyId,

            @RequestParam Long sourceStationId,

            @RequestParam Long destinationStationId) {

        return ResponseEntity.ok(
                bookingService.getAvailableSeats(
                        journeyId,
                        sourceStationId,
                        destinationStationId));
    }

    // ==========================================================
    // BOOK TICKETS
    // ==========================================================

    @PostMapping
    public ResponseEntity<List<TicketResponse>> bookTickets(

            @AuthenticationPrincipal UserPrincipal principal,

            @Valid @RequestBody BookTicketRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(
                        bookingService.bookTickets(
                                principal,
                                request));
    }
}