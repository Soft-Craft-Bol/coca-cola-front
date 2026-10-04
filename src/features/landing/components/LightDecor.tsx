import bottle from '@/assets/landing/coca_cola.webp'

// Decoración de las secciones claras: curva rosa y botella lateral muy tenue, siempre detrás del contenido
// variant="hero": botella grande y nítida en el borde izquierdo (página Mi entrada); por defecto, marca casi imperceptible
export default function LightDecor({ variant = 'subtle' }: { variant?: 'subtle' | 'hero' }) {
  return (
    <>
      <svg className="light-wave" viewBox="0 0 1440 360" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path d="M0,170 C220,60 420,150 640,250 C760,300 860,330 960,360 L0,360 Z" fill="#FFF2F3" />
      </svg>
      <img className={`light-bottle ${variant}`} src={bottle} alt="" aria-hidden="true" width={1500} height={1500} loading="lazy" decoding="async" />
    </>
  )
}
