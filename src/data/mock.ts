export const kpis = {
  revenue: '$1,240,300',
  growth: '+6.4%',
  clients: 482,
  pendingOrders: 21,
  employeeScore: '84'
}

export const salesSeries = [
  {label:'Jan', value: 80000},
  {label:'Feb', value: 92000},
  {label:'Mar', value: 75000},
  {label:'Apr', value: 98000},
  {label:'May', value: 120000},
  {label:'Jun', value: 132000}
]

export const categoryData = [
  {name:'Office Supplies', value: 420000},
  {name:'Industrial Tools', value: 320000},
  {name:'Packaging', value: 180000},
  {name:'Safety', value: 200000}
]

export type Employee = {
  id: string
  name: string
  role: string
  department: string
  status: 'Active'|'Inactive'
  score: number
}

export const employees: Employee[] = [
  {id:'e1', name:'Alice Johnson', role:'Sales Manager', department:'Sales', status:'Active', score:92},
  {id:'e2', name:'Bob Smith', role:'Account Executive', department:'Sales', status:'Active', score:79},
  {id:'e3', name:'Chen Li', role:'Warehouse Lead', department:'Operations', status:'Active', score:85},
  {id:'e4', name:'Dina Torres', role:'Support', department:'Customer Success', status:'Inactive', score:68}
]

export const clients = [
  {id:'c1', company:'Acme Co', contact:'John Doe', status:'Active', totalOrders: 34},
  {id:'c2', company:'Beta Logistics', contact:'Sara Lee', status:'Active', totalOrders: 19}
]

export const orders = [
  {id:'o1001', client:'Acme Co', status:'Pending', amount: 4200, date:'2026-04-10'},
  {id:'o1002', client:'Beta Logistics', status:'Completed', amount: 15000, date:'2026-03-28'}
]
