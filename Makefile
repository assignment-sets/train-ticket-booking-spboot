ifneq (,$(wildcard .env))
    include .env
    export
endif

.PHONY: dev install sync test stripe-listen db-up db-down

dev:
	./mvnw spring-boot:run

db-up:
	docker compose up -d

db-down:
	docker compose down

stripe-listen:
	stripe listen --forward-to localhost:8080/api/v1/payments/webhook

install:
	./mvnw clean install -U

sync:
	./mvnw compile

test:
	./mvnw clean test
