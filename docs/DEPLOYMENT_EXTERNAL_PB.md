# Deployment with External PocketBase

When PocketBase is at `https://pb_goldfisch.iwishihadthis.com`:

## "No available server" fix

Coolify's proxy needs a port to route to. The main compose now exposes PocketBase with `POCKETBASE_PORT` (default 8090). If port 8090 is already in use on the host, set:

```
POCKETBASE_PORT=18090
```

## Environment variables for main app

```
POCKETBASE_URL=https://pb_goldfisch.iwishihadthis.com
FRONTEND_URL=https://goldfisch.iwishihadthis.com
VITE_POCKETBASE_URL=https://pb_goldfisch.iwishihadthis.com
```

**VITE_POCKETBASE_URL** must be set at **build time** for the frontend (Coolify build env vars).

## If PocketBase is a separate Coolify app

Use `docker-compose.pocketbase.yml` for a standalone PocketBase deployment. It exposes port 8090. Assign domain `pb_goldfisch.iwishihadthis.com` in Coolify.
