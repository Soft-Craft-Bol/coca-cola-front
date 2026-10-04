import { Card } from '@/shared/components/ui'
import { formatNumber } from '@/shared/utils/format'
import type { ProductInterest } from '@/shared/types'

interface Props {
  attended: number
  interactions: number
  conversions: number
  redemptions: number
  productInterest: ProductInterest[]
  scope?: string
}

// Resumen en lenguaje natural del resultado, construido solo con los valores reales del panel
export default function ImpactSummary({ attended, interactions, conversions, redemptions, productInterest, scope = 'del evento' }: Props) {
  const top = [...productInterest].sort((a, b) => b.value - a.value)[0]
  const n = (v: number, one: string, many: string) => `${formatNumber(v)} ${v === 1 ? one : many}`
  return (
    <Card title={`Resultado ${scope}`}>
      <p style={{ margin: 0, fontSize: 17, lineHeight: 1.6 }}>
        {attended === 1 ? 'Asistió' : 'Asistieron'} <strong>{n(attended, 'persona', 'personas')}</strong>, se registraron{' '}
        <strong>{n(interactions, 'interacción', 'interacciones')}</strong> con productos, se {conversions === 1 ? 'generó' : 'generaron'}{' '}
        <strong>{n(conversions, 'conversión', 'conversiones')}</strong> y <strong>{n(redemptions, 'persona canjeó', 'personas canjearon')}</strong> un beneficio
        {top && top.value > 0 ? <>. El producto con mayor interés fue <strong>{top.name}</strong> ({formatNumber(top.value)} {top.value === 1 ? 'persona interesada' : 'personas interesadas'})</> : null}.
      </p>
    </Card>
  )
}
