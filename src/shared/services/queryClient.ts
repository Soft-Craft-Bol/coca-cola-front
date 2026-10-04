import { QueryClient } from '@tanstack/react-query'

// Caché de lecturas del navegador: lo ya cargado se muestra al instante y se actualiza en segundo plano
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000, // 1 min: dentro de ese tiempo no se vuelve a pedir al servidor
      gcTime: 10 * 60_000, // se conserva 10 min en memoria aunque la pantalla se cierre
      retry: false, // los errores se muestran de inmediato (sin reintentos que demoren)
      refetchOnWindowFocus: false,
    },
  },
})
