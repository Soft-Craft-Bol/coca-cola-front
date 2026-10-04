import { Badge, Card, ErrorBox, KpiCard, Loading, ProgressBar } from '@/shared/components/ui'
import { DonutChart } from '@/shared/components/charts'
import { useAsync } from '@/shared/hooks/useAsync'
import { insightsService } from '../services/insightsService'
import PredictionAnalysis from './PredictionAnalysis'

const TONE = { Alta: 'green', Media: 'amber', Baja: '' } as const

// Afinidad: probabilidad estimada de que cada participante vuelva a futuros eventos
export default function AffinityTab({ eventId }: { eventId: string }) {
  const { data, loading, error } = useAsync(() => insightsService.affinity(eventId || undefined, 15), [eventId])
  if (error) return <ErrorBox error={error} />
  if (loading || !data) return <Loading />

  return (
    <div className="stack">
      <PredictionAnalysis eventId={eventId || undefined} />
      <div className="grid cols-3">
        <KpiCard label="Afinidad promedio" value={`${data.averageScore.toFixed(0)} / 100`} accent />
        {data.distribution.map((d) => <KpiCard key={d.name} label={`Afinidad ${d.name.toLowerCase()}`} value={d.value} />)}
      </div>
      <div className="grid cols-2">
        <Card title="Distribución de la afinidad"><DonutChart data={data.distribution} /></Card>
        <Card title="Cómo se calcula">
          <p className="muted" style={{ marginTop: 0, fontSize: 14, lineHeight: 1.7 }}>
            Es una puntuación de 0 a 100 (modelo logístico con pesos fijos y explicables). Suma puntos cuando la persona
            asistió, interactuó, calificó bien los productos, compraría, aceptó comunicaciones, convirtió, es recurrente o
            fue promotora en la encuesta. No requiere entrenamiento y cada resultado muestra sus factores.
          </p>
        </Card>
      </div>
      <Card title="Participantes con mayor probabilidad de volver">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Participante</th><th>Ciudad</th><th>Afinidad</th><th>Factores</th></tr></thead>
            <tbody>
              {data.top.map((a) => (
                <tr key={a.participantId}>
                  <td>{a.name}{!a.consent && <><br /><span className="muted" style={{ fontSize: 12 }}>Sin consentimiento</span></>}</td>
                  <td>{a.city}</td>
                  <td style={{ minWidth: 170 }}>
                    <div className="row"><div style={{ flex: 1 }}><ProgressBar value={a.score} /></div><strong>{a.score}</strong></div>
                    <Badge tone={TONE[a.level]}>{a.level}</Badge>
                  </td>
                  <td><div className="chips">{a.factors.slice(0, 4).map((f) => <span key={f} className="chip static">{f}</span>)}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
