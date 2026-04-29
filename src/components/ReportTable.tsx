import React, { useMemo, useState } from 'react';
import type { Column } from '../features/reports/columnsConfig';

export type SortDirection = 'asc' | 'desc';

export type SortState = {
  key?: string;
  dir?: SortDirection;
};

type Props<T> = {
  columns: Column<T>[];
  data: T[];
  rowKey?: (r: T) => string;
  className?: string;
  sortState?: SortState;
  onSortChange?: (sort: SortState) => void;
};

function sortData<T>(data: T[], colKey: string, direction: 'asc' | 'desc') {
  return [...data].sort((a: any, b: any) => {
    const va = a[colKey];
    const vb = b[colKey];
    if (va == null && vb == null) return 0;
    if (va == null) return direction === 'asc' ? -1 : 1;
    if (vb == null) return direction === 'asc' ? 1 : -1;
    // try number
    if (typeof va === 'number' && typeof vb === 'number') return direction === 'asc' ? va - vb : vb - va;
    // try date
    const da = Date.parse(va);
    const db = Date.parse(vb);
    if (!Number.isNaN(da) && !Number.isNaN(db)) return direction === 'asc' ? da - db : db - da;
    // fallback string
    return direction === 'asc' ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
  });
}

export default function ReportTable<T>({ columns, data, rowKey, className, sortState, onSortChange }: Props<T>) {
  const [internalSort, setInternalSort] = useState<SortState>({});
  const sort = sortState ?? internalSort;
  const updateSort = (next: SortState | ((current: SortState) => SortState)) => {
    const resolved = typeof next === 'function' ? next(sort) : next;
    if (onSortChange) {
      onSortChange(resolved);
      return;
    }
    setInternalSort(resolved);
  };

  const sorted = useMemo(() => {
    if (!sort.key) return data;
    return sortData(data as any[], sort.key, sort.dir || 'asc') as T[];
  }, [data, sort]);

  return (
    <div className={className ?? ''}>
      <div className="overflow-auto rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full table-auto">
          <thead className="sticky top-0 z-10 bg-slate-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  style={{ width: col.width }}
                  className="border-b border-slate-200 px-3 py-3 text-left text-sm font-medium text-slate-600"
                >
                  <div className="flex items-center gap-2">
                    <span>{col.title}</span>
                    {col.sortable ? (
                      <button
                        onClick={() =>
                          updateSort((s) => {
                            if (s.key === String(col.key)) {
                              return { key: String(col.key), dir: s.dir === 'asc' ? 'desc' : 'asc' };
                            }
                            return { key: String(col.key), dir: 'asc' };
                          })
                        }
                        className="text-xs text-slate-500"
                      >
                        {sort.key === String(col.key) ? (sort.dir === 'asc' ? '↑' : '↓') : '↕'}
                      </button>
                    ) : null}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, idx) => (
              <tr key={rowKey ? rowKey(row) : idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                {columns.map((col) => {
                  const k = col.key as keyof T;
                  const cell = col.render ? col.render(row) : (row as any)[k];
                  const text = typeof cell === 'string' || typeof cell === 'number' ? String(cell) : '';
                  return (
                    <td key={String(col.key)} style={{ width: col.width }} className="border-b border-slate-100 px-3 py-3 align-top text-sm text-slate-700">
                      <div className="truncate" title={text} style={{ maxWidth: col.width || 200 }}>
                        {text || cell}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
