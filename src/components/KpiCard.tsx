import React from 'react'

type Props = {
  title: string
  value: string
  delta?: string
  hint?: string
}

export default function KpiCard({title, value, delta, hint}: Props){
  return (
    <div className="card w-full p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">{title}</div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{value}</div>
        </div>
        {delta && (
          <div className={`rounded-full px-2.5 py-1 text-xs font-medium ${delta.startsWith('-') ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
            {delta}
          </div>
        )}
      </div>
      {hint && <div className="mt-3 text-xs text-slate-500">{hint}</div>}
    </div>
  )
}
