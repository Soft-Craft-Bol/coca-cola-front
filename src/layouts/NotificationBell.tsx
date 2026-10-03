import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, Bell, BellRing, CheckCheck, CheckCircle2, Info } from 'lucide-react'
import { useToast } from '@/shared/components/Toast'
import { useAsync } from '@/shared/hooks/useAsync'
import { useLive } from '@/shared/hooks/useLive'
import { formatDateTime } from '@/shared/utils/format'
import { notificationService } from '@/features/notifications/services/notificationService'
import type { AppNotification } from '@/shared/types'
import { Dropdown } from './Dropdown'

const ICONS = { info: Info, success: CheckCircle2, warning: AlertTriangle }

// Campana de notificaciones: se actualiza sola, avisa de las nuevas y permite activar avisos del navegador
export default function NotificationBell() {
  const toast = useToast()
  const count = useAsync(() => notificationService.count(), [])
  const list = useAsync(() => notificationService.list(false, 15), [])
  const unread = count.data?.unread ?? 0
  const previous = useRef<number | null>(null)
  const [permission, setPermission] = useState<NotificationPermission>(() => ('Notification' in window ? Notification.permission : 'denied'))

  const refreshAll = useCallback(() => {
    count.refresh()
    list.refresh()
  }, [count, list])
  useLive(refreshAll, true, 15000)

  // Aviso cuando llegan notificaciones nuevas
  useEffect(() => {
    if (count.data == null) return
    const current = count.data.unread
    if (previous.current !== null && current > previous.current) {
      const latest = list.data?.find((n) => !n.read)
      toast.success(latest ? latest.title : 'Tienes notificaciones nuevas')
      if (permission === 'granted' && latest) new Notification(latest.title, { body: latest.message })
    }
    previous.current = current
  }, [count.data, list.data, permission, toast])

  const open = async (n: AppNotification) => {
    if (!n.read) {
      await notificationService.read(n.id)
      refreshAll()
    }
  }

  const readAll = async () => {
    await notificationService.readAll()
    refreshAll()
  }

  const enableBrowser = async () => {
    if ('Notification' in window) setPermission(await Notification.requestPermission())
  }

  return (
    <Dropdown trigger={<><Bell size={19} />{unread > 0 && <span className="dot">{unread > 9 ? '9+' : unread}</span>}</>}>
      <div className="dropdown-head row spread">
        <span>Notificaciones</span>
        {unread > 0 && <button className="link-btn" onClick={(e) => { e.stopPropagation(); readAll() }}><CheckCheck size={14} /> Marcar todo</button>}
      </div>
      <div className="notif-list">
        {(list.data ?? []).length === 0 && <div className="dropdown-item muted">Sin notificaciones</div>}
        {list.data?.map((n) => {
          const Icon = ICONS[n.severity] ?? Info
          const body = (
            <>
              <span className={`notif-icon ${n.severity}`}><Icon size={16} /></span>
              <span className="notif-text">
                <strong>{n.title}</strong>
                <span>{n.message}</span>
                <small>{formatDateTime(n.createdAt)}</small>
              </span>
              {!n.read && <i className="notif-unread" />}
            </>
          )
          return n.eventId
            ? <Link key={n.id} className={`notif-item ${n.read ? '' : 'unread'}`} to={`/eventos/${n.eventId}`} onClick={() => open(n)}>{body}</Link>
            : <button key={n.id} className={`notif-item ${n.read ? '' : 'unread'}`} onClick={(e) => { e.stopPropagation(); open(n) }}>{body}</button>
        })}
      </div>
      {permission === 'default' && (
        <button className="dropdown-item" onClick={(e) => { e.stopPropagation(); enableBrowser() }}><BellRing size={15} /> Activar avisos del navegador</button>
      )}
    </Dropdown>
  )
}
