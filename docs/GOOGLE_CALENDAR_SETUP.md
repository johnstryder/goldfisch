# Google Calendar Setup

Connect Google Calendar to GoldFisch for viewing events alongside your client segmentation.

## 1. Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project or select existing
3. Enable **Google Calendar API**: APIs & Services → Library → search "Google Calendar API" → Enable
4. Create OAuth credentials:
   - APIs & Services → Credentials → Create Credentials → OAuth client ID
   - Application type: **Web application**
   - Authorized redirect URIs: Add your callback URL, e.g.:
     - Local: `http://localhost:3000/api/calendar/callback`
     - Production: `https://your-app.com/api/calendar/callback`
5. Copy **Client ID** and **Client Secret**

## 2. Environment Variables

Add to your `.env` or Coolify:

```
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALENDAR_REDIRECT_URI=https://your-app.com/api/calendar/callback
```

For local dev, `GOOGLE_CALENDAR_REDIRECT_URI` defaults to `http://localhost:3000/api/calendar/callback`.

## 3. PocketBase Google Login (Separate)

PocketBase Google OAuth is for **sign-in** only. The Calendar connection uses a separate OAuth flow with calendar scopes. Both can use the same Google Cloud project and OAuth client.

- **PocketBase**: Configure in Admin → Settings → Auth providers → Google (for sign-in)
- **Calendar**: Uses `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` for the Connect Calendar flow

## 4. Flow

1. User signs in with Google (PocketBase)
2. User clicks "Connect Google Calendar" on the Calendar page
3. Redirected to Google to grant calendar access
4. Callback stores tokens, user sees their events
