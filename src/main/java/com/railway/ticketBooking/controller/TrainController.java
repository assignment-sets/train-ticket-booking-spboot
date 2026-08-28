package com.railway.ticketBooking.controller;

import com.railway.ticketBooking.dto.TrainResponse;
import com.railway.ticketBooking.dto.TrainScheduleResponse;
import com.railway.ticketBooking.service.TrainService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/trains")
@RequiredArgsConstructor
public class TrainController {

    private final TrainService trainService;

    @GetMapping
    public ResponseEntity<List<TrainResponse>> getAllTrains() {
        return ResponseEntity.ok(trainService.getAllTrains());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrainResponse> getTrainById(@PathVariable Long id) {
        return ResponseEntity.ok(trainService.getTrainById(id));
    }

    @GetMapping("/{id}/schedule")
    public ResponseEntity<TrainScheduleResponse> getTrainSchedule(@PathVariable Long id) {
        return ResponseEntity.ok(trainService.getTrainSchedule(id));
    }

    @GetMapping("/journeys/{journeyId}/schedule")
    public ResponseEntity<TrainScheduleResponse> getScheduleByJourneyId(@PathVariable Long journeyId) {
        return ResponseEntity.ok(trainService.getScheduleByJourneyId(journeyId));
    }
}
