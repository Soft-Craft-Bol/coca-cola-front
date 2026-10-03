import { useEffect, type RefObject } from 'react'

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Expone en el contenedor: --sy (scroll en px) y --mx/--my (puntero normalizado -1..1, con suavizado)
export function useParallax(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current
    if (!el || reduced()) return

    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2
      ty = (e.clientY / window.innerHeight - 0.5) * 2
    }
    const onScroll = () => el.style.setProperty('--sy', String(window.scrollY))

    const tick = () => {
      cx += (tx - cx) * 0.08
      cy += (ty - cy) * 0.08
      el.style.setProperty('--mx', cx.toFixed(3))
      el.style.setProperty('--my', cy.toFixed(3))
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    tick()
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [root])
}

// Progreso (0..1) de un elemento al cruzar la pantalla, como variable CSS --p
export function useScrollProgress(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => {
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height * 0.4)))
      el.style.setProperty('--p', p.toFixed(3))
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [ref])
}
