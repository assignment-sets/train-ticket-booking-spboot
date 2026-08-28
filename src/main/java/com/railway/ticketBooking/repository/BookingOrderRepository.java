package com.railway.ticketBooking.repository;

import com.railway.ticketBooking.entity.BookingOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BookingOrderRepository extends JpaRepository<BookingOrder, Long> {

    // Used to detect duplicate requests before execution loops fire
    Optional<BookingOrder> findByIdempotencyKey(String idempotencyKey);

    @Query("""
            SELECT DISTINCT bo FROM BookingOrder bo
            LEFT JOIN FETCH bo.tickets t
            LEFT JOIN FETCH t.journey j
            LEFT JOIN FETCH j.train tr
            LEFT JOIN FETCH t.seat s
            LEFT JOIN FETCH t.sourceRouteStop srs
            LEFT JOIN FETCH srs.station sstat
            LEFT JOIN FETCH t.destinationRouteStop drs
            LEFT JOIN FETCH drs.station dstat
            WHERE bo.user.id = :userId
            ORDER BY bo.createdAt DESC
            """)
    List<BookingOrder> findUserOrdersWithDetails(@Param("userId") Long userId);

    @Query("""
            SELECT bo FROM BookingOrder bo
            LEFT JOIN FETCH bo.tickets t
            LEFT JOIN FETCH t.journey j
            LEFT JOIN FETCH j.train tr
            LEFT JOIN FETCH t.seat s
            LEFT JOIN FETCH t.sourceRouteStop srs
            LEFT JOIN FETCH srs.station sstat
            LEFT JOIN FETCH t.destinationRouteStop drs
            LEFT JOIN FETCH drs.station dstat
            WHERE bo.id = :orderId AND bo.user.id = :userId
            """)
    Optional<BookingOrder> findUserOrderByIdWithDetails(@Param("orderId") Long orderId, @Param("userId") Long userId);
}