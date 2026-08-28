package com.railway.ticketBooking.repository;

import com.railway.ticketBooking.entity.Route;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RouteRepository extends JpaRepository<Route, Long> {
    Optional<Route> findByTrain_Id(Long trainId);
}
