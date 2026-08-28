package com.railway.ticketBooking.service;

import com.railway.ticketBooking.dto.StationResponse;
import com.railway.ticketBooking.exception.ResourceNotFoundException;
import com.railway.ticketBooking.repository.StationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StationService {

    private final StationRepository stationRepository;

    public List<StationResponse> getAllStations(String query) {
        if (query != null && !query.trim().isEmpty()) {
            return stationRepository.searchStations(query.trim()).stream()
                    .map(StationResponse::fromEntity)
                    .toList();
        }
        return stationRepository.findAllByOrderByNameAsc().stream()
                .map(StationResponse::fromEntity)
                .toList();
    }

    public StationResponse getStationById(Long id) {
        return stationRepository.findById(id)
                .map(StationResponse::fromEntity)
                .orElseThrow(() -> new ResourceNotFoundException("Station not found with id: " + id));
    }
}
