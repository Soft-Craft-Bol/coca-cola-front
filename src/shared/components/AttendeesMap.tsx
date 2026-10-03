import { CircleMarker, MapContainer, TileLayer, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { CHART_COLORS } from '@/shared/constants'
import { cityCoords } from '@/shared/constants/cities'
import type { NamedValue } from '@/shared/types'
import { Empty } from './ui'

// Mapa de procedencia: un círculo por ciudad, más grande cuanto más participantes
export default function AttendeesMap({ data }: { data: NamedValue[] }) {
  const placed = data.map((d) => ({ ...d, coords: cityCoords(d.name) })).filter((d) => d.coords)
  const unplaced = data.filter((d) => !cityCoords(d.name)).reduce((a, d) => a + d.value, 0)
  if (!placed.length) return <Empty>Sin ciudades para ubicar en el mapa</Empty>
  const max = Math.max(...placed.map((p) => p.value))

  return (
    <div className="map-wrap">
      <MapContainer center={[5.2, -74.5]} zoom={6} scrollWheelZoom={false} className="map">
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {placed.map((p) => (
          <CircleMarker
            key={p.name}
            center={p.coords as [number, number]}
            radius={10 + (p.value / max) * 26}
            pathOptions={{ color: CHART_COLORS[0], fillColor: CHART_COLORS[0], fillOpacity: 0.45, weight: 2 }}
          >
            <Tooltip direction="top"><strong>{p.name}</strong>: {p.value} participantes</Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
      {unplaced > 0 && <p className="muted" style={{ fontSize: 12, margin: '8px 0 0' }}>{unplaced} participantes con ciudades que no se pudieron ubicar.</p>}
    </div>
  )
}
