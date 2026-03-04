import PocketBase from 'pocketbase'

function getPocketBaseUrl(): string {
  if (typeof window === 'undefined') return '/api/pb'
  return import.meta.env.VITE_POCKETBASE_URL ?? `${window.location.origin}/api/pb`
}

export const pb = new PocketBase(getPocketBaseUrl())
