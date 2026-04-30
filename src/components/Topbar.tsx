import React from 'react'
import { useLocation } from 'react-router-dom'

const ROLE_KEY = 'dashboard:role'
type RoleOption = { id: string; label: string; mode: string }
const ROLE_OPTIONS: RoleOption[] = [
  { id: 'gm', label: 'General Manager', mode: 'Control Tower' },
  { id: 'sales', label: 'Sales Lead', mode: 'Execution Control' },
  { id: 'procurement', label: 'Procurement Lead', mode: 'Pricing Intelligence' },
]

function getRoleByPath(pathname: string) {
  if (pathname.startsWith('/sales')) {
    return { role: 'Sales Lead', mode: 'Execution Control' }
  }

  if (pathname.startsWith('/procurement')) {
    return { role: 'Procurement Lead', mode: 'Pricing Intelligence' }
  }

  if (pathname.startsWith('/gm')) {
    return { role: 'General Manager', mode: 'Control Tower' }
  }

  return { role: 'Admin', mode: 'General Workspace' }
}

export default function Topbar(){
  const location = useLocation()
  const routeInfo = getRoleByPath(location.pathname)

  const [roleId, setRoleId] = React.useState<string>(() => {
    try {
      const stored = localStorage.getItem(ROLE_KEY)
      if (stored) return stored
    } catch (e) {
      /* ignore */
    }
    // default from route
    if (routeInfo.role === 'Sales Lead') return 'sales'
    if (routeInfo.role === 'Procurement Lead') return 'procurement'
    if (routeInfo.role === 'General Manager') return 'gm'
    return 'gm'
  })

  const current = ROLE_OPTIONS.find((r) => r.id === roleId) ?? ROLE_OPTIONS[0]

  React.useEffect(() => {
    try {
      localStorage.setItem(ROLE_KEY, roleId)
    } catch (e) {
      /* ignore */
    }
  }, [roleId])

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-slate-50/90 px-4 py-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-4 min-w-0">
        <input placeholder="Search..." className="field w-64 max-w-[40vw]" />
        <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 md:flex">
          <span className="h-2 w-2 rounded-full bg-blue-500" />
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">Role Mode</span>
          <span className="text-xs font-semibold text-slate-800">{current.mode}</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="button-ghost px-2">🔔</button>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full border border-slate-200 bg-slate-100" />
          <div className="hidden sm:block">
            <div className="text-sm font-medium text-slate-700">{current.label}</div>
            <div className="text-xs text-slate-500">Mock User</div>
          </div>

          <div>
            <label className="sr-only">Select role</label>
            <select
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              className="field bg-white text-sm"
              aria-label="Select role"
            >
              {ROLE_OPTIONS.map((r) => (
                <option key={r.id} value={r.id}>{r.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  )
}
