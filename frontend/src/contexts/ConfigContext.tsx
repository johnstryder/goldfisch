import React, { createContext, useContext } from 'react'

interface Config {
  pocketbaseUrl: string
}

const ConfigContext = createContext<Config | null>(null)

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  // Always use same-origin proxy to avoid CORS - backend proxies /api/pb to PocketBase
  const config: Config = {
    pocketbaseUrl: typeof window !== 'undefined' ? `${window.location.origin}/api/pb` : '/api/pb',
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
