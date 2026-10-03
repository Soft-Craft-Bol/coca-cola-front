import { ChevronLeft, ChevronRight } from 'lucide-react'
import { PAGE_SIZES, type Pagination as PaginationState } from '@/shared/hooks/usePagination'

// Páginas visibles: primera, última y las cercanas a la actual (con "…" entre medio)
function visiblePages(page: number, totalPages: number): (number | 'gap-l' | 'gap-r')[] {
  const pages = new Set([1, totalPages, page - 1, page, page + 1])
  const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b)
  const result: (number | 'gap-l' | 'gap-r')[] = []
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) result.push(i === 1 ? 'gap-l' : 'gap-r')
    result.push(p)
  })
  return result
}

export default function Pagination<T>({ p, sizes = PAGE_SIZES }: { p: PaginationState<T>; sizes?: number[] }) {
  if (p.total === 0) return null
  return (
    <div className="pagination">
      <span className="muted pagination-info">
        Mostrando {p.from}–{p.to} de {p.total}
      </span>
      <div className="pagination-controls">
        <label className="pagination-size">
          <span className="muted">Por página</span>
          <select value={p.pageSize} onChange={(e) => p.setPageSize(Number(e.target.value))}>
            {sizes.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <button className="page-btn" disabled={p.page <= 1} onClick={() => p.setPage(p.page - 1)} aria-label="Página anterior">
          <ChevronLeft size={16} />
        </button>
        {visiblePages(p.page, p.totalPages).map((n) =>
          typeof n === 'number' ? (
            <button key={n} className={`page-btn ${n === p.page ? 'on' : ''}`} onClick={() => p.setPage(n)} aria-current={n === p.page ? 'page' : undefined}>
              {n}
            </button>
          ) : (
            <span key={n} className="muted">…</span>
          ),
        )}
        <button className="page-btn" disabled={p.page >= p.totalPages} onClick={() => p.setPage(p.page + 1)} aria-label="Página siguiente">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
