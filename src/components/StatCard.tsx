import React from 'react'

type Tone = 'default' | 'success' | 'warning' | 'danger' | 'info'

type Props = {
  title: string
  value: string
  subtitle?: string
  trend?: string
  tone?: Tone
  onClick?: () => void
}

const toneStyles: Record<Tone, string> = {
  default: 'border-slate-200',
  success: 'border-emerald-200',
  warning: 'border-amber-200',
  danger: 'border-rose-200',
  info: 'border-sky-200',
}

function getTrendTone(trend: string): string {
  if (trend.startsWith('+')) return 'bg-emerald-50 text-emerald-700'
  if (trend.startsWith('-')) return 'bg-rose-50 text-rose-700'
  return 'bg-slate-100 text-slate-700'
}

export default function StatCard({
  title,
  value,
  subtitle,
  trend,
  tone = 'default',
  onClick,
}: Props) {
  const interactive = Boolean(onClick)

  return (
    <button
      type="button"
      className={`card w-full p-4 text-left transition ${toneStyles[tone]} ${
        interactive ? 'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-300' : 'cursor-default'
      }`}
      onClick={onClick}
      disabled={!interactive}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{value}</p>
          {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
        </div>
        {trend ? <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${getTrendTone(trend)}`}>{trend}</span> : null}
      </div>
    </button>
  )
}
