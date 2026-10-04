import { api } from '@/shared/services/api'
import type { Experience, Product } from '@/shared/types'

export interface ProductInput {
  name: string
  category: string
  flavor: string
  presentation: string
  archived: boolean
}

export interface ExperienceInput {
  name: string
  category: string
  description: string
  archived: boolean
}

export const catalogService = {
  products: () => api.get<Product[]>('/products'),
  createProduct: (data: ProductInput) => api.post<Product>('/products', data),
  updateProduct: (id: string, data: ProductInput) => api.put<Product>(`/products/${id}`, data),
  experiences: () => api.get<Experience[]>('/experiences'),
  createExperience: (data: ExperienceInput) => api.post<Experience>('/experiences', data),
  updateExperience: (id: string, data: ExperienceInput) => api.put<Experience>(`/experiences/${id}`, data),
}
