package com.railway.ticketBooking.controller;

import com.railway.ticketBooking.entity.Payment;
import com.railway.ticketBooking.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/booking")
@RequiredArgsConstructor
public class PaymentTestController {

    private final PaymentRepository paymentRepository;

    // ==========================================================
    // SUCCESS REDIRECT PAGE
    // ==========================================================
    @GetMapping("/success")
    public String handleSuccess(@RequestParam("bookingId") String sessionId) {
        // Query the audit database ledger using Stripe's reference token
        List<Payment> payments = paymentRepository.findByStripePaymentId(sessionId);

        StringBuilder html = new StringBuilder();
        html.append("<html><body style='font-family: sans-serif; padding: 40px;'>");
        html.append("<h1 style='color: #2e7d32;'>🎉 Payment Successful!</h1>");
        html.append("<p>Stripe Checkout Session ID: <code>").append(sessionId).append("</code></p>");
        html.append("<hr/>");

        if (!payments.isEmpty()) {
            html.append("<h3>Database Record Verified Status:</h3>");

            // Calculate the total aggregated amount across all tickets
            java.math.BigDecimal totalAmount = payments.stream()
                    .map(Payment::getAmount)
                    .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);

            html.append("<p><strong>Total Tickets Provisioned:</strong> ").append(payments.size()).append("</p>");
            html.append("<p><strong>Total Amount Captured:</strong> $").append(totalAmount).append("</p>");

            html.append("<h4>Individual Item Ledger Breakdown:</h4>");
            html.append("<ul>");

            // Loop through each payment record to show the 1-to-1 seat mapping
            for (Payment p : payments) {
                html.append(
                        "<li style='margin-bottom: 10px; padding: 10px; background-color: #f5f5f5; border-radius: 5px;'>");
                html.append("<strong>Ledger ID:</strong> ").append(p.getId());
                html.append(" | <strong>Ticket ID:</strong> ").append(p.getTicketId());
                html.append(" | <strong>Amount:</strong> $").append(p.getAmount());
                html.append(" | <strong>Status:</strong> <span style='color: green;'>").append(p.getStatus())
                        .append("</span>");
                html.append("</li>");
            }
            html.append("</ul>");

            html.append(
                    "<p style='color: green;'><strong>✔ Webhook fired and synced database atomic state successfully!</strong></p>");
        } else {
            html.append(
                    "<p style='color: #d32f2f;'><strong>⌛ Webhook processing pending:</strong> Order captured by Stripe, but backend ledger sync hasn't written to the database yet. Refresh in a second.</p>");
        }

        html.append("</body></html>");
        return html.toString();
    }

    // ==========================================================
    // CANCEL REDIRECT PAGE
    // ==========================================================
    @GetMapping("/cancel")
    public String handleCancel() {
        return "<html><body style='font-family: sans-serif; padding: 40px;'>" +
                "<h1 style='color: #c62828;'>❌ Checkout Canceled</h1>" +
                "<p>The payment session was abandoned or terminated by the user. The database order remains in <code>PENDING</code> state.</p>"
                +
                "</body></html>";
    }
}