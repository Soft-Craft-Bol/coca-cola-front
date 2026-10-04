import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Bot, MessageCircle, RotateCcw, Send, User, X } from 'lucide-react'
import { ErrorBox } from '@/shared/components/ui'
import NarrateButton from '@/features/insights/components/NarrateButton'
import { useChatStore } from '../store/chatStore'

const SUGGESTIONS = [
  '¿Cuántas personas asistieron en total?',
  '¿Qué evento tuvo mejor asistencia?',
  '¿Qué producto o sabor tiene más interés?',
  '¿De qué ciudades vienen más participantes?',
]

// Burbuja flotante del asistente de datos: disponible en todo el panel. Solo responde con los datos de la plataforma
export default function ChatBubble() {
  const { turns, busy, error, send, reset } = useChatStore()
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const end = useRef<HTMLDivElement>(null)

  useEffect(() => { if (open) end.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }) }, [turns, busy, open])
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const message = text
    setText('')
    void send(message)
  }

  return (
    <>
      {open && (
        <section className="chat-widget" role="dialog" aria-label="Asistente de datos">
          <header className="chat-head">
            <span className="row" style={{ gap: 8 }}><Bot size={18} /> <strong>Asistente de datos</strong></span>
            <span className="row" style={{ gap: 4 }}>
              {turns.length > 0 && <button className="chat-icon-btn" title="Nueva conversación" onClick={reset}><RotateCcw size={16} /></button>}
              <button className="chat-icon-btn" title="Cerrar" onClick={() => setOpen(false)}><X size={18} /></button>
            </span>
          </header>
          <div className="chat-body">
            {turns.length === 0 && (
              <>
                <p className="muted" style={{ margin: '0 0 10px', fontSize: 13 }}>
                  Pregunta por eventos, asistencia, productos, encuestas o pronósticos. Solo respondo con los datos de la plataforma.
                </p>
                <div className="chips">
                  {SUGGESTIONS.map((s) => <button key={s} className="chip" onClick={() => void send(s)}>{s}</button>)}
                </div>
              </>
            )}
            {turns.map((t, i) => (
              <div key={i} className={`chat-msg ${t.role}`}>
                <span className="chat-avatar">{t.role === 'user' ? <User size={14} /> : <Bot size={14} />}</span>
                <div className="chat-bubble">
                  {t.text}
                  {t.role === 'assistant' && <div style={{ marginTop: 6 }}><NarrateButton text={t.text} /></div>}
                </div>
              </div>
            ))}
            {busy && <div className="chat-msg assistant"><span className="chat-avatar"><Bot size={14} /></span><div className="chat-bubble muted">Consultando los datos…</div></div>}
            <div ref={end} />
          </div>
          <ErrorBox error={error} />
          <form className="chat-form" onSubmit={submit}>
            <input maxLength={500} placeholder="Escribe tu pregunta…" value={text} onChange={(e) => setText(e.target.value)} autoFocus />
            <button className="btn primary icon-inline" disabled={busy || !text.trim()} title="Enviar"><Send size={15} /></button>
          </form>
        </section>
      )}
      <button className="chat-fab" onClick={() => setOpen((o) => !o)} aria-label={open ? 'Cerrar asistente' : 'Abrir asistente de datos'} title="Asistente de datos">
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </>
  )
}
