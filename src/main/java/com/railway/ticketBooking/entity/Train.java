package com.railway.ticketBooking.entity;

import java.math.BigDecimal;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "trains")
@Getter
@Setter
@NoArgsConstructor
public class Train {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "train_number", nullable = false, unique = true)
    private String trainNumber;

    @Column(nullable = false)
    private String name;

    @Column(name = "total_coaches", nullable = false)
    private Integer totalCoaches;

    @Column(name = "seats_per_coach", nullable = false)
    private Integer seatsPerCoach;

    @Column(name = "base_seat_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal baseSeatPrice;
}