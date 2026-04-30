import { deals, salesReps } from './mockData'
import type { CustomerRating, Deal, DealPriority, DealStatus, FollowUpState } from './types'

export type SalesOutstandingCard = {
  title: 'Outstanding Offers' | 'Pending Deals' | 'Overdue Deals' | 'Deals Requiring Action'
  count: number
}

export type SalesFollowUpRow = {
  id: string
  customer: string
  deal: string
  status: 'Pending' | 'Overdue' | 'In Pipeline'
  dueDate: string
  lastActivity: string
}

export type SalesSnapshot = {
  totalDealsWon: number
  conversionRate: number
  cashDealPercent: number
  customerRatingBreakdown: Record<CustomerRating, number>
}

export type DisciplineRow = {
  repId: string
  repName: string
  followUpCompliance: number
  missedFollowUps: number
  inactiveDealsCount: number
}

export type PricingActivityRow = {
  item: string
  pricedBy: string
  usesInDeals: number
  conversionRate: number
  status: 'Active' | 'Idle'
  dealIds: string[]
}

export type PricingKpis = {
  pricingWinCorrelationRate: number
  avgTimeToPriceRequest: number
  pricingDelayImpactScore: number
}

export type DealBlockingRow = {
  dealName: string
  customerPriority: CustomerRating
  dealValue: number
  timeWaitingDays: number
  isCashDeal: boolean
  blockingStatus: 'Waiting Pricing' | 'Escalated'
  dealIds: string[]
}

export type GmTopKpis = {
  totalRevenueMonthlyLive: number
  numberOfOrders: number
  dealStatusDistribution: Record<DealStatus, number>
  dealTypeDistribution: Record<'CASH' | '30' | '45' | '60' | '90', number>
  customerRatingDistribution: Record<CustomerRating, number>
}

export type GmAlert = {
  id: string
  title: string
  description: string
  severity: 'high' | 'medium' | 'low'
  category: 'High Risk' | 'Behavioral'
  dealId: string
  customerName: string
}

export type TeamPerformanceRow = {
  repId: string
  salesRepName: string
  revenue: number
  followUpCompliance: number
  underperformanceScore: number
  riskLevel: 'Low' | 'Medium' | 'High'
}

function money(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
}

function calcDiffDays(fromDate: string, toDate: Date = new Date('2026-04-30T12:00:00.000Z')): number {
  const from = new Date(fromDate)
  return Math.max(0, Math.floor((toDate.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)))
}

function dealStatusLabel(status: FollowUpState): SalesFollowUpRow['status'] {
  if (status === 'OVERDUE') return 'Overdue'
  if (status === 'PENDING') return 'Pending'
  return 'In Pipeline'
}

function filterActiveDeals(allDeals: Deal[]): Deal[] {
  return allDeals.filter((deal) => deal.status !== 'LOST')
}

export function getSalesOutstandingCards() {
  const activeDeals = filterActiveDeals(deals)
  const cards: SalesOutstandingCard[] = [
    {
      title: 'Outstanding Offers',
      count: activeDeals.filter((deal) => deal.status === 'PENDING' || deal.status === 'IN_PIPELINE').length,
    },
    { title: 'Pending Deals', count: activeDeals.filter((deal) => deal.status === 'PENDING').length },
    { title: 'Overdue Deals', count: activeDeals.filter((deal) => deal.status === 'OVERDUE').length },
    {
      title: 'Deals Requiring Action',
      count: activeDeals.filter((deal) => !deal.followUpCompleted || deal.followUpState === 'OVERDUE').length,
    },
  ]

  return cards
}

export function getSalesFollowUpRows(): SalesFollowUpRow[] {
  return deals
    .filter((deal) => deal.status === 'PENDING' || deal.status === 'OVERDUE' || deal.status === 'IN_PIPELINE')
    .slice(0, 16)
    .map((deal) => ({
      id: deal.id,
      customer: deal.customerName,
      deal: `${money(deal.value)} ${deal.product}`,
      status: dealStatusLabel(deal.followUpState),
      dueDate: deal.nextFollowUpDate,
      lastActivity: deal.lastActivityDate,
    }))
}

