package com.railway.ticketBooking.service;

import com.railway.ticketBooking.dto.RouteStopResponse;
import com.railway.ticketBooking.dto.TrainResponse;
import com.railway.ticketBooking.dto.TrainScheduleResponse;
import com.railway.ticketBooking.entity.Journey;
import com.railway.ticketBooking.entity.Route;
import com.railway.ticketBooking.entity.RouteStop;
import com.railway.ticketBooking.entity.Train;
import com.railway.ticketBooking.exception.ResourceNotFoundException;
import com.railway.ticketBooking.repository.JourneyRepository;
import com.railway.ticketBooking.repository.RouteRepository;
import com.railway.ticketBooking.repository.RouteStopRepository;
import com.railway.ticketBooking.repository.TrainRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TrainService {

    private final TrainRepository trainRepository;
    private final RouteRepository routeRepository;
    private final RouteStopRepository routeStopRepository;
    private final JourneyRepository journeyRepository;

    public List<TrainResponse> getAllTrains() {
        return trainRepository.findAll().stream()
                .map(TrainResponse::fromEntity)
                .toList();
    }

    public TrainResponse getTrainById(Long id) {
        return trainRepository.findById(id)
                .map(TrainResponse::fromEntity)
                .orElseThrow(() -> new ResourceNotFoundException("Train not found with ID: " + id));
    }

    public TrainScheduleResponse getTrainSchedule(Long trainId) {
        Train train = trainRepository.findById(trainId)
                .orElseThrow(() -> new ResourceNotFoundException("Train not found with ID: " + trainId));

        Route route = routeRepository.findByTrain_Id(trainId)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found for train ID: " + trainId));

        return buildScheduleResponse(train, route);
    }

    public TrainScheduleResponse getScheduleByJourneyId(Long journeyId) {
        Journey journey = journeyRepository.findById(journeyId)
                .orElseThrow(() -> new ResourceNotFoundException("Journey not found with ID: " + journeyId));

        return buildScheduleResponse(journey.getTrain(), journey.getRoute());
    }

    private TrainScheduleResponse buildScheduleResponse(Train train, Route route) {
        List<RouteStop> stops = routeStopRepository.findStopsWithStationByRouteId(route.getId());

        List<RouteStopResponse> stopResponses = stops.stream()
                .map(RouteStopResponse::fromEntity)
                .toList();

        return new TrainScheduleResponse(
                train.getId(),
                train.getTrainNumber(),
                train.getName(),
                route.getId(),
                route.getName(),
                train.getTotalCoaches(),
                train.getSeatsPerCoach(),
                train.getBaseSeatPrice(),
                stopResponses
        );
    }
}
