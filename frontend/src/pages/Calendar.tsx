import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

type CalendarEvent = {
  id: string
  summary: string
  start: string
  end: string
  htmlLink?: string
  isAllDay?: boolean
}

export function Calendar() {
  const auth = useAuth()
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [connected, setConnected] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [connecting, setConnecting] = useState(false)

  const apiBase = '/api'

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const connectedParam = params.get('connected')
    const errorParam = params.get('error')
    if (connectedParam === '1') {
      setConnected(true)
      setError(null)
      window.history.replaceState({}, '', '/calendar')
    }
    if (errorParam) {
      setError(`Connection failed: ${errorParam}`)
      window.history.replaceState({}, '', '/calendar')
    }
  }, [])

  const token = auth.getToken?.() ?? null

  const checkStatus = async () => {
    if (!auth.user || !token) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${apiBase}/calendar/status`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setConnected(data.connected)
    } catch (e) {
      setError('Failed to check status')
    } finally {
      setLoading(false)
    }
  }

  const connectCalendar = async () => {
    if (!auth.user || !token) {
      setError('Please sign in first')
      return
    }
    setConnecting(true)
    setError(null)
    try {
      const res = await fetch(`${apiBase}/calendar/connect`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.authUrl) {
        window.location.href = data.authUrl
      } else {
        setError(data.error || 'Failed to get auth URL')
      }
    } catch (e) {
      setError('Failed to connect')
    } finally {
      setConnecting(false)
    }
  }

  const fetchEvents = async () => {
    if (!auth.user || !token) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${apiBase}/calendar/events`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.events) {
        setEvents(data.events)
        setConnected(true)
      } else if (data.connected === false) {
        setConnected(false)
        setEvents([])
      } else {
        setError(data.error || 'Failed to fetch events')
      }
    } catch (e) {
      setError('Failed to fetch events')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (auth.user && token) checkStatus()
  }, [auth.user, token])

  useEffect(() => {
    if (auth.user && token && connected) fetchEvents()
  }, [auth.user, token, connected])

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-text">Google Calendar</h1>
      <p className="text-muted mt-2">Connect your Google Calendar to view events</p>

      {!auth.user ? (
        <p className="mt-4 text-warning">Sign in with Google to connect your calendar.</p>
      ) : (
        <>
          {error && (
            <div className="mt-4 p-3 bg-danger/20 text-danger rounded-md">{error}</div>
          )}
          {connected === false && (
            <button
              onClick={connectCalendar}
              disabled={connecting}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium disabled:opacity-50 hover:opacity-90"
            >
              {connecting ? 'Connecting...' : 'Connect Google Calendar'}
            </button>
          )}
          {connected && (
            <div className="mt-4">
              <button
                onClick={fetchEvents}
                disabled={loading}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium disabled:opacity-50 hover:opacity-90"
              >
                {loading ? 'Loading...' : 'Refresh Events'}
              </button>
              <div className="mt-4 space-y-2">
                {events.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-3 rounded-lg bg-surface border border-surface shadow-card"
                  >
                    <div className="font-medium text-text">{evt.summary}</div>
                    <div className="text-sm text-muted">
                      {new Date(evt.start).toLocaleString()} – {new Date(evt.end).toLocaleString()}
                    </div>
                    {evt.htmlLink && (
                      <a
                        href={evt.htmlLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        Open in Calendar
                      </a>
                    )}
                  </div>
                ))}
                {events.length === 0 && !loading && (
                  <p className="text-muted">No upcoming events</p>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
