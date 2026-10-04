import type { ComponentType, ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'

interface Props {
  icon: ComponentType<{ size?: number; 'aria-hidden'?: boolean }>
  title: string
  text: string
  benefit: string
  illustration: ReactNode
}

// Tarjeta de funcionalidad: la frase de beneficio es solo informativa (no es un enlace)
export default function FeatureCard({ icon: Icon, title, text, benefit, illustration }: Props) {
  return (
    <article className="fc-card">
      <div className="fc-main">
        <div className="fc-text">
          <div className="fc-icon"><Icon size={26} aria-hidden /></div>
          <h3>{title}</h3>
          <p>{text}</p>
        </div>
        <div className="fc-art">{illustration}</div>
      </div>
      <p className="fc-benefit"><ArrowRight size={16} aria-hidden="true" /> {benefit}</p>
    </article>
  )
}
