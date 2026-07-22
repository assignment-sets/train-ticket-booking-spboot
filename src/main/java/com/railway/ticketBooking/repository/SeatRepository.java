package com.railway.ticketBooking.repository;

import com.railway.ticketBooking.entity.Seat;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SeatRepository extends JpaRepository<Seat, Long> {

    List<Seat> findByTrain_Id(Long trainId);
}