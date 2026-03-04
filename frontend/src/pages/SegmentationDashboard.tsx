import { useState, useEffect } from 'react'

type Client = { id: string; name: string; revenue: number; score: number }
type SegmentationResult = { premier: Client[]; core: Client[]; drainy80: Client[] }

export function SegmentationDashboard() {
  const [clients, setClients] = useState<Client[]>([])
  const [result, setResult] = useState<SegmentationResult | null>(null)
  const [loading, setLoading] = useState(false)

  const sampleClients: Client[] = [
    { id: '1', name: 'Client A', revenue: 500000, score: 95 },
    { id: '2', name: 'Client B', revenue: 450000, score: 92 },
    { id: '3', name: 'Client C', revenue: 120000, score: 85 },
    { id: '4', name: 'Client D', revenue: 110000, score: 80 },
    { id: '5', name: 'Client E', revenue: 10000, score: 40 },
    { id: '6', name: 'Client F', revenue: 5000, score: 35 },
    { id: '7', name: 'Client G', revenue: 2000, score: 20 },
  ]

  const runSegmentation = async (clientList: Client[]) => {
    setLoading(true)
    try {
      const res = await fetch('/api/segmentation/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clients: clientList }),
      })
      const data = await res.json()
      setResult(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setClients(sampleClients)
    runSegmentation(sampleClients)
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-text">80/20 Squared Segmentation</h1>
      <p className="text-muted mt-2">Premier (4%) • Core (16%) • Drainy 80 (80%)</p>
      <button
        onClick={() => runSegmentation(clients.length > 0 ? clients : sampleClients)}
        disabled={loading}
        className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium disabled:opacity-50 hover:opacity-90"
      >
        {loading ? 'Running...' : 'Run Segmentation'}
      </button>
      {result && (
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="p-4 rounded-lg border border-tier-premier/30 bg-tier-premier/10 shadow-card">
            <h3 className="font-semibold text-tier-premier">Premier (Top 4%)</h3>
            <p className="text-sm text-muted mt-1">Target Revenue: 60-65%</p>
            <div className="mt-2 space-y-1">
              {result.premier.map((c) => (
                <div key={c.id} className="flex justify-between text-sm text-text">
                  <span>{c.name}</span>
                  <span>${(c.revenue / 1000).toFixed(0)}k</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 rounded-lg border border-tier-core/30 bg-tier-core/10 shadow-card">
            <h3 className="font-semibold text-tier-core">Core (Next 16%)</h3>
            <div className="mt-2 space-y-1">
              {result.core.map((c) => (
                <div key={c.id} className="flex justify-between text-sm text-text">
                  <span>{c.name}</span>
                  <span>${(c.revenue / 1000).toFixed(0)}k</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 rounded-lg border border-tier-drainy/30 bg-tier-drainy/10 shadow-card">
            <h3 className="font-semibold text-tier-drainy">Drainy 80 (Bottom 80%)</h3>
            <div className="mt-2 space-y-1">
              {result.drainy80.map((c) => (
                <div key={c.id} className="flex justify-between text-sm text-text">
                  <span>{c.name}</span>
                  <span>${(c.revenue / 1000).toFixed(0)}k</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
