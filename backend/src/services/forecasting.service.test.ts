/**
 * RED phase: Failing tests for Growth Forecasting Engine
 * Feature: growth_forecasting_engine.feature
 */
import { describe, it, expect } from 'bun:test'
import {
  calculateCapacityDisplacement,
  calculateProjectedRevenueJump,
  calculateCompoundedROI,
  applyRiskPenalty,
} from './forecasting.service'

describe('Growth Forecasting Engine', () => {
  describe('calculateCapacityDisplacement', () => {
    it('should return recovered capacity in hours when shifting from Drainy 80 to Premier', () => {
      const result = calculateCapacityDisplacement({
        currentHoursPerWeek: 40,
        drainy80TimeAllocPct: 0.5,
        targetDrainy80TimeAllocPct: 0.05,
        automationEfficiency: 0.9,
      })
      expect(result.recoveredCapacityHoursPerWeek).toBeGreaterThan(0)
      expect(result.projectedRevenueIncreasePct).toBeGreaterThanOrEqual(0)
    })

    it('should show significant recovered capacity when moving Drainy from 50% to 10%', () => {
      const result = calculateCapacityDisplacement({
        currentHoursPerWeek: 40,
        drainy80TimeAllocPct: 0.5,
        targetDrainy80TimeAllocPct: 0.1,
        automationEfficiency: 0.9,
      })
      expect(result.recoveredCapacityHoursPerWeek).toBeGreaterThanOrEqual(15)
    })
  })

  describe('calculateProjectedRevenueJump', () => {
    it('should calculate revenue jump for new Premier client', () => {
      const avgPremierRevenue = 250000
      const result = calculateProjectedRevenueJump(avgPremierRevenue, 1)
      expect(result.projectedJump).toBe(250000)
      expect(result.newClientCount).toBe(1)
    })
  })

  describe('calculateCompoundedROI', () => {
    it('should project compounded revenue over horizon', () => {
      const result = calculateCompoundedROI({
        referralRatePerPremier: 0.25,
        conversionProbability: 0.8,
        horizonYears: 3,
        premierClientCount: 10,
        avgRevenuePerClient: 200000,
      })
      expect(result.year3ProjectedRevenue).toBeGreaterThan(0)
      expect(result.growthCurveData.length).toBeGreaterThan(0)
    })
  })

  describe('applyRiskPenalty', () => {
    it('should apply risk penalty when confidence below 40%', () => {
      const baseProjection = 100000
      const result = applyRiskPenalty(baseProjection, 0.35)
      expect(result.adjustedProjection).toBeLessThan(baseProjection)
      expect(result.confidenceInterval).toBeDefined()
    })
  })
})
