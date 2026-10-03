import { useAsync } from '@/shared/hooks/useAsync'
import { activityService } from '../services/activityService'

export const useActivities = (eventId: string) =>
  useAsync(() => (eventId ? activityService.list(eventId) : Promise.resolve([])), [eventId])

export const useInteractions = (eventId: string) =>
  useAsync(() => (eventId ? activityService.interactions(eventId) : Promise.resolve([])), [eventId])
