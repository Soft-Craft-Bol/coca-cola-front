import { Badge, Card, ErrorBox, Loading } from '@/shared/components/ui'
import { useAsync } from '@/shared/hooks/useAsync'
import { insightsService } from '../services/insightsService'

const TONE = { alta: 'red', media: 'amber', baja: 'green' } as const
const LABEL = { alta: 'Prioridad alta', media: 'Prioridad media', baja: 'Oportunidad' } as const

// Recomendaciones accionables generadas con reglas sobre los indicadores del evento
export default function RecommendationsTab({ eventId }: { eventId: string }) {
  const { data, loading, error } = useAsync(() => insightsService.recommendations(eventId || undefined), [eventId])
  if (error) return <ErrorBox error={error} />
  if (loading || !data) return <Loading />
  if (data.length === 0) return <div className="empty">Aún no hay datos suficientes para recomendar</div>

  return (
    <div className="grid cols-2">
      {data.map((r) => (
        <Card key={r.title}>
          <div className="row spread" style={{ marginBottom: 8 }}>
            <Badge tone={TONE[r.priority]}>{LABEL[r.priority]}</Badge>
            <span className="muted" style={{ fontSize: 12 }}>{r.category}</span>
          </div>
          <h3 style={{ fontSize: 16, marginBottom: 6 }}>{r.title}</h3>
          <p className="muted" style={{ margin: 0, fontSize: 14, lineHeight: 1.6 }}>{r.detail}</p>
        </Card>
      ))}
    </div>
  )
}
