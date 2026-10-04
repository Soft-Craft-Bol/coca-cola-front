import { useCallback, useState, type DependencyList } from 'react'
import { useQuery } from '@tanstack/react-query'
import { tokenStorage } from '@/shared/services/api'

// Identifica el lugar del código que llama al hook (archivo y línea): dos pantallas con funciones parecidas no comparten caché
const callSite = () => (new Error().stack ?? '').split('\n').slice(1, 9).join('')

/**
 * Carga datos de un servicio y expone { data, loading, error, reload, refresh }.
 * Usa la caché de TanStack Query: al volver a una pantalla los datos aparecen al instante y se actualizan en segundo plano.
 * La clave se arma con el usuario, el lugar de la llamada y las dependencias.
 */
export function useAsync<T>(fn: () => Promise<T>, deps: DependencyList = []) {
  const [site] = useState(callSite)
  const query = useQuery<T, Error>({
    queryKey: ['async', tokenStorage.get(), site, ...deps],
    queryFn: fn,
  })
  const { refetch } = query
  // reload y refresh vuelven a pedir los datos aunque la caché aún sea reciente; los datos actuales siguen visibles
  const reload = useCallback(() => { void refetch() }, [refetch])
  return {
    data: query.data ?? null,
    loading: query.isPending,
    error: query.error,
    reload,
    refresh: reload,
  }
}
