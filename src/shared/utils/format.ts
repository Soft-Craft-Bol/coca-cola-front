type Maybe<T> = T | null | undefined

export const formatNumber = (n: Maybe<number>) => new Intl.NumberFormat('es-CO').format(n ?? 0)

export const formatPercent = (n: Maybe<number>, digits = 0) => `${(n ?? 0).toFixed(digits)} %`

export const formatDate = (iso: Maybe<string>) =>
  iso
    ? new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(iso))
    : '—'

export const formatDateTime = (iso: Maybe<string>) =>
  iso
    ? new Intl.DateTimeFormat('es-CO', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(iso))
    : '—'

export const formatCurrency = (n: Maybe<number>) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n ?? 0)

export const toInputDate = (iso: Maybe<string>) => (iso ? iso.slice(0, 10) : '')
