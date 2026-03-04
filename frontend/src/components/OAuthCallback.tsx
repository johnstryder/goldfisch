import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PocketBase from 'pocketbase'
import { Loader2, AlertCircle } from 'lucide-react'
import { usePostHog } from 'posthog-js/react'
import { useConfig } from '../contexts/ConfigContext'

export function OAuthCallback() {
  const [error, setError] = useState<string | null>(null)
  const posthog = usePostHog()
  const navigate = useNavigate()
  const { pocketbaseUrl } = useConfig()
  
  const pb = new PocketBase(pocketbaseUrl)

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Get URL parameters
        const searchParams = new URLSearchParams(window.location.search)
        const code = searchParams.get('code')
        const state = searchParams.get('state')

        // Get stored provider data
        const providerJson = localStorage.getItem('provider')
        if (!providerJson) {
          throw new Error('No provider data found')
        }
        const provider = JSON.parse(providerJson)

        // Verify state matches
        if (!state || state !== provider.state) {
          throw new Error('Invalid state parameter')
        }

        // Verify we have a code
        if (!code) {
          throw new Error('No code parameter received')
        }

        // Complete OAuth flow
        const authData = await pb.collection('users').authWithOAuth2Code(
          'google',
          code,
          provider.codeVerifier,
          `${window.location.origin}/oauth-callback`,
          {
            emailVisibility: true,
          }
        )

        // Manually save token and user record to authStore
        if (authData.token && authData.record) {
          pb.authStore.save(authData.token, authData.record)
        }

        // Track user signup/login
        posthog.capture('user_signed_up', {
          provider: 'google',
          is_new_user: !authData.meta?.isNewRecord ? false : true
        })

        // Clear stored data
        localStorage.removeItem('provider')

        // Get redirect path or default to home
        const redirectPath = localStorage.getItem('redirectPath') || '/'
        localStorage.removeItem('redirectPath')

        // Navigate to home page
        navigate(redirectPath, { replace: true })
      } catch (err) {
        console.error('OAuth callback error:', err)
        setError('Authentication failed. Please try again.')
      }
    }

    handleOAuthCallback()
  }, [navigate])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="bg-surface border border-danger rounded-lg p-4 flex items-center gap-2 text-danger">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
    </div>
  )
}