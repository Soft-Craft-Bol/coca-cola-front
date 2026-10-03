import canRed from '@/assets/landing/can-red.png'
import canZero from '@/assets/landing/can-zero.png'

// Lata (foto recortada) con un brillo que la recorre, enmascarado con su propia silueta
function Can({ className, src }: { className: string; src: string }) {
  return (
    <div className={`can ${className}`}>
      <img src={src} alt="Lata de Coca-Cola" draggable={false} />
      <span className="can-gloss" style={{ WebkitMaskImage: `url(${src})`, maskImage: `url(${src})` }} />
    </div>
  )
}

// Escena 3D del hero: latas con perspectiva que siguen el puntero, cubos de hielo y burbujas
export default function HeroScene() {
  return (
    <div className="scene" aria-hidden="true">
      <div className="scene-glow" />

      <div className="scene-stage">
        <Can className="can-back" src={canZero} />
        <Can className="can-main" src={canRed} />
        <div className="can-shadow" />

        <div className="ice ice-1"><i /></div>
        <div className="ice ice-2"><i /></div>
        <div className="ice ice-3"><i /></div>

        <div className="glass-chip chip-a">
          <small>Asistencia efectiva</small>
          <strong>70 %</strong>
          <span className="chip-bar"><i style={{ width: '70%' }} /></span>
        </div>
        <div className="glass-chip chip-b">
          <small>Satisfacción</small>
          <strong>4,7 / 5</strong>
          <span className="chip-stars">★★★★★</span>
        </div>
        <div className="glass-chip chip-c">
          <small>Conversiones</small>
          <strong>+84</strong>
        </div>
      </div>
    </div>
  )
}
