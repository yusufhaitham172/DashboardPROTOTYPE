import React from 'react'
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import AlertCard from '../components/AlertCard'
import DataTable, { type DataTableColumn } from '../components/DataTable'
import DrillDownModal from '../components/DrillDownModal'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import { deals } from '../features/crm/mockData'
import { getGmAlerts, getGmTopKpis, getTeamPerformanceRows, type TeamPerformanceRow } from '../features/crm/selectors'
import { useDrilldownState, type DrilldownContext } from '../features/crm/useDrilldownState'
import type { Deal } from '../features/crm/types'
import { Link } from 'react-router-dom'

type DrilldownState = {
  title: string
  subtitle: string
  deals: Deal[]
  context: 'kpi' | 'alert' | 'rep'
}

const statusMeta: Record<Deal['status'], { label: string; color: string }> = {
  WON: { label: 'Won', color: '#0f172a' },
  PENDING: { label: 'Pending', color: '#64748b' },
  OVERDUE: { label: 'Overdue', color: '#b91c1c' },
  IN_PIPELINE: { label: 'In Pipeline', color: '#0369a1' },
  LOST: { label: 'Lost', color: '#cbd5e1' },
}

const paymentColors = ['#0f172a', '#334155', '#64748b', '#94a3b8', '#cbd5e1']

function currency(value: number): string {
  return `$${value.toLocaleString('en-US')}`
}

function getDealsByStatus(status: Deal['status']): Deal[] {
  return deals.filter((deal) => deal.status === status)
}

function getDealsByRep(repId: string): Deal[] {
  return deals.filter((deal) => deal.ownerRepId === repId)
}

function getDealsByRating(rating: Deal['customerRating']): Deal[] {
  return deals.filter((deal) => deal.customerRating === rating)
}

