/**
 * Scenario Persistence and Historical Tier Tracking - GoldFisch
 * Feature: scenario_persistence.feature
 */

import { randomUUID } from 'crypto'

export type ScenarioSnapshot = {
  scenario_uuid: string
  scenario_name: string
  total_production_weeks: number
  premier_time_alloc: number
  drainy_80_time_alloc: number
  created_at: string
}

export type TierHistoryEntry = {
  id: string
  client_id: string
  previous_tier: string
  current_tier: string
  change_trigger: string
  timestamp: string
}

export function createScenarioSnapshot(input: {
  scenarioName: string
  totalProductionWeeks: number
  premierTimeAlloc: number
  drainy80TimeAlloc: number
}): ScenarioSnapshot {
  return {
    scenario_uuid: randomUUID(),
    scenario_name: input.scenarioName,
    total_production_weeks: input.totalProductionWeeks,
    premier_time_alloc: input.premierTimeAlloc,
    drainy_80_time_alloc: input.drainy80TimeAlloc,
    created_at: new Date().toISOString(),
  }
}

export function createTierHistoryEntry(input: {
  clientId: string
  previousTier: string
  currentTier: string
  changeTrigger: string
}): TierHistoryEntry {
  return {
    id: randomUUID(),
    client_id: input.clientId,
    previous_tier: input.previousTier,
    current_tier: input.currentTier,
    change_trigger: input.changeTrigger,
    timestamp: new Date().toISOString(),
  }
}
