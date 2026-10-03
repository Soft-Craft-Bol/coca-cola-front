import { Badge, Card, ErrorBox, KpiCard, Loading, ProgressBar } from '@/shared/components/ui'
import { BarsChart } from '@/shared/components/charts'
import { useAsync } from '@/shared/hooks/useAsync'
import { insightsService } from '../services/insightsService'

// Predicción de asistencia para los eventos próximos o en curso, con la asistencia histórica por fuente de registro
export default function ForecastTab() {
  const { data, loading, error } = useAsync(() => insightsService.forecast(), [])
  if (error) return <ErrorBox error={error} />
  if (loading || !data) return <Loading />
  if (data.length === 0) return <div className="empty">No hay eventos próximos o en curso para predecir</div>

  return (
    <div className="stack">
      {data.map((f) => (
        <Card key={f.eventId} title={f.eventName} actions={<Badge tone={f.status === 'active' ? 'green' : 'amber'}>{f.status === 'active' ? 'En curso' : 'Planificado'}</Badge>}>
          {f.expectedAttendees == null ? <p className="muted">{f.note}</p> : (
            <div className="stack">
              <div className="grid cols-4">
                <KpiCard label="Asistentes esperados" value={f.expectedAttendees} hint={`Rango probable: ${f.low} a ${f.high}`} accent />
                <KpiCard label="Registrados" value={f.registered} hint={f.targetExpected ? `Meta: ${f.targetExpected}` : undefined} />
                <KpiCard label="Ya ingresaron" value={f.attendedSoFar} />
                <KpiCard label="Conversiones proyectadas" value={f.projectedConversions ?? '—'} hint={f.historicalRate != null ? `Asistencia histórica: ${f.historicalRate.toFixed(0)} %` : undefined} />
              </div>
              {f.targetExpected ? (
                <div>
                  <div className="row spread" style={{ fontSize: 13, marginBottom: 4 }}>
                    <span>Asistencia esperada frente a la meta</span>
                    <strong>{Math.round((f.expectedAttendees / f.targetExpected) * 100)} %</strong>
                  </div>
                  <ProgressBar value={(f.expectedAttendees / f.targetExpected) * 100} />
                </div>
              ) : null}
              {f.bySource.length > 0 && (
                <div>
                  <h3 style={{ fontSize: 14, marginBottom: 8 }}>Asistencia histórica por fuente de registro (%)</h3>
                  <BarsChart horizontal seriesName="Asistencia histórica (%)" data={f.bySource.map((s) => ({ name: s.source, value: Math.round(s.rate) }))} />
                </div>
              )}
              <p className="muted" style={{ fontSize: 12, margin: 0 }}>{f.note}</p>
            </div>
          )}
        </Card>
      ))}
    </div>
  )
}
