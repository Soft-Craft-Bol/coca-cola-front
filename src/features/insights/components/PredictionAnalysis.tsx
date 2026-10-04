import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { Card, ErrorBox } from '@/shared/components/ui'
import { insightsService } from '../services/insightsService'
import NarrateButton from './NarrateButton'

// Interpretación de las predicciones (asistencia esperada y afinidad) redactada por la IA, con opción de narrarla
export default function PredictionAnalysis({ eventId }: { eventId?: string }) {
  const [result, setResult] = useState<{ text: string; source: 'ia' | 'local' } | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const run = async () => {
    setBusy(true)
    setError(null)
    try {
      setResult(await insightsService.predictionAnalysis(eventId))
    } catch (e) {
      setError(e as Error)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card
      title="Interpretación de las predicciones con IA"
      actions={<button className="btn primary icon-inline" disabled={busy} onClick={run}><Sparkles size={15} /> {busy ? 'Analizando…' : 'Analizar con IA'}</button>}
    >
      <ErrorBox error={error} />
      {!result && <p className="muted" style={{ margin: 0 }}>La IA explica qué significan la asistencia esperada y la afinidad, y propone acciones. Solo recibe cifras agregadas, sin datos personales.</p>}
      {result && (
        <div className="stack">
          <NarrateButton text={result.text} label="Narrar el análisis" />
          <div className="ai-text">{result.text}</div>
          {result.source === 'local' && (
            <div className="ok-box" style={{ background: '#fef3c7', color: '#92400e', borderColor: '#fde68a' }}>
              La IA no está configurada o no respondió; se muestran las cifras calculadas. Configura <code>AI_API_KEY</code> (OpenAI) en el backend.
            </div>
          )}
        </div>
      )}
    </Card>
  )
}
