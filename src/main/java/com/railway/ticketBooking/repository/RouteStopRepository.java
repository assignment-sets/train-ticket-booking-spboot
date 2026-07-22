package com.railway.ticketBooking.repository;

import com.railway.ticketBooking.entity.RouteStop;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RouteStopRepository extends JpaRepository<RouteStop, Long> {

    List<RouteStop> findByRoute_IdOrderByStopOrder(Long routeId);

    Optional<RouteStop> findByRoute_IdAndStation_Id(Long routeId, Long stationId);
}