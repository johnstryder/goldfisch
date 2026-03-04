# syntax=docker/dockerfile:1
# Enable BuildKit for cache mounts
FROM oven/bun:1 as base
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json bun.lock* package-lock.json* ./
RUN --mount=type=cache,id=bun,target=/root/.bun/install/cache bun install --frozen-lockfile

# Build the app
FROM deps AS builder
COPY . .
RUN bun run build

# Production image
FROM base AS runner
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

EXPOSE 8000
CMD ["bun", "run", "start"]
