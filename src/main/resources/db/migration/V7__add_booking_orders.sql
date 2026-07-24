CREATE TABLE booking_orders (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    total_amount NUMERIC(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    idempotency_key VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_user FOREIGN KEY (user_id) REFERENCES users(id)
);

--Relational link between individual seats/tickets and their master order transaction
ALTER TABLE tickets ADD COLUMN booking_order_id BIGINT;
ALTER TABLE tickets ADD CONSTRAINT fk_ticket_booking_order 
    FOREIGN KEY (booking_order_id) REFERENCES booking_orders(id);