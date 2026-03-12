DOCKER_EXEC = docker compose exec angular

.PHONY: lint lint-fix start build

start-node:
	cd soma-sophia && npm start -- --host 0.0.0.0

lint:
	$(DOCKER_EXEC) npm run lint:scss

lint-fix:
	$(DOCKER_EXEC) npm run lint:scss:fix

start:
	docker compose up

build:
	$(DOCKER_EXEC) npm run build
