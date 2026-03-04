import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PocketBase from 'pocketbase'

interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  getToken: () => string | null
  isLoading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL || 'http://localhost:8090')

  useEffect(() => {
    // Check if user is already authenticated
    if (pb.authStore.isValid && pb.authStore.model) {
      const userModel = pb.authStore.model as any
      setUser({
        id: userModel.id,
        email: userModel.email,
        name: userModel.name || userModel.email,
        avatar: userModel.avatar
      })
    }
    setIsLoading(false)

    // Listen for auth changes
    const unsubscribe = pb.authStore.onChange((_token, model) => {
      if (model) {
        const userModel = model as any
        setUser({
          id: userModel.id,
          email: userModel.email,
          name: userModel.name || userModel.email,
          avatar: userModel.avatar
        })
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })

    return unsubscribe
  }, [])

  const signInWithGoogle = async () => {
    try {
      setError(null)
      const authData = await pb.collection('users').listAuthMethods()
      
      if (!authData?.oauth2?.providers) {
        const hint = authData ? 'OAuth2 not configured for this collection.' : 'Check VITE_POCKETBASE_URL points to your PocketBase.'
        throw new Error(`No OAuth providers available. ${hint}`)
      }

      const providers = authData.oauth2.providers as Array<{ name: string; authURL: string; state: string; codeVerifier: string }>
      const provider = providers.find(
        (p) => p.name?.toLowerCase() === 'google'
      )
      if (!provider) {
        const names = providers.map((p) => p.name ?? '(unnamed)').join(', ')
        throw new Error(
          `Google provider not found. Available: ${names || 'none'}. ` +
          'Enable Google OAuth in PocketBase: Collections → users → Options → OAuth2.'
        )
      }

      localStorage.setItem('provider', JSON.stringify({
        state: provider.state,
        codeVerifier: provider.codeVerifier,
      }))

      const redirectUrl = `${window.location.origin}/oauth-callback`
      window.location.href = `${provider.authURL}${encodeURIComponent(redirectUrl)}`
    } catch (err) {
      console.error('Google sign-in error:', err)
      setError(err instanceof Error ? err.message : 'Authentication failed')
    }
  }

  const signOut = async () => {
    try {
      pb.authStore.clear()
      setUser(null)
      navigate('/')
    } catch (error) {
      console.error('Sign-out error:', error)
    }
  }

  const getToken = () => pb.authStore.token

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, signOut, getToken, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)