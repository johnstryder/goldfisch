import { Link } from 'react-router-dom'

export function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-4 py-3 flex gap-4">
        <Link to="/" className="font-bold">GoldFisch</Link>
        <Link to="/segmentation">Segmentation</Link>
        <Link to="/scoring">Client Scoring</Link>
        <Link to="/time-allocation">Time Allocation</Link>
      </nav>
      <div className="p-6">
        <h1 className="text-2xl font-bold">ROI & Growth Forecasting</h1>
        <p className="text-gray-600 mt-2">Opportunity cost, capacity displacement, valuation</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="p-4 border rounded-lg bg-white">
            <h3 className="font-semibold">Diverging Bar Chart</h3>
            <p className="text-sm text-gray-500 mt-1">Tier comparison placeholder</p>
          </div>
          <div className="p-4 border rounded-lg bg-white">
            <h3 className="font-semibold">Impact Scorecard</h3>
            <p className="text-sm text-gray-500 mt-1">Recovered capacity placeholder</p>
          </div>
          <div className="p-4 border rounded-lg bg-white">
            <h3 className="font-semibold">Valuation Multiplier</h3>
            <p className="text-sm text-gray-500 mt-1">Enterprise value placeholder</p>
          </div>
        </div>
      </div>
    </div>
  )
}
