DOCKER_EXEC = docker compose exec angular

.PHONY: start build start-client start-server lint-client lint-client-fix lint-server lint-server-fix

start-client:
	cd client && npm start -- --host 0.0.0.0

start-server:
	cd server && uv run fastapi dev main.py

lint-client:
	cd client && npm run lint:scss

lint-client-fix:
	cd client && npm run lint:scss:fix

lint-server:
	cd server && uv run ruff check . && uv run ruff format --check .

lint-server-fix:
	cd server && uv run ruff check --fix . && uv run ruff format .

start:
	docker compose up

build:
	$(DOCKER_EXEC) npm run build
