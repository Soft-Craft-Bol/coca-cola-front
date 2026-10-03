import { useEffect, type ReactNode } from 'react'
import { Star } from 'lucide-react'
import { formatNumber } from '@/shared/utils/format'

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="page-head">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {actions && <div className="row">{actions}</div>}
    </div>
  )
}

export function Card({ title, children, actions, className = '' }: { title?: string; children?: ReactNode; actions?: ReactNode; className?: string }) {
  return (
    <div className={`card ${className}`}>
      {(title || actions) && (
        <div className="row spread" style={{ marginBottom: 12 }}>
          {title && <h3 style={{ margin: 0 }}>{title}</h3>}
          {actions}
        </div>
      )}
      {children}
    </div>
  )
}

export function KpiCard({ label, value, hint, accent }: { label: string; value: string | number; hint?: string; accent?: boolean }) {
  return (
    <div className={`card kpi ${accent ? 'accent' : ''}`}>
      <span className="kpi-label">{label}</span>
      <span className="kpi-value">{typeof value === 'number' ? formatNumber(value) : value}</span>
      {hint && <span className="kpi-hint">{hint}</span>}
    </div>
  )
}

export function Field({ label, hint, children, className = '' }: { label: string; hint?: string; children: ReactNode; className?: string }) {
  return (
    <label className={`field ${className}`}>
      <span>
        {label} {hint && <span className="hint">{hint}</span>}
      </span>
      {children}
    </label>
  )
}

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  return (
    <div className="modal-back" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true">
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  )
}

export function Badge({ tone = '', children }: { tone?: string; children: ReactNode }) {
  return <span className={`badge ${tone}`}>{children}</span>
}

export function Empty({ children = 'Sin datos todavía' }: { children?: ReactNode }) {
  return <div className="empty">{children}</div>
}

export function Loading({ text = 'Cargando…' }: { text?: string }) {
  return <div className="empty">{text}</div>
}

export function ErrorBox({ error }: { error?: Error | null }) {
  if (!error) return null
  return <div className="error-box">{error.message}</div>
}

export function Stars({ value, onChange }: { value: number; onChange?: (n: number) => void }) {
  return (
    <span className="stars" role="radiogroup">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          type="button"
          key={n}
          className={`star ${n <= value ? 'on' : ''}`}
          onClick={() => onChange?.(n)}
          aria-label={`${n} estrellas`}
        >
          <Star size={22} fill={n <= value ? 'currentColor' : 'none'} />
        </button>
      ))}
    </span>
  )
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="bar">
      <i style={{ width: `${Math.min(100, value)}%` }} />
    </div>
  )
}
