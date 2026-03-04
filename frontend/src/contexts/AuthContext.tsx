import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { pb } from '../lib/pocketbase'

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
  const location = useLocation()

  useEffect(() => {
    if (pb.authStore.isValid && pb.authStore.model) {
      const userModel = pb.authStore.model as Record<string, unknown>
      setUser({
        id: userModel.id as string,
        email: userModel.email as string,
        name: (userModel.name as string) || (userModel.email as string),
        avatar: userModel.avatar as string | undefined
      })
    }
    setIsLoading(false)

    const unsubscribe = pb.authStore.onChange((_token, model) => {
      if (model) {
        const userModel = model as Record<string, unknown>
        setUser({
          id: userModel.id as string,
          email: userModel.email as string,
          name: (userModel.name as string) || (userModel.email as string),
          avatar: userModel.avatar as string | undefined
        })
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })

    return unsubscribe
  }, [])

  const signInWithGoogle = async () => {
    setError(null)
    try {
      const res = await fetch('/api/auth/google')
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to start Google sign-in')

      localStorage.setItem('redirectPath', location.pathname || '/')
      window.location.href = data.url
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
    } catch (err) {
      console.error('Sign-out error:', err)
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
