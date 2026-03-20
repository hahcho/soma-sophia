FROM python:3.14-slim AS base
WORKDIR /app
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

# ---- dev ----
# Code and .venv are mounted via docker-compose
# Dependencies are installed on startup so the venv stays in sync with pyproject.toml
FROM base AS dev
ENV VIRTUAL_ENV=/app/.venv
ENV PATH="/app/.venv/bin:$PATH"
CMD ["sh", "-c", "uv pip install . && uvicorn main:app --host 0.0.0.0 --reload"]

# ---- prod ----
FROM base AS prod
COPY pyproject.toml .
RUN uv pip install --system --no-dev .
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--proxy-headers"]
