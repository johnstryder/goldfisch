import { Link } from 'react-router-dom'

export function DataOnboarding() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-4 py-3 flex gap-4">
        <Link to="/" className="font-bold">GoldFisch</Link>
        <Link to="/segmentation">Segmentation</Link>
        <Link to="/scoring">Client Scoring</Link>
        <Link to="/time-allocation">Time Allocation</Link>
      </nav>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Data Onboarding Wizard</h1>
        <p className="text-gray-600 mt-2">Connect CRM, map fields, prepare for scoring</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="p-4 border rounded-lg bg-white">
            <h3 className="font-semibold">Integration List</h3>
            <ul className="mt-2 space-y-2 text-sm">
              <li>Salesforce — Pending</li>
              <li>Wealthbox — Pending</li>
              <li>Plaid — Pending</li>
              <li>Email Provider — Pending</li>
            </ul>
          </div>
          <div className="p-4 border rounded-lg bg-white">
            <h3 className="font-semibold">Field Mapping</h3>
            <p className="text-sm text-gray-500 mt-1">Draggable Chips • Auto-Detect Schema</p>
          </div>
        </div>
      </div>
    </div>
  )
}
