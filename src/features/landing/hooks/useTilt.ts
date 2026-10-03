import { useCallback, type PointerEvent } from 'react'

// Inclina un elemento en 3D según la posición del puntero y mueve un brillo (glare)
export function useTilt(max = 10) {
  const onPointerMove = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      const el = e.currentTarget
      const rect = el.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width
      const py = (e.clientY - rect.top) / rect.height
      el.style.setProperty('--ry', `${(px - 0.5) * 2 * max}deg`)
      el.style.setProperty('--rx', `${(0.5 - py) * 2 * max}deg`)
      el.style.setProperty('--gx', `${px * 100}%`)
      el.style.setProperty('--gy', `${py * 100}%`)
    },
    [max],
  )

  const onPointerLeave = useCallback((e: PointerEvent<HTMLElement>) => {
    const el = e.currentTarget
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }, [])

  return { onPointerMove, onPointerLeave }
}
