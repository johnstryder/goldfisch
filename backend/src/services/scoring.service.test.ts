/**
 * RED phase: Failing tests for Client Scoring Algorithm
 * Feature: scoring_algorithm.feature
 */
import { describe, it, expect } from 'bun:test'
import {
  calculateWeightedScore,
  applyPenaltyMultipliers,
  redistributeWeightsForIncompleteProfile,
  DEFAULT_WEIGHTS,
  type ClientScores,
  type ScoringWeights,
} from './scoring.service'

describe('Client Scoring Algorithm', () => {
  describe('calculateWeightedScore', () => {
    it('should return high score for a Premier relationship with full category scores', () => {
      const scores: ClientScores = {
        Revenue: 95,
        ReferralHistory: 80,
        FuturePotential: 90,
        RespectForTime: 85,
        RelationshipFocus: 90,
      }
      const result = calculateWeightedScore(scores)
      expect(result.overallScore).toBeGreaterThanOrEqual(85)
      expect(result.eligibleForPremier).toBe(true)
    })

    it('should apply variable multipliers to penalize high-maintenance clients', () => {
      const scores: ClientScores = {
        Revenue: 100,
        ReferralHistory: 10,
        FuturePotential: 20,
        RespectForTime: 10,
        RelationshipFocus: 30,
      }
      const result = calculateWeightedScore(scores, {
        penaltyMultipliers: { HighMaintenance: 0.7, FlightRisk: 0.8 },
        hasSubtractionBadge: true,
      })
      // Base weighted ~49.5, * 0.7 * 0.8 = 27.72
      expect(result.finalScore).toBeCloseTo(27.72, 1)
      expect(result.hasSubtractionBadge).toBe(true)
    })

    it('should apply sentiment chip tag deductions to Respect for Time', () => {
      const scores: ClientScores = {
        Revenue: 80,
        ReferralHistory: 70,
        FuturePotential: 75,
        RespectForTime: 85,
        RelationshipFocus: 80,
      }
      const result = calculateWeightedScore(scores, {
        sentimentDeductions: { RespectForTime: 25 },
      })
      expect(result.categoryScores.RespectForTime).toBe(60)
    })
  })

  describe('redistributeWeightsForIncompleteProfile', () => {
    it('should redistribute missing Referral History weight across remaining categories', () => {
      const scores: Partial<ClientScores> = {
        Revenue: 90,
        FuturePotential: 85,
        RespectForTime: 80,
        RelationshipFocus: 75,
      }
      const { weights, isIncomplete } = redistributeWeightsForIncompleteProfile(
        scores,
        DEFAULT_WEIGHTS
      )
      expect(isIncomplete).toBe(true)
      expect(
        weights.Revenue + weights.FuturePotential + weights.RespectForTime + weights.RelationshipFocus
      ).toBeCloseTo(1.0, 5)
      expect(weights.ReferralHistory).toBe(0)
    })
  })

  describe('applyPenaltyMultipliers', () => {
    it('should reduce score by 0.7 when High Maintenance multiplier is applied', () => {
      const baseScore = 50
      const result = applyPenaltyMultipliers(baseScore, { HighMaintenance: 0.7 })
      expect(result).toBe(35)
    })

    it('should apply multiple multipliers cumulatively', () => {
      const baseScore = 100
      const result = applyPenaltyMultipliers(baseScore, {
        HighMaintenance: 0.7,
        FlightRisk: 0.8,
      })
      expect(result).toBeCloseTo(56, 0) // 100 * 0.7 * 0.8
    })
  })
})
