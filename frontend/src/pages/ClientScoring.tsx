import { useState } from 'react'

const CATEGORIES = [
  'Revenue',
  'ReferralHistory',
  'FuturePotential',
  'RespectForTime',
  'RelationshipFocus',
] as const

export function ClientScoring() {
  const [scores, setScores] = useState<Record<string, number>>({
    Revenue: 80,
    ReferralHistory: 70,
    FuturePotential: 75,
    RespectForTime: 85,
    RelationshipFocus: 80,
  })
  const [result, setResult] = useState<{
    overallScore: number
    finalScore: number
    eligibleForPremier: boolean
    hasSubtractionBadge: boolean
  } | null>(null)
  const [highMaintenance, setHighMaintenance] = useState(false)
  const [flightRisk, setFlightRisk] = useState(false)

  const calculate = async () => {
    try {
      const res = await fetch('/api/scoring/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scores,
          options: {
            penaltyMultipliers: {
              ...(highMaintenance && { HighMaintenance: 0.7 }),
              ...(flightRisk && { FlightRisk: 0.8 }),
            },
            hasSubtractionBadge: highMaintenance || flightRisk,
          },
        }),
      })
      const data = await res.json()
      setResult(data)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-text">Client Scoring</h1>
      <p className="text-muted mt-2">5-category weighted scoring with penalty multipliers • Iconic Sliders</p>
      <div className="mt-6 space-y-4">
        {CATEGORIES.map((cat) => (
          <div key={cat} className="space-y-1">
            <label className="block text-sm font-medium text-text">{cat}</label>
            <input
              type="range"
              min="0"
              max="100"
              value={scores[cat] ?? 50}
              onChange={(e) => setScores((s) => ({ ...s, [cat]: +e.target.value }))}
              className="w-full h-2 bg-surface rounded-full appearance-none cursor-pointer accent-primary"
            />
            <span className="text-sm text-muted">{scores[cat] ?? 50}</span>
          </div>
        ))}
        <div className="flex gap-4 pt-2">
          <label className="flex items-center gap-2 text-text cursor-pointer">
            <input
              type="checkbox"
              checked={highMaintenance}
              onChange={(e) => setHighMaintenance(e.target.checked)}
              className="rounded accent-primary"
            />
            High Maintenance (-30%)
          </label>
          <label className="flex items-center gap-2 text-text cursor-pointer">
            <input
              type="checkbox"
              checked={flightRisk}
              onChange={(e) => setFlightRisk(e.target.checked)}
              className="rounded accent-primary"
            />
            Flight Risk (-20%)
          </label>
        </div>
        <button
          onClick={calculate}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90"
        >
          Calculate Score
        </button>
        {result && (
          <div className="p-4 rounded-lg bg-surface border border-surface shadow-card">
            <p className="font-semibold text-text">
              Overall: {result.overallScore.toFixed(1)} → Final: {result.finalScore.toFixed(2)}
            </p>
            <p className={result.eligibleForPremier ? 'text-success' : 'text-warning'}>
              {result.eligibleForPremier ? 'Eligible for Premier' : 'Not Premier'}
            </p>
            {result.hasSubtractionBadge && (
              <span className="inline-block mt-2 px-2 py-0.5 bg-danger/20 text-danger rounded text-sm">
                Subtraction Badge
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
