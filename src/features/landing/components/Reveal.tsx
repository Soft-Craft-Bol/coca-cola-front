import type { CSSProperties, ReactNode } from 'react'
import { useInView } from '../hooks/useReveal'

interface Props {
  children: ReactNode
  delay?: number
  direction?: 'up' | 'left' | 'right' | 'zoom'
  className?: string
}

// Aparece con animación cuando entra en pantalla
export default function Reveal({ children, delay = 0, direction = 'up', className = '' }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>()
  return (
    <div
      ref={ref}
      className={`reveal reveal-${direction} ${inView ? 'in' : ''} ${className}`}
      style={{ '--delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  )
}
