import { useState } from 'react'
import { Card, Empty, ProgressBar } from '@/shared/components/ui'
import { formatNumber } from '@/shared/utils/format'
import type { NamedValue, ProductInterest } from '@/shared/types'

interface Props {
  title?: string
  products: ProductInterest[]
  byFlavor: NamedValue[]
  byPresentation: NamedValue[]
  byCategory: NamedValue[]
  total: number // participantes (para calcular el % de interés)
}

const VIEWS = [['producto', 'Producto'], ['sabor', 'Sabor'], ['presentacion', 'Presentación'], ['categoria', 'Categoría']] as const
type View = (typeof VIEWS)[number][0]

// Interés de los participantes por producto, sabor, presentación o categoría, con su porcentaje
export default function InterestCard({ title = 'Interés de los participantes', products, byFlavor, byPresentation, byCategory, total }: Props) {
  const [view, setView] = useState<View>('producto')
  const pct = (value: number) => (total ? (value / total) * 100 : 0)
  const rows = view === 'producto'
    ? products.map((p) => ({ name: p.name, value: p.value, pct: p.pct }))
    : (view === 'sabor' ? byFlavor : view === 'presentacion' ? byPresentation : byCategory).map((n) => ({ name: n.name, value: n.value, pct: pct(n.value) }))
  const max = Math.max(1, ...rows.map((r) => r.value))

  return (
    <Card title={title}>
      <div className="chips" style={{ marginBottom: 14 }}>
        {VIEWS.map(([k, l]) => <button key={k} className={`chip ${view === k ? 'on' : ''}`} onClick={() => setView(k)}>{l}</button>)}
      </div>
      {rows.length === 0 ? <Empty>Aún no hay preferencias registradas</Empty> : (
        <div className="stack" style={{ gap: 12 }}>
          {rows.slice(0, 8).map((r) => (
            <div key={r.name}>
              <div className="row spread" style={{ fontSize: 13, marginBottom: 4 }}>
                <span>{r.name}</span>
                <strong>{formatNumber(r.value)} · {r.pct.toFixed(0)} %</strong>
              </div>
              <ProgressBar value={(r.value / max) * 100} />
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
