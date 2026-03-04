export function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-text">ROI & Growth Forecasting</h1>
      <p className="text-muted mt-2">Opportunity cost, capacity displacement, valuation</p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="p-4 rounded-lg bg-surface border border-surface shadow-card">
          <h3 className="font-semibold text-text">Diverging Bar Chart</h3>
          <p className="text-sm text-muted mt-1">Tier comparison placeholder</p>
        </div>
        <div className="p-4 rounded-lg bg-surface border border-surface shadow-card">
          <h3 className="font-semibold text-text">Impact Scorecard</h3>
          <p className="text-sm text-muted mt-1">Recovered capacity placeholder</p>
        </div>
        <div className="p-4 rounded-lg bg-surface border border-surface shadow-card">
          <h3 className="font-semibold text-text">Valuation Multiplier</h3>
          <p className="text-sm text-muted mt-1">Enterprise value placeholder</p>
        </div>
      </div>
    </div>
  )
}
