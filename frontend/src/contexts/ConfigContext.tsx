import React, { createContext, useContext } from 'react'

interface Config {
  pocketbaseUrl: string
}

const ConfigContext = createContext<Config | null>(null)

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  // Per PocketBase docs: use PocketBase server URL directly for OAuth2 (redirect must be yourdomain.com/api/oauth2-redirect)
  // Fall back to same-origin proxy when VITE_POCKETBASE_URL not set (e.g. local dev)
  const config: Config = {
    pocketbaseUrl:
      typeof window !== 'undefined' && import.meta.env.VITE_POCKETBASE_URL
        ? import.meta.env.VITE_POCKETBASE_URL
        : `${typeof window !== 'undefined' ? window.location.origin : ''}/api/pb`,
  }

  return (
    <ConfigContext.Provider value={config}>
      {children}
    </ConfigContext.Provider>
  )
}

export function useConfig() {
  const ctx = useContext(ConfigContext)
  if (!ctx) throw new Error('useConfig must be used within ConfigProvider')
  return ctx
}
