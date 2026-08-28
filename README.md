# Train Ticket Booking System - Backend

A Spring Boot backend application for a railway ticket booking system using PostgreSQL, Flyway, and Stripe.

---

## Key Features & Design

- **Dynamic Segment Overlap Detection**: Seats are allocated along ordered route stop sequences (`stop_order`), allowing non-overlapping station intervals to share the same physical seat on a single train:
  ```
  overlap = (reqFrom < bookedTo) && (bookedFrom < reqTo)
  ```
- **2D Visual Coach Seating Matrix**: Returns all coach seats with real-time availability status (`AVAILABLE` vs `BOOKED`) and pre-calculated fares for UI rendering.
- **Order & Ticket State Machines**: Manages reservations (`PENDING_PAYMENT` → `CONFIRMED` / `CANCELLED`), order tracking (`PENDING` → `PAID` / `EXPIRED`), idempotency keys, and Stripe webhook verification.
- **Automated Hold TTL**: An internal scheduled task automatically cancels abandoned checkout holds after 5 minutes to release seats.
- **Soft Deletes**: Uses an `is_active` flag to deactivate users while preserving historical ticket and payment records.

---

## Tech Stack

- Java 21 & Spring Boot 3
- PostgreSQL & Spring Data JPA (Hibernate)
- Flyway Database Migrations
- Spring Security 6 & JWT
- Stripe Java SDK (Hosted Checkout & Webhooks)
- Docker Compose & GNU Make

---

## Local Setup

### Prerequisites
- Java 21 JDK
- Docker & Docker Compose
- Stripe CLI *(optional, for local webhook testing)*

### 1. Clone the Repository
```bash
git clone https://github.com/assignment-sets/train-ticket-booking-spboot.git
cd train-ticket-booking-spboot
```

### 2. Configure Environment
```bash
cp .env.example .env
```

### 3. Start Database
```bash
make db-up
# Alternatively: docker compose up -d
```

### 4. Build Dependencies
```bash
make install
```

### 5. Run Application
```bash
make dev
```
The server starts at `http://localhost:8080`.

### 6. (Optional) Run Stripe Webhook Listener
```bash
make stripe-listen
```

---

## API Documentation

Interactive Swagger API documentation and OpenAPI schemas are available when the server is running at:
- **Swagger UI**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **OpenAPI JSON**: [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

---

## Future Roadmap / TODOs

- [ ] **1. Shorter Hold Timers**: Reduce checkout reservation hold duration from 10–15 minutes down to 3–5 minutes during peak hours to prevent seats from being blocked for too long.
- [ ] **2. Redis Distributed In-Memory TTL Locks**: Transition temporary seat locking during checkout to Redis (`SET seat:{id}:journey:{id} {userId} EX 300 NX`) to achieve ultra-low latency and eliminate unnecessary database writes.
- [ ] **3. Account Quotas, Rate Limiting & CAPTCHA Protection**: Implement per-user concurrent pending order limits (e.g., maximum 1 pending order per account) and checkout rate limiting to protect against Denial-of-Inventory (DoI) / cart hoarding attacks.
- [ ] **4. Priority Waitlist Queue (RAC / WL)**: Implement a waitlist mechanism that automatically reassigns abandoned, expired, or cancelled seats directly to queued passengers in priority order.
- [ ] **5. Admin Catalog Management API (`ROLE_ADMIN`)**: Build dedicated CRUD endpoints for administrators to dynamically add/manage new stations, trains with coach seat configurations, routes with ordered route stops, and scheduled train journeys without relying on static SQL migrations.
