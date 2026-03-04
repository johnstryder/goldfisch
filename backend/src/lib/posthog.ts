import { PostHog } from 'posthog-node'

let posthog: PostHog | null = null

export function initializePostHog() {
  if (posthog) return posthog

  const apiKey = process.env.POSTHOG_API_KEY
  if (!apiKey) {
    console.warn('[POSTHOG] POSTHOG_API_KEY not found. PostHog tracking disabled.')
    return null
  }

  posthog = new PostHog(apiKey, {
    host: process.env.POSTHOG_HOST || 'https://app.posthog.com',
    flushAt: 1,
    flushInterval: 0
  })

  console.log('[POSTHOG] PostHog initialized')
  return posthog
}

export function getPostHog() {
  return posthog || initializePostHog()
}

export function trackEvent(eventName: string, properties?: Record<string, any>, distinctId?: string) {
  const client = getPostHog()
  if (!client) return

  if (distinctId) {
    client.capture({
      distinctId,
      event: eventName,
      properties
    })
  } else {
    client.capture({
      event: eventName,
      properties
    })
  }
}

export function identifyUser(distinctId: string, properties?: Record<string, any>) {
  const client = getPostHog()
  if (!client) return

  client.identify({
    distinctId,
    properties
  })
}

export function flushPostHog() {
  if (posthog) {
    posthog.shutdown()
  }
}