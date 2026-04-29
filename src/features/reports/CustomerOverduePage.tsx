/**
 * Customer Overdue Report Page (متأخرات العملاء حتى تاريخ اليوم)
 * Main component that displays the financial report with filtering and sorting
 */

import React, { useMemo, useState } from 'react';
import ReportTable from '../../components/ReportTable';
import type { Column, SortState } from '../../components/ReportTable';
import type { OverdueRecord, OverdueTotals } from './overdueTypes';
import { overdueMockData } from './overdueMockData';
import {
  extractMonthsFromData,
  getColumnTotals,
  getRowTotal,
  formatCurrency,
  formatNumber,
  getMonthValue,
} from './overdueUtils';
import { getOverdueReportColumns, formatMonthHeader } from './overdueColumns';
import {
  filterRecords,
  getUniqueCreditRatings,
  getDefaultFilters,
  getCreditRatingColor,
  getCreditRatingIcon,
  type FilterState,
} from './overdueFilters';

/**
 * Row data with total included for rendering
 */
type RowWithTotal = OverdueRecord & { __total: number };

/**
 * Total row pseudo-record for displaying footer
 */
const createTotalRow = (totals: OverdueTotals, months: string[]): RowWithTotal => {
  const monthlyData: Record<string, number> = {};
  months.forEach((month) => {
    monthlyData[month] = totals[month];
  });

  return {
    id: 0,
    clientName: 'الإجمالي',
    salesName: '',
    creditRating: '',
    guarantees: '',
    monthlyOverdue: monthlyData,
    __total: totals.total,
  };
};

