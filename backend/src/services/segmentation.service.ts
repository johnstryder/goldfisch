/**
 * 80/20 Squared Segmentation Engine - GoldFisch
 * Feature: segmentation_engine.feature
 * Groups clients into Premier (4%), Core (16%), Drainy 80 (80%)
 */

export type Client = {
  id: string
  name: string
  revenue: number
  score: number
  manualOverride?: boolean
  overrideReason?: string
}

export type SegmentThresholds = {
  premierPopulationPct: number
  corePopulationPct: number
  drainy80PopulationPct: number
}

export const DEFAULT_THRESHOLDS: SegmentThresholds = {
  premierPopulationPct: 0.04,
  corePopulationPct: 0.16,
  drainy80PopulationPct: 0.8,
}

export type SegmentationResult = {
  premier: Client[]
  core: Client[]
  drainy80: Client[]
  snapshotTimestamp: Date
}

export function segmentClients(
  clients: Client[],
  thresholds: SegmentThresholds = DEFAULT_THRESHOLDS
): SegmentationResult {
  const withManualOverrides = clients.filter((c) => c.manualOverride)
  const autoClients = clients
    .filter((c) => !c.manualOverride)
    .sort((a, b) => b.score - a.score)

  const n = autoClients.length
  const premierCount = Math.max(1, Math.floor(n * thresholds.premierPopulationPct))
  const coreCount = Math.max(0, Math.floor(n * thresholds.corePopulationPct))

  const premier = autoClients.slice(0, premierCount)
  const core = autoClients.slice(premierCount, premierCount + coreCount)
  const drainy80 = autoClients.slice(premierCount + coreCount)

  const manualPremier = withManualOverrides.filter((c) => c.manualOverride)
  const manualCore = [] as Client[]
  const manualDrainy = [] as Client[]

  return {
    premier: [...premier, ...manualPremier],
    core,
    drainy80,
    snapshotTimestamp: new Date(),
  }
}

export function getTierForClient(
  client: Client,
  allClients: Client[],
  thresholds: SegmentThresholds = DEFAULT_THRESHOLDS
): 'Premier' | 'Core' | 'Drainy 80' {
  if (client.manualOverride) return 'Premier'

  const sorted = [...allClients]
    .filter((c) => !c.manualOverride)
    .sort((a, b) => b.score - a.score)
  const idx = sorted.findIndex((c) => c.id === client.id)
  if (idx < 0) return 'Drainy 80'

  const n = sorted.length
  const premierCount = Math.max(1, Math.floor(n * thresholds.premierPopulationPct))
  const coreCount = Math.max(0, Math.floor(n * thresholds.corePopulationPct))

  if (idx < premierCount) return 'Premier'
  if (idx < premierCount + coreCount) return 'Core'
  return 'Drainy 80'
}
