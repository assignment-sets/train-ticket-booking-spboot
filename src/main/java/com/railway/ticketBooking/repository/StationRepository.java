package com.railway.ticketBooking.repository;

import com.railway.ticketBooking.entity.Station;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StationRepository extends JpaRepository<Station, Long> {

    List<Station> findAllByOrderByNameAsc();

    @Query("""
            SELECT s FROM Station s
            WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%'))
               OR LOWER(s.code) LIKE LOWER(CONCAT('%', :query, '%'))
               OR LOWER(s.city) LIKE LOWER(CONCAT('%', :query, '%'))
            ORDER BY s.name ASC
            """)
    List<Station> searchStations(@Param("query") String query);
}
