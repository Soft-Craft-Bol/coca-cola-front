import { useMemo, useState, type FormEvent } from 'react'
import { Card, ErrorBox, Field, KpiCard, PageHeader, Stars } from '@/shared/components/ui'
import { useToast } from '@/shared/components/Toast'
import { SURVEY_CRITERIA, type SurveyCriterionKey } from '@/shared/constants'
import { useSelectedEvent } from '@/shared/hooks/useSelectedEvent'
import { useAsync } from '@/shared/hooks/useAsync'
import EventSelector from '@/features/events/components/EventSelector'
import { useParticipants } from '@/features/participants/hooks/useParticipants'
import { dashboardService } from '@/features/dashboard/services/dashboardService'
import { surveyService } from '../services/surveyService'

type SurveyForm = Record<SurveyCriterionKey, number> & { nps: number | null }

const EMPTY: SurveyForm = { organization: 0, service: 0, experiences: 0, products: 0, overall: 0, nps: null }

export default function SurveysPage() {
  const { eventId, setEventId } = useSelectedEvent()
  const { data: participants } = useParticipants(eventId)
  const { data: surveys, reload } = useAsync(() => (eventId ? surveyService.list(eventId) : Promise.resolve([])), [eventId])
  const { data: metrics, reload: reloadMetrics } = useAsync(() => (eventId ? dashboardService.event(eventId) : Promise.resolve(null)), [eventId])
  const toast = useToast()
  const [participantId, setParticipantId] = useState('')
  const [form, setForm] = useState<SurveyForm>(EMPTY)
  const [error, setError] = useState<Error | null>(null)

  const answered = useMemo(() => new Set(surveys?.map((s) => s.participantId)), [surveys])
  const candidates = participants?.filter((p) => p.checkedInAt && !answered.has(p.id)) ?? []
  const complete = SURVEY_CRITERIA.every((c) => form[c.key] > 0) && form.nps !== null && participantId

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await surveyService.create({ ...form, nps: form.nps ?? 0, eventId, participantId })
      toast.success('Encuesta registrada')
      setForm(EMPTY)
      setParticipantId('')
      reload()
      reloadMetrics()
    } catch (err) {
      setError(err as Error)
    }
  }

  return (
    <>
      <PageHeader title="Encuestas" subtitle="Satisfacción del evento y Net Promoter Score" actions={<EventSelector value={eventId} onChange={setEventId} />} />
      <div className="grid cols-3" style={{ marginBottom: 16 }}>
        <KpiCard label="Respuestas" value={metrics?.surveyCount ?? 0} />
        <KpiCard label="Índice de satisfacción" value={metrics?.satisfaction ? `${metrics.satisfaction.toFixed(2)} / 5` : '—'} accent />
        <KpiCard label="NPS" value={metrics?.surveyCount ? Math.round(metrics.nps) : '—'} hint="Promotores − detractores" />
      </div>
      <Card title="Registrar encuesta">
        <form className="stack" onSubmit={submit}>
          <ErrorBox error={error} />
          <Field label="Participante (asistentes que aún no responden)">
            <select value={participantId} onChange={(e) => setParticipantId(e.target.value)}>
              <option value="">Selecciona…</option>
              {candidates.map((p) => <option key={p.id} value={p.id}>{p.firstName} {p.lastName} · {p.qrCode}</option>)}
            </select>
          </Field>
          {SURVEY_CRITERIA.map((c) => (
            <div key={c.key} className="row spread">
              <span>{c.label}</span>
              <Stars value={form[c.key]} onChange={(v) => setForm({ ...form, [c.key]: v })} />
            </div>
          ))}
          <div className="field">
            <span>Del 0 al 10, ¿qué tan probable es que recomiende esta experiencia de Coca-Cola?</span>
            <div className="chips">
              {Array.from({ length: 11 }, (_, n) => (
                <button type="button" key={n} className={`chip ${form.nps === n ? 'on' : ''}`} onClick={() => setForm({ ...form, nps: n })}>{n}</button>
              ))}
            </div>
          </div>
          <button className="btn primary" disabled={!complete}>Guardar encuesta</button>
        </form>
      </Card>
    </>
  )
}
