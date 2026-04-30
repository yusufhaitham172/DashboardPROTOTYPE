import React from 'react'
import StatusBadge from './StatusBadge'

type Severity = 'high' | 'medium' | 'low'

type Props = {
  title: string
  description: string
  severity?: Severity
  meta?: string
  onClick?: () => void
}

function severityTone(severity: Severity): 'danger' | 'warning' | 'info' {
  if (severity === 'high') return 'danger'
  if (severity === 'medium') return 'warning'
  return 'info'
}

export default function AlertCard({ title, description, severity = 'medium', meta, onClick }: Props) {
  const interactive = Boolean(onClick)

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!interactive}
      className={`card w-full p-4 text-left transition ${
        interactive ? 'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-300' : 'cursor-default'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm text-slate-600">{description}</p>
          {meta ? <p className="mt-2 text-xs text-slate-500">{meta}</p> : null}
        </div>
        <StatusBadge label={severity.toUpperCase()} tone={severityTone(severity)} />
      </div>
    </button>
  )
}
