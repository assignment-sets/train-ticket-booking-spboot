package com.railway.ticketBooking.controller;

import com.railway.ticketBooking.dto.TicketDetailResponse;
import com.railway.ticketBooking.dto.TicketResponse;
import com.railway.ticketBooking.security.UserPrincipal;
import com.railway.ticketBooking.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    // ==========================================================
    // GET SINGLE TICKET BOARDING PASS (BY TICKET ID)
    // ==========================================================
    @GetMapping("/{ticketId}")
    public ResponseEntity<TicketDetailResponse> getTicketById(@PathVariable Long ticketId) {
        return ResponseEntity.ok(ticketService.getTicketById(ticketId));
    }

    // ==========================================================
    // GET ALL INDIVIDUAL TICKETS FOR LOGGED-IN USER
    // ==========================================================
    @GetMapping("/my-tickets")
    public ResponseEntity<List<TicketResponse>> getMyTickets(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ticketService.getMyTickets(principal));
    }
}
