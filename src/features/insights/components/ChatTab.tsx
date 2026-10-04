import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Bot, Send, User } from 'lucide-react'
import { Card, ErrorBox } from '@/shared/components/ui'
import { insightsService, type ChatTurn } from '../services/insightsService'
import NarrateButton from './NarrateButton'

const SUGGESTIONS = [
  '¿Cuántas personas asistieron en total?',
  '¿Qué evento tuvo mejor asistencia?',
  '¿Qué producto o sabor tiene más interés?',
  '¿De qué ciudades vienen más participantes?',
  '¿Cuál es el NPS y la satisfacción promedio?',
]

// Asistente de consulta: responde solo con los datos de la plataforma (el servidor le entrega un resumen agregado)
export default function ChatTab() {
  const [turns, setTurns] = useState<ChatTurn[]>([])
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const end = useRef<HTMLDivElement>(null)

  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }) }, [turns, busy])

  const send = async (message: string) => {
    const question = message.trim()
    if (!question || busy) return
    const history = turns
    setTurns([...history, { role: 'user', text: question }])
    setText('')
    setError(null)
    setBusy(true)
    try {
      const res = await insightsService.chat(question, history)
      setTurns((t) => [...t, { role: 'assistant', text: res.answer }])
    } catch (e) {
      setError(e as Error)
    } finally {
      setBusy(false)
    }
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    void send(text)
  }

  return (
    <Card title="Asistente de datos">
      <p className="muted" style={{ marginTop: 0, fontSize: 14 }}>
        Pregunta por tus eventos, asistencia, productos, encuestas o pronósticos. Solo responde con los datos de la plataforma, sin datos personales.
      </p>
      <div className="chat-box">
        {turns.length === 0 && (
          <div className="chips">
            {SUGGESTIONS.map((s) => <button key={s} className="chip" onClick={() => void send(s)}>{s}</button>)}
          </div>
        )}
        {turns.map((t, i) => (
          <div key={i} className={`chat-msg ${t.role}`}>
            <span className="chat-avatar">{t.role === 'user' ? <User size={16} /> : <Bot size={16} />}</span>
            <div className="chat-bubble">
              {t.text}
              {t.role === 'assistant' && <div style={{ marginTop: 6 }}><NarrateButton text={t.text} /></div>}
            </div>
          </div>
        ))}
        {busy && <div className="chat-msg assistant"><span className="chat-avatar"><Bot size={16} /></span><div className="chat-bubble muted">Consultando los datos…</div></div>}
        <div ref={end} />
      </div>
      <ErrorBox error={error} />
      <form className="row" style={{ marginTop: 12 }} onSubmit={submit}>
        <input style={{ flex: 1 }} maxLength={500} placeholder="Escribe tu pregunta sobre los datos…" value={text} onChange={(e) => setText(e.target.value)} />
        <button className="btn primary icon-inline" disabled={busy || !text.trim()}><Send size={15} /> Enviar</button>
      </form>
    </Card>
  )
}
