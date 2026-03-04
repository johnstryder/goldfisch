import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PocketBase from 'pocketbase'
import { usePostHog } from 'posthog-js/react'
import { useConfig } from './ConfigContext'

interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  signInWithGoogle: () => void
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
  const { pocketbaseUrl } = useConfig()
  const posthog = usePostHog()

  const pb = new PocketBase(pocketbaseUrl)

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

  // Use .then() instead of async/await so Safari doesn't block the popup (PocketBase docs)
  const signInWithGoogle = () => {
    setError(null)
    pb.collection('users')
      .authWithOAuth2({
        provider: 'google',
        createData: { emailVisibility: true },
      })
      .then((authData) => {
        posthog?.capture('user_signed_up', {
          provider: 'google',
          is_new_user: authData.meta?.isNewRecord ?? false,
        })
      })
      .catch((err) => {
        console.error('Google sign-in error:', err)
        setError(err instanceof Error ? err.message : 'Authentication failed')
      })
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