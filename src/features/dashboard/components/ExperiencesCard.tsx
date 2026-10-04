import { Card, Empty, ProgressBar } from '@/shared/components/ui'
import { formatNumber } from '@/shared/utils/format'
import type { ExperienceInterest } from '@/shared/types'

// Experiencias destacadas del catálogo y cuántos asistentes participaron en actividades vinculadas
export default function ExperiencesCard({ data }: { data: ExperienceInterest[] }) {
  const max = Math.max(1, ...data.map((e) => e.value))
  return (
    <Card title="Experiencias destacadas">
      {data.length === 0 ? <Empty>Este evento no tiene experiencias destacadas</Empty> : (
        <div className="stack" style={{ gap: 12 }}>
          {data.slice(0, 8).map((e) => (
            <div key={e.experienceId}>
              <div className="row spread" style={{ fontSize: 13, marginBottom: 4 }}>
                <span>{e.name}</span>
                <strong>{formatNumber(e.value)} · {e.pct.toFixed(0)} % de asistentes</strong>
              </div>
              <ProgressBar value={(e.value / max) * 100} />
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
