import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { CalendarView } from '../components/CalendarView'
import { getDemoEvents } from '../lib/demoCalendarEvents'
import type { CalendarEvent } from '../lib/demoCalendarEvents'

export function Calendar() {
  const auth = useAuth()
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [connected, setConnected] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [connecting, setConnecting] = useState(false)
  const [demoMode, setDemoMode] = useState(true)
  const [viewDate, setViewDate] = useState(() => new Date())

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

  const displayEvents = demoMode ? getDemoEvents(viewDate) : events
  const canShowLive = auth.user && connected

  const navPrev = () => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1))
  const navNext = () => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1))

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Calendar</h1>
          <p className="text-muted mt-1">
            {demoMode ? 'Demo view – sample client meetings' : 'Your Google Calendar events'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {canShowLive && (
            <>
              <button
                onClick={() => setDemoMode(true)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  demoMode ? 'bg-primary/20 text-primary' : 'bg-glass text-muted hover:text-text'
                }`}
              >
                Demo
              </button>
              <button
                onClick={() => setDemoMode(false)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  !demoMode ? 'bg-primary/20 text-primary' : 'bg-glass text-muted hover:text-text'
                }`}
              >
                Live
              </button>
            </>
          )}
          {!auth.user && (
            <span className="text-xs text-muted bg-surface/50 px-2 py-1 rounded">Demo mode</span>
          )}
        </div>
      </div>

      {!auth.user ? (
        <div className="mt-4 p-4 rounded-lg bg-surface/30 border border-surface">
          <p className="text-muted mb-3">
            Sign in with Google and connect your calendar to see your real events.
          </p>
          <CalendarView
            year={viewDate.getFullYear()}
            month={viewDate.getMonth()}
            events={displayEvents}
            onPrevMonth={navPrev}
            onNextMonth={navNext}
          />
        </div>
      ) : (
        <>
          {error && (
            <div className="mt-4 p-3 bg-danger/20 text-danger rounded-md">{error}</div>
          )}
          {connected === false && (
            <div className="mt-4 p-4 rounded-lg bg-surface/30 border border-surface">
              <p className="text-muted mb-3">Connect your Google Calendar to view your events.</p>
              <button
                onClick={connectCalendar}
                disabled={connecting}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium disabled:opacity-50 hover:opacity-90"
              >
                {connecting ? 'Connecting...' : 'Connect Google Calendar'}
              </button>
              <div className="mt-4">
                <p className="text-sm text-muted mb-2">Or explore the demo:</p>
                <CalendarView
                  year={viewDate.getFullYear()}
                  month={viewDate.getMonth()}
                  events={displayEvents}
                  onPrevMonth={navPrev}
                  onNextMonth={navNext}
                />
              </div>
            </div>
          )}
          {connected && (
            <div className="mt-4">
              <div className="flex gap-2 mb-4">
                <button
                  onClick={fetchEvents}
                  disabled={loading}
                  className="px-3 py-1.5 bg-glass text-text rounded-md text-sm hover:bg-surface/50 disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Refresh'}
                </button>
              </div>
              <CalendarView
                year={viewDate.getFullYear()}
                month={viewDate.getMonth()}
                events={displayEvents}
                onPrevMonth={navPrev}
                onNextMonth={navNext}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}
