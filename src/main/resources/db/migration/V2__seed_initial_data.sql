-- ==========================================
-- Seed Stations
-- ==========================================

INSERT INTO stations (code, name, city, state)
VALUES
    ('HWH',  'Howrah Junction',   'Howrah',   'West Bengal'),
    ('BWN',  'Bardhaman Junction','Bardhaman','West Bengal'),
    ('DGR',  'Durgapur',          'Durgapur', 'West Bengal'),
    ('ASN',  'Asansol Junction',  'Asansol',  'West Bengal'),
    ('DHN',  'Dhanbad Junction',  'Dhanbad',  'Jharkhand'),
    ('PNBE', 'Patna Junction',    'Patna',    'Bihar'),
    ('CNB',  'Kanpur Central',    'Kanpur',   'Uttar Pradesh'),
    ('NDLS', 'New Delhi',         'Delhi',    'Delhi');

-- ==========================================
-- Seed Train
-- ==========================================

INSERT INTO trains (
    train_number,
    name,
    total_coaches,
    seats_per_coach
)
VALUES (
    '12301',
    'Rajdhani Express',
    10,
    18
);

-- ==========================================
-- Seed Route
-- ==========================================

INSERT INTO routes (
    train_id,
    name
)
VALUES (
    1,
    'Howrah to New Delhi'
);

-- ==========================================
-- Seed Route Stops
-- ==========================================

INSERT INTO route_stops (
    route_id,
    station_id,
    stop_order,
    arrival_time,
    departure_time
)
VALUES
    (1, 1, 1, NULL,    '08:00'),
    (1, 2, 2, '09:30', '09:35'),
    (1, 3, 3, '10:40', '10:45'),
    (1, 4, 4, '11:30', '11:35'),
    (1, 5, 5, '12:50', '12:55'),
    (1, 6, 6, '15:30', '15:40'),
    (1, 7, 7, '20:15', '20:20'),
    (1, 8, 8, '23:00', NULL);

-- ==========================================
-- Seed Journey
-- ==========================================

INSERT INTO journeys (
    train_id,
    route_id,
    journey_date,
    status
)
VALUES (
    1,
    1,
    DATE '2026-07-22',
    'SCHEDULED'
);

-- ==========================================
-- Seed Seats
-- ==========================================

INSERT INTO seats (
    coach_number,
    seat_number,
    seat_type
)
SELECT
    coach,
    seat,
    CASE
        WHEN (seat - 1) % 3 = 0 THEN 'WINDOW'
        WHEN (seat - 1) % 3 = 1 THEN 'MIDDLE'
        ELSE 'AISLE'
    END
FROM generate_series(1, 10) AS coach
CROSS JOIN generate_series(1, 18) AS seat;