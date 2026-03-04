FROM oven/bun:1 as base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json ./
RUN bun install

# Build the app
FROM deps AS builder
COPY . .
RUN bun run build

# Production image
FROM base AS runner
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

EXPOSE 8000
CMD ["bun", "run", "start"]