import React, { useMemo, useState } from 'react'

export type SortDirection = 'asc' | 'desc'

export type DataTableColumn<T> = {
  key: string
  header: string
  width?: number | string
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
  render?: (row: T) => React.ReactNode
  sortValue?: (row: T) => string | number
}

type SortState = {
  key?: string
  direction: SortDirection
}

type Props<T> = {
  columns: DataTableColumn<T>[]
  rows: T[]
  rowKey: (row: T, index: number) => string
  emptyMessage?: string
  initialSort?: { key: string; direction?: SortDirection }
  className?: string
  onRowClick?: (row: T) => void
}

function sortRows<T>(rows: T[], columns: DataTableColumn<T>[], sortState: SortState): T[] {
  if (!sortState.key) return rows
  const activeColumn = columns.find((col) => col.key === sortState.key)
  if (!activeColumn) return rows

  return [...rows].sort((a, b) => {
    const aValue = activeColumn.sortValue
      ? activeColumn.sortValue(a)
      : String(activeColumn.render ? activeColumn.render(a) : '')
    const bValue = activeColumn.sortValue
      ? activeColumn.sortValue(b)
      : String(activeColumn.render ? activeColumn.render(b) : '')

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortState.direction === 'asc' ? aValue - bValue : bValue - aValue
    }

    const result = String(aValue).localeCompare(String(bValue))
    return sortState.direction === 'asc' ? result : -result
  })
}

function getAlignmentClass(align?: 'left' | 'center' | 'right') {
  if (align === 'center') return 'text-center'
  if (align === 'right') return 'text-right'
  return 'text-left'
}

export default function DataTable<T>({
  columns,
  rows,
  rowKey,
  emptyMessage = 'No data available.',
  initialSort,
  className,
  onRowClick,
}: Props<T>) {
  const [sortState, setSortState] = useState<SortState>({
    key: initialSort?.key,
    direction: initialSort?.direction ?? 'asc',
  })

  const sortedRows = useMemo(() => sortRows(rows, columns, sortState), [rows, columns, sortState])

  return (
    <div className={className ?? ''}>
      <div className="overflow-auto rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full table-auto">
          <thead className="sticky top-0 z-10 bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  style={{ width: column.width }}
                  className={`border-b border-slate-200 px-3 py-3 text-sm font-semibold text-slate-600 ${getAlignmentClass(column.align)}`}
                >
                  <div
                    className={`flex items-center gap-2 ${
                      column.align === 'right' ? 'justify-end' : column.align === 'center' ? 'justify-center' : 'justify-start'
                    }`}
                  >
                    <span>{column.header}</span>
                    {column.sortable ? (
                      <button
                        type="button"
                        className="text-xs text-slate-500"
                        onClick={() => {
                          setSortState((current) => {
                            if (current.key === column.key) {
                              return { key: column.key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
                            }
                            return { key: column.key, direction: 'asc' }
                          })
                        }}
                      >
                        {sortState.key === column.key ? (sortState.direction === 'asc' ? '↑' : '↓') : '↕'}
                      </button>
                    ) : null}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-3 py-8 text-center text-sm text-slate-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sortedRows.map((row, index) => (
                <tr
                  key={rowKey(row, index)}
                  className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'} ${onRowClick ? 'cursor-pointer hover:bg-slate-100/80' : ''}`}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  onKeyDown={
                    onRowClick
                      ? (event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault()
                            onRowClick(row)
                          }
                        }
                      : undefined
                  }
                  role={onRowClick ? 'button' : undefined}
                  tabIndex={onRowClick ? 0 : undefined}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      style={{ width: column.width }}
                      className={`border-b border-slate-100 px-3 py-3 align-middle text-sm text-slate-700 ${getAlignmentClass(column.align)}`}
                    >
                      {column.render ? column.render(row) : null}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
