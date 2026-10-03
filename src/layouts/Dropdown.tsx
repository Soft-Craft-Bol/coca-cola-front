import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'

// Cierra el menú al hacer clic fuera
function useClickOutside(ref: RefObject<HTMLElement | null>, onOutside: () => void) {
  useEffect(() => {
    const handler = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && onOutside()
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [ref, onOutside])
}

export function Dropdown({ trigger, children, align = 'right' }: { trigger: ReactNode; children: ReactNode; align?: 'right' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useClickOutside(ref, () => setOpen(false))
  return (
    <div className="dropdown" ref={ref}>
      <button className="nav-btn" onClick={() => setOpen(!open)}>{trigger}</button>
      {open && <div className={`dropdown-menu ${align}`} onClick={() => setOpen(false)}>{children}</div>}
    </div>
  )
}
