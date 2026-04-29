import React from 'react';
import type { Status } from '../features/reports/types';

const tabs: { key: 'ALL' | Status; label: string; color: string }[] = [
  { key: 'ALL', label: 'All', color: 'bg-gray-200' },
  { key: 'PENDING', label: 'Pending', color: 'bg-yellow-200' },
  { key: 'REFUSED', label: 'Refused', color: 'bg-red-200' },
  { key: 'PROFITED', label: 'Profited', color: 'bg-green-200' },
];

type Props = {
  value: 'ALL' | Status;
  onChange: (s: 'ALL' | Status) => void;
};

export default function StatusTabs({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition ${value === t.key ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
        >
          <span className={`inline-block h-2.5 w-2.5 rounded-full ${value === t.key ? 'bg-white' : 'bg-slate-300'}`} />
          {t.label}
        </button>
      ))}
    </div>
  );
}
