package com.railway.ticketBooking.repository;

import com.railway.ticketBooking.entity.RouteStop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RouteStopRepository extends JpaRepository<RouteStop, Long> {

    List<RouteStop> findByRoute_IdOrderByStopOrder(Long routeId);

    @Query("""
            SELECT rs FROM RouteStop rs
            JOIN FETCH rs.station
            WHERE rs.route.id = :routeId
            ORDER BY rs.stopOrder ASC
            """)
    List<RouteStop> findStopsWithStationByRouteId(@Param("routeId") Long routeId);

    Optional<RouteStop> findByRoute_IdAndStation_Id(Long routeId, Long stationId);
}