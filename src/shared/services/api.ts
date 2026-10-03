const BASE_URL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api'
export const API_URL = BASE_URL
const TOKEN_KEY = 'cc_token'
const SESSION_KEY = 'cc_auth'

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

async function request<T>(method: string, url: string, body?: unknown): Promise<T> {
  const token = tokenStorage.get()
  let res: Response
  try {
    res = await fetch(`${BASE_URL}${url}`, {
      method,
      headers: {
        // Con FormData el navegador define el Content-Type (multipart + boundary)
        ...(body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body === undefined ? undefined : body instanceof FormData ? body : JSON.stringify(body),
    })
  } catch {
    throw new ApiError('No se pudo conectar con el servidor', 0)
  }

  const data: unknown = await res.json().catch(() => null)
  if (!res.ok) {
    // Sesión vencida: se limpia y se vuelve al login (excepto en el propio login)
    if (res.status === 401 && token && !url.startsWith('/auth/login')) {
      tokenStorage.clear()
      localStorage.removeItem(SESSION_KEY)
      window.location.assign('/login')
    }
    const message = (data as { message?: string } | null)?.message ?? `Error ${res.status}`
    throw new ApiError(message, res.status)
  }
  return data as T
}

/** Descarga un archivo (CSV, etc.) con la sesión actual y lo guarda en el equipo. */
async function download(url: string, filename: string): Promise<void> {
  const token = tokenStorage.get()
  const res = await fetch(`${BASE_URL}${url}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as { message?: string } | null
    throw new ApiError(data?.message ?? `Error ${res.status}`, res.status)
  }
  const href = URL.createObjectURL(await res.blob())
  const a = document.createElement('a')
  a.href = href
  a.download = filename
  a.click()
  URL.revokeObjectURL(href)
}

// Cliente HTTP único de la app (backend Spring Boot). Configura VITE_API_URL en .env
const pendingGets = new Map<string, Promise<unknown>>()
function get<T>(url: string): Promise<T> {
  const key = `${tokenStorage.get() ?? ''}:${url}`
  const pending = pendingGets.get(key)
  if (pending) return pending as Promise<T>
  const promise = request<T>('GET', url).finally(() => pendingGets.delete(key))
  pendingGets.set(key, promise)
  return promise
}

export const api = {
  get,
  post: <T>(url: string, body?: unknown) => request<T>('POST', url, body),
  put: <T>(url: string, body?: unknown) => request<T>('PUT', url, body),
  upload: <T>(url: string, formData: FormData) => request<T>('POST', url, formData),
  delete: <T = { ok: boolean }>(url: string) => request<T>('DELETE', url),
  download,
}
