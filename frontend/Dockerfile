# syntax=docker/dockerfile:1
# Enable BuildKit for cache mounts
FROM oven/bun:1 as base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json bun.lock* package-lock.json* ./
RUN --mount=type=cache,id=bun-frontend,target=/root/.bun/install/cache bun install

# Build the app
FROM deps AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# Production image with nginx
FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
