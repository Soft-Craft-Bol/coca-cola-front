import { api } from '@/shared/services/api'

export type BiType = 'text' | 'integer' | 'number' | 'date' | 'datetime'

export interface BiColumn {
  name: string
  type: BiType
}

export interface BiTable {
  name: string
  description: string
  columns: BiColumn[]
}

export const biService = {
  catalog: () => api.get<BiTable[]>('/bi'),
  downloadCsv: (table: string) => api.download(`/bi/${table}?format=csv`, `${table}.csv`),
}
