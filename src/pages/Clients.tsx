import React from 'react'
import { clients } from '../data/mock'

export default function Clients(){
  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold tracking-tight text-slate-900">Clients</h2>
      <div className="card">
        <table className="w-full text-left">
          <thead className="text-sm text-slate-500">
            <tr><th className="p-3">Company</th><th>Contact</th><th>Status</th><th>Total Orders</th></tr>
          </thead>
          <tbody>
            {clients.map(c=> (
              <tr key={c.id} className="border-t border-slate-100"><td className="p-3">{c.company}</td><td>{c.contact}</td><td>{c.status}</td><td>{c.totalOrders}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
