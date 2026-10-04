import type { Product } from '@/shared/types'

export const productLabel = (product: Product) => [product.name, product.flavor, product.presentation].filter(Boolean).join(' · ')
