import type { ReactNode } from 'react'
import { useTilt } from '../hooks/useTilt'

// Tarjeta que se inclina en 3D con brillo según el puntero
export default function TiltCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  const tilt = useTilt(9)
  return (
    <div className={`tilt ${className}`} {...tilt}>
      <div className="tilt-inner">{children}</div>
      <span className="tilt-glare" />
    </div>
  )
}
