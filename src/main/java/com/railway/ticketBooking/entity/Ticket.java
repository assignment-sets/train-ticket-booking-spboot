package com.railway.ticketBooking.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tickets")
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ------------------------------------------------------------------------
    // User
    // ------------------------------------------------------------------------

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // ------------------------------------------------------------------------
    // Journey
    // ------------------------------------------------------------------------

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "journey_id", nullable = false)
    private Journey journey;

    // ------------------------------------------------------------------------
    // Seat
    // ------------------------------------------------------------------------

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seat_id", nullable = false)
    private Seat seat;

    // ------------------------------------------------------------------------
    // Boarding Station
    // ------------------------------------------------------------------------

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_route_stop_id", nullable = false)
    private RouteStop sourceRouteStop;

    // ------------------------------------------------------------------------
    // Destination Station
    // ------------------------------------------------------------------------

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destination_route_stop_id", nullable = false)
    private RouteStop destinationRouteStop;

    // ------------------------------------------------------------------------
    // Cached stop orders
    // ------------------------------------------------------------------------

    @Column(name = "source_stop_order", nullable = false)
    private Integer sourceStopOrder;

    @Column(name = "destination_stop_order", nullable = false)
    private Integer destinationStopOrder;

    // ------------------------------------------------------------------------
    // Booking metadata
    // ------------------------------------------------------------------------

    @Column(name = "booking_time", nullable = false, insertable = false, updatable = false)
    private LocalDateTime bookingTime;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal fare;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketStatus status;
}