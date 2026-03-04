import { useEffect, useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { usePostHog } from 'posthog-js/react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { OAuthCallback } from './components/OAuthCallback'
import { Dashboard } from './pages/Dashboard'
import { SegmentationDashboard } from './pages/SegmentationDashboard'
import { ClientScoring } from './pages/ClientScoring'
import { TimeAllocation } from './pages/TimeAllocation'
import { DataOnboarding } from './pages/DataOnboarding'

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500" />
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/oauth-callback" element={<OAuthCallback />} />
      <Route
        path="/"
        element={
          <div className="min-h-screen bg-gray-50">
            <nav className="bg-white border-b px-4 py-3 flex gap-4 items-center">
              <Link to="/" className="font-bold text-lg">GoldFisch</Link>
              <Link to="/dashboard" className="text-sm hover:underline">Dashboard</Link>
              <Link to="/segmentation" className="text-sm hover:underline">Segmentation</Link>
              <Link to="/scoring" className="text-sm hover:underline">Client Scoring</Link>
              <Link to="/time-allocation" className="text-sm hover:underline">Time Allocation</Link>
              <Link to="/onboarding" className="text-sm hover:underline">Data Onboarding</Link>
              <div className="ml-auto">
                {auth.user ? (
                  <button onClick={auth.signOut} className="text-sm text-gray-600 hover:underline">
                    Sign Out
                  </button>
                ) : (
                  <button
                    onClick={auth.signInWithGoogle}
                    className="px-3 py-1 bg-indigo-600 text-white rounded text-sm"
                  >
                    Sign in with Google
                  </button>
                )}
              </div>
            </nav>
            <div className="p-4 max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold">GoldFisch Client Segmentation</h1>
              <p className="text-gray-600 mt-2">80/20 Squared • Premier • Core • Drainy 80</p>
              {auth.user && (
                <p className="mt-2 text-sm text-gray-500">Welcome, {auth.user.name || auth.user.email}</p>
              )}
              {auth.error && <p className="mt-2 text-sm text-red-600">{auth.error}</p>}
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg bg-white">
                  <h2 className="font-semibold">Quick Links</h2>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Link to="/segmentation" className="px-3 py-1 bg-indigo-100 rounded text-sm">
                      Segmentation Dashboard
                    </Link>
                    <Link to="/scoring" className="px-3 py-1 bg-indigo-100 rounded text-sm">
                      Client Scoring
                    </Link>
                    <Link to="/time-allocation" className="px-3 py-1 bg-indigo-100 rounded text-sm">
                      Time Allocation
                    </Link>
                  </div>
                </div>
                <div className="p-4 border rounded-lg bg-white">
                  <h2 className="font-semibold">Items Demo</h2>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={createItem}
                      disabled={loading}
                      className="px-3 py-1 bg-black text-white rounded text-sm disabled:opacity-50"
                    >
                      Create Item
                    </button>
                    <button
                      onClick={fetchItems}
                      disabled={loading}
                      className="px-3 py-1 border rounded text-sm"
                    >
                      {loading ? 'Loading...' : 'Refresh'}
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">{items.length} items</p>
                </div>
              </div>
            </div>
          </div>
        }
      />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/segmentation" element={<SegmentationDashboard />} />
      <Route path="/scoring" element={<ClientScoring />} />
      <Route path="/time-allocation" element={<TimeAllocation />} />
      <Route path="/onboarding" element={<DataOnboarding />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
