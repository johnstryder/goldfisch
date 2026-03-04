import { useState } from 'react'

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
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-text">Time Allocation & ROI Calculator</h1>
      <p className="text-muted mt-2">Max Effectiveness • Capacity Displacement • Impact Heatmap</p>
      <div className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-text">Current Drainy 80 Time %</label>
          <input
            type="range"
            min="0"
            max="100"
            value={drainyPct}
            onChange={(e) => setDrainyPct(+e.target.value)}
            className="w-full h-2 bg-surface rounded-full appearance-none cursor-pointer accent-primary"
          />
          <span className="text-muted">{drainyPct}%</span>
        </div>
        <div>
          <label className="block text-sm font-medium text-text">Target Drainy 80 Time %</label>
          <input
            type="range"
            min="0"
            max="100"
            value={targetDrainyPct}
            onChange={(e) => setTargetDrainyPct(+e.target.value)}
            className="w-full h-2 bg-surface rounded-full appearance-none cursor-pointer accent-primary"
          />
          <span className="text-muted">{targetDrainyPct}%</span>
        </div>
        <div>
          <label className="block text-sm font-medium text-text">Automation Efficiency %</label>
          <input
            type="range"
            min="0"
            max="100"
            value={automation}
            onChange={(e) => setAutomation(+e.target.value)}
            className="w-full h-2 bg-surface rounded-full appearance-none cursor-pointer accent-primary"
          />
          <span className="text-muted">{automation}%</span>
        </div>
        <button
          onClick={calculate}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90"
        >
          Calculate Capacity Displacement
        </button>
        {result && (
          <div className="p-4 rounded-lg bg-surface border border-surface shadow-card mt-4">
            <h3 className="font-semibold text-text">Impact Scorecard</h3>
            <p className="text-muted mt-1">Recovered Capacity: {result.recoveredCapacityHoursPerWeek} hrs/week</p>
            <p className="text-muted">Projected Revenue Increase: {result.projectedRevenueIncreasePct}%</p>
          </div>
        )}
      </div>
    </div>
  )
}
