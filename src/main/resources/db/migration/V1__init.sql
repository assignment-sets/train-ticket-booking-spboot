-- ==========================
-- USERS
-- ==========================

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(255) NOT NULL UNIQUE,

    password VARCHAR(255) NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ==========================
-- STATIONS
-- ==========================

CREATE TABLE stations (
    id BIGSERIAL PRIMARY KEY,

    code VARCHAR(10) NOT NULL UNIQUE,

    name VARCHAR(100) NOT NULL,

    city VARCHAR(100) NOT NULL,

    state VARCHAR(100)
);

-- ==========================
-- TRAINS
-- ==========================

CREATE TABLE trains (
    id BIGSERIAL PRIMARY KEY,

    train_number VARCHAR(20) NOT NULL UNIQUE,

    name VARCHAR(100) NOT NULL,

    total_coaches INTEGER NOT NULL,

    seats_per_coach INTEGER NOT NULL
);

-- ==========================
-- ROUTES
-- ==========================

CREATE TABLE routes (
    id BIGSERIAL PRIMARY KEY,

    train_id BIGINT NOT NULL UNIQUE,

    name VARCHAR(100),

    CONSTRAINT fk_route_train
        FOREIGN KEY (train_id)
        REFERENCES trains(id)
        ON DELETE CASCADE
);

-- ==========================
-- ROUTE STOPS
-- ==========================

CREATE TABLE route_stops (
    id BIGSERIAL PRIMARY KEY,

    route_id BIGINT NOT NULL,

    station_id BIGINT NOT NULL,

    stop_order INTEGER NOT NULL,

    arrival_time TIME,

    departure_time TIME,

    CONSTRAINT fk_route_stop_route
        FOREIGN KEY (route_id)
        REFERENCES routes(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_route_stop_station
        FOREIGN KEY (station_id)
        REFERENCES stations(id),

    CONSTRAINT uq_route_stop_order
        UNIQUE(route_id, stop_order)
);

-- ==========================
-- JOURNEYS
-- ==========================

CREATE TABLE journeys (
    id BIGSERIAL PRIMARY KEY,

    train_id BIGINT NOT NULL,

    route_id BIGINT NOT NULL,

    journey_date DATE NOT NULL,

    status VARCHAR(20) NOT NULL,

    CONSTRAINT fk_journey_train
        FOREIGN KEY (train_id)
        REFERENCES trains(id),

    CONSTRAINT fk_journey_route
        FOREIGN KEY (route_id)
        REFERENCES routes(id),

    CONSTRAINT uq_train_date
        UNIQUE(train_id, journey_date)
);

-- ==========================
-- SEATS
-- ==========================

CREATE TABLE seats (
    id BIGSERIAL PRIMARY KEY,

    coach_number INTEGER NOT NULL,

    seat_number INTEGER NOT NULL,

    seat_type VARCHAR(20) NOT NULL,

    CONSTRAINT uq_seat
        UNIQUE(coach_number, seat_number)
);

-- ==========================
-- TICKETS
-- ==========================

CREATE TABLE tickets (
    id BIGSERIAL PRIMARY KEY,

    user_id BIGINT NOT NULL,

    journey_id BIGINT NOT NULL,

    seat_id BIGINT NOT NULL,

    source_route_stop_id BIGINT NOT NULL,

    destination_route_stop_id BIGINT NOT NULL,

    booking_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    fare NUMERIC(10,2) NOT NULL,

    status VARCHAR(20) NOT NULL,

    CONSTRAINT fk_ticket_user
        FOREIGN KEY (user_id)
        REFERENCES users(id),

    CONSTRAINT fk_ticket_journey
        FOREIGN KEY (journey_id)
        REFERENCES journeys(id),

    CONSTRAINT fk_ticket_seat
        FOREIGN KEY (seat_id)
        REFERENCES seats(id),

    CONSTRAINT fk_ticket_source
        FOREIGN KEY (source_route_stop_id)
        REFERENCES route_stops(id),

    CONSTRAINT fk_ticket_destination
        FOREIGN KEY (destination_route_stop_id)
        REFERENCES route_stops(id)
);

-- ==========================
-- PAYMENTS
-- ==========================

CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,

    ticket_id BIGINT NOT NULL UNIQUE,

    stripe_payment_id VARCHAR(255),

    amount NUMERIC(10,2) NOT NULL,

    status VARCHAR(20) NOT NULL,

    payment_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_payment_ticket
        FOREIGN KEY (ticket_id)
        REFERENCES tickets(id)
);