export function getSalesSnapshot(): SalesSnapshot {
  const totalOffers = deals.filter((deal) => deal.status !== 'LOST').length
  const wonDeals = deals.filter((deal) => deal.status === 'WON')
  const cashWonDeals = wonDeals.filter((deal) => deal.isCashDeal)

  const ratings: Record<CustomerRating, number> = { 'A+': 0, A: 0, B: 0 }
  deals.forEach((deal) => {
    ratings[deal.customerRating] += 1
  })

  return {
    totalDealsWon: wonDeals.length,
    conversionRate: totalOffers === 0 ? 0 : Number(((wonDeals.length / totalOffers) * 100).toFixed(1)),
    cashDealPercent: wonDeals.length === 0 ? 0 : Number(((cashWonDeals.length / wonDeals.length) * 100).toFixed(1)),
    customerRatingBreakdown: ratings,
  }
}

export function getDisciplineRows(): DisciplineRow[] {
  return salesReps.map((rep) => {
    const repDeals = deals.filter((deal) => deal.ownerRepId === rep.id)
    const actionable = repDeals.filter((deal) => deal.status !== 'WON' && deal.status !== 'LOST')
    const compliant = actionable.filter((deal) => deal.followUpState === 'COMPLETED').length
    const missed = actionable.filter((deal) => deal.followUpState === 'OVERDUE').length
    const inactive = actionable.filter((deal) => calcDiffDays(deal.lastActivityDate) > 5).length
    const followUpCompliance = actionable.length === 0 ? 100 : Number(((compliant / actionable.length) * 100).toFixed(1))

    return {
      repId: rep.id,
      repName: rep.name,
      followUpCompliance,
      missedFollowUps: missed,
      inactiveDealsCount: inactive,
    }
  })
}

export function getPricingActivityRows(): PricingActivityRow[] {
  const pricingDeals = deals.filter((deal) => deal.requiresPricing)
  const grouped = new Map<string, Deal[]>()
  pricingDeals.forEach((deal) => {
    const key = `${deal.product}::${deal.pricingRepId ?? 'rep-unknown'}`
    const current = grouped.get(key) ?? []
    current.push(deal)
    grouped.set(key, current)
  })

  return Array.from(grouped.entries()).map(([key, group]) => {
    const [item, repId] = key.split('::')
    const repName = salesReps.find((rep) => rep.id === repId)?.name ?? 'Unassigned'
    const won = group.filter((deal) => deal.status === 'WON').length
    const conversionRate = Number(((won / group.length) * 100).toFixed(1))
    const status = group.some((deal) => calcDiffDays(deal.lastActivityDate) <= 4) ? 'Active' : 'Idle'

    return {
      item,
      pricedBy: repName,
      usesInDeals: group.length,
      conversionRate,
      status,
      dealIds: group.map((deal) => deal.id),
    }
  })
}

export function getPricingKpis(): PricingKpis {
  const pricingDeals = deals.filter((deal) => deal.requiresPricing)
  const wonDeals = pricingDeals.filter((deal) => deal.status === 'WON').length
  const pricedClosedDeals = pricingDeals.filter((deal) => deal.pricingCompletedAt && deal.status === 'WON').length

  const requestWaitDays = pricingDeals
    .filter((deal) => Boolean(deal.pricingRequestedAt))
    .map((deal) => calcDiffDays(deal.pricingRequestedAt as string))

  const blockedCount = pricingDeals.filter((deal) => deal.isPricingBlocked).length

  const avgTime =
    requestWaitDays.length === 0
      ? 0
      : Number((requestWaitDays.reduce((sum, value) => sum + value, 0) / requestWaitDays.length).toFixed(1))

  return {
    pricingWinCorrelationRate: wonDeals === 0 ? 0 : Number(((pricedClosedDeals / wonDeals) * 100).toFixed(1)),
    avgTimeToPriceRequest: avgTime,
    pricingDelayImpactScore: Number(((blockedCount / Math.max(pricingDeals.length, 1)) * 100).toFixed(1)),
  }
}

export function getDealBlockingRows(): DealBlockingRow[] {
  return deals
    .filter((deal) => deal.isPricingBlocked)
    .sort((a, b) => b.value - a.value)
    .slice(0, 12)
    .map((deal) => ({
      dealName: deal.dealName,
      customerPriority: deal.customerRating,
      dealValue: deal.value,
      timeWaitingDays: deal.pricingRequestedAt ? calcDiffDays(deal.pricingRequestedAt) : 0,
      isCashDeal: deal.isCashDeal,
      blockingStatus: deal.customerRating === 'A+' || deal.isCashDeal ? 'Escalated' : 'Waiting Pricing',
      dealIds: [deal.id],
    }))
}

