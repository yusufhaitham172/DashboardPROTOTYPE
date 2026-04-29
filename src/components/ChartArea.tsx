import React from 'react'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export function SalesLine({data}:{data:any[]}){
  return (
    <div className="card h-64 p-4">
      <div className="mb-3 text-sm font-medium text-slate-700">Sales Over Time</div>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)' }} />
          <Line type="monotone" dataKey="value" stroke="#0f172a" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

// CategoryPie removed — replaced by a focused OffersDonut for minimal dashboard

export function OffersDonut({data}:{data:any[]}){
  const colors = ['#0f172a', '#64748b', '#cbd5e1']
  const total = data.reduce((s, d) => s + (d.value || 0), 0) || 1
  const items = data.map((d) => ({ name: d.name, value: d.value || 0, pct: Math.round(((d.value || 0) / total) * 100) }))

  return (
    <div className="card p-4">
      <div className="mb-3 text-sm font-medium text-slate-700">Outstanding Offers</div>
      <div className="flex items-center gap-4">
        <div className="w-40 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={items}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={36}
                outerRadius={60}
                paddingAngle={2}
              >
                {items.map((_,i)=>(<Cell key={i} fill={colors[i%colors.length]} />))}
              </Pie>
              <Tooltip formatter={(value:number) => `${value}`} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 text-xs text-slate-600">
          {items.map((it, idx) => (
            <div key={it.name} className="flex items-center justify-between py-1">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ background: colors[idx%colors.length] }} />
                <span className="font-medium text-slate-800">{it.name}</span>
              </div>
              <div className="ml-2 text-slate-500">{it.pct}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
