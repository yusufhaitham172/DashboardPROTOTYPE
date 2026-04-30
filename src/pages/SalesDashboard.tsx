import React from 'react'
import AlertCard from '../components/AlertCard'
import DataTable, { type DataTableColumn } from '../components/DataTable'
import DrillDownModal from '../components/DrillDownModal'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import { deals, salesReps } from '../features/crm/mockData'
import {
  getSalesFollowUpRows,
  getSalesOutstandingCards,
  getSalesSnapshot,
  type SalesFollowUpRow,
} from '../features/crm/selectors'
import { useDrilldownState, type DrilldownContext } from '../features/crm/useDrilldownState'
import { Link } from 'react-router-dom'

type DealRecord = (typeof deals)[number]

function statusTone(status: SalesFollowUpRow['status']): 'warning' | 'danger' | 'info' {
  if (status === 'Overdue') return 'danger'
  if (status === 'Pending') return 'warning'
  return 'info'
}

export default function SalesDashboard() {
  const { drilldown, openDrilldown, closeDrilldown } = useDrilldownState()
  const followUpRows = React.useMemo(() => getSalesFollowUpRows(), [])
  const outstandingCards = React.useMemo(() => getSalesOutstandingCards(), [])
  const snapshot = React.useMemo(() => getSalesSnapshot(), [])
  const dealMap = React.useMemo(() => new Map(deals.map((deal) => [deal.id, deal] as const)), [])

  const selectedDeals = React.useMemo(
    () => drilldown?.dealIds.map((dealId) => dealMap.get(dealId)).filter((deal): deal is DealRecord => Boolean(deal)) ?? [],
    [dealMap, drilldown],
  )
  const selectedDeal = selectedDeals[0] ?? null

  const columns: DataTableColumn<SalesFollowUpRow>[] = [
    { key: 'customer', header: 'Customer', sortable: true, render: (row) => row.customer, sortValue: (row) => row.customer },
    { key: 'deal', header: 'Deal', render: (row) => row.deal },
    {
      key: 'status',
      header: 'Follow-up Status',
      sortable: true,
      render: (row) => <StatusBadge label={row.status} tone={statusTone(row.status)} />,
      sortValue: (row) => row.status,
    },
    { key: 'dueDate', header: 'Due Date', sortable: true, render: (row) => row.dueDate, sortValue: (row) => row.dueDate },
    { key: 'lastActivity', header: 'Last Activity', render: (row) => row.lastActivity },
  ]

  const cardTone: Record<string, 'info' | 'warning' | 'danger'> = {
    'Outstanding Offers': 'info',
    'Pending Deals': 'warning',
    'Overdue Deals': 'danger',
    'Deals Requiring Action': 'warning',
  }

  const ratingBars = [
    { label: 'A+', value: snapshot.customerRatingBreakdown['A+'] },
    { label: 'A', value: snapshot.customerRatingBreakdown.A },
    { label: 'B', value: snapshot.customerRatingBreakdown.B },
  ]

  const dealOwnerName = selectedDeal ? salesReps.find((rep) => rep.id === selectedDeal.ownerRepId)?.name ?? 'Unassigned' : ''

  function openDealDrilldown(title: string, subtitle: string, dealIds: string[], context: DrilldownContext) {
    openDrilldown({ title, subtitle, dealIds, context })
  }

  function findDealByFilter(filter: (deal: (typeof deals)[number]) => boolean) {
    return deals.find(filter)
  }

  function resolveCardSelection(title: string) {
    if (title === 'Outstanding Offers') return findDealByFilter((deal) => deal.status === 'PENDING' || deal.status === 'IN_PIPELINE')
    if (title === 'Pending Deals') return findDealByFilter((deal) => deal.status === 'PENDING')
    if (title === 'Overdue Deals') return findDealByFilter((deal) => deal.status === 'OVERDUE')
    return findDealByFilter((deal) => !deal.followUpCompleted || deal.followUpState === 'OVERDUE')
  }

  function resolveAlertSelection(type: 'risk' | 'behavioral') {
    if (type === 'risk') {
      return findDealByFilter((deal) => !deal.customerContactedRecently || (deal.customerRating === 'A+' && deal.followUpState !== 'COMPLETED'))
    }

    return findDealByFilter((deal) => deal.followUpState === 'OVERDUE' || deal.lastActivityDate < '2026-04-24')
  }

  function resolveSnapshotSelection(title: string) {
    if (title === 'Total Deals Won') return findDealByFilter((deal) => deal.status === 'WON')
    if (title === 'Conversion Rate') return findDealByFilter((deal) => deal.status === 'WON' || deal.status === 'PENDING')
    return findDealByFilter((deal) => deal.isCashDeal)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Sales Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Execution Control workspace for sales follow-up discipline.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {outstandingCards.map((card) => (
          <StatCard
            key={card.title}
            title={card.title}
            value={String(card.count)}
            subtitle="Derived from canonical CRM data"
            tone={cardTone[card.title]}
            onClick={() => {
              const deal = resolveCardSelection(card.title)
              if (deal) openDealDrilldown(card.title, `Top-level snapshot for ${card.title.toLowerCase()}.`, [deal.id], 'kpi')
            }}
          />
        ))}
      </div>

      <div className="card p-4">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-base font-semibold text-slate-900">Follow-Up Execution Panel</h2>
          <StatusBadge label="No deal can progress without follow-up completion" tone="danger" />
        </div>
        <DataTable
          columns={columns}
          rows={followUpRows}
          rowKey={(row) => row.id}
          initialSort={{ key: 'dueDate', direction: 'asc' }}
          onRowClick={(row) => openDealDrilldown(`Follow-up: ${row.customer}`, `Follow-up due ${row.dueDate}`, [row.id], 'table')}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          title="Total Deals Won"
          value={String(snapshot.totalDealsWon)}
          subtitle="YTD + live"
          tone="success"
          onClick={() => {
            const deal = resolveSnapshotSelection('Total Deals Won')
            if (deal) openDealDrilldown('Total Deals Won', 'Won deals currently recognized in the sales workspace.', [deal.id], 'kpi')
          }}
        />
        <StatCard
          title="Conversion Rate"
          value={`${snapshot.conversionRate}%`}
          subtitle="Won / total offers"
          tone="info"
          onClick={() => {
            const deal = resolveSnapshotSelection('Conversion Rate')
            if (deal) openDealDrilldown('Conversion Rate', 'Conversion snapshot across the active CRM pipeline.', [deal.id], 'kpi')
          }}
        />
        <StatCard
          title="Cash Deal %"
          value={`${snapshot.cashDealPercent}%`}
          subtitle="Won cash deals ratio"
          tone="warning"
          onClick={() => {
            const deal = resolveSnapshotSelection('Cash Deal %')
            if (deal) openDealDrilldown('Cash Deal %', 'Cash-heavy deals that clear the pipeline faster.', [deal.id], 'kpi')
          }}
        />
      </div>

      <div className="card p-4">
        <h3 className="mb-3 text-sm font-semibold text-slate-900">Customer Rating Breakdown</h3>
        <div className="space-y-2">
          {ratingBars.map((entry) => (
            <div key={entry.label}>
              <div className="mb-1 flex items-center justify-between text-xs text-slate-600">
                <span>{entry.label}</span>
                <span>{entry.value}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-slate-700"
                  style={{ width: `${Math.max(8, (entry.value / Math.max(1, followUpRows.length)) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AlertCard
          title="High Risk: A+ customer not contacted"
          description="An A+ customer with stale activity is flagged for immediate outreach."
          meta="Customer Priority: A+ | Deal Value: Real CRM data"
          severity="high"
          onClick={() => {
            const deal = resolveAlertSelection('risk')
            if (deal) openDealDrilldown('High Risk Alert', 'Customers that need immediate outreach and follow-up.', [deal.id], 'alert')
          }}
        />
        <AlertCard
          title="Behavioral Alert: Repeated inactivity"
          description="Open pipeline deals have crossed the inactivity threshold."
          meta="Impact: Live CRM data"
          severity="medium"
          onClick={() => {
            const deal = resolveAlertSelection('behavioral')
            if (deal) openDealDrilldown('Behavioral Alert', 'Recurring inactivity patterns that need execution discipline.', [deal.id], 'alert')
          }}
        />
      </div>

      <DrillDownModal open={Boolean(drilldown)} title={drilldown?.title ?? 'Drill-Down Details'} onClose={closeDrilldown}>
        {selectedDeal ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">{drilldown?.context ?? 'detail'}</p>
                  <h3 className="mt-1 text-lg font-semibold text-slate-900">{selectedDeal.dealName}</h3>
                  <p className="mt-1 text-sm text-slate-600">{selectedDeal.customerName}</p>
                </div>
                <StatusBadge
                  label={selectedDeal.status}
                  tone={selectedDeal.status === 'WON' ? 'success' : selectedDeal.status === 'OVERDUE' ? 'danger' : 'warning'}
                />
              </div>
              <p className="mt-3 text-sm text-slate-600">{drilldown?.subtitle}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link to="/procurement" className="button">
                  Open Procurement Dashboard
                </Link>
                <Link to="/gm" className="button">
                  Open GM Dashboard
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 p-3">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Owner</p>
                <p className="mt-1 text-sm font-medium text-slate-900">{dealOwnerName}</p>
                <p className="mt-1 text-sm text-slate-600">Region: {salesReps.find((rep) => rep.id === selectedDeal.ownerRepId)?.region ?? 'Unknown'}</p>
              </div>
              <div className="rounded-xl border border-slate-200 p-3">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Value</p>
                <p className="mt-1 text-sm font-medium text-slate-900">${selectedDeal.value.toLocaleString('en-US')}</p>
                <p className="mt-1 text-sm text-slate-600">Payment term: {selectedDeal.paymentTerm}</p>
              </div>
              <div className="rounded-xl border border-slate-200 p-3">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Follow-up</p>
                <p className="mt-1 text-sm font-medium text-slate-900">{selectedDeal.followUpState}</p>
                <p className="mt-1 text-sm text-slate-600">Next action: {selectedDeal.nextRequiredAction}</p>
              </div>
              <div className="rounded-xl border border-slate-200 p-3">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Pricing</p>
                <p className="mt-1 text-sm font-medium text-slate-900">{selectedDeal.requiresPricing ? 'Pricing required' : 'No pricing dependency'}</p>
                <p className="mt-1 text-sm text-slate-600">Margin: {selectedDeal.marginPercent.toFixed(1)}%</p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <h4 className="text-sm font-semibold text-slate-900">Execution Notes</h4>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>Customer rating: {selectedDeal.customerRating}</li>
                <li>Last activity: {selectedDeal.lastActivityDate}</li>
                <li>Next follow-up: {selectedDeal.nextFollowUpDate}</li>
                <li>Pricing status: {selectedDeal.isPricingBlocked ? 'Blocked' : 'Clear'}</li>
              </ul>
            </div>

            {selectedDeals.length > 1 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <h4 className="text-sm font-semibold text-slate-900">Related Deals</h4>
                <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                  {selectedDeals.slice(0, 4).map((deal) => (
                    <div key={deal.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{deal.customerName}</p>
                      <p className="mt-1 text-sm font-medium text-slate-900">{deal.dealName}</p>
                      <p className="mt-1 text-sm text-slate-600">${deal.value.toLocaleString('en-US')}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </DrillDownModal>
    </div>
  )
}