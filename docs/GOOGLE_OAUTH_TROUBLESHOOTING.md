# Google OAuth "Provider not found" Troubleshooting

When you see **"Google provider not found"**, the frontend successfully connected to PocketBase but the auth collection has no Google OAuth provider in its list.

## 1. Verify PocketBase URL at build time

`VITE_POCKETBASE_URL` is baked into the frontend at **build time**. If it's wrong or missing, the app will hit the wrong PocketBase.

**In Coolify** (or your build env):

- Add `VITE_POCKETBASE_URL=https://pb_goldfisch.iwishihadthis.com` to the **build** environment variables
- Rebuild the frontend after changing it

Check what URL the app uses: open DevTools → Network, click "Sign in with Google", and confirm the request goes to `https://pb_goldfisch.iwishihadthis.com/api/collections/users/...`.

## 2. Configure Google OAuth on the auth collection

OAuth is configured **per collection**, not globally.

1. Open PocketBase Admin: `https://pb_goldfisch.iwishihadthis.com/_/`
2. Go to **Collections** → select your auth collection (usually **users**)
3. Click the **Options** (gear) icon
4. Find the **OAuth2** section
5. Enable **Google** and set:
   - Client ID (from Google Cloud Console)
   - Client Secret
   - Redirect URL: `https://goldfisch.iwishihadthis.com/oauth-callback`

## 3. Google Cloud Console setup

1. Create OAuth 2.0 credentials (Web application)
2. Add authorized redirect URI: `https://goldfisch.iwishihadthis.com/oauth-callback`
3. Copy Client ID and Client Secret into PocketBase

## 4. Check the error message

After the recent change, the error message shows which providers *are* available, e.g.:

- `Available: none` → OAuth2 not enabled on the collection
- `Available: github, microsoft` → Google not enabled; add it in PocketBase
- `Available: google` → Should work; if it still fails, the lookup may have been case-sensitive (now fixed)

## 5. Auth collection name

The app uses `users` by default. If your auth collection has a different name, you’d need to update `AuthContext.tsx` and `OAuthCallback.tsx` to use that collection.
