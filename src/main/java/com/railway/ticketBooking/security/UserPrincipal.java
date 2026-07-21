package com.railway.ticketBooking.security;

import com.railway.ticketBooking.entity.Role;

public record UserPrincipal(
                Long id,
                String email,
                Role role) {
}