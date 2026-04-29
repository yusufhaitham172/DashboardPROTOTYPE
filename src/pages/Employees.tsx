import React, {useState} from 'react'
import { useStore } from '../store/useStore'

export default function Employees(){
  const employees = useStore(s=>s.employees)
  const deleteEmployee = useStore(s=>s.deleteEmployee)
  const [q, setQ] = useState('')

  const filtered = employees.filter(e=> e.name.toLowerCase().includes(q.toLowerCase()) || e.department.toLowerCase().includes(q.toLowerCase()))

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">Employees</h2>
        <div className="flex gap-2">
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by name or dept" className="field w-64" />
          <button className="button-primary">Add</button>
        </div>
      </div>

      <div className="card overflow-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-sm text-slate-500">
              <th className="p-3">Name</th>
              <th>Role</th>
              <th>Department</th>
              <th>Status</th>
              <th>Score</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(e=> (
              <tr key={e.id} className="border-t border-slate-100">
                <td className="p-3">{e.name}</td>
                <td>{e.role}</td>
                <td>{e.department}</td>
                <td>{e.status}</td>
                <td>{e.score}</td>
                <td className="text-right">
                  <button onClick={()=>deleteEmployee(e.id)} className="text-sm text-rose-600 hover:text-rose-700">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
