import { useState } from 'react'
import { useParams } from 'react-router-dom'
import logo from '@/assets/coca-cola-logo.png'
import { Card, ErrorBox, Loading, Stars } from '@/shared/components/ui'
import { SURVEY_CRITERIA, type SurveyCriterionKey } from '@/shared/constants'
import { useAsync } from '@/shared/hooks/useAsync'
import { publicSurveyService } from '../services/publicSurveyService'

// Página pública (sin login): el asistente responde la encuesta con el código de su QR
export default function PublicSurveyPage() {
  const { code = '' } = useParams()
  const { data, loading, error } = useAsync(() => publicSurveyService.info(code), [code])
  const [ratings, setRatings] = useState<Record<SurveyCriterionKey, number>>({ organization: 0, service: 0, experiences: 0, products: 0, overall: 0 })
  const [nps, setNps] = useState<number | null>(null)
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)
  const [submitError, setSubmitError] = useState<Error | null>(null)

  const complete = SURVEY_CRITERIA.every((c) => ratings[c.key] > 0) && nps !== null

  const submit = async () => {
    if (nps === null) return
    setBusy(true)
    setSubmitError(null)
    try {
      await publicSurveyService.submit(code, { ...ratings, nps })
      setDone(true)
    } catch (e) {
      setSubmitError(e as Error)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="public-page">
      <div className="public-card stack">
        <img className="public-logo" src={logo} alt="Coca-Cola" />
        {loading && <Loading />}
        <ErrorBox error={error} />
        {data && (done || data.answered) && (
          <Card title="¡Gracias por tu opinión!"><p style={{ margin: 0 }}>Tu respuesta sobre <strong>{data.eventName}</strong> ya quedó registrada. ¡Esperamos verte en el próximo evento!</p></Card>
        )}
        {data && !done && !data.answered && !data.attended && (
          <Card title="Encuesta no disponible"><p style={{ margin: 0 }}>La encuesta de <strong>{data.eventName}</strong> es solo para quienes asistieron al evento.</p></Card>
        )}
        {data && !done && !data.answered && data.attended && (
          <Card title={`Hola ${data.participantName}, cuéntanos tu experiencia`}>
            <p className="muted" style={{ marginTop: 0 }}>{data.eventName}</p>
            <div className="stack">
              {SURVEY_CRITERIA.map((c) => (
                <div key={c.key} className="row spread">
                  <span>{c.label}</span>
                  <Stars value={ratings[c.key]} onChange={(v) => setRatings({ ...ratings, [c.key]: v })} />
                </div>
              ))}
              <div className="field">
                <span>Del 0 al 10, ¿qué tan probable es que recomiendes esta experiencia de Coca-Cola?</span>
                <div className="chips">
                  {Array.from({ length: 11 }, (_, n) => (
                    <button type="button" key={n} className={`chip ${nps === n ? 'on' : ''}`} onClick={() => setNps(n)}>{n}</button>
                  ))}
                </div>
              </div>
              <ErrorBox error={submitError} />
              <button className="btn primary" disabled={!complete || busy} onClick={submit}>{busy ? 'Enviando…' : 'Enviar respuestas'}</button>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
