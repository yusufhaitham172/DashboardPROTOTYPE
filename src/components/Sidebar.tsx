import React, { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'

const items = [
  {label: 'Dashboard', to: '/dashboard'},
  {label: 'Employees', to: '/employees'},
  {label: 'Clients', to: '/clients'},
  {label: 'Orders', to: '/orders'}
]

const crmDashboards = [
  { label: 'Sales Dashboard', to: '/sales' },
  { label: 'Procurement Dashboard', to: '/procurement' },
  { label: 'GM Dashboard', to: '/gm' },
]

const reportItems = [
  { key: 'OUTSTANDING_OFFERS', label: 'Outstanding Offers' },
  { key: 'CUSTOMER_OVERDUE', label: 'متأخرات العملاء' },
  { key: 'PIPELINE', label: 'Pipeline' },
  { key: 'SALES_PERFORMANCE', label: 'Sales Performance' },
]

export default function Sidebar(){
  const [openReports, setOpenReports] = useState(false)

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 bg-white/95 backdrop-blur h-screen sticky top-0">
      <div className="p-6">
        <div className="text-lg font-semibold tracking-tight text-slate-900">QualityTrade</div>
        <div className="text-sm text-slate-500">CRM Dashboard</div>
      </div>
      <nav className="mt-2 px-3 space-y-1">
        <div className="px-4 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">CRM Dashboards</div>
        {crmDashboards.map((i) => (
          <NavLink
            key={i.to}
            to={i.to}
            className={({ isActive }) =>
              `block rounded-xl px-4 py-2 text-sm transition ${isActive ? 'bg-slate-900 font-medium text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`
            }
          >
            {i.label}
          </NavLink>
        ))}

        <div className="mt-3 px-4 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Core</div>
        {items.map(i=> (
          <NavLink key={i.to} to={i.to} className={({isActive})=>
            `block rounded-xl px-4 py-2 text-sm transition ${isActive ? 'bg-slate-100 font-medium text-slate-900' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            {i.label}
          </NavLink>
        ))}

        <div className="pt-2">
          <button
            onClick={() => setOpenReports(s => !s)}
            className="w-full rounded-xl px-4 py-2 text-left text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            Reports
          </button>

          {openReports && (
            <div className="pl-4 pr-1 pb-2 space-y-1">
              <Link to="/reports" className="block rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-900">All Reports</Link>
              {reportItems.map(r => (
                <Link
                  key={r.key}
                  to={`/reports?report=${r.key}`}
                  className="block rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                >
                  {r.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>
    </aside>
  )
}
