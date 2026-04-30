import React from 'react'

type Tone = 'success' | 'warning' | 'danger' | 'info' | 'neutral'
type Size = 'sm' | 'md'

type Props = {
  label: string
  tone?: Tone
  size?: Size
}

const toneStyles: Record<Tone, string> = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-700',
  danger: 'border-rose-200 bg-rose-50 text-rose-700',
  info: 'border-sky-200 bg-sky-50 text-sky-700',
  neutral: 'border-slate-200 bg-slate-100 text-slate-700',
}

const sizeStyles: Record<Size, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
}

export default function StatusBadge({ label, tone = 'neutral', size = 'md' }: Props) {
  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium whitespace-nowrap ${toneStyles[tone]} ${sizeStyles[size]}`}
    >
      {label}
    </span>
  )
}
