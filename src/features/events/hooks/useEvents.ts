import { useAsync } from '@/shared/hooks/useAsync'
import { eventService } from '../services/eventService'

export const useEvents = () => useAsync(() => eventService.list(), [])
export const useEvent = (id: string) => useAsync(() => eventService.get(id), [id])
export const useProducts = () => useAsync(() => eventService.products(), [])
