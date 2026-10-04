import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import logoWhite from '@/assets/coca-cola-logo-white.png'
import { useAuth } from '@/features/auth/hooks/useAuth'

const SECTIONS = ['eventos', 'solucion', 'como-funciona']

// Barra superior compartida: en la landing marca la sección visible; en otras páginas enlaza a las secciones de "/"
export default function LandingNav() {
  const { pathname } = useLocation()
  const onLanding = pathname === '/'
  const { isAuthenticated } = useAuth()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Marca en la barra la sección visible (solo en la landing)
  useEffect(() => {
    if (!onLanding) return
    const io = new IntersectionObserver(
      entries => entries.forEach(en => { if (en.isIntersecting) setActive(en.target.id) }),
      { rootMargin: '-35% 0px -55% 0px' },
    )
    SECTIONS.forEach(id => { const el = document.getElementById(id); if (el) io.observe(el) })
    return () => io.disconnect()
  }, [onLanding])

  const cta = isAuthenticated ? { to: '/panel', label: 'Ir al panel' } : { to: '/login', label: 'Ingresar' }
  const section = (id: string, label: string) => onLanding
    ? <a href={`#${id}`} aria-current={active === id}>{label}</a>
    : <Link to={`/#${id}`}>{label}</Link>

  return (
    <header className={`lp-nav ${scrolled ? 'scrolled' : ''}`}>
      {onLanding
        ? <a href="#inicio" className="lp-brand" aria-label="Coca-Cola"><img src={logoWhite} alt="Coca-Cola" /></a>
        : <Link to="/" className="lp-brand" aria-label="Coca-Cola, página principal"><img src={logoWhite} alt="Coca-Cola" /></Link>}
      <nav className={open ? 'open' : ''} onClick={() => setOpen(false)}>
        {section('eventos', 'Eventos')}
        {section('solucion', 'Solución')}
        {section('como-funciona', 'Cómo funciona')}
        <Link to="/mi-entrada" aria-current={pathname === '/mi-entrada'}>Mi entrada</Link>
      </nav>
      <Link to={cta.to} className="lp-btn lp-btn-white lp-nav-cta">{cta.label}</Link>
      <button className="lp-burger" onClick={() => setOpen(!open)} aria-label="Abrir menú" aria-expanded={open}>{open ? <X size={22} /> : <Menu size={22} />}</button>
    </header>
  )
}
