import { useCallback, useEffect, useRef, useState, type DependencyList } from 'react'

interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

// Carga datos de un servicio y expone { data, loading, error, reload }
export function useAsync<T>(fn: () => Promise<T>, deps: DependencyList = []) {
  const [state, setState] = useState<AsyncState<T>>({ data: null, loading: true, error: null })
  const fnRef = useRef(fn)
  const requestId = useRef(0)
  fnRef.current = fn

  // silent = true: refresca sin mostrar "cargando" ni borrar los datos si falla (tiempo real)
  const run = useCallback(async (silent = false) => {
    const id = ++requestId.current
    if (!silent) setState((s) => ({ ...s, loading: true, error: null }))
    try {
      const data = await fnRef.current()
      if (id !== requestId.current) return
      setState({ data, loading: false, error: null })
    } catch (error) {
      if (id !== requestId.current || silent) return
      setState({ data: null, loading: false, error: error as Error })
    }
  }, [])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { run(); return () => { requestId.current++ } }, deps)

  const reload = useCallback(() => run(), [run])
  const refresh = useCallback(() => run(true), [run])

  return { ...state, reload, refresh }
}
