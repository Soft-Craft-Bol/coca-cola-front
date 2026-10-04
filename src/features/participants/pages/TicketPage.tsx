import { Link, useParams } from 'react-router-dom'
import logo from '@/assets/coca-cola-logo.png'
import { ErrorBox, Loading } from '@/shared/components/ui'
import { useAsync } from '@/shared/hooks/useAsync'
import TicketForPublic from '../components/TicketForPublic'
import { publicService } from '../services/publicService'

// Página pública de una entrada por su código (enlace del correo de confirmación)
export default function TicketPage() {
  const { code = '' } = useParams()
  const { data, loading, error } = useAsync(() => publicService.ticket(code), [code])
  return (
    <div className="public-page">
      <div className="public-card stack">
        <Link to="/"><img className="public-logo" src={logo} alt="Coca-Cola" /></Link>
        {loading && <Loading />}
        <ErrorBox error={error} />
        {data && <TicketForPublic ticket={data} startOpen />}
        <p className="muted" style={{ fontSize: 13, textAlign: 'center' }}>¿No es tu entrada? <Link to="/mi-entrada">Recupérala con tu correo o celular</Link>.</p>
      </div>
    </div>
  )
}
