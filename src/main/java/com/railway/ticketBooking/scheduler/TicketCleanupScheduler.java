package com.railway.ticketBooking.scheduler;

import com.railway.ticketBooking.entity.BookingOrder;
import com.railway.ticketBooking.entity.OrderStatus;
import com.railway.ticketBooking.entity.Ticket;
import com.railway.ticketBooking.entity.TicketStatus;
import com.railway.ticketBooking.repository.BookingOrderRepository;
import com.railway.ticketBooking.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class TicketCleanupScheduler {

    private final TicketRepository ticketRepository;
    private final BookingOrderRepository bookingOrderRepository;

    @Scheduled(cron = "0 */2 * * * *") // Runs every 2 minutes
    @Transactional
    public void releaseExpiredSeatLocks() {
        // Find tickets locked more than 5 minutes ago
        LocalDateTime thresholdTime = LocalDateTime.now().minusMinutes(5);

        List<Ticket> expiredTickets = ticketRepository
                .findByStatusAndBookingTimeBefore(TicketStatus.PENDING_PAYMENT, thresholdTime);

        if (!expiredTickets.isEmpty()) {
            log.info("Found {} expired individual seat locks. Processing cancellation context...",
                    expiredTickets.size());

            // 1. Mark all expired tickets as CANCELLED
            for (Ticket ticket : expiredTickets) {
                ticket.setStatus(TicketStatus.CANCELLED);
            }
            ticketRepository.saveAll(expiredTickets);

            // 2. Identify the unique parent BookingOrders attached to these expired tickets
            Set<BookingOrder> parentOrders = expiredTickets.stream()
                    .map(Ticket::getBookingOrder)
                    .filter(order -> order != null && order.getStatus() == OrderStatus.PENDING)
                    .collect(Collectors.toSet());

            if (!parentOrders.isEmpty()) {
                log.info("Updating {} corresponding parent booking orders to EXPIRED.", parentOrders.size());

                // 3. Mark the parent master transactions as EXPIRED
                for (BookingOrder order : parentOrders) {
                    order.setStatus(OrderStatus.EXPIRED);
                }
                bookingOrderRepository.saveAll(parentOrders);
            }
        }
    }
}