import PocketBase from 'pocketbase'

// Always use same-origin proxy to avoid CORS when PocketBase is on a different domain.
// Backend proxies /api/pb/* to POCKETBASE_URL.
function getPocketBaseUrl(): string {
  if (typeof window === 'undefined') return '/api/pb'
  return `${window.location.origin}/api/pb`
}

export const pb = new PocketBase(getPocketBaseUrl())
