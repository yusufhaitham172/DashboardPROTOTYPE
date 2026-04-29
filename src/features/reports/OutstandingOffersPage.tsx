import React, { useEffect, useMemo, useState } from 'react';
import sample from './mockData';
import { useColumnsForStatus } from './columnsConfig';
import ReportTable, { type SortState } from '../../components/ReportTable';
import StatusTabs from '../../components/StatusTabs';
import SearchBar from '../../components/SearchBar';
import type { OfferRecord, Status } from './types';

export default function OutstandingOffersPage() {
  const [statusFilter, setStatusFilter] = useState<'ALL' | Status>('ALL');
  const [query, setQuery] = useState('');
  const [sectorFilter, setSectorFilter] = useState('ALL');
  const [creditFilter, setCreditFilter] = useState('ALL');
  const [sortState, setSortState] = useState<SortState>({ key: 'quotationDate', dir: 'desc' });

  const columns = useColumnsForStatus(statusFilter === 'ALL' ? 'PENDING' : statusFilter);

  const sectors = useMemo(() => ['ALL', ...new Set(sample.map((row) => row.sector))], []);
  const creditRatings = useMemo(() => ['ALL', ...new Set(sample.map((row) => row.creditRating))], []);

  useEffect(() => {
    if (sortState.key && !columns.some((column) => String(column.key) === sortState.key)) {
      setSortState({ key: 'quotationDate', dir: 'desc' });
    }
  }, [columns, sortState.key]);

  const filtered = useMemo(() => {
    return sample.filter((r) => {
      if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
      if (sectorFilter !== 'ALL' && r.sector !== sectorFilter) return false;
      if (creditFilter !== 'ALL' && r.creditRating !== creditFilter) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        r.clientName.toLowerCase().includes(q) || r.quotationId.toLowerCase().includes(q)
      );
    }) as OfferRecord[];
  }, [statusFilter, sectorFilter, creditFilter, query]);

  const sortableColumns = useMemo(
    () => columns.filter((column) => column.sortable).map((column) => ({ key: String(column.key), title: column.title })),
    [columns]
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Outstanding Offers Report</h1>
        <p className="mt-1 text-sm text-slate-500">A compact view with simple filters and a single consistent table style.</p>
      </div>

      <div className="space-y-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <StatusTabs value={statusFilter} onChange={(v) => setStatusFilter(v)} />
          <div className="text-sm text-slate-500">Showing: {statusFilter}</div>
          <SearchBar value={query} onChange={setQuery} placeholder="Search client or quotation ID" />
        </div>

        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <select className="field" value={sectorFilter} onChange={(e) => setSectorFilter(e.target.value)}>
            {sectors.map((sector) => (
              <option key={sector} value={sector}>{sector === 'ALL' ? 'All sectors' : sector}</option>
            ))}
          </select>

          <select className="field" value={creditFilter} onChange={(e) => setCreditFilter(e.target.value)}>
            {creditRatings.map((rating) => (
              <option key={rating} value={rating}>{rating === 'ALL' ? 'All ratings' : rating}</option>
            ))}
          </select>

          <select
            className="field min-w-52"
            value={sortState.key ?? ''}
            onChange={(e) => setSortState({ key: e.target.value, dir: sortState.dir ?? 'asc' })}
          >
            {sortableColumns.map((column) => (
              <option key={column.key} value={column.key}>{`Sort by: ${column.title}`}</option>
            ))}
          </select>

          <button
            type="button"
            className="button"
            onClick={() => setSortState((current) => ({ key: current.key, dir: current.dir === 'asc' ? 'desc' : 'asc' }))}
          >
            {sortState.dir === 'asc' ? 'Ascending' : 'Descending'}
          </button>

          <button
            type="button"
            className="button"
            onClick={() => {
              setQuery('');
              setSectorFilter('ALL');
              setCreditFilter('ALL');
              setSortState({ key: 'quotationDate', dir: 'desc' });
            }}
          >
            Reset filters
          </button>
        </div>
      </div>

      <div className="card p-3">
        <ReportTable
          columns={columns}
          data={filtered}
          sortState={sortState}
          onSortChange={setSortState}
          rowKey={(r) => r.quotationId}
        />
      </div>
    </div>
  );
}
