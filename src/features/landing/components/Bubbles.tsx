import type { CSSProperties } from 'react'

// Generador pseudoaleatorio determinista (las burbujas no cambian entre renders)
function rand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

const BUBBLES = Array.from({ length: 46 }, (_, i) => {
  const size = 5 + Math.round(Math.pow(rand(i + 1), 2) * 34) // muchas pequeñas, pocas grandes
  return {
    left: Math.round(rand(i + 11) * 100),
    size,
    duration: 9 + Math.round(rand(i + 21) * 12) + (size > 24 ? -2 : 0),
    delay: -Math.round(rand(i + 31) * 20),
    sway: 10 + Math.round(rand(i + 41) * 26),
    swayDuration: 3 + Math.round(rand(i + 51) * 4),
    tint: i % 5 === 0, // algunas con tono rojo de marca
  }
})

// Burbujas de gaseosa que suben de abajo hacia arriba con un vaivén suave
export default function Bubbles() {
  return (
    <div className="fizz" aria-hidden="true">
      {BUBBLES.map((b, i) => (
        <span
          key={i}
          className={`fizz-bubble ${b.tint ? 'tint' : ''}`}
          style={
            {
              left: `${b.left}%`,
              width: b.size,
              height: b.size,
              '--rise': `${b.duration}s`,
              '--sway': `${b.swayDuration}s`,
              '--amp': `${b.sway}px`,
              animationDelay: `${b.delay}s, ${b.delay}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}
