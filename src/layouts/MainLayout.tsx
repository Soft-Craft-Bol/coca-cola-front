import { Suspense, useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import logo from '@/assets/coca-cola-logo.png'
import { useAuth, useCurrentUser } from '@/features/auth/hooks/useAuth'
import { ROLE_LABELS } from '@/shared/constants'
import ChatBubble from '@/features/assistant/components/ChatBubble'
import Navbar from './Navbar'
import { NAV } from './navItems'
import { Loading } from '@/shared/components/ui'

const KEY = 'cc_sidebar_collapsed'
const MOBILE = '(max-width: 860px)'
const readCollapsed = () => {
  try { return localStorage.getItem(KEY) === '1' } catch { return false }
}

export default function MainLayout() {
  const { logout } = useAuth()
  const user = useCurrentUser()
  const { pathname } = useLocation()
  const [collapsed, setCollapsed] = useState(readCollapsed)
  const [open, setOpen] = useState(false)
  const links = NAV.filter((n) => n.roles.includes(user.role))

  // Cierra el menú móvil al navegar
  useEffect(() => { setOpen(false) }, [pathname])

  // El mismo botón abre/cierra el drawer en móvil y colapsa/expande en escritorio
  const toggle = () => {
    if (window.matchMedia(MOBILE).matches) {
      setOpen((o) => !o)
      return
    }
    setCollapsed((c) => {
      try { localStorage.setItem(KEY, c ? '0' : '1') } catch { /* sin persistencia */ }
      return !c
    })
  }

  return (
    <div className={`shell ${collapsed ? 'collapsed' : ''}`}>
      <div className={`backdrop ${open ? 'show' : ''}`} onClick={() => setOpen(false)} />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="brand">
          <img className="brand-img" src={logo} alt="Coca-Cola" />
          <span className="brand-sub">Inteligencia de eventos</span>
        </div>
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} title={label} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Icon size={18} /> <span className="nav-text">{label}</span>
          </NavLink>
        ))}
        <div className="sidebar-foot">
          <div className="foot-text">
            <strong>{user.name}</strong>
            {ROLE_LABELS[user.role]}
          </div>
          <div style={{ marginTop: 8 }}>
            <button className="btn small row" style={{ display: 'inline-flex' }} onClick={logout} title="Cerrar sesión">
              <LogOut size={14} /> <span className="foot-text">Cerrar sesión</span>
            </button>
          </div>
        </div>
      </aside>
      <div className="main">
        <Navbar onToggleMenu={toggle} sidebarOpen={open || !collapsed} />
        <main className="content">
          <Suspense fallback={<Loading />}><Outlet /></Suspense>
        </main>
      </div>
      {/* el asistente consulta datos de participantes agregados: solo administración y marketing */}
      {(user.role === 'admin' || user.role === 'marketing') && <ChatBubble />}
    </div>
  )
}
