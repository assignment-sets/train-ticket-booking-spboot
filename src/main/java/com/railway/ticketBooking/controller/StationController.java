package com.railway.ticketBooking.controller;

import com.railway.ticketBooking.dto.StationResponse;
import com.railway.ticketBooking.service.StationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/stations")
@RequiredArgsConstructor
public class StationController {

    private final StationService stationService;

    @GetMapping
    public ResponseEntity<List<StationResponse>> getStations(
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(stationService.getAllStations(search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<StationResponse> getStationById(@PathVariable Long id) {
        return ResponseEntity.ok(stationService.getStationById(id));
    }
}
