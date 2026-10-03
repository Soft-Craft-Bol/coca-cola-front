import { useEffect, useState } from 'react'

const KEY = 'cc_live'

/** Preferencia "en vivo" (se recuerda en el navegador). */
export function useLiveFlag() {
  const [live, setLive] = useState(() => {
    try { return localStorage.getItem(KEY) !== '0' } catch { return true }
  })
  const update = (value: boolean) => {
    setLive(value)
    try { localStorage.setItem(KEY, value ? '1' : '0') } catch { /* sin persistencia */ }
  }
  return [live, update] as const
}

/** Ejecuta `refresh` cada `ms` mientras la pestaña esté visible (dashboard en tiempo real). */
export function useLive(refresh: () => void, enabled: boolean, ms = 8000) {
  useEffect(() => {
    if (!enabled) return
    const timer = setInterval(() => {
      if (!document.hidden) refresh()
    }, ms)
    return () => clearInterval(timer)
  }, [refresh, enabled, ms])
}
