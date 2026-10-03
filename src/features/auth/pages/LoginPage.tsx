import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import logo from '@/assets/coca-cola-logo.png'
import { ErrorBox, Field } from '@/shared/components/ui'
import { useAuth } from '../hooks/useAuth'

const DEMO = [
  { label: 'Administrador', email: 'admin@cocacola.com', password: 'admin123' },
  { label: 'Organizador', email: 'organizador@cocacola.com', password: 'org123' },
  { label: 'Marketing', email: 'marketing@cocacola.com', password: 'mkt123' },
]

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) return <Navigate to="/panel" replace />

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await login(form.email, form.password)
      navigate(location.state?.from?.pathname ?? '/panel', { replace: true })
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card stack" onSubmit={submit}>
        <div>
          <img className="auth-logo" src={logo} alt="Coca-Cola" />
          <h1>Inteligencia de eventos</h1>
          <p className="muted" style={{ margin: 0 }}>Medir. Entender. Mejorar cada experiencia.</p>
        </div>
        <ErrorBox error={error} />
        <Field label="Correo">
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </Field>
        <Field label="Contraseña">
          <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </Field>
        <button className="btn primary" disabled={loading}>{loading ? 'Ingresando…' : 'Ingresar'}</button>
        <div>
          <p className="muted" style={{ fontSize: 12, margin: '0 0 6px' }}>Usuarios de demostración:</p>
          <div className="chips">
            {DEMO.map((d) => (
              <button type="button" key={d.email} className="chip" onClick={() => setForm({ email: d.email, password: d.password })}>
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  )
}
