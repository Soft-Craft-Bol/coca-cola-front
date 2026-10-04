import { usePagination } from '@/shared/hooks/usePagination'
import Pagination from '@/shared/components/Pagination'
import type { OverviewMetrics } from '@/shared/types'
import { Card, KpiCard } from '@/shared/components/ui'
import { BarsChart, DonutChart, GroupedBars, MultiLineChart } from '@/shared/components/charts'
import ImpactSummary from './ImpactSummary'
import AttendeesMap from '@/shared/components/AttendeesMap'
import ExperiencesCard from './ExperiencesCard'
import InterestCard from './InterestCard'
import { formatNumber, formatPercent } from '@/shared/utils/format'

const SERIES: Record<string, string> = {
  registered: 'Registrados',
  attended: 'Asistentes',
  interactions: 'Interacciones',
  conversions: 'Conversiones',
  redemptions: 'Canjes',
}

// Páginas del panel ejecutivo (equivalentes a las páginas sugeridas para Power BI)

export function SummaryPage({ o }: { o: OverviewMetrics }) {
  return (
    <div className="stack">
      <ImpactSummary attended={o.attended} interactions={o.productInteractions} conversions={o.conversions} redemptions={o.redemptions} productInterest={o.productInterest} scope="de todos los eventos" />
      <div className="grid cols-4">
        <KpiCard label="Eventos" value={o.events} />
        <KpiCard label="Participantes" value={o.registered} />
        <KpiCard label="Asistencia" value={o.attended} hint={`${formatPercent(o.attendanceRate)} efectiva`} accent />
        <KpiCard label="Interacciones" value={o.productInteractions} hint={`${formatNumber(o.samples)} muestras`} />
        <KpiCard label="Conversiones" value={o.conversions} accent />
        <KpiCard label="Canjes" value={o.redemptions} />
        <KpiCard label="Satisfacción" value={o.satisfaction ? `${o.satisfaction.toFixed(1)} / 5` : '—'} />
        <KpiCard label="NPS global" value={Math.round(o.nps)} />
      </div>
      <Card title="Evolución de asistencia por evento">
        <MultiLineChart data={o.evolution} keys={['Asistentes', 'Recurrentes']} />
      </Card>
    </div>
  )
}

export function ParticipantsPage({ o }: { o: OverviewMetrics }) {
  return (
    <div className="grid cols-2">
      <Card title="Edad"><BarsChart data={o.byAge} seriesName="Participantes" /></Card>
      <Card title="Ciudad"><BarsChart horizontal data={o.byCity} seriesName="Participantes" /></Card>
      <Card title="Mapa de asistentes"><AttendeesMap data={o.byCity} /></Card>
      <Card title="Nuevo o recurrente"><DonutChart data={o.newVsReturning} /></Card>
      <Card title="Fuente de registro"><DonutChart data={o.bySource} /></Card>
      <Card title="Consentimiento para comunicaciones"><DonutChart data={o.consentSplit} /></Card>
      <Card title="Preferencias de producto"><BarsChart horizontal data={o.productInterest} seriesName="Personas interesadas" /></Card>
    </div>
  )
}

export function PerformancePage({ o }: { o: OverviewMetrics }) {
  const pg = usePagination(o.perEvent, 5)
  return (
    <div className="stack">
      <Card title="Comparación entre eventos">
        <GroupedBars data={o.perEvent} keys={['registered', 'attended', 'interactions', 'conversions']} labels={SERIES} />
      </Card>
      <Card title="Detalle">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Evento</th><th>Registrados</th><th>Asistentes</th><th>Asistencia</th><th>Interacciones</th><th>Conversiones</th><th>Satisfacción</th></tr></thead>
            <tbody>
              {pg.pageItems.map((e) => (
                <tr key={e.id}>
                  <td>{e.name}</td><td>{e.registered}</td><td>{e.attended}</td><td>{formatPercent(e.attendanceRate)}</td>
                  <td>{e.interactions}</td><td>{e.conversions}</td><td>{e.satisfaction ? e.satisfaction.toFixed(1) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination p={pg} sizes={[5, 10, 20]} />
      </Card>
    </div>
  )
}

export function ProductCampaignPage({ o }: { o: OverviewMetrics }) {
  return (
    <div className="grid cols-2">
      <InterestCard title="Productos, sabores y presentaciones con mayor interés" products={o.productInterest} byFlavor={o.interestByFlavor}
        byPresentation={o.interestByPresentation} byCategory={o.interestByCategory} total={o.registered} />
      <ExperiencesCard data={o.experienceInterest} />
      <Card title="Participantes por campaña"><DonutChart data={o.byCampaign} /></Card>
      <Card title="Conversiones y canjes por evento" className="">
        <GroupedBars data={o.perEvent} keys={['conversions', 'redemptions']} labels={SERIES} />
      </Card>
    </div>
  )
}

export function LoyaltyPage({ o }: { o: OverviewMetrics }) {
  return (
    <div className="stack">
      <div className="grid cols-3">
        <KpiCard label="Participantes recurrentes" value={o.returning} accent />
        <KpiCard label="Índice de recurrencia" value={formatPercent(o.recurrenceIndex, 1)} hint="Asistentes que ya habían participado" />
        <KpiCard label="Consentimientos" value={o.consents} />
      </div>
      <div className="grid cols-2">
        <Card title="Eventos por usuario"><BarsChart data={o.loyalty} seriesName="Participantes" /></Card>
        <Card title="Evolución de participación"><MultiLineChart data={o.evolution} keys={['Asistentes', 'Recurrentes']} /></Card>
      </div>
    </div>
  )
}
