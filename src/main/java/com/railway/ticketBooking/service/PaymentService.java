package com.railway.ticketBooking.service;

import com.railway.ticketBooking.config.StripeProperties;
import com.railway.ticketBooking.dto.CheckoutRequest;
import com.railway.ticketBooking.entity.BookingOrder;
import com.railway.ticketBooking.entity.OrderStatus;
import com.railway.ticketBooking.entity.Payment;
import com.railway.ticketBooking.entity.PaymentStatus;
import com.railway.ticketBooking.entity.Ticket;
import com.railway.ticketBooking.entity.TicketStatus;
import com.railway.ticketBooking.exception.PaymentException;
import com.railway.ticketBooking.exception.ResourceNotFoundException;
import com.railway.ticketBooking.repository.BookingOrderRepository;
import com.railway.ticketBooking.repository.PaymentRepository;
import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.stripe.net.ApiResource;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final StripeProperties stripeProperties;
    private final BookingOrderRepository bookingOrderRepository;
    private final PaymentRepository paymentRepository;

    @PostConstruct
    public void initStripe() {
        Stripe.apiKey = stripeProperties.getSecretKey();
    }

    @Transactional(readOnly = true)
    public String createCheckoutSession(CheckoutRequest request) {
        // 1. Target the complete transaction intent envelope
        BookingOrder order = bookingOrderRepository.findById(request.bookingOrderId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Booking order not found with ID: " + request.bookingOrderId()));

        // 2. Tampering Prevention: Validate database aggregated sum against client
        // payload
        if (order.getTotalAmount().compareTo(request.expectedAmount()) != 0) {
            log.error("Price mismatch detected! Order DB Sum: {}, Client Request Sum: {}", order.getTotalAmount(),
                    request.expectedAmount());
            throw new PaymentException("Transaction validation failed: Amount mismatch.");
        }

        // 3. Status Guard: Must be outstanding pending intent
        if (order.getStatus() != OrderStatus.PENDING) {
            throw new PaymentException("Order cannot be processed. Current status: " + order.getStatus());
        }

        // 4. Ingest total checkout balance converted to subunit cents
        long totalAmountInCents = order.getTotalAmount().multiply(BigDecimal.valueOf(100)).longValue();

        try {
            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl(stripeProperties.getSuccessUrl())
                    .setCancelUrl(stripeProperties.getCancelUrl())
                    .putMetadata("bookingOrderId", String.valueOf(order.getId()))
                    .addLineItem(
                            SessionCreateParams.LineItem.builder()
                                    .setQuantity(1L)
                                    .setPriceData(
                                            SessionCreateParams.LineItem.PriceData.builder()
                                                    .setCurrency("usd")
                                                    .setUnitAmount(totalAmountInCents)
                                                    .setProductData(
                                                            SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                    .setName("Railway Ticket Reservation Bundle")
                                                                    .setDescription("Total items: "
                                                                            + order.getTickets().size()
                                                                            + " seats. Order ID: " + order.getId())
                                                                    .build())
                                                    .build())
                                    .build())
                    .build();

            Session session = Session.create(params);
            return session.getUrl();

        } catch (StripeException e) {
            log.error("Failed to generate secure Stripe checkout portal URL", e);
            throw new PaymentException("Payment gateway handshake failure", e);
        }
    }

    @Transactional
    public void processWebhookEvent(String payload, String sigHeader) {
        Event event;
        try {
            event = Webhook.constructEvent(payload, sigHeader, stripeProperties.getWebhookSecret());
        } catch (SignatureVerificationException e) {
            log.error("Webhook signature verification failed!");
            throw new PaymentException("Invalid signature verification token");
        }

        if ("checkout.session.completed".equals(event.getType())) {
            try {
                EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();

                Session session;
                if (dataObjectDeserializer.getObject().isPresent()) {
                    session = (Session) dataObjectDeserializer.getObject().get();
                } else {
                    session = ApiResource.GSON.fromJson(dataObjectDeserializer.getRawJson(), Session.class);
                    if (session == null) {
                        throw new PaymentException(
                                "Failed to extract session payload context (raw fallback also failed)");
                    }
                }

                String orderIdStr = session.getMetadata().get("bookingOrderId");
                if (orderIdStr == null) {
                    throw new PaymentException("Malformed webhook execution context: Missing bookingOrderId metadata.");
                }

                handleSuccessfulPayment(Long.parseLong(orderIdStr), session);
            } catch (Exception e) {
                log.error("CRITICAL: Error processing checkout.session.completed webhook", e);
                throw new PaymentException("Webhook internal processing failed: " + e.getMessage(), e);
            }
        }
    }

    private void handleSuccessfulPayment(Long orderId, Session session) {
        BookingOrder order = bookingOrderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Booking order target missing for tracking ID: " + orderId));

        if (order.getStatus() == OrderStatus.PAID) {
            log.info("Booking Order {} already settled.", orderId);
            return;
        }

        order.setStatus(OrderStatus.PAID);

        for (Ticket ticket : order.getTickets()) {
            ticket.setStatus(TicketStatus.CONFIRMED);

            Payment entry = Payment.builder()
                    .ticketId(ticket.getId())
                    .stripePaymentId(session.getId()) // FIX: Saving the Checkout Session ID so verification page can
                                                      // find it!
                    .amount(ticket.getFare())
                    .status(PaymentStatus.SUCCESS)
                    .build();

            paymentRepository.save(entry);
        }

        bookingOrderRepository.save(order);
        log.info("✔ Successfully settled and audited Booking Order cluster ID: {}", orderId);
    }
}