import { useEffect, useId, useRef, useState } from 'react'
import { AlertCircle, CheckCircle2, Star, X } from 'lucide-react'
import { SURVEY_CRITERIA, type SurveyCriterionKey } from '@/shared/constants'
import { publicSurveyService } from '../services/publicSurveyService'

export interface SurveyTarget { code: string; eventName: string; participantName: string }

type Ratings = Record<SurveyCriterionKey, number>
const EMPTY: Ratings = { organization: 0, service: 0, experiences: 0, products: 0, overall: 0 }

// Respuestas de la encuesta de satisfacción de un evento: se envían al mismo endpoint público que usa /encuesta/:code
function SurveyForm({ target, onClose, onSaved }: { target: SurveyTarget; onClose: () => void; onSaved: (code: string) => void }) {
  const uid = useId()
  const [ratings, setRatings] = useState<Ratings>(EMPTY)
  const [nps, setNps] = useState<number | null>(null)
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const complete = SURVEY_CRITERIA.every((c) => ratings[c.key] > 0) && nps !== null

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (busy || nps === null) return
    setBusy(true)
    setError(null)
    try {
      await publicSurveyService.submit(target.code, { ...ratings, nps })
      setDone(true)
      onSaved(target.code)
    } catch (err) {
      setError((err as Error).message || 'No pudimos guardar tus respuestas. Inténtalo de nuevo.')
    } finally {
      setBusy(false)
    }
  }

  if (done) {
    return (
      <div className="sv-done" role="status">
        <CheckCircle2 size={44} aria-hidden="true" />
        <h2>¡Gracias por compartir tu experiencia!</h2>
        <p>Tus respuestas sobre <strong>{target.eventName}</strong> quedaron guardadas.</p>
        <button type="button" className="sv-primary" onClick={onClose}>Cerrar</button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} aria-busy={busy}>
      <p className="sv-hint">Todas las preguntas son obligatorias.</p>
      {SURVEY_CRITERIA.map((c) => (
        <div key={c.key} className="sv-q" role="radiogroup" aria-labelledby={`${uid}-${c.key}`}>
          <span id={`${uid}-${c.key}`} className="sv-label">{c.label}</span>
          <span className="sv-stars">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n} type="button" role="radio" aria-checked={ratings[c.key] === n} aria-label={`${n} de 5`}
                className={n <= ratings[c.key] ? 'on' : ''} onClick={() => setRatings((r) => ({ ...r, [c.key]: n }))}
              >
                <Star size={26} fill={n <= ratings[c.key] ? 'currentColor' : 'none'} aria-hidden="true" />
              </button>
            ))}
          </span>
        </div>
      ))}
      <div className="sv-q" role="radiogroup" aria-labelledby={`${uid}-nps`}>
        <span id={`${uid}-nps`} className="sv-label">Del 0 al 10, ¿qué tan probable es que recomiendes esta experiencia de Coca-Cola?</span>
        <span className="sv-nps">
          {Array.from({ length: 11 }, (_, n) => (
            <button key={n} type="button" role="radio" aria-checked={nps === n} className={nps === n ? 'on' : ''} onClick={() => setNps(n)}>{n}</button>
          ))}
        </span>
      </div>
      {error && <div className="sv-error" role="alert"><AlertCircle size={18} aria-hidden="true" /> {error}</div>}
      <div className="sv-actions">
        <button type="button" className="sv-secondary" onClick={onClose} disabled={busy}>Cancelar</button>
        <button type="submit" className="sv-primary" disabled={!complete || busy}>{busy ? 'Enviando…' : 'Enviar respuestas'}</button>
      </div>
    </form>
  )
}

// Modal nativo (<dialog>): atrapa el foco, se cierra con Esc y devuelve el foco al botón que lo abrió
export default function SurveyDialog({ target, onClose, onSaved }: { target: SurveyTarget | null; onClose: () => void; onSaved: (code: string) => void }) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (target && !d.open) d.showModal()
    if (!target && d.open) d.close()
  }, [target])

  const requestClose = () => {
    const d = ref.current
    if (d && d.querySelector('.sv-stars button.on, .sv-nps button.on') && !d.querySelector('.sv-done')
      && !window.confirm('Tienes respuestas sin enviar. ¿Quieres cerrar la encuesta?')) return
    onClose()
  }

  return (
    <dialog
      ref={ref} className="sv-dialog" aria-labelledby="sv-title"
      onCancel={(e) => { e.preventDefault(); requestClose() }}
      onClick={(e) => { if (e.target === ref.current) requestClose() }}
    >
      {target && (
        <div className="sv-box">
          <header>
            <div>
              <h2 id="sv-title">Encuesta de satisfacción</h2>
              <p>{target.eventName}</p>
              <p className="sv-for">Hola, {target.participantName}. Cuéntanos tu experiencia.</p>
            </div>
            <button type="button" className="sv-x" onClick={requestClose} aria-label="Cerrar encuesta"><X size={20} aria-hidden="true" /></button>
          </header>
          <SurveyForm key={target.code} target={target} onClose={onClose} onSaved={onSaved} />
        </div>
      )}
    </dialog>
  )
}
