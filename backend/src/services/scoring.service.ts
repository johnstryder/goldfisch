/**
 * Client Scoring Algorithm - GoldFisch
 * Feature: scoring_algorithm.feature
 * 5-category weighted scoring with penalty multipliers and dynamic weight redistribution
 */

export const DEFAULT_WEIGHTS: ScoringWeights = {
  Revenue: 0.4,
  ReferralHistory: 0.2,
  FuturePotential: 0.15,
  RespectForTime: 0.15,
  RelationshipFocus: 0.1,
}

export type ScoringWeights = {
  Revenue: number
  ReferralHistory: number
  FuturePotential: number
  RespectForTime: number
  RelationshipFocus: number
}

export type ClientScores = {
  Revenue: number
  ReferralHistory: number
  FuturePotential: number
  RespectForTime: number
  RelationshipFocus: number
}

export type ScoringOptions = {
  penaltyMultipliers?: Record<string, number>
  sentimentDeductions?: Partial<Record<keyof ClientScores, number>>
  hasSubtractionBadge?: boolean
  weights?: ScoringWeights
}

export function calculateWeightedScore(
  scores: ClientScores | Partial<ClientScores>,
  options: ScoringOptions = {}
): {
  overallScore: number
  finalScore: number
  eligibleForPremier: boolean
  hasSubtractionBadge: boolean
  categoryScores: Record<string, number>
  weights: ScoringWeights
} {
  const weights = options.weights ?? DEFAULT_WEIGHTS
  const { weights: redistributedWeights, isIncomplete } = redistributeWeightsForIncompleteProfile(
    scores,
    weights
  )
  const effectiveWeights = redistributedWeights

  const categoryScores: Record<string, number> = {}
  let weightedSum = 0
  let totalWeight = 0

  const categories = Object.keys(effectiveWeights) as (keyof ClientScores)[]
  for (const cat of categories) {
    const rawScore = (scores as Record<string, number>)[cat] ?? 0
    const deduction = options.sentimentDeductions?.[cat] ?? 0
    const adjustedScore = Math.max(0, rawScore - deduction)
    categoryScores[cat] = adjustedScore
    weightedSum += adjustedScore * effectiveWeights[cat]
    totalWeight += effectiveWeights[cat]
  }

  weightedSum = totalWeight > 0 ? weightedSum / totalWeight : 0
  let finalScore = weightedSum

  if (options.penaltyMultipliers && Object.keys(options.penaltyMultipliers).length > 0) {
    const product = Object.values(options.penaltyMultipliers).reduce((a, b) => a * b, 1)
    finalScore = finalScore * product
  }

  const eligibleForPremier = finalScore >= 85
  const hasSubtractionBadge = options.hasSubtractionBadge ?? false

  return {
    overallScore: Math.round(weightedSum * 10) / 10,
    finalScore: Math.round(finalScore * 100) / 100,
    eligibleForPremier,
    hasSubtractionBadge,
    categoryScores,
    weights: effectiveWeights,
  }
}

export function applyPenaltyMultipliers(
  baseScore: number,
  multipliers: Record<string, number>
): number {
  const product = Object.values(multipliers).reduce((a, b) => a * b, 1)
  return Math.round(baseScore * product * 100) / 100
}

export function redistributeWeightsForIncompleteProfile(
  scores: Partial<ClientScores>,
  weights: ScoringWeights
): {
  weights: ScoringWeights
  isIncomplete: boolean
} {
  const presentCategories = (Object.keys(weights) as (keyof ScoringWeights)[]).filter(
    (k) => scores[k] !== undefined && scores[k] !== null
  )
  const missingCategories = (Object.keys(weights) as (keyof ScoringWeights)[]).filter(
    (k) => !presentCategories.includes(k)
  )

  if (missingCategories.length === 0) {
    return { weights, isIncomplete: false }
  }

  const presentWeight = presentCategories.reduce((sum, k) => sum + weights[k], 0)
  const missingWeight = missingCategories.reduce((sum, k) => sum + weights[k], 0)

  if (presentWeight >= 1) {
    return { weights, isIncomplete: false }
  }

  const scale = 1 / presentWeight
  const newWeights = { ...weights }
  for (const k of presentCategories) {
    newWeights[k] = weights[k] * scale
  }
  for (const k of missingCategories) {
    newWeights[k] = 0
  }

  return {
    weights: newWeights,
    isIncomplete: true,
  }
}
