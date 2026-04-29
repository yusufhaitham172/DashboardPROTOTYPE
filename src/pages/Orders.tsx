import React from 'react'
import { orders } from '../data/mock'

export default function Orders(){
  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold tracking-tight text-slate-900">Orders</h2>
      <div className="card">
        <table className="w-full text-left">
          <thead className="text-sm text-slate-500"><tr><th className="p-3">Order ID</th><th>Client</th><th>Status</th><th>Amount</th><th>Date</th></tr></thead>
          <tbody>
            {orders.map(o=> (
              <tr key={o.id} className="border-t border-slate-100"><td className="p-3">{o.id}</td><td>{o.client}</td><td>{o.status}</td><td>${o.amount}</td><td>{o.date}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
