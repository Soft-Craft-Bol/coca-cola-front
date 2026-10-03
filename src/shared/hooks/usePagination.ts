import { useMemo, useState } from 'react'

export const PAGE_SIZES = [5, 10, 20, 50]

// Paginación en cliente para cualquier lista
export function usePagination<T>(items: T[], initialSize = 10) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialSize)

  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  // Si la lista se reduce (filtros, borrados), se mantiene dentro del rango
  const current = Math.min(page, totalPages)

  const pageItems = useMemo(
    () => items.slice((current - 1) * pageSize, current * pageSize),
    [items, current, pageSize],
  )

  return {
    pageItems,
    page: current,
    pageSize,
    total,
    totalPages,
    from: total === 0 ? 0 : (current - 1) * pageSize + 1,
    to: Math.min(current * pageSize, total),
    setPage,
    setPageSize: (size: number) => {
      setPageSize(size)
      setPage(1)
    },
    reset: () => setPage(1),
  }
}

export type Pagination<T> = ReturnType<typeof usePagination<T>>
