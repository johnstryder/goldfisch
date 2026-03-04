/**
 * Auth middleware - validates PocketBase token and sets user in context
 */
import type { Context, Next } from 'hono'

export type AuthVariables = {
  userId: string
  userEmail: string
}

export async function requireAuth(c: Context<{ Variables: AuthVariables }>, next: Next) {
  const authHeader = c.req.header('Authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!token) {
    return c.json({ error: 'Unauthorized: No token provided' }, 401)
  }

  try {
    const pbUrl = process.env.POCKETBASE_URL || 'http://localhost:8090'
    // PocketBase: validate token via auth-refresh (returns user record)
    const res = await fetch(`${pbUrl}/api/collections/users/auth-refresh`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: '{}',
    })
    if (!res.ok) {
      return c.json({ error: 'Unauthorized: Invalid or expired token' }, 401)
    }
    const data = await res.json()
    const user = data.record ?? data.user ?? data
    c.set('userId', user.id)
    c.set('userEmail', user.email ?? '')
    await next()
  } catch {
    return c.json({ error: 'Unauthorized: Invalid or expired token' }, 401)
  }
}
