import { useEffect, useRef, useState } from 'react'
import { Square, Volume2 } from 'lucide-react'
import { insightsService } from '../services/insightsService'

// Narra un texto: con la voz del servidor (ElevenLabs u OpenAI) si está configurada y, si no, con la voz del navegador
export default function NarrateButton({ text, label = 'Narrar' }: { text: string; label?: string }) {
  const [state, setState] = useState<'idle' | 'loading' | 'playing'>('idle')
  const [error, setError] = useState('')
  const audio = useRef<HTMLAudioElement | null>(null)
  const alive = useRef(true)

  const stop = () => {
    audio.current?.pause()
    audio.current = null
    window.speechSynthesis?.cancel()
    if (alive.current) setState('idle')
  }

  useEffect(() => {
    alive.current = true
    return () => {
      alive.current = false
      audio.current?.pause()
      window.speechSynthesis?.cancel()
    }
  }, [])

  useEffect(stop, [text])

  const speakWithBrowser = () => {
    if (!('speechSynthesis' in window)) {
      setError('Tu navegador no permite narrar')
      setState('idle')
      return
    }
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'es-419'
    utterance.onend = () => alive.current && setState('idle')
    utterance.onerror = () => alive.current && setState('idle')
    setState('playing')
    window.speechSynthesis.speak(utterance)
  }

  const play = async () => {
    setError('')
    setState('loading')
    try {
      const blob = await insightsService.narrate(text)
      if (!alive.current) return
      if (!blob) return speakWithBrowser()
      const url = URL.createObjectURL(blob)
      const el = new Audio(url)
      audio.current = el
      el.onended = () => {
        URL.revokeObjectURL(url)
        if (alive.current) setState('idle')
      }
      await el.play()
      setState('playing')
    } catch (e) {
      // Si el servidor falla, se intenta con la voz del navegador
      if (alive.current) {
        setError((e as Error).message)
        speakWithBrowser()
      }
    }
  }

  return (
    <span className="row" style={{ gap: 8 }}>
      {state === 'playing'
        ? <button className="btn small icon-inline" onClick={stop}><Square size={14} /> Detener</button>
        : <button className="btn small icon-inline" disabled={state === 'loading' || !text} onClick={play}><Volume2 size={14} /> {state === 'loading' ? 'Preparando voz…' : label}</button>}
      {error && <span className="muted" style={{ fontSize: 12 }}>{error}</span>}
    </span>
  )
}
