.PHONY: dev

dev:
	mvn spring-boot:run
install:
	mvn clean install -U