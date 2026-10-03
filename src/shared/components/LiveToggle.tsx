import { Radio } from 'lucide-react'

// Interruptor "En vivo": cuando está activo, los datos se refrescan solos cada pocos segundos
export default function LiveToggle({ live, onChange }: { live: boolean; onChange: (value: boolean) => void }) {
  return (
    <button
      className={`live-toggle ${live ? 'on' : ''}`}
      onClick={() => onChange(!live)}
      title={live ? 'Datos en vivo: se actualizan solos cada 8 segundos' : 'Activar actualización en vivo'}
    >
      {live ? <span className="live-dot" /> : <Radio size={14} />}
      {live ? 'En vivo' : 'Pausado'}
    </button>
  )
}
