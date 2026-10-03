import { useRef } from 'react'
import { useScrollProgress } from '../hooks/useParallax'

const BARS = [38, 62, 48, 80, 66, 92, 74]

// Maqueta del panel dibujada con CSS; se endereza en 3D al hacer scroll
export default function DashboardPreview() {
  const ref = useRef<HTMLDivElement>(null)
  useScrollProgress(ref)

  return (
    <div className="dash-stage" ref={ref}>
      <div className="dash-3d">
        <div className="dash-top">
          <span className="dot r" /><span className="dot y" /><span className="dot g" />
          <em>Panel de indicadores</em>
        </div>
        <div className="dash-kpis">
          {[
            ['Participantes', '350'],
            ['Asistentes', '280'],
            ['Interacciones', '126'],
            ['Conversiones', '84'],
          ].map(([k, v]) => (
            <div key={k} className="dash-kpi"><small>{k}</small><strong>{v}</strong></div>
          ))}
        </div>
        <div className="dash-grid">
          <div className="dash-card">
            <small>Asistencia por hora</small>
            <div className="dash-bars">
              {BARS.map((h, i) => <i key={i} style={{ height: `${h}%`, animationDelay: `${i * 90}ms` }} />)}
            </div>
          </div>
          <div className="dash-card">
            <small>Interés por producto</small>
            {[['Coca-Cola Original', 86], ['Zero', 62], ['Fanta', 45]].map(([name, v]) => (
              <div key={name} className="dash-row">
                <span>{name}</span>
                <b><i style={{ width: `${v}%` }} /></b>
              </div>
            ))}
          </div>
        </div>
        <span className="dash-shine" />
      </div>
    </div>
  )
}
