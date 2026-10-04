import type { Experience, Product } from '@/shared/types'

/** Nombre completo de un producto: marca · sabor · presentación. */
export const productLabel = (product: Product) => [product.name, product.flavor, product.presentation].filter(Boolean).join(' · ')

export const experienceLabel = (experience: Experience) => `${experience.name}${experience.archived ? ' (archivada)' : ''}`

/** Valores distintos (sin vacíos) de un campo, para sugerirlos en los formularios. */
export const distinct = (values: (string | null | undefined)[]) =>
  [...new Set(values.map((v) => (v ?? '').trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es'))
