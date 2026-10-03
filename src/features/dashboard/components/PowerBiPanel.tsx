import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@/shared/components/ui'

const KEY = 'cc_powerbi_url'
const read = () => {
  try { return localStorage.getItem(KEY) ?? '' } catch { return '' }
}

// Incrusta un informe de Power BI ya publicado
export default function PowerBiPanel() {
  const [url, setUrl] = useState(read)
  const [draft, setDraft] = useState(url)
  const save = () => {
    setUrl(draft)
    try { localStorage.setItem(KEY, draft) } catch { /* sin persistencia */ }
  }

  return (
    <Card title="Informe de Power BI">
      <div className="row" style={{ marginBottom: 12 }}>
        <input placeholder="Pega la URL de inserción (Archivo, Insertar informe, Sitio web público)" value={draft} onChange={(e) => setDraft(e.target.value)} style={{ flex: 1, minWidth: 260 }} />
        <button className="btn primary" onClick={save}>Mostrar</button>
      </div>
      {url
        ? <iframe title="Power BI" src={url} style={{ width: '100%', height: 560, border: 0, borderRadius: 10 }} allowFullScreen />
        : (
          <div className="empty">
            Aún no hay un informe configurado. Para crearlo, sigue la guía en <Link to="/power-bi">Power BI</Link>.
          </div>
        )}
    </Card>
  )
}
