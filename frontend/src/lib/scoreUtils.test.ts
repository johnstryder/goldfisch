/**
 * Unit tests for score display utilities - Red-Green-Refactor
 */
import { describe, it, expect } from 'vitest'
import { formatScore, getTierColor, isEligibleForPremier } from './scoreUtils'

describe('scoreUtils', () => {
  describe('formatScore', () => {
    it('should format score to one decimal place', () => {
      expect(formatScore(91.0)).toBe('91.0')
      expect(formatScore(72.25)).toBe('72.3')
    })
  })

  describe('getTierColor', () => {
    it('should return green for Premier tier', () => {
      expect(getTierColor('Premier')).toBe('text-green-600')
    })
    it('should return amber for Core tier', () => {
      expect(getTierColor('Core')).toBe('text-amber-600')
    })
    it('should return red for Drainy 80 tier', () => {
      expect(getTierColor('Drainy 80')).toBe('text-red-600')
    })
  })

  describe('isEligibleForPremier', () => {
    it('should return true when score >= 85', () => {
      expect(isEligibleForPremier(85)).toBe(true)
      expect(isEligibleForPremier(91)).toBe(true)
    })
    it('should return false when score < 85', () => {
      expect(isEligibleForPremier(84)).toBe(false)
      expect(isEligibleForPremier(72)).toBe(false)
    })
  })
})
