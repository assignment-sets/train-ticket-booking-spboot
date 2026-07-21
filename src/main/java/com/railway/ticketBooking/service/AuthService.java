package com.railway.ticketBooking.service;

import com.railway.ticketBooking.dto.AuthResponse;
import com.railway.ticketBooking.dto.LoginRequest;
import com.railway.ticketBooking.dto.RegisterRequest;
import com.railway.ticketBooking.entity.Role;
import com.railway.ticketBooking.entity.User;
import com.railway.ticketBooking.jwt.JwtService;
import com.railway.ticketBooking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email address is already registered.");
        }

        User user = new User();
        user.setName(request.name());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(Role.USER); // Defaulting new registrations to standard user access level

        User savedUser = userRepository.save(user);
        String token = jwtService.generateToken(savedUser.getId(), savedUser.getEmail(), savedUser.getRole());

        return new AuthResponse(token, savedUser.getEmail(), savedUser.getRole().name());
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email credentials or password."));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email credentials or password.");
        }

        String token = jwtService.generateToken(user.getId(), user.getEmail(), user.getRole());

        return new AuthResponse(token, user.getEmail(), user.getRole().name());
    }
}