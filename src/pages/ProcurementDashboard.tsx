import React from 'react'
import { Link } from 'react-router-dom'
import DataTable, { type DataTableColumn } from '../components/DataTable'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import DrillDownModal from '../components/DrillDownModal'
import { deals } from '../features/crm/mockData'
import { getDealBlockingRows, getPricingActivityRows, getPricingKpis, type DealBlockingRow, type PricingActivityRow } from '../features/crm/selectors'
import { useDrilldownState } from '../features/crm/useDrilldownState'
import type { Deal } from '../features/crm/types'

export default function ProcurementDashboard() {
  const pricingRows = React.useMemo(() => getPricingActivityRows(), [])
  const pricingKpis = React.useMemo(() => getPricingKpis(), [])
  const blockingRows = React.useMemo(() => getDealBlockingRows(), [])
  const { drilldown, openDrilldown, closeDrilldown } = useDrilldownState()
  const dealMap = React.useMemo(() => new Map(deals.map((deal) => [deal.id, deal] as const)), [])
  const pricingDeals = React.useMemo(() => deals.filter((deal) => deal.requiresPricing), [])
  const blockedDeals = React.useMemo(() => deals.filter((deal) => deal.isPricingBlocked), [])
  const selectedDeals = React.useMemo(
    () => drilldown?.dealIds.map((dealId) => dealMap.get(dealId)).filter((deal): deal is Deal => Boolean(deal)) ?? [],
    [dealMap, drilldown],
  )

  const pricingColumns: DataTableColumn<PricingActivityRow>[] = [
    { key: 'item', header: 'Item / Product', sortable: true, render: (row) => row.item, sortValue: (row) => row.item },
    { key: 'pricedBy', header: 'Priced By', sortable: true, render: (row) => row.pricedBy, sortValue: (row) => row.pricedBy },
    { key: 'usesInDeals', header: 'Uses in Deals', sortable: true, align: 'right', render: (row) => row.usesInDeals, sortValue: (row) => row.usesInDeals },
    {
      key: 'conversionRate',
      header: 'Conversion Rate',
      sortable: true,
      align: 'right',
      render: (row) => `${row.conversionRate}%`,
      sortValue: (row) => row.conversionRate,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge label={row.status} tone={row.status === 'Active' ? 'success' : 'warning'} />,
      sortValue: (row) => row.status,
    },
  ]

  function openDealDrilldown(title: string, subtitle: string, dealIds: string[], context: 'kpi' | 'table') {
    openDrilldown({ title, subtitle, dealIds, context })
  }

  const blockingColumns: DataTableColumn<DealBlockingRow>[] = [
    { key: 'dealName', header: 'Deal Name', sortable: true, render: (row) => row.dealName, sortValue: (row) => row.dealName },
    {
      key: 'priority',
      header: 'Customer Priority',
      render: (row) => <StatusBadge label={row.customerPriority} tone={row.customerPriority === 'A+' ? 'danger' : row.customerPriority === 'A' ? 'warning' : 'neutral'} />,
      sortValue: (row) => row.customerPriority,
    },
    { key: 'dealValue', header: 'Deal Value', align: 'right', sortable: true, render: (row) => `$${row.dealValue.toLocaleString('en-US')}`, sortValue: (row) => row.dealValue },
    { key: 'timeWaitingDays', header: 'Time Waiting', align: 'right', sortable: true, render: (row) => `${row.timeWaitingDays} days`, sortValue: (row) => row.timeWaitingDays },
    {
      key: 'blockingStatus',
      header: 'Blocking Status',
      render: (row) => <StatusBadge label={row.blockingStatus} tone={row.blockingStatus === 'Escalated' ? 'danger' : 'warning'} />,
      sortValue: (row) => row.blockingStatus,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Procurement Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Pricing Intelligence workspace for deal support and bottlenecks.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          title="Pricing → Win Correlation"
          value={`${pricingKpis.pricingWinCorrelationRate}%`}
          subtitle="Won deals with completed pricing"
          tone="info"
          onClick={() => openDealDrilldown('Pricing Correlation', 'Won deals that completed pricing support.', pricingDeals.filter((deal) => deal.status === 'WON').map((deal) => deal.id), 'kpi')}
        />
        <StatCard
          title="Avg Time to Price Request"
          value={`${pricingKpis.avgTimeToPriceRequest} days`}
          subtitle="From request creation"
          tone="warning"
          onClick={() => openDealDrilldown('Price Request Timing', 'All pricing-backed deals with request timestamps.', pricingDeals.filter((deal) => Boolean(deal.pricingRequestedAt)).map((deal) => deal.id), 'kpi')}
        />
        <StatCard
          title="Pricing Delay Impact"
          value={`${pricingKpis.pricingDelayImpactScore}%`}
          subtitle="Blocked pricing deals share"
          tone="danger"
          onClick={() => openDealDrilldown('Pricing Delay Impact', 'Blocked pricing deals holding up execution.', blockedDeals.map((deal) => deal.id), 'kpi')}
        />
      </div>

      <div className="card p-4">
        <h2 className="mb-4 text-base font-semibold text-slate-900">Pricing Activity Table</h2>
        <DataTable
          columns={pricingColumns}
          rows={pricingRows}
          rowKey={(row) => `${row.item}-${row.pricedBy}`}
          initialSort={{ key: 'usesInDeals', direction: 'desc' }}
          onRowClick={(row) => openDealDrilldown(`${row.item} pricing`, `${row.pricedBy} priced ${row.usesInDeals} deal${row.usesInDeals === 1 ? '' : 's'}.`, row.dealIds, 'table')}
        />
      </div>

      <div className="card p-4">
        <h2 className="mb-4 text-base font-semibold text-slate-900">Deal Blocking Panel</h2>
        <DataTable
          columns={blockingColumns}
          rows={blockingRows}
          rowKey={(row) => row.dealIds[0]}
          initialSort={{ key: 'dealValue', direction: 'desc' }}
          onRowClick={(row) => openDealDrilldown(row.dealName, `Blocked for ${row.timeWaitingDays} days.`, row.dealIds, 'table')}
        />
      </div>

      <DrillDownModal open={Boolean(drilldown)} title={drilldown?.title ?? 'Pricing Drill-Down'} onClose={closeDrilldown}>
        {drilldown ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-600">{drilldown.subtitle}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <StatusBadge label={`${selectedDeals.length} deals`} tone="info" />
                <StatusBadge label={drilldown.context === 'kpi' ? 'KPI drill-down' : 'Table drill-down'} tone="neutral" />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link to="/sales" className="button">
                  Open Sales Dashboard
                </Link>
                <Link to="/gm" className="button">
                  Open GM Dashboard
                </Link>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Deal</th>
                    <th className="px-4 py-3 font-semibold">Customer</th>
                    <th className="px-4 py-3 font-semibold">Value</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedDeals.length === 0 ? (
                    <tr>
                      <td className="px-4 py-6 text-slate-500" colSpan={4}>
                        No deals available for this drill-down.
                      </td>
                    </tr>
                  ) : (
                    selectedDeals.map((deal) => (
                      <tr key={deal.id} className="border-t border-slate-100">
                        <td className="px-4 py-3 font-medium text-slate-900">{deal.dealName}</td>
                        <td className="px-4 py-3 text-slate-700">{deal.customerName}</td>
                        <td className="px-4 py-3 text-slate-700">${deal.value.toLocaleString('en-US')}</td>
                        <td className="px-4 py-3">
                          <StatusBadge label={deal.isPricingBlocked ? 'Blocked' : 'Pricing Clear'} tone={deal.isPricingBlocked ? 'danger' : 'success'} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </DrillDownModal>
    </div>
  )
}