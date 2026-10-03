import { Link, useLocation } from 'react-router-dom'
import { CalendarDays, ChevronDown, LogOut, Menu, QrCode, UserPlus } from 'lucide-react'
import { useAuth, useCurrentUser } from '@/features/auth/hooks/useAuth'
import { useEvents } from '@/features/events/hooks/useEvents'
import { useSelectedEvent } from '@/shared/hooks/useSelectedEvent'
import { ROLE_LABELS } from '@/shared/constants'
import { Dropdown } from './Dropdown'
import NotificationBell from './NotificationBell'
import { NAV } from './navItems'

export default function Navbar({ onToggleMenu, sidebarOpen }: { onToggleMenu: () => void; sidebarOpen: boolean }) {
  const { logout, can } = useAuth()
  const user = useCurrentUser()
  const { pathname } = useLocation()
  const { data: events } = useEvents()
  const { eventId, setEventId } = useSelectedEvent('finished')

  const current = NAV.find((n) => (n.end ? pathname === n.to : pathname.startsWith(n.to)))

  return (
    <header className="navbar">
      <button className="nav-btn" onClick={onToggleMenu} aria-label={sidebarOpen ? 'Cerrar menú' : 'Abrir menú'} title={sidebarOpen ? 'Cerrar menú' : 'Abrir menú'}>
        <Menu size={22} />
      </button>
      <div className="navbar-title">
        {current && <current.icon size={18} />}
        <strong>{current?.label ?? 'Inteligencia de eventos'}</strong>
      </div>

      <div className="navbar-spacer" />

      <label className="navbar-event" title="Evento activo">
        <CalendarDays size={16} />
        <select value={eventId} onChange={(e) => setEventId(e.target.value)}>
          {events?.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
      </label>

      {can('admin', 'organizer') && (
        <>
          <Link className="btn small nav-quick" to="/checkin"><QrCode size={15} /> Ingreso</Link>
          <Link className="btn small nav-quick" to="/participantes"><UserPlus size={15} /> Registrar</Link>
        </>
      )}

      <NotificationBell />

      <Dropdown
        trigger={
          <>
            <span className="avatar">{user.name.charAt(0)}</span>
            <span className="user-label"><strong>{user.name}</strong><small>{ROLE_LABELS[user.role]}</small></span>
            <ChevronDown size={14} />
          </>
        }
      >
        <div className="dropdown-head">{user.email}</div>
        <button className="dropdown-item" onClick={logout}><LogOut size={15} /> Cerrar sesión</button>
      </Dropdown>
    </header>
  )
}
