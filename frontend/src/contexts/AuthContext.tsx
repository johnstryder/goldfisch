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
        throw new Error('No OAuth providers available')
      }

      const provider = authData.oauth2.providers.find((p: any) => p.name === 'google')
      if (!provider) throw new Error('Google provider not found')

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

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, signOut, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)