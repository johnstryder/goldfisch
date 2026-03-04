# Google OAuth Troubleshooting

The app uses a **manual redirect OAuth flow** with a custom callback page (`/oauth-callback`). The flow: listAuthMethods → redirect to Google → redirect back to `/oauth-callback` → authWithOAuth2Code.

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

## 3. PocketBase URL

Set `VITE_POCKETBASE_URL` in your frontend env when PocketBase is on a different domain:

- Production: `VITE_POCKETBASE_URL=https://pb_goldfisch.iwishihadthis.com`
- Local: `VITE_POCKETBASE_URL=http://127.0.0.1:8090`

When not set, the app uses the proxy (`/api/pb`).

## 4. Auth collection name

The app uses `users` by default. If your auth collection has a different name, update `AuthContext.tsx` to use that collection.
