# Deployment with External PocketBase

When PocketBase is at `https://pb_goldfisch.iwishihadthis.com`:

## "No available server" fix

Coolify's proxy needs a port to route to. In Coolify's application settings:

1. **Port** – Set the port to `80` (frontend container exposes 80)
2. **If using external PocketBase** – Use `docker-compose.prod.yml` (see below) so the main app doesn't depend on the PocketBase container

If port 8090 is already in use on the host for PocketBase, set:

```
POCKETBASE_PORT=18090
```

## Environment variables for main app

```
POCKETBASE_URL=https://pb_goldfisch.iwishihadthis.com
FRONTEND_URL=https://goldfisch.iwishihadthis.com
# or SERVICE_URL_FRONTEND for Coolify
```

**POCKETBASE_URL** – Backend proxies PocketBase API through `/api/pb/*` to avoid CORS. The frontend uses the proxy URL (same origin).

**FRONTEND_URL** or **SERVICE_URL_FRONTEND** – Used to build the proxy URL in `/api/config`.

## If PocketBase is a separate Coolify app

1. Deploy PocketBase separately using `docker-compose.pocketbase.yml`. Assign domain `pb_goldfisch.iwishihadthis.com` in Coolify.

2. For the main app, use the prod override so it doesn't wait for PocketBase:
   ```
   docker compose -f docker-compose.yaml -f docker-compose.prod.yml up -d
   ```
   In Coolify, set the compose file to `docker-compose.yaml` and add `docker-compose.prod.yml` as an override, or configure the command to use both files.

3. Set `POCKETBASE_URL=https://pb_goldfisch.iwishihadthis.com` in the main app's environment.
