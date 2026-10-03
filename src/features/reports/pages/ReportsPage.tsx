import { useState, type CSSProperties } from 'react'
import type { EventSummary } from '@/shared/types'
import { Card, ErrorBox, Loading, PageHeader } from '@/shared/components/ui'
import { useAsync } from '@/shared/hooks/useAsync'
import { useSelectedEvent } from '@/shared/hooks/useSelectedEvent'
import { downloadCsv, type CsvColumn } from '@/shared/utils/csv'
import { formatDate, formatNumber, formatPercent } from '@/shared/utils/format'
import { usePagination } from '@/shared/hooks/usePagination'
import Pagination from '@/shared/components/Pagination'
import EventSelector from '@/features/events/components/EventSelector'
import { reportService } from '../services/reportService'

const COMPARE_COLUMNS: CsvColumn<EventSummary>[] = [
  { label: 'Evento', value: (e) => e.name },
  { label: 'Tipo', value: (e) => e.type },
  { label: 'Campaña', value: (e) => e.campaign },
  { label: 'Registrados', value: (e) => e.registered },
  { label: 'Asistentes', value: (e) => e.attended },
  { label: 'Asistencia %', value: (e) => e.attendanceRate.toFixed(1) },
  { label: 'Interacciones', value: (e) => e.interactions },
  { label: 'Conversiones', value: (e) => e.conversions },
  { label: 'Canjes', value: (e) => e.redemptions },
  { label: 'Satisfacción', value: (e) => e.satisfaction.toFixed(2) },
  { label: 'NPS', value: (e) => Math.round(e.nps) },
]

type NumericKey = 'attended' | 'attendanceRate' | 'interactions' | 'conversions' | 'redemptions' | 'satisfaction'

function best(list: EventSummary[], key: NumericKey): (e: EventSummary) => CSSProperties | undefined {
  const max = Math.max(...list.map((e) => e[key]))
  return (e) => (e[key] === max && max > 0 ? { fontWeight: 600, color: 'var(--red)' } : undefined)
}

export default function ReportsPage() {
  const { eventId, setEventId } = useSelectedEvent('finished')
  const [tab, setTab] = useState('comparar')
  const overview = useAsync(() => reportService.overview(), [])
  const event = useAsync(() => (eventId ? reportService.event(eventId) : Promise.resolve(null)), [eventId])
  const [selected, setSelected] = useState<string[]>([])

  const list = overview.data?.perEvent ?? []
  const pg = usePagination(list, 5)
  const compared = selected.length ? list.filter((e) => selected.includes(e.id)) : list
  const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  const m = event.data

  const summaryLine = m &&
    `Asistieron ${formatNumber(m.attended)} personas, ${formatNumber(m.productInteractions)} interactuaron con productos, se generaron ${formatNumber(m.conversions)} conversiones, ${formatNumber(m.redemptions)} canjearon un beneficio${m.productInterest[0] ? ` y ${m.productInterest[0].name} fue el producto que generó mayor interés` : ''}.`

  return (
    <>
      <PageHeader
        title="Reportes"
        subtitle="Resultados por evento y comparación entre eventos"
        actions={
          <>
            <button className="btn" onClick={() => window.print()}>Imprimir / PDF</button>
            <button className="btn primary" disabled={!compared.length} onClick={() => downloadCsv('comparacion-eventos.csv', compared, COMPARE_COLUMNS)}>Exportar CSV</button>
          </>
        }
      />
      <ErrorBox error={overview.error} />
      <div className="tabs">
        <button className={`tab ${tab === 'comparar' ? 'on' : ''}`} onClick={() => setTab('comparar')}>Comparación entre eventos</button>
        <button className={`tab ${tab === 'evento' ? 'on' : ''}`} onClick={() => setTab('evento')}>Reporte de un evento</button>
      </div>

      {tab === 'comparar' && (
        <Card title="Indicadores por evento" actions={<span className="muted" style={{ fontSize: 12 }}>Marca eventos para comparar (vacío = todos). En rojo, el mejor valor.</span>}>
          {overview.loading ? <Loading /> : (
            <>
            <div className="table-wrap">
              <table>
                <thead><tr><th /><th>Evento</th><th>Fecha</th><th>Asistentes</th><th>Asistencia</th><th>Interacciones</th><th>Conversiones</th><th>Canjes</th><th>Satisfacción</th><th>NPS</th></tr></thead>
                <tbody>
                  {pg.pageItems.map((e) => {
                    const on = selected.includes(e.id)
                    const scope = compared
                    return (
                      <tr key={e.id} style={on ? { background: 'var(--red-soft)' } : undefined}>
                        <td><input type="checkbox" checked={on} onChange={() => toggle(e.id)} /></td>
                        <td><strong>{e.name}</strong><br /><span className="muted" style={{ fontSize: 12 }}>{e.type}</span></td>
                        <td>{formatDate(e.date)}</td>
                        <td style={best(scope, 'attended')(e)}>{e.attended}</td>
                        <td style={best(scope, 'attendanceRate')(e)}>{formatPercent(e.attendanceRate)}</td>
                        <td style={best(scope, 'interactions')(e)}>{e.interactions}</td>
                        <td style={best(scope, 'conversions')(e)}>{e.conversions}</td>
                        <td style={best(scope, 'redemptions')(e)}>{e.redemptions}</td>
                        <td style={best(scope, 'satisfaction')(e)}>{e.satisfaction ? e.satisfaction.toFixed(1) : '—'}</td>
                        <td>{Math.round(e.nps)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <Pagination p={pg} sizes={[5, 10, 20]} />
            </>
          )}
        </Card>
      )}

      {tab === 'evento' && (
        <div className="stack">
          <div className="row"><EventSelector value={eventId} onChange={setEventId} /></div>
          {event.loading || !m ? <Loading /> : (
            <Card title={`Reporte de resultados · ${m.event.name}`}>
              <p style={{ fontSize: 16, lineHeight: 1.6, marginTop: 0 }}>{summaryLine}</p>
              <table>
                <tbody>
                  {[
                    ['Registrados', formatNumber(m.registered)],
                    ['Asistentes', `${formatNumber(m.attended)} (${formatPercent(m.attendanceRate)})`],
                    ['Nuevos / recurrentes', `${m.newCount} / ${m.returningCount}`],
                    ['Índice de recurrencia', formatPercent(m.recurrenceIndex, 1)],
                    ['Muestras entregadas', formatNumber(m.samples)],
                    ['Tasa de participación en experiencias', formatPercent(m.participationRate, 1)],
                    ['Registros con consentimiento', `${m.consents} (${formatPercent(m.consentRate)})`],
                    ['Tasa de conversión', formatPercent(m.conversionRate, 1)],
                    ['Interacciones por asistente', m.interactionRate.toFixed(2)],
                    ['Satisfacción', m.satisfaction ? `${m.satisfaction.toFixed(2)} / 5` : '—'],
                    ['NPS', m.surveyCount ? Math.round(m.nps) : '—'],
                  ].map(([k, v]) => <tr key={k}><td className="muted">{k}</td><td><strong>{v}</strong></td></tr>)}
                </tbody>
              </table>
            </Card>
          )}
        </div>
      )}
    </>
  )
}
