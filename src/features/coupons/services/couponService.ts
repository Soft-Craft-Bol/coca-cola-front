import { api } from '@/shared/services/api'
import type { Coupon, CouponIssueInput, CouponRedeemInput } from '@/shared/types'

export const couponService = {
  list: (eventId: string) => api.get<Coupon[]>(`/coupons?eventId=${eventId}`),
  issue: (data: CouponIssueInput) => api.post<Coupon>('/coupons', data),
  redeem: (data: CouponRedeemInput) => api.post<Coupon>('/coupons/redeem', data),
  remove: (id: string) => api.delete(`/coupons/${id}`),
}
