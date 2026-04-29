import create from 'zustand'
import { employees as empMock, Employee } from '../data/mock'

type State = {
  employees: Employee[]
  addEmployee: (e: Employee)=>void
  updateEmployee: (id:string, patch:Partial<Employee>)=>void
  deleteEmployee: (id:string)=>void
}

export const useStore = create<State>((set)=>({
  employees: empMock,
  addEmployee: (e)=> set((s)=> ({ employees: [e, ...s.employees]})),
  updateEmployee: (id, patch)=> set((s)=> ({ employees: s.employees.map(x=> x.id===id? {...x,...patch}:x)})),
  deleteEmployee: (id)=> set((s)=> ({ employees: s.employees.filter(x=> x.id!==id)}))
}))
