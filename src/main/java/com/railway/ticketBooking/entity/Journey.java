package com.railway.ticketBooking.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "journeys")
@Getter
@Setter
@NoArgsConstructor
public class Journey {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "train_id", nullable = false)
    private Train train;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "route_id", nullable = false)
    private Route route;

    @Column(name = "journey_date", nullable = false)
    private LocalDate journeyDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private JourneyStatus status;
}