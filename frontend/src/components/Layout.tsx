import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const STRATEGIC_MODELING = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/segmentation', label: 'Segmentation' },
  { to: '/scoring', label: 'Client Scoring' },
  { to: '/time-allocation', label: 'Time Allocation' },
]

const DAILY_OPERATIONS = [
  { to: '/onboarding', label: 'Data Onboarding' },
  { to: '/calendar', label: 'Calendar' },
]

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const auth = useAuth()

  return (
    <div className="min-h-screen flex bg-background">
      {/* Glow sidebar - design_spec: glow_sidebar */}
      <aside className="w-56 flex-shrink-0 flex flex-col border-r border-surface bg-surface/50 backdrop-blur-sm"
        style={{ boxShadow: 'inset -1px 0 0 0 rgba(212, 175, 55, 0.15)' }}>
        <div className="p-4">
          <Link to="/" className="block font-bold text-lg text-primary" style={{ textShadow: '0 0 12px rgba(212, 175, 55, 0.4)' }}>
            GoldFisch
          </Link>
          <p className="text-muted text-xs mt-1">80/20 Squared</p>
        </div>
        <nav className="flex-1 px-3 py-2 space-y-4 overflow-y-auto">
          <div>
            <p className="text-muted text-xs font-medium uppercase tracking-wider px-2 mb-2">Strategic Modeling</p>
            <ul className="space-y-0.5">
              {STRATEGIC_MODELING.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                      location.pathname === to
                        ? 'bg-primary/20 text-primary'
                        : 'text-muted hover:text-text hover:bg-glass'
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-muted text-xs font-medium uppercase tracking-wider px-2 mb-2">Daily Operations</p>
            <ul className="space-y-0.5">
              {DAILY_OPERATIONS.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                      location.pathname === to
                        ? 'bg-primary/20 text-primary'
                        : 'text-muted hover:text-text hover:bg-glass'
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
        <div className="p-4 border-t border-surface mt-auto">
          {auth.user ? (
            <div className="flex items-center justify-between">
              <span className="text-muted text-sm truncate max-w-[120px]">{auth.user.name || auth.user.email}</span>
              <button
                onClick={auth.signOut}
                className="text-muted hover:text-text text-sm"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={auth.signInWithGoogle}
              className="w-full px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
              style={{ boxShadow: '0 0 12px rgba(212, 175, 55, 0.3)' }}
            >
              Sign in with Google
            </button>
          )}
        </div>
      </aside>

      {/* Main content - dashboard-centric hub */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
