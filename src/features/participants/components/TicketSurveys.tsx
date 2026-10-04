import { useState } from 'react'
import { useQueries, useQueryClient } from '@tanstack/react-query'
import { AlertCircle, ArrowRight, CalendarDays, CheckCircle2, ClipboardList } from 'lucide-react'
import SurveyDialog, { type SurveyTarget } from '@/features/communications/components/SurveyDialog'
import { publicSurveyService } from '@/features/communications/services/publicSurveyService'
import { formatDateTime } from '@/shared/utils/format'
import { optimizeImage } from '@/shared/utils/image'
import type { PublicEvent, PublicSurveyInfo, PublicTicket } from '@/shared/types'

type Status = 'pending' | 'answered' | 'locked' | 'loading' | 'error'

// Encuestas de los eventos del asistente: una por entrada, con el estado que devuelve el backend
export default function TicketSurveys({ tickets, events }: { tickets: PublicTicket[] | null; events: PublicEvent[] | null }) {
  const qc = useQueryClient()
  const [target, setTarget] = useState<SurveyTarget | null>(null)
  const list = tickets ?? []
  const queries = useQueries({
    queries: list.map((t) => ({
      queryKey: ['public-survey', t.qrCode],
      queryFn: () => publicSurveyService.info(t.qrCode),
      retry: false,
    })),
  })

  const rows = list.map((t, i) => {
    const q = queries[i]
    const info: PublicSurveyInfo | undefined = q.data
    const status: Status = q.isPending ? 'loading' : q.isError ? 'error' : info!.answered ? 'answered' : info!.attended ? 'pending' : 'locked'
    return { t, q, info, status }
  })
  const order: Record<Status, number> = { pending: 0, error: 1, loading: 2, locked: 3, answered: 4 }
  rows.sort((a, b) => order[a.status] - order[b.status])

  const allAnswered = rows.length > 0 && rows.every((r) => r.status === 'answered')

  return (
    <section className="tk-section" aria-labelledby="tk-surveys-title">
      <header className="sh">
        <span className="sh-eyebrow">ENCUESTAS</span>
        <h2 id="tk-surveys-title" className="sh-title">Tus encuestas <span>disponibles</span></h2>
        <p className="sh-lead">{tickets && tickets.length > 0 ? 'Cuéntanos tu experiencia. Tu opinión nos ayuda a mejorar.' : 'Recupera tu entrada para consultar las encuestas de tus eventos.'}</p>
      </header>

      {tickets && tickets.length === 0 && <div className="tk-empty">No hay encuestas porque no encontramos inscripciones con ese dato.</div>}
      {allAnswered && <div className="tk-empty" role="status">Ya respondiste todas tus encuestas. ¡Gracias!</div>}

      {rows.length > 0 && (
        <ul className="tk-surveys">
          {rows.map(({ t, q, info, status }) => {
            const cover = optimizeImage(events?.find((e) => e.id === t.eventId)?.imageUrl, 160, 160)
            return (
              <li key={t.qrCode} className="tk-survey">
                <div className="tk-survey-head">
                  {cover ? <img src={cover} alt="" width={56} height={56} loading="lazy" /> : <span className="tk-ph" aria-hidden="true"><ClipboardList size={24} /></span>}
                  <span className={`tk-state ${status}`}>
                    {status === 'pending' && 'Pendiente'}
                    {status === 'answered' && <><CheckCircle2 size={14} aria-hidden="true" /> Respondida</>}
                    {status === 'locked' && 'Disponible al asistir'}
                    {status === 'loading' && 'Cargando…'}
                    {status === 'error' && 'Sin conexión'}
                  </span>
                </div>
                <h3>Encuesta de satisfacción</h3>
                <p className="tk-survey-event">{t.eventName}</p>
                <p className="tk-meta"><CalendarDays size={16} aria-hidden="true" /> {formatDateTime(t.eventDate)}</p>
                <p className="tk-desc">
                  {status === 'locked' ? 'Esta encuesta es solo para quienes asistieron al evento.' : 'Califica la organización, la atención, las experiencias, los productos y tu experiencia general.'}
                </p>
                {status === 'pending' && info && (
                  <button type="button" className="tk-cta" onClick={() => setTarget({ code: t.qrCode, eventName: t.eventName, participantName: info.participantName })}>
                    Responder encuesta <ArrowRight size={18} aria-hidden="true" />
                  </button>
                )}
                {status === 'error' && (
                  <div className="tk-retry" role="alert">
                    <span><AlertCircle size={16} aria-hidden="true" /> No pudimos consultar esta encuesta.</span>
                    <button type="button" className="tk-outline" onClick={() => void q.refetch()}>Reintentar</button>
                  </div>
                )}
                {status === 'answered' && <p className="tk-thanks">Tu respuesta ya quedó registrada.</p>}
              </li>
            )
          })}
        </ul>
      )}

      <SurveyDialog
        target={target}
        onClose={() => setTarget(null)}
        onSaved={(code) => { void qc.invalidateQueries({ queryKey: ['public-survey', code] }) }}
      />
    </section>
  )
}
