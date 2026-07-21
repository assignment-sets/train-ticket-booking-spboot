package com.railway.ticketBooking.service;

import com.railway.ticketBooking.dto.UserResponse;
import com.railway.ticketBooking.entity.User;
import com.railway.ticketBooking.exception.ResourceNotFoundException;
import com.railway.ticketBooking.repository.UserRepository;
import com.railway.ticketBooking.security.UserPrincipal;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserResponse getCurrentUser(UserPrincipal principal) {

        User user = userRepository.findById(principal.id())
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found."));

        return toResponse(user);
    }

    public UserResponse getUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User with id " + id + " not found."));

        return toResponse(user);
    }

    public List<UserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public void deleteUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User with id " + id + " not found."));

        userRepository.delete(user);
    }

    private UserResponse toResponse(User user) {

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getCreatedAt());
    }
}