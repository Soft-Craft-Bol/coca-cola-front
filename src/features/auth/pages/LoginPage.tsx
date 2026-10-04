import { useId, useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { AlertCircle, ArrowRight, BarChart3, CalendarDays, Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck } from 'lucide-react'
import logo from '@/assets/coca-cola-logo-transparent.png'
import logoWhite from '@/assets/coca-cola-logo-white.png'
import '@/styles/login.css'
import { useAuth } from '../hooks/useAuth'

const DEMO = [
  { label: 'Administrador', email: 'admin@cocacola.com', password: 'admin123', icon: ShieldCheck },
  { label: 'Organizador', email: 'organizador@cocacola.com', password: 'org123', icon: CalendarDays },
  { label: 'Marketing', email: 'marketing@cocacola.com', password: 'mkt123', icon: BarChart3 },
]

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)
  const uid = useId()

  if (isAuthenticated) return <Navigate to="/panel" replace />

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (loading) return
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
    <main className="lg-page">
      <div className="lg-bg" aria-hidden="true">
        <svg className="lg-wave lg-wave-l" viewBox="0 0 700 500" preserveAspectRatio="none">
          <defs>
            <linearGradient id="lg-fade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#FF5059" stopOpacity="0.3" /><stop offset="1" stopColor="#FF5059" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0,60 C160,70 330,180 520,330 C600,395 660,430 700,450 L700,500 L0,500 Z" fill="url(#lg-fade)" />
          <path d="M0,60 C160,70 330,180 520,330 C600,395 660,430 700,450" fill="none" stroke="rgba(255,190,195,0.55)" strokeWidth="1.5" />
        </svg>
        <svg className="lg-wave lg-wave-r" viewBox="0 0 700 500" preserveAspectRatio="none">
          <path d="M700,40 C560,70 420,200 300,300 C230,355 120,385 0,380 L0,500 L700,500 Z" fill="url(#lg-fade)" />
          <path d="M700,40 C560,70 420,200 300,300 C230,355 120,385 0,380" fill="none" stroke="rgba(255,190,195,0.5)" strokeWidth="1.5" />
        </svg>
        <img className="lg-mark" src={logoWhite} alt="" />
        <i className="lg-bubble" style={{ left: '7%', top: '18%', width: 34 }} />
        <i className="lg-bubble" style={{ left: '12%', top: '38%', width: 18 }} />
        <i className="lg-bubble" style={{ left: '20%', top: '48%', width: 24 }} />
        <i className="lg-bubble" style={{ right: '9%', top: '62%', width: 40 }} />
        <i className="lg-bubble" style={{ right: '14%', top: '80%', width: 20 }} />
      </div>

      <form className="lg-card" onSubmit={submit} aria-busy={loading}>
        <Link to="/" className="lg-logo-link" aria-label="Coca-Cola, ir a la página principal"><img className="lg-logo" src={logo} alt="" /></Link>
        <h1>Inteligencia de eventos</h1>
        <p className="lg-sub">Medir. Entender. Mejorar cada experiencia.</p>

        {error && (
          <div className="lg-error" role="alert"><AlertCircle size={18} aria-hidden="true" /><span>{error.message}</span></div>
        )}

        <div className="lg-field">
          <label htmlFor={`${uid}-email`}>Correo</label>
          <div className="lg-input">
            <Mail size={20} aria-hidden="true" />
            <input
              id={`${uid}-email`} type="email" inputMode="email" autoComplete="username" autoCapitalize="none" spellCheck={false}
              required placeholder="tu@empresa.com" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
        </div>

        <div className="lg-field">
          <label htmlFor={`${uid}-pass`}>Contraseña</label>
          <div className="lg-input">
            <Lock size={20} aria-hidden="true" />
            <input
              id={`${uid}-pass`} type={show ? 'text' : 'password'} autoComplete="current-password"
              required placeholder="Tu contraseña" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button type="button" className="lg-eye" onClick={() => setShow(!show)} aria-pressed={show} aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
              {show ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
            </button>
          </div>
        </div>

        <button type="submit" className="lg-submit" disabled={loading}>
          {loading ? <><Loader2 size={20} className="lg-spin" aria-hidden="true" /> Ingresando…</> : <>Ingresar <ArrowRight size={20} aria-hidden="true" /></>}
        </button>

        <div className="lg-demo">
          <p>Usuarios de demostración:</p>
          <div className="lg-chips">
            {DEMO.map(({ label, email, password, icon: Icon }) => (
              <button type="button" key={email} onClick={() => setForm({ email, password })}>
                <Icon size={18} aria-hidden="true" /> {label}
              </button>
            ))}
          </div>
        </div>
      </form>
    </main>
  )
}
