import { useState } from 'react'
import { Crown, Eye, Target, UserX, Zap } from 'lucide-react'
import { Badge, Card, ErrorBox, Loading, ProgressBar } from '@/shared/components/ui'
import { useAsync } from '@/shared/hooks/useAsync'
import { insightsService } from '../services/insightsService'

const ICONS = { embajadores: Crown, potenciales: Target, activos: Zap, pasivos: Eye, ausentes: UserX }

// Segmentación automática de participantes según su comportamiento en el evento
export default function SegmentsTab({ eventId }: { eventId: string }) {
  const { data, loading, error } = useAsync(() => insightsService.segments(eventId || undefined), [eventId])
  const [selected, setSelected] = useState<string | null>(null)

  if (error) return <ErrorBox error={error} />
  if (loading || !data) return <Loading />
  const current = data.find((s) => s.key === selected) ?? data.find((s) => s.count > 0) ?? data[0]

  return (
    <div className="stack">
      <div className="grid cols-3">
        {data.map((s) => {
          const Icon = ICONS[s.key as keyof typeof ICONS] ?? Eye
          return (
            <button key={s.key} className={`segment-card ${current?.key === s.key ? 'on' : ''}`} onClick={() => setSelected(s.key)}>
              <div className="row spread">
                <span className="segment-icon"><Icon size={20} /></span>
                <strong className="segment-count">{s.count}</strong>
              </div>
              <h3>{s.name}</h3>
              <p>{s.description}</p>
              <ProgressBar value={s.pct} />
              <small>{s.pct.toFixed(0)} % de los participantes</small>
            </button>
          )
        })}
      </div>

      {current && (
        <Card title={current.name} actions={<Badge tone="red">{current.count} personas</Badge>}>
          <p className="muted" style={{ marginTop: 0 }}><strong>Acción sugerida:</strong> {current.action}</p>
          {current.members.length === 0 ? <div className="empty">Ningún participante en este segmento</div> : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Participante</th><th>Ciudad</th><th>Comunicaciones</th><th>Afinidad</th></tr></thead>
                <tbody>
                  {current.members.map((m) => (
                    <tr key={m.participantId}>
                      <td>{m.name}</td>
                      <td>{m.city}</td>
                      <td>{m.consent ? <Badge tone="green">Aceptó</Badge> : <Badge>Sin consentimiento</Badge>}</td>
                      <td style={{ minWidth: 150 }}><div className="row"><div style={{ flex: 1 }}><ProgressBar value={m.affinity} /></div><strong>{m.affinity}</strong></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {current.count > current.members.length && <p className="muted" style={{ fontSize: 12, marginBottom: 0 }}>Se muestran los {current.members.length} con mayor afinidad.</p>}
        </Card>
      )}
    </div>
  )
}
