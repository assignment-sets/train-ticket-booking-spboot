package com.railway.ticketBooking.controller;

import com.railway.ticketBooking.dto.CheckoutRequest;
import com.railway.ticketBooking.security.UserPrincipal;
import com.railway.ticketBooking.service.PaymentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    // ==========================================================
    // INITIATE CHECKOUT
    // ==========================================================

    @PostMapping("/checkout")
    public ResponseEntity<Map<String, String>> initiateCheckout(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CheckoutRequest request) {

        // Maps directly into your Security context principal if needed
        String checkoutUrl = paymentService.createCheckoutSession(request);

        return ResponseEntity.ok(Map.of("url", checkoutUrl));
    }

    // ==========================================================
    // STRIPE WEBHOOK LISTENER
    // ==========================================================

    @PostMapping("/webhook")
    public ResponseEntity<String> handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {

        paymentService.processWebhookEvent(payload, sigHeader);

        return ResponseEntity.ok("Event received and validated successfully");
    }
}