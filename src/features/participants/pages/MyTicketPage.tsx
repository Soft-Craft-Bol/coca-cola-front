import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, Search } from 'lucide-react'
import LandingNav from '@/features/landing/components/LandingNav'
import LightDecor from '@/features/landing/components/LightDecor'
import { useAsync } from '@/shared/hooks/useAsync'
import type { PublicTicket } from '@/shared/types'
import '@/styles/landing.css'
import '@/styles/landing-light.css'
import '@/styles/my-ticket.css'
import TicketForPublic from '../components/TicketForPublic'
import TicketSurveys from '../components/TicketSurveys'
import { publicService } from '../services/publicService'

// Página pública: el asistente recupera su entrada con el correo o el celular de su inscripción y responde las encuestas de sus eventos
export default function MyTicketPage() {
  const [contact, setContact] = useState('')
  const [tickets, setTickets] = useState<PublicTicket[] | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { data: events } = useAsync(() => publicService.events(), [])

  const search = async (e: FormEvent) => {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    setError(null)
    try {
      setTickets(await publicService.lookup(contact))
    } catch (err) {
      setTickets(null)
      setError(err as Error)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="landing tk-root">
      <LandingNav />
      <main className="lp-light tk-page">
        <LightDecor variant="hero" />
        <div className="tk-wrap">
          <section className="tk-search" aria-labelledby="tk-title">
            <header className="sh">
              <span className="sh-eyebrow">MI ENTRADA</span>
              <h1 id="tk-title" className="sh-title">Recupera tu <span>entrada</span></h1>
              <p className="sh-lead">Ingresa el correo o celular con el que te inscribiste para recuperar tu entrada y consultar las encuestas de tus eventos.</p>
            </header>
            <form className="tk-form" onSubmit={search} aria-busy={busy}>
              <label htmlFor="tk-contact">Correo o celular</label>
              <input
                id="tk-contact" required autoComplete="email" autoCapitalize="none" spellCheck={false}
                placeholder="tucorreo@ejemplo.com o tu celular" value={contact} onChange={(e) => setContact(e.target.value)}
              />
              {error && <div className="tk-error" role="alert"><AlertCircle size={18} aria-hidden="true" /> {error.message}</div>}
              <button type="submit" className="tk-cta" disabled={busy}><Search size={18} aria-hidden="true" /> {busy ? 'Buscando…' : 'Buscar mi entrada'}</button>
            </form>
          </section>

          {tickets && tickets.length === 0 && (
            <div className="tk-empty" role="status">
              <strong>No encontramos una inscripción.</strong> Revisa que el correo o el celular sean los mismos de tu inscripción. Solo se muestran eventos que aún no finalizan.
              ¿Aún no te inscribes? <Link to="/#eventos">Mira los próximos eventos</Link>.
            </div>
          )}
          {tickets && tickets.length > 0 && (
            <section aria-label="Tus entradas" className="tk-tickets">
              {tickets.map((t) => <TicketForPublic key={t.qrCode} ticket={t} />)}
            </section>
          )}

          <TicketSurveys tickets={tickets} events={events} />
        </div>
      </main>
    </div>
  )
}
