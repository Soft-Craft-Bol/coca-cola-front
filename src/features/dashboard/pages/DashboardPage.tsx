import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ErrorBox, Loading, PageHeader } from '@/shared/components/ui'
import { useAsync } from '@/shared/hooks/useAsync'
import { useSelectedEvent } from '@/shared/hooks/useSelectedEvent'
import { useLive, useLiveFlag } from '@/shared/hooks/useLive'
import LiveToggle from '@/shared/components/LiveToggle'
import EventSelector from '@/features/events/components/EventSelector'
import EventDashboard from '../components/EventDashboard'
import { LoyaltyPage, ParticipantsPage, PerformancePage, ProductCampaignPage, SummaryPage } from '../components/OverviewPages'
import PowerBiPanel from '../components/PowerBiPanel'
import { dashboardService } from '../services/dashboardService'

const TABS = [
  ['evento', 'Evento'],
  ['resumen', 'Resumen general'],
  ['participantes', 'Participantes'],
  ['rendimiento', 'Rendimiento de eventos'],
  ['producto', 'Producto y campaña'],
  ['fidelizacion', 'Fidelización'],
  ['powerbi', 'Power BI'],
]

export default function DashboardPage() {
  const [params] = useSearchParams()
  const { eventId, setEventId } = useSelectedEvent('finished')
  const [tab, setTab] = useState('evento')
  const [live, setLive] = useLiveFlag()
  const targetEvent = params.get('evento') || eventId

  return (
    <>
      <PageHeader
        title="Panel de indicadores"
        subtitle="Indicadores del impacto de los eventos Coca-Cola"
        actions={<>{tab === 'evento' && <EventSelector value={targetEvent} onChange={setEventId} />}<LiveToggle live={live} onChange={setLive} /></>}
      />
      <div className="tabs">
        {TABS.map(([k, l]) => <button key={k} className={`tab ${tab === k ? 'on' : ''}`} onClick={() => setTab(k)}>{l}</button>)}
      </div>
      {tab === 'powerbi' ? <PowerBiPanel /> : tab === 'evento'
        ? <EventPanel key={targetEvent} eventId={targetEvent} live={live} /> : <OverviewPanel tab={tab} live={live} />}
    </>
  )
}

function EventPanel({ eventId, live }: { eventId: string; live: boolean }) {
  const { data, loading, error, refresh } = useAsync(() => eventId ? dashboardService.event(eventId) : Promise.resolve(null), [eventId])
  useLive(refresh, live)
  if (error) return <ErrorBox error={error} />
  if (!eventId) return <div className="empty">Selecciona un evento para ver sus indicadores</div>
  if (loading || !data) return <Loading />
  return <EventDashboard m={data} />
}

function OverviewPanel({ tab, live }: { tab: string; live: boolean }) {
  const { data: o, loading, error, refresh } = useAsync(() => dashboardService.overview(), [])
  useLive(refresh, live)
  if (error) return <ErrorBox error={error} />
  if (loading || !o) return <Loading />
  return { resumen: <SummaryPage o={o} />, participantes: <ParticipantsPage o={o} />, rendimiento: <PerformancePage o={o} />, producto: <ProductCampaignPage o={o} />, fidelizacion: <LoyaltyPage o={o} /> }[tab]
}
