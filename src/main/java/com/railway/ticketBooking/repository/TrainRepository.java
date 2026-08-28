package com.railway.ticketBooking.repository;

import com.railway.ticketBooking.entity.Train;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrainRepository extends JpaRepository<Train, Long> {
}
