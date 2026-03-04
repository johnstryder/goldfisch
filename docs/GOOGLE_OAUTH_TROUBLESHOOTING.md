# Google OAuth Troubleshooting

The app uses a **backend-initiated OAuth flow**. The backend fetches auth-methods from PocketBase directly (avoids proxy issues), stores the code verifier, and returns the Google OAuth URL. Flow: frontend → GET /api/auth/google → redirect to Google → redirect to /oauth-callback → GET /api/auth/oauth-verifier → authWithOAuth2Code.

## 1. Google Cloud Console setup

1. Create OAuth 2.0 credentials (Web application)
2. Add authorized redirect URI: `https://goldfisch.iwishihadthis.com/oauth-callback`
   - For local testing: `http://localhost:5173/oauth-callback` (or your Vite dev port)
3. Copy Client ID and Client Secret into PocketBase

## 2. Configure Google OAuth on the auth collection

OAuth is configured **per collection**, not globally.

1. Open PocketBase Admin: `https://pb_goldfisch.iwishihadthis.com/_/`
2. Go to **Collections** → select your auth collection (usually **users**)
3. Click the **Options** (gear) icon
4. Find the **OAuth2** section
5. Enable **Google** and set Client ID and Client Secret from Google Cloud Console

## 3. Backend env

**Backend env** (Coolify / runtime):
- `POCKETBASE_URL=https://pb_goldfisch.iwishihadthis.com`
- `SERVICE_URL_FRONTEND` or `FRONTEND_URL` – used for redirect URI (e.g. `https://goldfisch.iwishihadthis.com`)
- `POCKETBASE_INSECURE_TLS=1` if TLS verification fails in Docker

## 4. Auth collection name

The app uses `users` by default. If your auth collection has a different name, update `AuthContext.tsx` to use that collection.
