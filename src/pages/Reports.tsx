import React, { useMemo, useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import OutstandingOffersPage from '../features/reports/OutstandingOffersPage'
import CustomerOverduePage from '../features/reports/CustomerOverduePage'

type ReportKey = 'OUTSTANDING_OFFERS' | 'PIPELINE' | 'SALES_PERFORMANCE' | 'CUSTOMER_OVERDUE'

const reports: { key: ReportKey; label: string }[] = [
  { key: 'OUTSTANDING_OFFERS', label: 'Outstanding Offers Report' },
  { key: 'CUSTOMER_OVERDUE', label: 'متأخرات العملاء' },
  { key: 'PIPELINE', label: 'Pipeline Report' },
  { key: 'SALES_PERFORMANCE', label: 'Sales Performance Report' },
]

export default function Reports(){
  const location = useLocation()
  const navigate = useNavigate()

  const getReportFromSearch = (): ReportKey => {
    const qp = new URLSearchParams(location.search).get('report')
    if (qp === 'PIPELINE' || qp === 'SALES_PERFORMANCE' || qp === 'CUSTOMER_OVERDUE') return qp
    return 'OUTSTANDING_OFFERS'
  }

  const [activeReport, setActiveReport] = useState<ReportKey>(getReportFromSearch)

  useEffect(() => {
    const qp = new URLSearchParams(location.search).get('report')
    if (!qp) return
    if (qp === 'PIPELINE' || qp === 'SALES_PERFORMANCE' || qp === 'OUTSTANDING_OFFERS' || qp === 'CUSTOMER_OVERDUE') {
      setActiveReport(qp)
    }
  }, [location.search])

  const content = useMemo(() => {
    if (activeReport === 'OUTSTANDING_OFFERS') {
      return <OutstandingOffersPage />
    }

    if (activeReport === 'CUSTOMER_OVERDUE') {
      return <CustomerOverduePage />
    }

    if (activeReport === 'PIPELINE') {
      return (
        <div className="card p-4">
          <h3 className="mb-2 text-lg font-semibold text-slate-900">Pipeline Report</h3>
          <p className="text-sm text-slate-500">Placeholder for upcoming report.</p>
        </div>
      )
    }

    return (
      <div className="card p-4">
        <h3 className="mb-2 text-lg font-semibold text-slate-900">Sales Performance Report</h3>
        <p className="text-sm text-slate-500">Placeholder for upcoming report.</p>
      </div>
    )
  }, [activeReport])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">Reports & Analytics</h2>
          <p className="text-sm text-slate-500">Choose a report and keep the layout consistent across views.</p>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="report-selector" className="text-sm text-slate-600">Report</label>
          <select
            id="report-selector"
            className="field min-w-56"
            value={activeReport}
            onChange={(e) => {
              const value = e.target.value as ReportKey
              setActiveReport(value)
              navigate(`/reports?report=${value}`)
            }}
          >
            {reports.map((r) => (
              <option key={r.key} value={r.key}>{r.label}</option>
            ))}
          </select>
        </div>
      </div>

      {content}
    </div>
  )
}
