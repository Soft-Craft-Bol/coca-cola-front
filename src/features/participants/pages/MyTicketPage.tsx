import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import logo from '@/assets/coca-cola-logo.png'
import { Card, ErrorBox, Field } from '@/shared/components/ui'
import type { PublicTicket } from '@/shared/types'
import TicketForPublic from '../components/TicketForPublic'
import { publicService } from '../services/publicService'

// Página pública: el asistente recupera su entrada escribiendo el correo o el celular con el que se inscribió
export default function MyTicketPage() {
  const [contact, setContact] = useState('')
  const [tickets, setTickets] = useState<PublicTicket[] | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const search = async (e: FormEvent) => {
    e.preventDefault()
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
    <div className="public-page">
      <div className="public-card stack">
        <Link to="/"><img className="public-logo" src={logo} alt="Coca-Cola" /></Link>
        <Card title="Recupera tu entrada">
          <form className="stack" onSubmit={search}>
            <p className="muted" style={{ margin: 0, fontSize: 14 }}>
              Escribe el correo o el celular con el que te inscribiste y te mostramos tu entrada con el código QR.
            </p>
            <Field label="Correo o celular">
              <input required placeholder="tucorreo@ejemplo.com o 71234567" value={contact} onChange={(e) => setContact(e.target.value)} />
            </Field>
            <ErrorBox error={error} />
            <button className="btn primary icon-inline" disabled={busy}><Search size={15} /> {busy ? 'Buscando…' : 'Buscar mi entrada'}</button>
          </form>
        </Card>

        {tickets && tickets.length === 0 && (
          <Card title="No encontramos una inscripción">
            <p style={{ margin: 0 }}>
              Revisa que el correo o el celular sean los mismos de tu inscripción. Solo se muestran eventos que aún no finalizan.
              ¿Aún no te inscribes? <Link to="/#eventos">Mira los próximos eventos</Link>.
            </p>
          </Card>
        )}
        {tickets?.map((t, i) => <TicketForPublic key={t.qrCode} ticket={t} startOpen={tickets.length === 1 && i === 0} />)}
      </div>
    </div>
  )
}
