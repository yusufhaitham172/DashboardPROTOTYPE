import React from 'react'

type Props = {
  open: boolean
  title: string
  onClose: () => void
  children: React.ReactNode
}

export default function DrillDownModal({ open, title, onClose, children }: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="drilldown-title">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 w-full max-w-2xl border-l border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 id="drilldown-title" className="text-base font-semibold text-slate-900">
            {title}
          </h2>
          <button type="button" onClick={onClose} className="button-ghost px-2">
            Close
          </button>
        </div>
        <div className="h-[calc(100%-65px)] overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  )
}
