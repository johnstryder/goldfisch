# Google OAuth Troubleshooting

The app uses PocketBase's **popup OAuth flow** (`authWithOAuth2`) per [PocketBase docs](https://pocketbase.io/docs/authentication/#oauth2-integration). A popup opens for Google sign-in; no custom redirect page is needed.

## 1. Use PocketBase URL directly (recommended)

Per PocketBase docs, the client must point to the **PocketBase server URL** so the redirect URI matches.

**Set `VITE_POCKETBASE_URL`** in your frontend env (e.g. Coolify runtime vars):

- Production: `VITE_POCKETBASE_URL=https://pb_goldfisch.iwishihadthis.com`
- Local: `VITE_POCKETBASE_URL=http://127.0.0.1:8090`

When not set, the app falls back to the proxy (`/api/pb`). For OAuth2, direct connection is preferred.

## 2. Configure Google OAuth on the auth collection

OAuth is configured **per collection**, not globally.

1. Open PocketBase Admin: `https://pb_goldfisch.iwishihadthis.com/_/`
2. Go to **Collections** → select your auth collection (usually **users**)
3. Click the **Options** (gear) icon
4. Find the **OAuth2** section
5. Enable **Google** and set Client ID and Client Secret from Google Cloud Console

## 3. Google Cloud Console setup

1. Create OAuth 2.0 credentials (Web application)
2. Add authorized redirect URI: `https://pb_goldfisch.iwishihadthis.com/api/oauth2-redirect`
   - For local testing: `http://127.0.0.1:8090/api/oauth2-redirect`
3. Copy Client ID and Client Secret into PocketBase

## 4. Proxy fallback (when VITE_POCKETBASE_URL not set)

If using the proxy, the redirect URI is different: `https://goldfisch.iwishihadthis.com/api/pb/api/oauth2-redirect`. Add that to Google Cloud Console if you're not using direct connection.

## 5. Auth collection name

The app uses `users` by default. If your auth collection has a different name, update `AuthContext.tsx` to use that collection.
