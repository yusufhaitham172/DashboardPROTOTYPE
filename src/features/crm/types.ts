export type DealStatus = 'WON' | 'PENDING' | 'OVERDUE' | 'IN_PIPELINE' | 'LOST'

export type CustomerRating = 'A+' | 'A' | 'B'

export type DealPriority = 'HIGH' | 'MEDIUM' | 'LOW'

export type PaymentTerm = 'CASH' | '30' | '45' | '60' | '90'

export type FollowUpState = 'COMPLETED' | 'PENDING' | 'OVERDUE'

export type SalesRep = {
  id: string
  name: string
  region: 'North' | 'South' | 'East' | 'West'
  tenureMonths: number
  monthlyRevenueTarget: number
}

export type Deal = {
  id: string
  dealName: string
  customerName: string
  customerRating: CustomerRating
  value: number
  status: DealStatus
  priority: DealPriority
  nextRequiredAction: string
  ownerRepId: string
  product: string
  followUpState: FollowUpState
  followUpCompleted: boolean
  nextFollowUpDate: string
  lastActivityDate: string
  createdAt: string
  paymentTerm: PaymentTerm
  isCashDeal: boolean
  requiresPricing: boolean
  pricingRepId?: string
  pricingRequestedAt?: string
  pricingCompletedAt?: string
  isPricingBlocked: boolean
  marginPercent: number
  customerContactedRecently: boolean
}
