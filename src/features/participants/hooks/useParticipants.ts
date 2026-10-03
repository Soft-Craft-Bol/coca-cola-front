import { useAsync } from '@/shared/hooks/useAsync'
import { participantService } from '../services/participantService'

export const useParticipants = (eventId: string) =>
  useAsync(() => (eventId ? participantService.list(eventId) : Promise.resolve([])), [eventId])
