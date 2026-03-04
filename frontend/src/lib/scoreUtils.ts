/**
 * Client scoring display utilities - used by Client Scoring UI
 */
export function formatScore(score: number): string {
  return score.toFixed(1)
}

export function getTierColor(tier: string): string {
  switch (tier) {
    case 'Premier':
      return 'text-green-600'
    case 'Core':
      return 'text-amber-600'
    case 'Drainy 80':
      return 'text-red-600'
    default:
      return 'text-gray-600'
  }
}

export function isEligibleForPremier(score: number): boolean {
  return score >= 85
}
