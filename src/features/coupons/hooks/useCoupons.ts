import { useAsync } from '@/shared/hooks/useAsync'
import { couponService } from '../services/couponService'

export const useCoupons = (eventId: string) =>
  useAsync(() => (eventId ? couponService.list(eventId) : Promise.resolve([])), [eventId])
