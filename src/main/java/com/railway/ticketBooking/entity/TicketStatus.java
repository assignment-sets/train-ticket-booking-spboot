package com.railway.ticketBooking.entity;

public enum TicketStatus {
    PENDING_PAYMENT, // Locked during checkout
    CONFIRMED, // Paid and fully valid for travel
    CANCELLED
}