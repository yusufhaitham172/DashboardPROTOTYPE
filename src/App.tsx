import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from './components/DashboardLayout'
import Dashboard from './pages/Dashboard'
import Employees from './pages/Employees'
import Reports from './pages/Reports'
import Clients from './pages/Clients'
import Orders from './pages/Orders'
import SalesDashboard from './pages/SalesDashboard'
import ProcurementDashboard from './pages/ProcurementDashboard'
import GmDashboard from './pages/GmDashboard'

export default function App(){
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/employees" element={<Employees/>} />
        <Route path="/reports" element={<Reports/>} />
        <Route path="/clients" element={<Clients/>} />
        <Route path="/orders" element={<Orders/>} />
        <Route path="/sales" element={<SalesDashboard />} />
        <Route path="/procurement" element={<ProcurementDashboard />} />
        <Route path="/gm" element={<GmDashboard />} />
      </Routes>
    </DashboardLayout>
  )
}
