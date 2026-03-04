import React, { createContext, useContext, useEffect, useState } from 'react'

interface Config {
  pocketbaseUrl: string
}

const ConfigContext = createContext<Config | null>(null)

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<Config | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/config')
      .then((res) => res.json())
      .then((data) => setConfig({ pocketbaseUrl: data.pocketbaseUrl || 'http://localhost:8090' }))
      .catch((err) => {
        console.error('Failed to load config:', err)
        setError(err.message)
        setConfig({ pocketbaseUrl: 'http://localhost:8090' })
      })
  }, [])

  if (config === null && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" />
      </div>
    )
  }

  return (
    <ConfigContext.Provider value={config ?? { pocketbaseUrl: 'http://localhost:8090' }}>
      {children}
    </ConfigContext.Provider>
  )
}

export function useConfig() {
  const ctx = useContext(ConfigContext)
  if (!ctx) throw new Error('useConfig must be used within ConfigProvider')
  return ctx
}
