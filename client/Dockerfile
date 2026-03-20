# ---- dev ----
# Code and node_modules are mounted via docker-compose
# Dependencies are installed on startup so node_modules stays in sync with package-lock.json
FROM node:24-bookworm-slim AS dev
WORKDIR /app
CMD ["sh", "-c", "npm install && npm start -- --host 0.0.0.0"]

# ---- prod ----
FROM node:24-alpine AS prod
ARG API_URL
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build -- --configuration=production --define="API_URL=\"${API_URL}\""

# Minimal image just to hold the build artifacts for extraction
FROM alpine:3 AS artifacts
COPY --from=prod /app/dist/soma-sophia/browser /dist
