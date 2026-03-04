import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePostHog } from 'posthog-js/react'
import { pb } from '../lib/pocketbase'
import { Loader2, AlertCircle } from 'lucide-react'

export function OAuthCallback() {
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const posthog = usePostHog()

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const searchParams = new URLSearchParams(window.location.search)
        const code = searchParams.get('code')
        const state = searchParams.get('state')

        const providerJson = localStorage.getItem('provider')
        if (!providerJson) {
          throw new Error('No provider data found')
        }
        const provider = JSON.parse(providerJson)

        if (!state || state !== provider.state) {
          throw new Error('Invalid state parameter')
        }

        if (!code) {
          throw new Error('No code parameter received')
        }

        const authData = await pb.collection('users').authWithOAuth2Code(
          'google',
          code,
          provider.codeVerifier,
          `${window.location.origin}/oauth-callback`,
          { emailVisibility: true }
        )

        posthog?.capture('user_signed_up', {
          provider: 'google',
          is_new_user: authData.meta?.isNewRecord ?? false
        })

        localStorage.removeItem('provider')

        const redirectPath = localStorage.getItem('redirectPath') || '/'
        localStorage.removeItem('redirectPath')

        navigate(redirectPath, { replace: true })
      } catch (err) {
        console.error('OAuth callback error:', err)
        setError('Authentication failed. Please try again.')
      }
    }

    handleOAuthCallback()
  }, [navigate, posthog])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="bg-danger/10 border border-danger/50 rounded-lg p-4 flex items-center gap-2 text-danger">
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
