import { createClient } from 'redis'
import RedisStore from 'connect-redis'

// Create Redis client for Dragonfly
export const redisClient = createClient({
  url: process.env.DRAGONFLY_URL || 'redis://localhost:6379',
  socket: {
    connectTimeout: 10000,
  },
})

// Handle Redis connection events
redisClient.on('error', (err) => {
  console.error('[REDIS] Redis Client Error:', err)
})

redisClient.on('connect', () => {
  console.log('[REDIS] Connected to Dragonfly')
})

redisClient.on('ready', () => {
  console.log('[REDIS] Dragonfly client ready')
})

redisClient.on('end', () => {
  console.log('[REDIS] Dragonfly connection ended')
})

// Create Redis store for sessions
export const createRedisStore = () => {
  return new RedisStore({
    client: redisClient as any,
    prefix: 'sess:',
    ttl: 24 * 60 * 60, // 24 hours in seconds
    disableTouch: false, // Enable touch to extend session
  })
}

// Utility function to invalidate all sessions for a user
export const invalidateUserSessions = async (userId: string) => {
  try {
    // Get all session keys
    const sessionKeys = await redisClient.keys('sess:*')
    
    // Check each session for user ID and delete if found
    for (const key of sessionKeys) {
      const sessionData = await redisClient.get(key)
      if (sessionData) {
        try {
          const session = JSON.parse(sessionData)
          if (session.pocketbaseUserId === userId) {
            await redisClient.del(key)
            console.log(`[REDIS] Invalidated session ${key} for user ${userId}`)
          }
        } catch (parseError) {
          console.warn(`[REDIS] Failed to parse session data for key ${key}:`, parseError)
        }
      }
    }
  } catch (error) {
    console.error('[REDIS] Error invalidating user sessions:', error)
  }
}

// Initialize Redis connection
export const initializeRedis = async () => {
  try {
    await redisClient.connect()
    console.log('[REDIS] Successfully connected to Dragonfly')
  } catch (error) {
    console.error('[REDIS] Failed to connect to Dragonfly:', error)
    throw error
  }
}