export default function GmDashboard() {
  const kpis = React.useMemo(() => getGmTopKpis(), [])
  const alerts = React.useMemo(() => getGmAlerts().slice(0, 4), [])
  const teamRows = React.useMemo(() => getTeamPerformanceRows(), [])
  const { drilldown, openDrilldown, closeDrilldown } = useDrilldownState()
  const dealIndex = React.useMemo(() => new Map(deals.map((deal) => [deal.id, deal] as const)), [])
  const selectedDeals = React.useMemo(
    () => drilldown?.dealIds.map((dealId) => dealIndex.get(dealId)).filter((deal): deal is Deal => Boolean(deal)) ?? [],
    [dealIndex, drilldown],
  )

  const statusPieData = React.useMemo(
    () =>
      (Object.entries(kpis.dealStatusDistribution) as Array<[Deal['status'], number]>)
        .filter(([, value]) => value > 0)
        .map(([status, value]) => ({ status, name: statusMeta[status].label, value, color: statusMeta[status].color })),
    [kpis.dealStatusDistribution],
  )

  const paymentTypeData = React.useMemo(
    () =>
      (Object.entries(kpis.dealTypeDistribution) as Array<[keyof typeof kpis.dealTypeDistribution, number]>)
        .map(([term, value]) => ({ name: term === 'CASH' ? 'Cash' : `${term} days`, value })),
    [kpis.dealTypeDistribution],
  )

  const revenueDeals = getDealsByStatus('WON')
  const pendingDeals = getDealsByStatus('PENDING')
  const overdueDeals = getDealsByStatus('OVERDUE')
  const highPriorityDeals = getDealsByRating('A+')

  const teamColumns: DataTableColumn<TeamPerformanceRow>[] = [
    { key: 'salesRepName', header: 'Sales Rep Name', sortable: true, render: (row) => row.salesRepName, sortValue: (row) => row.salesRepName },
    { key: 'revenue', header: 'Revenue', align: 'right', sortable: true, render: (row) => currency(row.revenue), sortValue: (row) => row.revenue },
    {
      key: 'followUpCompliance',
      header: 'Follow-up Compliance',
      align: 'right',
      sortable: true,
      render: (row) => `${row.followUpCompliance}%`,
      sortValue: (row) => row.followUpCompliance,
    },
    {
      key: 'underperformanceScore',
      header: 'Underperformance Score',
      align: 'right',
      sortable: true,
      render: (row) => row.underperformanceScore,
      sortValue: (row) => row.underperformanceScore,
    },
    {
      key: 'riskLevel',
      header: 'Risk Level',
      render: (row) => (
        <StatusBadge
          label={row.riskLevel}
          tone={row.riskLevel === 'High' ? 'danger' : row.riskLevel === 'Medium' ? 'warning' : 'success'}
        />
      ),
      sortValue: (row) => row.riskLevel,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">General Manager Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Control Tower workspace for executive risk and performance visibility.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Total Revenue"
          value={currency(kpis.totalRevenueMonthlyLive)}
          subtitle="Monthly live"
          tone="success"
          trend={`${kpis.dealStatusDistribution.WON} closed deals`}
          onClick={() => openDrilldown({ title: 'Won Deals', subtitle: 'Closed revenue currently recognized in the control tower.', dealIds: revenueDeals.map((deal) => deal.id), context: 'kpi' })}
        />
        <StatCard
          title="Number of Orders"
          value={String(kpis.numberOfOrders)}
          subtitle="Won orders"
          tone="info"
          trend={`${Math.round((kpis.numberOfOrders / Math.max(deals.length, 1)) * 100)}% of all deals`}
          onClick={() => openDrilldown({ title: 'Won Orders', subtitle: 'Completed orders driving monthly revenue.', dealIds: revenueDeals.map((deal) => deal.id), context: 'kpi' })}
        />
        <StatCard
          title="Pending Deals"
          value={String(kpis.dealStatusDistribution.PENDING)}
          subtitle="Needs follow-up"
          tone="warning"
          trend={`${pendingDeals.filter((deal) => deal.followUpState === 'OVERDUE').length} overdue`}
          onClick={() => openDrilldown({ title: 'Pending Deals', subtitle: 'Deals still waiting on customer response or pricing progress.', dealIds: pendingDeals.map((deal) => deal.id), context: 'kpi' })}
        />
        <StatCard
          title="Overdue Deals"
          value={String(kpis.dealStatusDistribution.OVERDUE)}
          subtitle="At risk"
          tone="danger"
          trend={`${overdueDeals.length} escalations`}
          onClick={() => openDrilldown({ title: 'Overdue Deals', subtitle: 'Deals that need immediate executive attention.', dealIds: overdueDeals.map((deal) => deal.id), context: 'kpi' })}
        />
        <StatCard
          title="A+ Customers"
          value={String(kpis.customerRatingDistribution['A+'])}
          subtitle="Priority accounts"
          tone="info"
          trend={`${highPriorityDeals.length} active opportunities`}
          onClick={() => openDrilldown({ title: 'A+ Customers', subtitle: 'Highest-priority customers with active opportunities.', dealIds: highPriorityDeals.map((deal) => deal.id), context: 'kpi' })}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="card p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Deal Status Distribution</h2>
              <p className="text-sm text-slate-500">Live mix of won, pending, overdue, and pipeline deals.</p>
            </div>
            <StatusBadge label="Control Tower" tone="info" />
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[220px_1fr]">
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={78} paddingAngle={3}>
                    {statusPieData.map((entry) => (
                      <Cell key={entry.status} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {statusPieData.map((entry) => (
                <button
                  key={entry.status}
                  type="button"
                  className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-left transition hover:bg-slate-100"
                  onClick={() =>
                    openDrilldown({
                      title: `${entry.name} Deals`,
                      subtitle: `All deals currently marked as ${entry.name.toLowerCase()}.`,
                      dealIds: getDealsByStatus(entry.status).map((deal) => deal.id),
                      context: 'kpi',
                    })
                  }
                >
                  <span className="flex items-center gap-2 text-sm font-medium text-slate-800">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                    {entry.name}
                  </span>
                  <span className="text-sm text-slate-500">{entry.value}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Deal-Type Distribution</h2>
              <p className="text-sm text-slate-500">Cash deals versus term deals in the current pipeline.</p>
            </div>
            <StatusBadge label="Payment Terms" tone="warning" />
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paymentTypeData} margin={{ left: 8, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={{ stroke: '#cbd5e1' }} />
                <YAxis allowDecimals={false} tick={{ fill: '#64748b', fontSize: 12 }} axisLine={{ stroke: '#cbd5e1' }} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)' }}
                />
                <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                  {paymentTypeData.map((entry, index) => (
                    <Cell key={entry.name} fill={paymentColors[index % paymentColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {alerts.map((alert) => {
          const deal = dealIndex.get(alert.dealId)

          return (
            <AlertCard
              key={alert.id}
              title={`${alert.category}: ${alert.title}`}
              description={alert.description}
              meta={`Customer: ${alert.customerName}`}
              severity={alert.severity}
              onClick={() =>
                openDrilldown({
                  title: alert.title,
                  subtitle: `${alert.category} alert for ${alert.customerName}`,
                  dealIds: deal ? [deal.id] : [],
                  context: 'alert',
                })
              }
            />
          )
        })}
      </div>

      <div className="card p-4">
        <h2 className="mb-4 text-base font-semibold text-slate-900">Team Performance Table</h2>
        <DataTable
          columns={teamColumns}
          rows={teamRows}
          rowKey={(row) => row.repId}
          initialSort={{ key: 'underperformanceScore', direction: 'desc' }}
          onRowClick={(row) =>
            openDrilldown({
              title: `${row.salesRepName} Performance`,
              subtitle: `${row.riskLevel} risk · ${row.followUpCompliance}% follow-up compliance`,
              dealIds: getDealsByRep(row.repId).map((deal) => deal.id),
              context: 'rep',
            })
          }
        />
      </div>

      <DrillDownModal open={Boolean(drilldown)} title={drilldown?.title ?? ''} onClose={closeDrilldown}>
        {drilldown ? (
          <div className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-600">{drilldown.subtitle}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <StatusBadge label={`${selectedDeals.length} deals`} tone="info" />
                <StatusBadge
                  label={drilldown.context === 'rep' ? 'Team drill-down' : drilldown.context === 'alert' ? 'Alert drill-down' : 'KPI drill-down'}
                  tone="neutral"
                />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link to="/sales" className="button">
                  Open Sales Dashboard
                </Link>
                <Link to="/procurement" className="button">
                  Open Procurement Dashboard
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
                    <th className="px-4 py-3 font-semibold">Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedDeals.length === 0 ? (
                    <tr>
                      <td className="px-4 py-6 text-slate-500" colSpan={5}>
                        No deals available for this drill-down.
                      </td>
                    </tr>
                  ) : (
                    selectedDeals.map((deal) => (
                      <tr key={deal.id} className="border-t border-slate-100">
                        <td className="px-4 py-3 font-medium text-slate-900">{deal.dealName}</td>
                        <td className="px-4 py-3 text-slate-700">{deal.customerName}</td>
                        <td className="px-4 py-3 text-slate-700">{currency(deal.value)}</td>
                        <td className="px-4 py-3">
                          <StatusBadge
                            label={deal.status.replace('_', ' ')}
                            tone={deal.status === 'WON' ? 'success' : deal.status === 'OVERDUE' ? 'danger' : deal.status === 'PENDING' ? 'warning' : 'info'}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge label={deal.priority} tone={deal.priority === 'HIGH' ? 'danger' : deal.priority === 'MEDIUM' ? 'warning' : 'neutral'} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {selectedDeals.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                {selectedDeals.slice(0, 3).map((deal) => (
                  <div key={deal.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{deal.customerName}</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">{deal.dealName}</p>
                    <p className="mt-1 text-sm text-slate-600">{currency(deal.value)}</p>
                    <p className="mt-2 text-xs text-slate-500">Next action: {deal.nextRequiredAction}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </DrillDownModal>
    </div>
  )
}