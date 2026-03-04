export function DataOnboarding() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-text">Data Onboarding Wizard</h1>
      <p className="text-muted mt-2">Connect CRM, map fields, prepare for scoring • Guided Step-Through</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="p-4 rounded-lg bg-surface border border-surface shadow-card">
          <h3 className="font-semibold text-text">Integration List</h3>
          <ul className="mt-2 space-y-2 text-sm text-muted">
            <li>Salesforce — Pending</li>
            <li>Wealthbox — Pending</li>
            <li>Plaid — Pending</li>
            <li>Email Provider — Pending</li>
          </ul>
        </div>
        <div className="p-4 rounded-lg bg-surface border border-surface shadow-card">
          <h3 className="font-semibold text-text">Field Mapping</h3>
          <p className="text-sm text-muted mt-1">Draggable Chips • Auto-Detect Schema</p>
        </div>
      </div>
    </div>
  )
}
