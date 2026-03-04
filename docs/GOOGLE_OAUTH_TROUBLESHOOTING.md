# Google OAuth Troubleshooting

The app uses PocketBase's **popup OAuth flow** (`authWithOAuth2`). A popup opens for Google sign-in; no custom redirect page is needed.

## 1. Verify PocketBase URL and proxy

The frontend uses same-origin requests to `/api/pb/*`; the backend proxies to PocketBase.

**In Coolify** (runtime env vars for the backend):

- Set `POCKETBASE_URL=https://pb_goldfisch.iwishihadthis.com`
- The backend must be able to reach this URL (outbound HTTPS from the backend container)

**If you get 500 on `/api/pb/...`**: Check backend logs for "PocketBase proxy error". Common causes:
- Backend cannot reach `POCKETBASE_URL` (network/DNS)
- Wrong or missing `POCKETBASE_URL`
- **UNABLE_TO_VERIFY_LEAF_SIGNATURE**: TLS cert verification fails (incomplete chain in Docker). Set `POCKETBASE_INSECURE_TLS=1` in backend env to skip verification (use only if you trust the PocketBase host).

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

## 4. Auth collection name

The app uses `users` by default. If your auth collection has a different name, you’d need to update `AuthContext.tsx` to use that collection.
