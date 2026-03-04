import { useState } from 'react'
import { Link } from 'react-router-dom'

export function TimeAllocation() {
  const [drainyPct, setDrainyPct] = useState(50)
  const [targetDrainyPct, setTargetDrainyPct] = useState(10)
  const [automation, setAutomation] = useState(90)
  const [result, setResult] = useState<{
    recoveredCapacityHoursPerWeek: number
    projectedRevenueIncreasePct: number
  } | null>(null)

  const calculate = async () => {
    try {
      const res = await fetch('/api/forecasting/capacity-displacement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentHoursPerWeek: 40,
          drainy80TimeAllocPct: drainyPct / 100,
          targetDrainy80TimeAllocPct: targetDrainyPct / 100,
          automationEfficiency: automation / 100,
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
        <h1 className="text-2xl font-bold">Time Allocation & ROI Calculator</h1>
        <p className="text-gray-600 mt-2">Max Effectiveness • Capacity Displacement</p>
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium">Current Drainy 80 Time %</label>
            <input
              type="range"
              min="0"
              max="100"
              value={drainyPct}
              onChange={(e) => setDrainyPct(+e.target.value)}
              className="w-full"
            />
            <span>{drainyPct}%</span>
          </div>
          <div>
            <label className="block text-sm font-medium">Target Drainy 80 Time %</label>
            <input
              type="range"
              min="0"
              max="100"
              value={targetDrainyPct}
              onChange={(e) => setTargetDrainyPct(+e.target.value)}
              className="w-full"
            />
            <span>{targetDrainyPct}%</span>
          </div>
          <div>
            <label className="block text-sm font-medium">Automation Efficiency %</label>
            <input
              type="range"
              min="0"
              max="100"
              value={automation}
              onChange={(e) => setAutomation(+e.target.value)}
              className="w-full"
            />
            <span>{automation}%</span>
          </div>
          <button
            onClick={calculate}
            className="px-4 py-2 bg-indigo-600 text-white rounded"
          >
            Calculate Capacity Displacement
          </button>
          {result && (
            <div className="p-4 border rounded-lg bg-white mt-4">
              <h3 className="font-semibold">Impact Scorecard</h3>
              <p>Recovered Capacity: {result.recoveredCapacityHoursPerWeek} hrs/week</p>
              <p>Projected Revenue Increase: {result.projectedRevenueIncreasePct}%</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
