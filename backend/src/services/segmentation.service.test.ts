/**
 * RED phase: Failing tests for 80/20 Squared Segmentation Engine
 * Feature: segmentation_engine.feature
 */
import { describe, it, expect } from 'bun:test'
import {
  segmentClients,
  getTierForClient,
  DEFAULT_THRESHOLDS,
  type Client,
  type SegmentThresholds,
} from './segmentation.service'

describe('80/20 Squared Segmentation Engine', () => {
  const sampleClients: Client[] = [
    { id: '1', name: 'Client A', revenue: 500000, score: 95 },
    { id: '2', name: 'Client B', revenue: 450000, score: 92 },
    { id: '3', name: 'Client C', revenue: 120000, score: 85 },
    { id: '4', name: 'Client D', revenue: 110000, score: 80 },
    { id: '5', name: 'Client E', revenue: 10000, score: 40 },
    { id: '6', name: 'Client F', revenue: 5000, score: 35 },
    { id: '7', name: 'Client G', revenue: 2000, score: 20 },
  ]

  describe('segmentClients', () => {
    it('should assign Client A to Premier tier', () => {
      const result = segmentClients(sampleClients)
      const clientA = result.premier.find((c) => c.name === 'Client A')
      expect(clientA).toBeDefined()
      expect(clientA?.name).toBe('Client A')
    })

    it('should partition clients into three tiers by population percentage', () => {
      const result = segmentClients(sampleClients)
      const total = result.premier.length + result.core.length + result.drainy80.length
      expect(total).toBe(sampleClients.length)
      expect(result.premier.length).toBeGreaterThanOrEqual(1)
      expect(result.drainy80.length).toBeGreaterThanOrEqual(1)
    })

    it('should place Client B in Core tier', () => {
      const result = segmentClients(sampleClients)
      const coreNames = result.core.map((c) => c.name)
      expect(coreNames).toContain('Client B')
    })

    it('should contain Client E, F, G in Drainy 80 tier', () => {
      const result = segmentClients(sampleClients)
      const drainyNames = result.drainy80.map((c) => c.name)
      expect(drainyNames).toContain('Client E')
      expect(drainyNames).toContain('Client F')
      expect(drainyNames).toContain('Client G')
    })

    it('should sort by score descending for tier assignment', () => {
      const result = segmentClients(sampleClients)
      expect(result.premier[0].score).toBeGreaterThanOrEqual(result.core[0]?.score ?? 0)
      expect(result.core[0]?.score).toBeGreaterThanOrEqual(result.drainy80[0]?.score ?? 0)
    })
  })

  describe('getTierForClient', () => {
    it('should return Premier for top 4% by score', () => {
      const tier = getTierForClient(
        { id: '1', name: 'Top', revenue: 500000, score: 95 },
        sampleClients
      )
      expect(tier).toBe('Premier')
    })

    it('should return Drainy 80 for bottom 80%', () => {
      const tier = getTierForClient(
        { id: '7', name: 'Client G', revenue: 2000, score: 20 },
        sampleClients
      )
      expect(tier).toBe('Drainy 80')
    })
  })

  describe('custom thresholds', () => {
    it('should respect draggable bracket thresholds', () => {
      const customThresholds: SegmentThresholds = {
        premierPopulationPct: 0.05,
        corePopulationPct: 0.15,
        drainy80PopulationPct: 0.8,
      }
      const result = segmentClients(sampleClients, customThresholds)
      const total = result.premier.length + result.core.length + result.drainy80.length
      expect(total).toBe(sampleClients.length)
    })
  })
})