export default function CustomerOverduePage() {
  const [filters, setFilters] = useState<FilterState>(getDefaultFilters());
  const [sort, setSort] = useState<SortState>({});

  // Get base data with filtering applied
  const filteredAndSorted = useMemo(() => {
    const filtered = filterRecords(overdueMockData, filters);
    const months = extractMonthsFromData(filtered);
    const columns = getOverdueReportColumns(months);
    const totals = getColumnTotals(filtered, months);

    const totalRow: any = createTotalRow(totals, months);
    return {
      records: filtered,
      columns,
      totals,
      months,
      totalRow,
    };
  }, [filters]);

  // Calculate summary stats
  const stats = useMemo(() => {
    const totalRecords = filteredAndSorted.records.length;
    const totalSum = Object.values(filteredAndSorted.totals)
      .slice(0, -1)
      .reduce((sum, val) => sum + val, 0);

    return {
      filteredCount: totalRecords,
      totalCount: overdueMockData.length,
      total: totalSum,
    };
  }, [filteredAndSorted]);

  const uniqueRatings = useMemo(
    () => getUniqueCreditRatings(overdueMockData),
    []
  );

  const data = [...filteredAndSorted.records, filteredAndSorted.totalRow];

  // Reset filters
  const handleResetFilters = () => {
    setFilters(getDefaultFilters());
    setSort({});
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6" dir="rtl">
      <div className="mx-auto max-w-full space-y-6">
        <div>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">متأخرات العملاء حتى تاريخ اليوم</h1>
              <p className="mt-1 text-slate-500">تقرير الأرصدة المتأخرة للعملاء موزعة حسب الشهور</p>
            </div>
            <button
              onClick={handleResetFilters}
              className="button"
            >
              إعادة تعيين الفلاتر
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="card p-5">
            <h3 className="mb-2 text-sm font-medium text-slate-500">إجمالي المتأخرات</h3>
            <p className="text-2xl font-semibold tracking-tight text-slate-900">{formatCurrency(stats.total)}</p>
          </div>

          <div className="card p-5">
            <h3 className="mb-2 text-sm font-medium text-slate-500">العملاء المعروضة</h3>
            <p className="text-2xl font-semibold tracking-tight text-slate-900">{formatNumber(stats.filteredCount)}</p>
          </div>

          <div className="card p-5">
            <h3 className="mb-2 text-sm font-medium text-slate-500">إجمالي العملاء</h3>
            <p className="text-2xl font-semibold tracking-tight text-slate-900">{formatNumber(stats.totalCount)}</p>
          </div>

          <div className="card p-5">
            <h3 className="mb-2 text-sm font-medium text-slate-500">عدد الشهور</h3>
            <p className="text-2xl font-semibold tracking-tight text-slate-900">{formatNumber(filteredAndSorted.months.length)}</p>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">الفلاتر</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                البحث (اسم العميل أو السيلز)
              </label>
              <input
                type="text"
                placeholder="اكتب للبحث..."
                value={filters.searchText}
                onChange={(e) => setFilters({ ...filters, searchText: e.target.value })}
                className="field"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                التصنيف الائتماني
              </label>
              <select
                value={filters.creditRating}
                onChange={(e) => setFilters({ ...filters, creditRating: e.target.value })}
                className="field bg-white"
              >
                <option value="">الكل</option>
                {uniqueRatings.map((rating) => (
                  <option key={rating} value={rating}>
                    {rating}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                الحد الأدنى للمتأخرات
              </label>
              <input
                type="number"
                placeholder="0"
                value={filters.minTotal}
                onChange={(e) =>
                  setFilters({ ...filters, minTotal: Math.max(0, parseInt(e.target.value) || 0) })
                }
                className="field"
              />
            </div>
          </div>

          {(filters.searchText || filters.creditRating || filters.minTotal > 0) && (
            <div className="mt-4 border-t border-slate-200 pt-4">
              <p className="mb-2 text-sm text-slate-500">الفلاتر النشطة:</p>
              <div className="flex flex-wrap gap-2">
                {filters.searchText && (
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                    بحث: {filters.searchText}
                    <button
                      onClick={() => setFilters({ ...filters, searchText: '' })}
                      className="mr-2 text-slate-500 hover:text-slate-900"
                    >
                      ✕
                    </button>
                  </span>
                )}
                {filters.creditRating && (
                  <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${getCreditRatingColor(filters.creditRating)}`}>
                    {getCreditRatingIcon(filters.creditRating)} {filters.creditRating}
                    <button
                      onClick={() => setFilters({ ...filters, creditRating: '' })}
                      className="mr-2 text-slate-500 hover:text-slate-900"
                    >
                      ✕
                    </button>
                  </span>
                )}
                {filters.minTotal > 0 && (
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                    الحد الأدنى: {formatCurrency(filters.minTotal)}
                    <button
                      onClick={() => setFilters({ ...filters, minTotal: 0 })}
                      className="mr-2 text-slate-500 hover:text-slate-900"
                    >
                      ✕
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="card overflow-hidden">
          {filteredAndSorted.records.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-lg text-slate-500">لا توجد نتائج تطابق معايير البحث</p>
            </div>
          ) : (
            <EnhancedReportTable
              columns={filteredAndSorted.columns}
              data={data}
              rowKey={(row) => `${row.id}`}
              sortState={sort}
              onSortChange={setSort}
              className="w-full"
              totalRowId={filteredAndSorted.totalRow.id}
            />
          )}
        </div>

        <div className="text-center text-sm text-slate-500">
          <p>تم إنشاء التقرير: {new Date().toLocaleDateString('en-US')} | {new Date().toLocaleTimeString('en-US')}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Enhanced ReportTable component with better visual design
 */
function EnhancedReportTable<T extends { id: number; creditRating?: string }>({
  columns,
  data,
  rowKey,
  sortState,
  onSortChange,
  className,
  totalRowId,
}: any) {
  const [internalSort, setInternalSort] = React.useState<SortState>(sortState || {});
  const sort = sortState ?? internalSort;
  const updateSort = (next: SortState | ((current: SortState) => SortState)) => {
    const resolved = typeof next === 'function' ? next(sort) : next;
    if (onSortChange) {
      onSortChange(resolved);
      return;
    }
    setInternalSort(resolved);
  };

  return (
    <div className={className ?? ''}>
      <div className="overflow-x-auto border-t border-slate-200">
        <table className="min-w-full table-auto">
          <thead className="sticky top-0 z-10 bg-slate-50">
            <tr>
              {columns.map((col: any) => (
                <th
                  key={String(col.key)}
                  style={{ width: col.width, minWidth: col.width }}
                  className="border-b border-slate-200 px-4 py-3 text-right font-semibold text-slate-600"
                >
                  <div className="flex items-center gap-2 justify-end">
                    <span>{col.title}</span>
                    {col.sortable ? (
                      <button
                        onClick={() =>
                          updateSort((s: any) => {
                            if (s.key === String(col.key)) {
                              return { key: String(col.key), dir: s.dir === 'asc' ? 'desc' : 'asc' };
                            }
                            return { key: String(col.key), dir: 'asc' };
                          })
                        }
                        className="text-sm text-slate-500 transition-colors hover:text-slate-900"
                        title="Click to sort"
                      >
                        {sort.key === String(col.key) ? (
                          sort.dir === 'asc' ? '↑' : '↓'
                        ) : (
                          '⇅'
                        )}
                      </button>
                    ) : null}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row: any, idx: number) => {
              const isTotal = row.id === totalRowId;
              return (
                <tr
                  key={rowKey ? rowKey(row) : idx}
                  className={`
                    ${isTotal
                      ? 'bg-slate-100 font-bold'
                      : idx % 2 === 0
                        ? 'bg-white hover:bg-slate-50'
                        : 'bg-slate-50/60 hover:bg-slate-50'
                    } transition-colors border-b border-slate-200
                  `}
                >
                  {columns.map((col: any) => {
                    const k = col.key as keyof T;
                    let cell = col.render ? col.render(row) : (row as any)[k];

                    // Special rendering for credit rating with badge
                    if (col.key === 'creditRating' && row.creditRating && !isTotal) {
                      const rating = row.creditRating;
                      cell = (
                        <div
                          className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-sm font-medium whitespace-nowrap ${getCreditRatingColor(rating)}`}
                        >
                          <span>{getCreditRatingIcon(rating)}</span>
                          <span>{rating}</span>
                        </div>
                      );
                    }

                    const text = typeof cell === 'string' || typeof cell === 'number' ? String(cell) : '';

                    return (
                      <td
                        key={String(col.key)}
                        style={{ width: col.width, minWidth: col.width }}
                        className={`px-4 py-3 align-middle text-sm border-b border-slate-100 ${
                          isTotal ? 'text-right font-semibold text-slate-900' : 'text-slate-700'
                        }`}
                      >
                        <div
                          className="truncate"
                          title={text}
                          style={{ maxWidth: col.width || 200 }}
                        >
                          {cell}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
