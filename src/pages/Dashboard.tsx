import React from 'react'
import KpiCard from '../components/KpiCard'
import { SalesLine, OffersDonut } from '../components/ChartArea'
import { kpis, salesSeries } from '../data/mock'
import sampleOffers from '../features/reports/mockData'

export default function Dashboard(){
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <KpiCard title="Total Revenue" value={kpis.revenue} delta={kpis.growth} />
        <KpiCard title="Monthly Growth" value={kpis.growth} delta={'+1.2%'} />
        <KpiCard title="Active Clients" value={String(kpis.clients)} />
        <KpiCard title="Pending Orders" value={String(kpis.pendingOrders)} />
        <KpiCard title="Employee Score" value={kpis.employeeScore} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SalesLine data={salesSeries} />
        </div>
        <div className="space-y-4">
          <OffersDonut
            data={(() => {
              const pending = sampleOffers.filter((s:any) => s.status === 'PENDING').length
              const profited = sampleOffers.filter((s:any) => s.status === 'PROFITED').length
              const refused = sampleOffers.filter((s:any) => s.status === 'REFUSED').length
              return [
                { name: 'Pending', value: pending },
                { name: 'Profited', value: profited },
                { name: 'Lost', value: refused },
              ]
            })()}
          />
        </div>
      </div>
    </div>
  )
}
