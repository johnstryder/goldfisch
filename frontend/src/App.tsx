import { useEffect, useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { usePostHog } from 'posthog-js/react'
import { ConfigProvider } from './contexts/ConfigContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { OAuthCallback } from './components/OAuthCallback'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { SegmentationDashboard } from './pages/SegmentationDashboard'
import { ClientScoring } from './pages/ClientScoring'
import { TimeAllocation } from './pages/TimeAllocation'
import { DataOnboarding } from './pages/DataOnboarding'
import { Calendar } from './pages/Calendar'

function AppContent() {
  const auth = useAuth()
  const [items, setItems] = useState<{ id: string; name: string; created: string }[]>([])
  const [loading, setLoading] = useState(false)
  const posthog = usePostHog()

  useEffect(() => {
    if (posthog) {
      posthog.capture('app_loaded', {
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
      })
    }
  }, [posthog])

  const fetchItems = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/items')
      const data = await response.json()
      setItems(Array.isArray(data) ? data : [])
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  const createItem = async () => {
    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: `Item ${Date.now()}` }),
      })
      const newItem = await response.json()
      setItems((prev) => [newItem, ...prev])
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  if (auth.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/oauth-callback" element={<OAuthCallback />} />
      <Route
        path="/"
        element={
          <Layout>
            <div className="p-6 max-w-4xl">
              <h1 className="text-2xl font-bold text-text">GoldFisch Client Segmentation</h1>
              <p className="text-muted mt-2">80/20 Squared • Premier • Core • Drainy 80</p>
              {auth.user && (
                <p className="mt-2 text-sm text-muted">Welcome, {auth.user.name || auth.user.email}</p>
              )}
              {auth.error && <p className="mt-2 text-sm text-danger">{auth.error}</p>}
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="p-4 rounded-lg bg-surface border border-surface shadow-card">
                  <h2 className="font-semibold text-text">Quick Links</h2>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Link to="/segmentation" className="px-3 py-1.5 bg-primary/20 text-primary rounded-md text-sm hover:bg-primary/30">
                      Segmentation Dashboard
                    </Link>
                    <Link to="/scoring" className="px-3 py-1.5 bg-primary/20 text-primary rounded-md text-sm hover:bg-primary/30">
                      Client Scoring
                    </Link>
                    <Link to="/time-allocation" className="px-3 py-1.5 bg-primary/20 text-primary rounded-md text-sm hover:bg-primary/30">
                      Time Allocation
                    </Link>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-surface border border-surface shadow-card">
                  <h2 className="font-semibold text-text">Items Demo</h2>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={createItem}
                      disabled={loading}
                      className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm font-medium disabled:opacity-50 hover:opacity-90"
                    >
                      Create Item
                    </button>
                    <button
                      onClick={fetchItems}
                      disabled={loading}
                      className="px-3 py-1.5 bg-surface border border-muted/30 text-text rounded-md text-sm hover:bg-glass"
                    >
                      {loading ? 'Loading...' : 'Refresh'}
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-muted">{items.length} items</p>
                </div>
              </div>
            </div>
          </Layout>
        }
      />
      <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
      <Route path="/segmentation" element={<Layout><SegmentationDashboard /></Layout>} />
      <Route path="/scoring" element={<Layout><ClientScoring /></Layout>} />
      <Route path="/time-allocation" element={<Layout><TimeAllocation /></Layout>} />
      <Route path="/onboarding" element={<Layout><DataOnboarding /></Layout>} />
      <Route path="/calendar" element={<Layout><Calendar /></Layout>} />
    </Routes>
  )
}

function App() {
  return (
    <ConfigProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ConfigProvider>
  )
}

export default App
