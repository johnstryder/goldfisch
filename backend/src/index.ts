import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serve } from '@hono/node-server'
import PocketBase from 'pocketbase/cjs'
import { config } from 'dotenv'
import { initializePostHog, trackEvent } from './lib/posthog'
import { initializeRedis } from './lib/redis'
import { sendTemplateEmail } from './services/email.service'
import { calculateWeightedScore } from './services/scoring.service'
import { segmentClients, getTierForClient } from './services/segmentation.service'
import {
  calculateCapacityDisplacement,
  calculateProjectedRevenueJump,
  calculateCompoundedROI,
  applyRiskPenalty,
} from './services/forecasting.service'
import {
  createScenarioSnapshot,
  createTierHistoryEntry,
} from './services/scenario.service'
import {
  getCalendarAuthUrl,
  fetchCalendarEvents,
  exchangeCodeForTokens,
} from './services/google-calendar.service'
import { requireAuth } from './middleware/auth'
import {
  storeCalendarTokens,
  getCalendarTokens,
  storeCalendarState,
  getCalendarState,
} from './lib/calendar-tokens'
import { randomUUID } from 'crypto'

config()

// When POCKETBASE_INSECURE_TLS=1, skip TLS verification (UNABLE_TO_VERIFY_LEAF_SIGNATURE in Docker)
if (process.env.POCKETBASE_INSECURE_TLS === '1') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
}

// Initialize services
initializePostHog()
initializeRedis().catch(console.error)

const app = new Hono()
const pb = new PocketBase(process.env.POCKETBASE_URL || 'http://localhost:8090')

// Middleware
app.use('*', cors({
  origin: process.env.FRONTEND_URL || process.env.SERVICE_URL_FRONTEND || 'http://localhost:3000',
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}))

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Runtime config for frontend (PocketBase URL etc.)
app.get('/api/config', (c) => {
  const frontendUrl = process.env.FRONTEND_URL || process.env.SERVICE_URL_FRONTEND || 'http://localhost:3000'
  // Use proxy URL to avoid CORS when PocketBase is on a different domain
  const pocketbaseUrl = `${frontendUrl.replace(/\/$/, '')}/api/pb`
  return c.json({ pocketbaseUrl })
})

// API routes
app.get('/api/hello', (c) => {
  trackEvent('api_hello_called')
  return c.json({ message: 'Hello from Hono + PocketBase!' })
})

// Email test endpoint
app.post('/api/send-welcome-email', async (c) => {
  try {
    const { email, name } = await c.req.json()
    
    if (!email) {
      return c.json({ error: 'Email is required' }, 400)
    }

    const result = await sendTemplateEmail({
      to: email,
      template: 'welcome',
      data: { userName: name || 'User' }
    })

    if (result.success) {
      trackEvent('welcome_email_sent', { email })
      return c.json({ success: true, message: 'Welcome email sent' })
    } else {
      trackEvent('welcome_email_failed', { email, error: result.error })
      return c.json({ error: result.error }, 500)
    }
  } catch (error) {
    console.error('Error sending welcome email:', error)
    trackEvent('welcome_email_error', { error: error.message })
    return c.json({ error: 'Failed to send email' }, 500)
  }
})

// Example PocketBase collection endpoint
app.get('/api/items', async (c) => {
  try {
    const records = await pb.collection('items').getFullList()
    return c.json(records)
  } catch (error) {
    console.error('Error fetching items:', error)
    return c.json({ error: 'Failed to fetch items' }, 500)
  }
})

app.post('/api/items', async (c) => {
  try {
    const body = await c.req.json()
    const record = await pb.collection('items').create(body)
    return c.json(record, 201)
  } catch (error) {
    console.error('Error creating item:', error)
    return c.json({ error: 'Failed to create item' }, 500)
  }
})

// GoldFisch API routes
app.post('/api/scoring/calculate', async (c) => {
  try {
    const body = await c.req.json()
    const result = calculateWeightedScore(body.scores || {}, body.options || {})
    return c.json(result)
  } catch (error) {
    console.error('Scoring error:', error)
    return c.json({ error: 'Scoring calculation failed' }, 500)
  }
})

app.post('/api/segmentation/run', async (c) => {
  try {
    const body = await c.req.json()
    const result = segmentClients(body.clients || [], body.thresholds)
    return c.json(result)
  } catch (error) {
    console.error('Segmentation error:', error)
    return c.json({ error: 'Segmentation failed' }, 500)
  }
})

app.post('/api/forecasting/capacity-displacement', async (c) => {
  try {
    const body = await c.req.json()
    const result = calculateCapacityDisplacement(body)
    return c.json(result)
  } catch (error) {
    console.error('Forecasting error:', error)
    return c.json({ error: 'Capacity displacement calculation failed' }, 500)
  }
})

app.post('/api/forecasting/revenue-jump', async (c) => {
  try {
    const { avgPremierRevenue, newClientCount } = await c.req.json()
    const result = calculateProjectedRevenueJump(
      avgPremierRevenue ?? 0,
      newClientCount ?? 0
    )
    return c.json(result)
  } catch (error) {
    console.error('Forecasting error:', error)
    return c.json({ error: 'Revenue jump calculation failed' }, 500)
  }
})

app.post('/api/forecasting/compounded-roi', async (c) => {
  try {
    const body = await c.req.json()
    const result = calculateCompoundedROI(body)
    return c.json(result)
  } catch (error) {
    console.error('Forecasting error:', error)
    return c.json({ error: 'Compounded ROI calculation failed' }, 500)
  }
})