export function getGmTopKpis(): GmTopKpis {
  const statusDistribution: Record<DealStatus, number> = {
    WON: 0,
    PENDING: 0,
    OVERDUE: 0,
    IN_PIPELINE: 0,
    LOST: 0,
  }

  const dealTypeDistribution: Record<'CASH' | '30' | '45' | '60' | '90', number> = {
    CASH: 0,
    '30': 0,
    '45': 0,
    '60': 0,
    '90': 0,
  }

  const customerRatingDistribution: Record<CustomerRating, number> = { 'A+': 0, A: 0, B: 0 }

  deals.forEach((deal) => {
    statusDistribution[deal.status] += 1
    dealTypeDistribution[deal.paymentTerm] += 1
    customerRatingDistribution[deal.customerRating] += 1
  })

  return {
    totalRevenueMonthlyLive: deals.filter((deal) => deal.status === 'WON').reduce((sum, deal) => sum + deal.value, 0),
    numberOfOrders: deals.filter((deal) => deal.status === 'WON').length,
    dealStatusDistribution: statusDistribution,
    dealTypeDistribution,
    customerRatingDistribution,
  }
}

export function getGmAlerts(): GmAlert[] {
  const highRisk: GmAlert[] = deals
    .filter((deal) => (deal.value > 220000 && deal.customerRating === 'B') || deal.marginPercent < 11 || !deal.customerContactedRecently)
    .slice(0, 6)
    .map((deal, index) => ({
      id: `hr-${index + 1}`,
      title:
        deal.value > 220000 && deal.customerRating === 'B'
          ? 'Big deal with B-rated customer'
          : deal.marginPercent < 11
            ? 'Low margin deal detected'
            : 'A+ customer not contacted',
      description: `${deal.dealName} for ${deal.customerName} needs executive attention.`,
      severity: deal.marginPercent < 11 ? 'high' : 'medium',
      category: 'High Risk',
      dealId: deal.id,
      customerName: deal.customerName,
    }))

  const behavioral: GmAlert[] = deals
    .filter((deal) => deal.followUpState === 'OVERDUE' || calcDiffDays(deal.lastActivityDate) > 6)
    .slice(0, 6)
    .map((deal, index) => ({
      id: `bh-${index + 1}`,
      title: deal.followUpState === 'OVERDUE' ? 'No follow-up activity' : 'Repeated inactivity',
      description: `${deal.dealName} is stuck and requires team action.`,
      severity: deal.followUpState === 'OVERDUE' ? 'high' : 'medium',
      category: 'Behavioral',
      dealId: deal.id,
      customerName: deal.customerName,
    }))

  return [...highRisk, ...behavioral]
}

export function getTeamPerformanceRows(): TeamPerformanceRow[] {
  return salesReps.map((rep) => {
    const repDeals = deals.filter((deal) => deal.ownerRepId === rep.id)
    const revenue = repDeals.filter((deal) => deal.status === 'WON').reduce((sum, deal) => sum + deal.value, 0)
    const openDeals = repDeals.filter((deal) => deal.status === 'PENDING' || deal.status === 'IN_PIPELINE' || deal.status === 'OVERDUE')
    const compliant = openDeals.filter((deal) => deal.followUpState === 'COMPLETED').length
    const followUpCompliance = openDeals.length === 0 ? 100 : Number(((compliant / openDeals.length) * 100).toFixed(1))
    const lowMarginDeals = repDeals.filter((deal) => deal.marginPercent < 11).length
    const overdueDeals = repDeals.filter((deal) => deal.followUpState === 'OVERDUE').length
    const underperformanceScore = Number((100 - followUpCompliance + lowMarginDeals * 4 + overdueDeals * 6).toFixed(1))

    let riskLevel: TeamPerformanceRow['riskLevel'] = 'Low'
    if (underperformanceScore >= 40) riskLevel = 'High'
    else if (underperformanceScore >= 24) riskLevel = 'Medium'

    return {
      repId: rep.id,
      salesRepName: rep.name,
      revenue,
      followUpCompliance,
      underperformanceScore,
      riskLevel,
    }
  })
}

export function getCrmSummary() {
  const statusCounts: Record<DealStatus, number> = {
    WON: 0,
    PENDING: 0,
    OVERDUE: 0,
    IN_PIPELINE: 0,
    LOST: 0,
  }

  deals.forEach((deal) => {
    statusCounts[deal.status] += 1
  })

  return {
    repCount: salesReps.length,
    dealCount: deals.length,
    statusCounts,
  }
}
