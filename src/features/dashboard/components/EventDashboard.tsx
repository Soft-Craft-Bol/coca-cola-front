import type { EventMetrics } from '@/shared/types'
import { Card, KpiCard, ProgressBar } from '@/shared/components/ui'
import { BarsChart, DonutChart } from '@/shared/components/charts'
import AttendeesMap from '@/shared/components/AttendeesMap'
import ExperiencesCard from './ExperiencesCard'
import InterestCard from './InterestCard'
import { SURVEY_CRITERIA } from '@/shared/constants'
import { formatNumber, formatPercent } from '@/shared/utils/format'

const criterionLabel = (key: string) => SURVEY_CRITERIA.find((c) => c.key === key)?.label ?? key

// Dashboard principal de un evento (KPIs + embudo + operación)
export default function EventDashboard({ m }: { m: EventMetrics }) {
  return (
    <div className="stack">
      <div className="grid cols-4">
        <KpiCard label="Participantes" value={m.registered} hint={`Esperados: ${m.event.expected}`} />
        <KpiCard label="Asistentes" value={m.attended} hint={`${formatPercent(m.attendanceRate)} de asistencia`} accent />
        <KpiCard label="Interacciones de producto" value={m.productInteractions} hint={`${formatNumber(m.samples)} muestras entregadas`} />
        <KpiCard label="Conversiones" value={m.conversions} hint={`${formatPercent(m.conversionRate, 1)} de conversión`} accent />
        <KpiCard label="Canjes / registros objetivo" value={m.redemptions} />
        <KpiCard label="Satisfacción" value={m.satisfaction ? `${m.satisfaction.toFixed(1)} / 5` : '—'} hint={`${m.surveyCount} encuestas`} />
        <KpiCard label="NPS" value={m.surveyCount ? Math.round(m.nps) : '—'} />
        <KpiCard label="Permanencia promedio" value={m.avgStayMinutes ? `${Math.round(m.avgStayMinutes)} min` : '—'} />
      </div>

      <div className="grid cols-2">
        <Card title="Embudo de interacción">
          <div className="stack" style={{ gap: 12 }}>
            {m.funnel.map((f) => (
              <div key={f.name}>
                <div className="row spread" style={{ fontSize: 13, marginBottom: 4 }}>
                  <span>{f.name}</span>
                  <strong>{formatNumber(f.value)}</strong>
                </div>
                <ProgressBar value={m.funnel[0].value ? (f.value / m.funnel[0].value) * 100 : 0} />
              </div>
            ))}
          </div>
        </Card>
        <Card title="Nuevos vs. recurrentes">
          <DonutChart data={[{ name: 'Nuevos', value: m.newCount }, { name: 'Recurrentes', value: m.returningCount }]} />
        </Card>
        <InterestCard title="Productos con mayor interés" products={m.productInterest} byFlavor={m.interestByFlavor}
          byPresentation={m.interestByPresentation} byCategory={m.interestByCategory} total={m.registered} />
        <Card title="Actividades con mayor participación">
          <BarsChart horizontal data={m.activityPerformance} seriesName="Participantes" />
        </Card>
        <ExperiencesCard data={m.experienceInterest} />
        <Card title="Horarios de mayor afluencia (ingresos)">
          <BarsChart data={m.hourly} seriesName="Ingresos" />
        </Card>
        <Card title="Satisfacción por criterio">
          <div className="stack" style={{ gap: 12 }}>
            {m.satisfactionByCriterion.map((c) => (
              <div key={c.key}>
                <div className="row spread" style={{ fontSize: 13, marginBottom: 4 }}>
                  <span>{criterionLabel(c.key)}</span>
                  <strong>{c.value ? c.value.toFixed(1) : '—'}</strong>
                </div>
                <ProgressBar value={(c.value / 5) * 100} />
              </div>
            ))}
          </div>
        </Card>
        <Card title="Procedencia de los participantes">
          <AttendeesMap data={m.byCity} />
        </Card>
      </div>
    </div>
  )
}
