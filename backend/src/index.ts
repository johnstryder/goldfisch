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

config()

// Initialize services
initializePostHog()
initializeRedis().catch(console.error)

const app = new Hono()
const pb = new PocketBase(process.env.POCKETBASE_URL || 'http://localhost:8090')

// Middleware
app.use('*', cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}))

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
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

// PocketBase proxy for admin operations
app.all('/pb/*', async (c) => {
  const path = c.req.path.replace('/pb', '')
  const method = c.req.method

  try {
    // Forward the request to PocketBase
    const url = `${process.env.POCKETBASE_URL || 'http://localhost:8090'}${path}`
    const headers = new Headers(c.req.raw.headers)

    let body
    if (method !== 'GET' && method !== 'HEAD') {
      body = await c.req.text()
    }

    const response = await fetch(url, {
      method,
      headers,
      body,
    })

    const responseBody = await response.text()
    return new Response(responseBody, {
      status: response.status,
      headers: response.headers,
    })
  } catch (error) {
    console.error('PocketBase proxy error:', error)
    return c.json({ error: 'Proxy error' }, 500)
  }
})

const port = parseInt(process.env.PORT || '8000')
console.log(`🚀 Server running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port,
})