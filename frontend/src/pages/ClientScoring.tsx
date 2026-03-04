import { useState } from 'react'
import { Link } from 'react-router-dom'

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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-4 py-3 flex gap-4">
        <Link to="/" className="font-bold">GoldFisch</Link>
        <Link to="/segmentation">Segmentation</Link>
        <Link to="/scoring">Client Scoring</Link>
        <Link to="/time-allocation">Time Allocation</Link>
      </nav>
      <div className="p-6 max-w-2xl">
        <h1 className="text-2xl font-bold">Client Scoring</h1>
        <p className="text-gray-600 mt-2">5-category weighted scoring with penalty multipliers</p>
        <div className="mt-6 space-y-4">
          {CATEGORIES.map((cat) => (
            <div key={cat}>
              <label className="block text-sm font-medium">{cat}</label>
              <input
                type="range"
                min="0"
                max="100"
                value={scores[cat] ?? 50}
                onChange={(e) => setScores((s) => ({ ...s, [cat]: +e.target.value }))}
                className="w-full"
              />
              <span className="text-sm text-gray-500">{scores[cat] ?? 50}</span>
            </div>
          ))}
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={highMaintenance}
                onChange={(e) => setHighMaintenance(e.target.checked)}
              />
              High Maintenance (-30%)
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={flightRisk}
                onChange={(e) => setFlightRisk(e.target.checked)}
              />
              Flight Risk (-20%)
            </label>
          </div>
          <button
            onClick={calculate}
            className="px-4 py-2 bg-indigo-600 text-white rounded"
          >
            Calculate Score
          </button>
          {result && (
            <div className="p-4 border rounded-lg bg-white">
              <p className="font-semibold">
                Overall: {result.overallScore.toFixed(1)} → Final: {result.finalScore.toFixed(2)}
              </p>
              <p className={result.eligibleForPremier ? 'text-green-600' : 'text-amber-600'}>
                {result.eligibleForPremier ? 'Eligible for Premier' : 'Not Premier'}
              </p>
              {result.hasSubtractionBadge && (
                <span className="inline-block mt-2 px-2 py-0.5 bg-red-100 text-red-700 rounded text-sm">
                  Subtraction Badge
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
