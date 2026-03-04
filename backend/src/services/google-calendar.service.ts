/**
 * Google Calendar Service - GoldFisch
 * Connects to Google Calendar API using OAuth2 tokens from PocketBase/Google login
 */
import { google } from 'googleapis'

export type CalendarEvent = {
  id: string
  summary: string
  start: string
  end: string
  htmlLink?: string
  isAllDay?: boolean
}

export type FetchEventsOptions = {
  timeMin?: string
  timeMax?: string
  maxResults?: number
  calendarId?: string
}

const CALENDAR_SCOPES = [
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/calendar.events.readonly',
]

export function getCalendarAuthUrl(
  clientId: string,
  redirectUri: string,
  state: string
): string {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: CALENDAR_SCOPES.join(' '),
    access_type: 'offline',
    prompt: 'consent',
    state,
  })
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
}

export function parseCalendarEvent(raw: {
  id?: string
  summary?: string
  start?: { dateTime?: string; date?: string }
  end?: { dateTime?: string; date?: string }
  htmlLink?: string
}): CalendarEvent {
  const start = raw.start?.dateTime ?? raw.start?.date ?? ''
  const end = raw.end?.dateTime ?? raw.end?.date ?? ''
  return {
    id: raw.id ?? '',
    summary: raw.summary ?? '(No title)',
    start,
    end,
    htmlLink: raw.htmlLink,
    isAllDay: !!raw.start?.date && !raw.start?.dateTime,
  }
}

export type CalendarClient = {
  events: {
    list: (opts: {
      calendarId: string
      timeMin?: string
      timeMax?: string
      maxResults?: number
      singleEvents?: boolean
      orderBy?: string
    }) => Promise<{ data: { items?: unknown[] } }>
  }
}

export async function fetchCalendarEvents(
  accessToken: string,
  options: FetchEventsOptions = {},
  calendarClient?: CalendarClient
): Promise<CalendarEvent[]> {
  let client = calendarClient
  if (!client) {
    const oauth2Client = new google.auth.OAuth2()
    oauth2Client.setCredentials({ access_token: accessToken })
    client = google.calendar({ version: 'v3', auth: oauth2Client }) as unknown as CalendarClient
  }

  const calendarId = options.calendarId ?? 'primary'
  const response = await client.events.list({
    calendarId,
    timeMin: options.timeMin,
    timeMax: options.timeMax,
    maxResults: options.maxResults ?? 50,
    singleEvents: true,
    orderBy: 'startTime',
  })

  const items = response.data.items ?? []
  return items.map((item) => parseCalendarEvent(item as any))
}

export async function exchangeCodeForTokens(
  code: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string
): Promise<{ accessToken: string; refreshToken?: string; expiresAt?: number }> {
  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri)
  const { tokens } = await oauth2Client.getToken(code)
  return {
    accessToken: tokens.access_token!,
    refreshToken: tokens.refresh_token,
    expiresAt: tokens.expiry_date ?? undefined,
  }
}
