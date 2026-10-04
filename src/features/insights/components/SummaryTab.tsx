import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { Badge, Card, ErrorBox, Loading } from '@/shared/components/ui'
import { useAsync } from '@/shared/hooks/useAsync'
import type { InsightSummary } from '@/shared/types'
import { insightsService } from '../services/insightsService'

// Resumen ejecutivo en lenguaje natural: automático y, si hay clave de Claude en el backend, redactado con IA
export default function SummaryTab({ eventId }: { eventId: string }) {
  const { data, loading, error } = useAsync(() => insightsService.summary(eventId || undefined), [eventId])
  const [ai, setAi] = useState<InsightSummary | null>(null)
  const [busy, setBusy] = useState(false)
  const [aiError, setAiError] = useState<Error | null>(null)

  const generate = async () => {
    setBusy(true)
    setAiError(null)
    try {
      setAi(await insightsService.summary(eventId || undefined, true))
    } catch (e) {
      setAiError(e as Error)
    } finally {
      setBusy(false)
    }
  }

  if (error) return <ErrorBox error={error} />
  if (loading || !data) return <Loading />
  const shown = ai && ai.eventId === data.eventId ? ai : null

  return (
    <div className="stack">
      <Card title={data.title} actions={<Badge tone="green">Resumen automático</Badge>}>
        <p style={{ fontSize: 16, lineHeight: 1.7, margin: 0 }}>{data.text}</p>
      </Card>

      <Card
        title="Análisis con inteligencia artificial"
        actions={<button className="btn primary icon-inline" disabled={busy} onClick={generate}><Sparkles size={15} /> {busy ? 'Generando…' : 'Generar con IA'}</button>}
      >
        <ErrorBox error={aiError} />
        {!shown && <p className="muted" style={{ margin: 0 }}>La IA redacta un resumen ejecutivo y tres acciones para la próxima activación a partir de los datos reales del evento (sin datos personales).</p>}
        {shown && shown.aiSource !== 'local' && <div className="ai-text">{shown.ai}</div>}
        {shown && shown.aiSource === 'local' && (
          <div className="ok-box" style={{ background: '#fef3c7', color: '#92400e', borderColor: '#fde68a' }}>
            La IA no está configurada o no respondió. Configura una en el backend: <code>ai.openai.api-key</code> (OpenCode Zen tiene modelos gratis)
            o <code>ai.anthropic.api-key</code> (Claude). Mientras tanto se usa el resumen automático de arriba.
          </div>
        )}
      </Card>
    </div>
  )
}