app.post('/api/forecasting/risk-penalty', async (c) => {
  try {
    const { baseProjection, confidencePct } = await c.req.json()
    const result = applyRiskPenalty(baseProjection ?? 0, confidencePct ?? 0)
    return c.json(result)
  } catch (error) {
    console.error('Forecasting error:', error)
    return c.json({ error: 'Risk penalty calculation failed' }, 500)
  }
})

app.post('/api/scenarios', async (c) => {
  try {
    const body = await c.req.json()
    const snapshot = createScenarioSnapshot(body)
    return c.json(snapshot, 201)
  } catch (error) {
    console.error('Scenario error:', error)
    return c.json({ error: 'Scenario creation failed' }, 500)
  }
})

app.post('/api/tier-history', async (c) => {
  try {
    const body = await c.req.json()
    const entry = createTierHistoryEntry(body)
    return c.json(entry, 201)
  } catch (error) {
    console.error('Tier history error:', error)
    return c.json({ error: 'Tier history creation failed' }, 500)
  }
})

// Google Calendar API routes (require auth)
app.get('/api/calendar/connect', requireAuth, async (c) => {
  const userId = c.get('userId')
  const clientId = process.env.GOOGLE_CLIENT_ID
  const redirectUri = process.env.GOOGLE_CALENDAR_REDIRECT_URI || `${process.env.FRONTEND_URL || 'http://localhost:3000'}/api/calendar/callback`
  if (!clientId) {
    return c.json({ error: 'Google OAuth not configured' }, 500)
  }
  const state = randomUUID()
  await storeCalendarState(state, userId)
  const url = getCalendarAuthUrl(clientId, redirectUri, state)
  return c.json({ authUrl: url })
})

app.get('/api/calendar/callback', async (c) => {
  const code = c.req.query('code')
  const state = c.req.query('state')
  const error = c.req.query('error')
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'

  if (error) {
    return c.redirect(`${frontendUrl}/calendar?error=${encodeURIComponent(error)}`)
  }
  if (!code || !state) {
    return c.redirect(`${frontendUrl}/calendar?error=missing_params`)
  }

  const userId = await getCalendarState(state)
  if (!userId) {
    return c.redirect(`${frontendUrl}/calendar?error=invalid_state`)
  }

  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const redirectUri = process.env.GOOGLE_CALENDAR_REDIRECT_URI || `${frontendUrl}/api/calendar/callback`
  if (!clientId || !clientSecret) {
    return c.redirect(`${frontendUrl}/calendar?error=config`)
  }

  try {
    const tokens = await exchangeCodeForTokens(code, clientId, clientSecret, redirectUri)
    await storeCalendarTokens(userId, {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt: tokens.expiresAt,
    })
    return c.redirect(`${frontendUrl}/calendar?connected=1`)
  } catch (err) {
    console.error('Calendar OAuth error:', err)
    return c.redirect(`${frontendUrl}/calendar?error=exchange_failed`)
  }
})

app.get('/api/calendar/events', requireAuth, async (c) => {
  const userId = c.get('userId')
  const tokens = await getCalendarTokens(userId)
  if (!tokens) {
    return c.json({ error: 'Google Calendar not connected', connected: false }, 400)
  }

  const timeMin = c.req.query('timeMin') ?? new Date().toISOString()
  const timeMax = c.req.query('timeMax') ?? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  const maxResults = parseInt(c.req.query('maxResults') ?? '50', 10)

  try {
    const events = await fetchCalendarEvents(tokens.accessToken, {
      timeMin,
      timeMax,
      maxResults,
    })
    return c.json({ events, connected: true })
  } catch (err) {
    console.error('Calendar fetch error:', err)
    return c.json({ error: 'Failed to fetch calendar events', connected: true }, 500)
  }
})

app.get('/api/calendar/status', requireAuth, async (c) => {
  const userId = c.get('userId')
  const tokens = await getCalendarTokens(userId)
  return c.json({ connected: !!tokens })
})

// PocketBase API proxy - avoids CORS when PocketBase is on a different domain
app.all('/api/pb/*', async (c) => {
  const path = c.req.path.replace(/^\/api\/pb/, '') || '/'
  const targetPath = path.startsWith('/') ? path : `/${path}`
  const rawUrl = c.req.url
  const query = rawUrl.includes('?') ? rawUrl.slice(rawUrl.indexOf('?')) : ''
  const baseUrl = (process.env.POCKETBASE_URL || 'http://localhost:8090').replace(/\/$/, '')
  const url = `${baseUrl}${targetPath}${query}`
  const method = c.req.method

  try {
    const headers = new Headers()
    const skipHeaders = ['host', 'connection', 'origin', 'referer']
    c.req.raw.headers.forEach((v, k) => {
      if (!skipHeaders.includes(k.toLowerCase())) {
        headers.set(k, v)
      }
    })

    let body: string | undefined
    if (method !== 'GET' && method !== 'HEAD') {
      body = await c.req.text()
    }

    const response = await fetch(url, { method, headers, body })
    const responseBody = await response.text()
    const resHeaders = new Headers()
    response.headers.forEach((v, k) => {
      if (!['content-encoding', 'transfer-encoding'].includes(k.toLowerCase())) {
        resHeaders.set(k, v)
      }
    })
    return new Response(responseBody, { status: response.status, headers: resHeaders })
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error)
    console.error('PocketBase proxy error:', errMsg, 'url:', url)
    return c.json({ error: 'Proxy error', detail: errMsg }, 500)
  }
})

const port = parseInt(process.env.PORT || '8000')
console.log(`🚀 Server running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port,
})