import { useState } from 'react'
import { PageHeader } from '@/shared/components/ui'
import EventSelector from '@/features/events/components/EventSelector'
import AffinityTab from '../components/AffinityTab'
import ChatTab from '../components/ChatTab'
import ForecastTab from '../components/ForecastTab'
import RecommendationsTab from '../components/RecommendationsTab'
import SegmentsTab from '../components/SegmentsTab'
import SummaryTab from '../components/SummaryTab'

const TABS = [
  ['resumen', 'Resumen con IA'],
  ['segmentos', 'Segmentación'],
  ['afinidad', 'Afinidad'],
  ['prediccion', 'Predicción'],
  ['recomendaciones', 'Recomendaciones'],
  ['asistente', 'Asistente'],
] as const

type Tab = (typeof TABS)[number][0]

export default function InsightsPage() {
  const [tab, setTab] = useState<Tab>('resumen')
  const [eventId, setEventId] = useState('')

  return (
    <>
      <PageHeader
        title="Inteligencia"
        subtitle="Segmentos, afinidad, predicción de asistencia y recomendaciones calculados con los datos de tus eventos"
        actions={tab !== 'prediccion' && tab !== 'asistente' && <EventSelector value={eventId} onChange={setEventId} allowAll />}
      />
      <div className="tabs">
        {TABS.map(([k, l]) => <button key={k} className={`tab ${tab === k ? 'on' : ''}`} onClick={() => setTab(k)}>{l}</button>)}
      </div>
      {tab === 'resumen' && <SummaryTab eventId={eventId} />}
      {tab === 'segmentos' && <SegmentsTab eventId={eventId} />}
      {tab === 'afinidad' && <AffinityTab eventId={eventId} />}
      {tab === 'prediccion' && <ForecastTab />}
      {tab === 'recomendaciones' && <RecommendationsTab eventId={eventId} />}
      {tab === 'asistente' && <ChatTab />}
    </>
  )
}
