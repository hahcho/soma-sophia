DOCKER_EXEC = docker compose exec angular

.PHONY: lint lint-fix start build

lint:
	$(DOCKER_EXEC) npm run lint:scss

lint-fix:
	$(DOCKER_EXEC) npm run lint:scss:fix

start:
	docker compose up

build:
	$(DOCKER_EXEC) npm run build
