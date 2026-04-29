import React from 'react'

export default function Topbar(){
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-slate-50/90 px-4 py-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-4">
        <input placeholder="Search..." className="field w-64 max-w-[40vw]" />
      </div>
      <div className="flex items-center gap-4">
        <button className="button-ghost px-2">🔔</button>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full border border-slate-200 bg-slate-100" />
          <div className="text-sm font-medium text-slate-700">Admin</div>
        </div>
      </div>
    </header>
  )
}
