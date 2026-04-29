import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Dashboard from './pages/Dashboard'
import Employees from './pages/Employees'
import Reports from './pages/Reports'
import Clients from './pages/Clients'
import Orders from './pages/Orders'

export default function App(){
  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard/>} />
            <Route path="/employees" element={<Employees/>} />
            <Route path="/reports" element={<Reports/>} />
            <Route path="/clients" element={<Clients/>} />
            <Route path="/orders" element={<Orders/>} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
