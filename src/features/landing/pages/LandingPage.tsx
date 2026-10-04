import { useEffect, useRef, type CSSProperties } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import logoWhite from '@/assets/coca-cola-logo-white.png'
import canRed from '@/assets/landing/can-red.png'
import canZero from '@/assets/landing/can-zero.png'
import logoRed from '@/assets/coca-cola-logo-transparent.png'
import { useAuth } from '@/features/auth/hooks/useAuth'
import '@/styles/landing.css'
import '@/styles/landing-light.css'
import LandingNav from '../components/LandingNav'
import Bubbles from '../components/Bubbles'
import CountUp from '../components/CountUp'
import HowItWorks from '../components/HowItWorks'
import PanelSection from '../components/PanelSection'
import HeroScene from '../components/HeroScene'
import Reveal from '../components/Reveal'
import LightDecor from '../components/LightDecor'
import Solution from '../components/Solution'
import UpcomingEvents from '../components/UpcomingEvents'
import { useParallax } from '../hooks/useParallax'

const STATS = [
  { to: 10, suffix: '+', label: 'Indicadores clave' },
  { to: 6, suffix: '', label: 'Niveles de interacción' },
  { to: 5, suffix: '', label: 'Vistas de análisis' },
  { to: 3, suffix: '', label: 'Roles de usuario' },
]

const WORDS = ['Medir', 'Entender', 'Mejorar', 'Cada experiencia', 'Cada evento', 'Cada dato']

export default function LandingPage() {
  const root = useRef<HTMLDivElement>(null)
  const { isAuthenticated } = useAuth()
  const { hash } = useLocation()
  useParallax(root)

  // Llegar desde otra página con /#seccion: desplaza hasta el ancla una vez montada la landing
  useEffect(() => {
    if (!hash) return
    const t = window.setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView(), 50)
    return () => window.clearTimeout(t)
  }, [hash])

  const cta = isAuthenticated ? { to: '/panel', label: 'Ir al panel' } : { to: '/login', label: 'Ingresar' }

  return (
    <div className="landing" ref={root}>
      <LandingNav />

      {/* ------------------------------------------------ hero */}
      <section id="inicio" className="lp-hero">
        <div className="hero-bg" aria-hidden="true">
          <span className="orb orb-1" /><span className="orb orb-2" /><span className="orb orb-3" />
          <Bubbles />
          <svg className="hero-wave" viewBox="0 0 1440 220" preserveAspectRatio="none">
            <path d="M0,120 C240,40 480,200 760,120 C1040,40 1240,160 1440,90 L1440,220 L0,220 Z" fill="#e61a27" opacity="0.28" />
            <path d="M0,150 C260,90 520,210 800,150 C1060,95 1250,190 1440,130 L1440,220 L0,220 Z" fill="#e61a27" opacity="0.5" />
            <path d="M0,185 C300,140 560,225 840,180 C1100,140 1280,210 1440,170 L1440,220 L0,220 Z" fill="#f6f6f7" />
          </svg>
        </div>

        <div className="hero-inner">
          <div className="hero-copy">
            <span className="eyebrow hero-in" style={{ '--i': 0 } as CSSProperties}>Plataforma de seguimiento y analítica de eventos</span>
            <h1 className="hero-in" style={{ '--i': 1 } as CSSProperties}>
              Cada evento cuenta.<br /><span className="hl">Mídelo de verdad.</span>
            </h1>
            <p className="hero-in" style={{ '--i': 2 } as CSSProperties}>
              Registra asistentes, controla el ingreso con QR, mide degustaciones y convierte cada activación de
              Coca-Cola en indicadores listos para tomar decisiones.
            </p>
            <div className="hero-cta hero-in" style={{ '--i': 3 } as CSSProperties}>
              <a href="#eventos" className="lp-btn lp-btn-white">Inscribirme a un evento <ArrowRight size={18} /></a>
              <Link to="/mi-entrada" className="lp-btn lp-btn-ghost">Recuperar mi entrada</Link>
            </div>
            <ul className="hero-points hero-in" style={{ '--i': 4 } as CSSProperties}>
              <li>Antes, durante y después del evento</li>
              <li>Indicadores y reportes automáticos</li>
              <li>Integración con Power BI</li>
            </ul>
          </div>
          <HeroScene />
        </div>
      </section>

      {/* ------------------------------------------------ cinta */}
      <div className="lp-marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...WORDS, ...WORDS, ...WORDS, ...WORDS].map((w, i) => (
            <span key={i}>{w}<i /></span>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------ eventos y solución (fondo claro compartido) */}
      <div className="lp-light">
        <LightDecor />
        <UpcomingEvents />
        <Solution />
        <HowItWorks />
        <PanelSection />
      </div>

      {/* ------------------------------------------------ cifras */}
      <section id="cifras" className="lp-stats">
        <div className="stats-grid">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 100}>
              <div className="stat">
                <strong><CountUp to={s.to} suffix={s.suffix} /></strong>
                <span>{s.label}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------ llamado final */}
      <section className="lp-final">
        <div className="final-orb" aria-hidden="true" />
        <img className="final-can final-can-l" src={canRed} alt="" aria-hidden="true" />
        <img className="final-can final-can-r" src={canZero} alt="" aria-hidden="true" />
        <Reveal><img className="final-logo" src={logoWhite} alt="Coca-Cola" /></Reveal>
        <Reveal delay={100}><h2>Convierte cada evento en información útil</h2></Reveal>
        <Reveal delay={200}><p>Mide. Entiende. Mejora cada experiencia.</p></Reveal>
        <Reveal delay={300}><Link to={cta.to} className="lp-btn lp-btn-white lp-btn-lg">{cta.label} <ArrowRight size={20} /></Link></Reveal>
      </section>

      <footer className="lp-footer">
        <img src={logoRed} alt="Coca-Cola" />
        <p>Plataforma de seguimiento y analítica de eventos especiales · Hackathon by Paseo Aranjuez · Reto Coca-Cola</p>
      </footer>
    </div>
  )
}
