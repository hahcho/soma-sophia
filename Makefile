DOCKER_EXEC = docker compose exec angular

.PHONY: lint lint-fix start build start-client start-server

start-client:
	cd client && npm start -- --host 0.0.0.0

start-server:
	cd server && uv run fastapi dev main.py

lint:
	$(DOCKER_EXEC) npm run lint:scss

lint-fix:
	$(DOCKER_EXEC) npm run lint:scss:fix

start:
	docker compose up

build:
	$(DOCKER_EXEC) npm run build
