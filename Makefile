.PHONY: start lint lint-fix build

start:
	docker compose up

lint:
	docker compose exec angular npm run lint:scss
	docker compose exec server sh -c "uv run ruff check . && uv run ruff format --check . && uv run pyright ."

lint-fix:
	docker compose exec angular npm run lint:scss:fix
	docker compose exec server sh -c "uv run ruff check --fix . && uv run ruff format ."

build:
	docker compose exec angular npm run build
