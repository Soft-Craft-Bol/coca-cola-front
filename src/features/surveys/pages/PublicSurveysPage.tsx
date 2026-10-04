import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import logo from '@/assets/coca-cola-logo.png'
import { Card, ErrorBox, Field } from '@/shared/components/ui'
import { publicSurveyService, type PendingSurvey } from '@/features/communications/services/publicSurveyService'

// Página pública: el asistente responde la encuesta de sus eventos escribiendo el correo con el que se inscribió
export default function PublicSurveysPage() {
  const [email, setEmail] = useState('')
  const [surveys, setSurveys] = useState<PendingSurvey[] | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const search = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      setSurveys(await publicSurveyService.lookup(email))
    } catch (err) {
      setSurveys(null)
      setError(err as Error)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="public-page">
      <div className="public-card stack">
        <Link to="/"><img className="public-logo" src={logo} alt="Coca-Cola" /></Link>
        <Card title="Encuestas de tus eventos">
          <form className="stack" onSubmit={search}>
            <p className="muted" style={{ margin: 0, fontSize: 14 }}>
              Escribe el correo con el que te inscribiste y te mostramos las encuestas de los eventos a los que asististe.
            </p>
            <Field label="Correo electrónico">
              <input required type="email" placeholder="tucorreo@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Field>
            <ErrorBox error={error} />
            <button className="btn primary icon-inline" disabled={busy}><Search size={15} /> {busy ? 'Buscando…' : 'Buscar mis encuestas'}</button>
          </form>
        </Card>

        {surveys && surveys.length === 0 && (
          <Card title="No encontramos encuestas pendientes">
            <p style={{ margin: 0 }}>
              Las encuestas son para quienes asistieron a un evento. Revisa que el correo sea el mismo de tu inscripción.
            </p>
          </Card>
        )}
        {surveys?.map((s) => (
          <Card key={s.code} title={s.eventName}>
            <div className="row spread">
              <span className="muted">{s.eventDate ? new Date(s.eventDate).toLocaleDateString('es-BO', { day: '2-digit', month: 'long', year: 'numeric' }) : ''}</span>
              {s.answered
                ? <span className="muted">Ya respondida</span>
                : <Link className="btn primary" to={`/encuesta/${s.code}`}>Responder encuesta</Link>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
