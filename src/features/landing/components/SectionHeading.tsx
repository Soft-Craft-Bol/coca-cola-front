import type { ReactNode } from 'react'
import Reveal from './Reveal'

interface Props {
  id: string
  eyebrow: string
  plain: string
  accent?: string
  align?: 'center' | 'left'
  children?: ReactNode
}

// Encabezado centrado compartido por las secciones claras: etiqueta, título bicolor y descripción
export default function SectionHeading({ id, eyebrow, plain, accent, align = 'center', children }: Props) {
  return (
    <header className={`sh ${align === 'left' ? 'left' : ''}`}>
      <Reveal><span className="sh-eyebrow">{eyebrow}</span></Reveal>
      <Reveal delay={80}>
        <h2 id={id} className="sh-title">{plain}{accent && <> <span>{accent}</span></>}</h2>
      </Reveal>
      {children && <Reveal delay={160}><p className="sh-lead">{children}</p></Reveal>}
    </header>
  )
}
