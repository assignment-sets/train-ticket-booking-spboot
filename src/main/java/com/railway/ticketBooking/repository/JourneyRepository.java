package com.railway.ticketBooking.repository;

import com.railway.ticketBooking.dto.TrainSearchResponse;
import com.railway.ticketBooking.entity.Journey;
import com.railway.ticketBooking.entity.JourneyStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface JourneyRepository extends JpaRepository<Journey, Long> {

    @Query("""
            SELECT new com.railway.ticketBooking.dto.TrainSearchResponse(
                j.id,
                t.id,
                t.trainNumber,
                t.name,
                source.departureTime,
                destination.arrivalTime
            )
            FROM Journey j
            JOIN j.train t
            JOIN j.route r
            JOIN r.routeStops source
            JOIN r.routeStops destination
            WHERE j.journeyDate = :journeyDate
            AND j.status = :status
            AND source.station.id = :sourceStationId
            AND destination.station.id = :destinationStationId
            AND source.stopOrder < destination.stopOrder
            ORDER BY source.departureTime
            """)

    List<TrainSearchResponse> searchTrains(
            @Param("sourceStationId") Long sourceStationId,
            @Param("destinationStationId") Long destinationStationId,
            @Param("journeyDate") LocalDate journeyDate,
            @Param("status") JourneyStatus status);
}