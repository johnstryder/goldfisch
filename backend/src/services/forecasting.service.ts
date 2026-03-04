/**
 * Growth Forecasting Engine - GoldFisch
 * Feature: growth_forecasting_engine.feature
 * Capacity displacement, ROI projections, valuation multipliers
 */

export type CapacityDisplacementInput = {
  currentHoursPerWeek: number
  drainy80TimeAllocPct: number
  targetDrainy80TimeAllocPct: number
  automationEfficiency: number
  premierTimeAllocPct?: number
  targetPremierTimeAllocPct?: number
}

export type CapacityDisplacementResult = {
  recoveredCapacityHoursPerWeek: number
  projectedRevenueIncreasePct: number
}

export function calculateCapacityDisplacement(
  input: CapacityDisplacementInput
): CapacityDisplacementResult {
  const drainyHoursCurrent = input.currentHoursPerWeek * input.drainy80TimeAllocPct
  const drainyHoursTarget =
    input.currentHoursPerWeek * input.targetDrainy80TimeAllocPct * (1 - input.automationEfficiency)
  const recovered = drainyHoursCurrent - drainyHoursTarget
  const recoveredCapacityHoursPerWeek = Math.max(0, recovered)

  const reallocatedToPremier = input.targetPremierTimeAllocPct
    ? (input.targetPremierTimeAllocPct - (input.premierTimeAllocPct ?? 0.2)) * input.currentHoursPerWeek
    : recoveredCapacityHoursPerWeek
  const projectedRevenueIncreasePct = Math.min(100, (reallocatedToPremier / input.currentHoursPerWeek) * 100)

  return {
    recoveredCapacityHoursPerWeek: Math.round(recoveredCapacityHoursPerWeek * 10) / 10,
    projectedRevenueIncreasePct: Math.round(projectedRevenueIncreasePct * 10) / 10,
  }
}

export function calculateProjectedRevenueJump(
  avgPremierRevenue: number,
  newClientCount: number
): { projectedJump: number; newClientCount: number } {
  return {
    projectedJump: avgPremierRevenue * newClientCount,
    newClientCount,
  }
}

export type CompoundedROIInput = {
  referralRatePerPremier: number
  conversionProbability: number
  horizonYears: number
  premierClientCount: number
  avgRevenuePerClient: number
}

export function calculateCompoundedROI(input: CompoundedROIInput): {
  year3ProjectedRevenue: number
  growthCurveData: { year: number; revenue: number }[]
} {
  const growthCurveData: { year: number; revenue: number }[] = []
  let totalRevenue = input.premierClientCount * input.avgRevenuePerClient

  for (let year = 1; year <= input.horizonYears; year++) {
    const newReferrals =
      input.premierClientCount * input.referralRatePerPremier * input.conversionProbability * year
    totalRevenue += newReferrals * input.avgRevenuePerClient
    growthCurveData.push({ year, revenue: totalRevenue })
  }

  return {
    year3ProjectedRevenue: growthCurveData[input.horizonYears - 1]?.revenue ?? totalRevenue,
    growthCurveData,
  }
}

export function applyRiskPenalty(
  baseProjection: number,
  confidencePct: number
): { adjustedProjection: number; confidenceInterval: { low: number; high: number } } {
  const penalty = confidencePct < 0.4 ? 1 - (0.4 - confidencePct) : 1
  const adjustedProjection = baseProjection * Math.max(0.2, penalty)
  const spread = adjustedProjection * (1 - confidencePct)
  return {
    adjustedProjection,
    confidenceInterval: {
      low: adjustedProjection - spread,
      high: adjustedProjection + spread,
    },
  }
}
