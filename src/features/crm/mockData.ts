import type { Deal, DealPriority, DealStatus, FollowUpState, PaymentTerm, SalesRep } from './types'

const referenceDate = new Date('2026-04-30T12:00:00.000Z')

function daysAgo(days: number): string {
  return new Date(referenceDate.getTime() - days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
}

function daysFromNow(days: number): string {
  return new Date(referenceDate.getTime() + days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
}

const repNames = [
  'Ahmed Kamal',
  'Mona Saleh',
  'Youssef Tarek',
  'Nour Hany',
  'Hassan Adel',
  'Laila Samir',
  'Omar Nabil',
  'Mariam Fouad',
  'Karim Ashraf',
  'Salma Wael',
]

const regions: SalesRep['region'][] = ['North', 'South', 'East', 'West']

export const salesReps: SalesRep[] = repNames.map((name, index) => ({
  id: `rep-${index + 1}`,
  name,
  region: regions[index % regions.length],
  tenureMonths: 12 + index * 4,
  monthlyRevenueTarget: 180000 + index * 18000,
}))

const customerPool = [
  'El Sewedy Group',
  'Nile Distribution',
  'Delta Manufacturing',
  'Orion Foods',
  'Cairo Retail Group',
  'Alex Engineering',
  'Pioneer Plastics',
  'Golden Textiles',
  'United Logistics',
  'Royal Hospitality',
  'Metro Pharma',
  'Heliopolis Trading',
]

const productPool = [
  'Steel Supply',
  'HVAC Package',
  'Electrical Panels',
  'Safety Equipment',
  'Piping Materials',
  'Industrial Valves',
]

const statusSequence: DealStatus[] = [
  'WON',
  'PENDING',
  'OVERDUE',
  'IN_PIPELINE',
  'LOST',
  'PENDING',
  'IN_PIPELINE',
]

const ratingSequence: Deal['customerRating'][] = ['A+', 'A', 'B', 'A', 'A+', 'B']
const prioritySequence: DealPriority[] = ['HIGH', 'MEDIUM', 'LOW', 'MEDIUM', 'HIGH']
const paymentSequence: PaymentTerm[] = ['CASH', '30', '45', '60', '90']

function deriveFollowUpState(status: DealStatus, index: number): FollowUpState {
  if (status === 'WON' || status === 'LOST') return 'COMPLETED'
  if (status === 'OVERDUE') return 'OVERDUE'
  return index % 4 === 0 ? 'OVERDUE' : 'PENDING'
}

export const deals: Deal[] = Array.from({ length: 42 }).map((_, index) => {
  const id = index + 1
  const status = statusSequence[index % statusSequence.length]
  const rating = ratingSequence[index % ratingSequence.length]
  const priority = prioritySequence[index % prioritySequence.length]
  const paymentTerm = paymentSequence[index % paymentSequence.length]
  const followUpState = deriveFollowUpState(status, index)
  const value = 45000 + index * 8500 + ((index % 3) * 2500)
  const ownerRep = salesReps[index % salesReps.length]
  const product = productPool[index % productPool.length]
  const requiresPricing = index % 2 === 0 || status === 'PENDING' || status === 'IN_PIPELINE'
  const pricingRep = salesReps[(index + 3) % salesReps.length]
  const isPricingBlocked = requiresPricing && (status === 'PENDING' || status === 'IN_PIPELINE') && index % 3 === 0
  const marginPercent = 9 + (index % 9) * 1.4

  return {
    id: `deal-${id}`,
    dealName: `${product} Opportunity ${id}`,
    customerName: customerPool[index % customerPool.length],
    customerRating: rating,
    value,
    status,
    priority,
    nextRequiredAction:
      status === 'OVERDUE'
        ? 'Escalate overdue follow-up'
        : status === 'PENDING'
          ? 'Submit revised offer'
          : status === 'IN_PIPELINE'
            ? 'Schedule customer call'
            : 'No pending action',
    ownerRepId: ownerRep.id,
    product,
    followUpState,
    followUpCompleted: followUpState === 'COMPLETED',
    nextFollowUpDate: followUpState === 'COMPLETED' ? daysAgo(index % 6) : daysFromNow((index % 10) - 3),
    lastActivityDate: daysAgo((index % 8) + 1),
    createdAt: daysAgo(30 + index * 2),
    paymentTerm,
    isCashDeal: paymentTerm === 'CASH',
    requiresPricing,
    pricingRepId: requiresPricing ? pricingRep.id : undefined,
    pricingRequestedAt: requiresPricing ? daysAgo((index % 9) + 2) : undefined,
    pricingCompletedAt: requiresPricing && !isPricingBlocked ? daysAgo(index % 4) : undefined,
    isPricingBlocked,
    marginPercent,
    customerContactedRecently: index % 5 !== 0,
  }
})
