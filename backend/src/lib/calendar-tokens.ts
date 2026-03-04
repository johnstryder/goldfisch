/**
 * Store/retrieve Google Calendar OAuth tokens in Redis
 */
import { redisClient } from './redis'

const KEY_PREFIX = 'gc:'
const STATE_PREFIX = 'gc_state:'
const STATE_TTL = 600 // 10 minutes

export type StoredTokens = {
  accessToken: string
  refreshToken?: string
  expiresAt?: number
}

export async function storeCalendarTokens(
  userId: string,
  tokens: StoredTokens
): Promise<void> {
  const key = `${KEY_PREFIX}${userId}`
  await redisClient.set(key, JSON.stringify(tokens), { EX: 60 * 60 * 24 * 30 }) // 30 days
}

export async function getCalendarTokens(
  userId: string
): Promise<StoredTokens | null> {
  const key = `${KEY_PREFIX}${userId}`
  const data = await redisClient.get(key)
  return data ? (JSON.parse(data) as StoredTokens) : null
}

export async function storeCalendarState(state: string, userId: string): Promise<void> {
  const key = `${STATE_PREFIX}${state}`
  await redisClient.set(key, userId, { EX: STATE_TTL })
}

export async function getCalendarState(state: string): Promise<string | null> {
  const key = `${STATE_PREFIX}${state}`
  const userId = await redisClient.get(key)
  if (userId) await redisClient.del(key) // one-time use
  return userId
}
