/**
 * Dynamic column generator for Overdue Report
 * Generates columns based on available months
 */

import type { Column } from './columnsConfig';
import type { OverdueRecord } from './overdueTypes';
import { formatMonthHeader, getMonthValue, formatCurrency, getRowTotal } from './overdueUtils';

/**
 * Generate static columns (first 5 columns)
 */
export function getStaticColumns(): Column<OverdueRecord>[] {
  return [
    {
      key: 'id',
      title: 'م',
      width: 60,
      sortable: true,
      render: (row) => row.id,
    },
    {
      key: 'clientName',
      title: 'اسم العميل',
      width: 180,
      sortable: true,
      render: (row) => row.clientName,
    },
    {
      key: 'salesName',
      title: 'السيلز',
      width: 140,
      sortable: true,
      render: (row) => row.salesName,
    },
    {
      key: 'creditRating',
      title: 'تصنيف العميل الائتمانى',
      width: 140,
      sortable: true,
      render: (row) => row.creditRating,
    },
    {
      key: 'guarantees',
      title: 'الضمانات المقرره',
      width: 140,
      sortable: true,
      render: (row) => row.guarantees,
    },
  ];
}

/**
 * Generate dynamic columns for each month
 */
export function getDynamicMonthColumns(months: string[]): Column<OverdueRecord>[] {
  return months.map((monthKey) => ({
    key: `month_${monthKey}`,
    title: formatMonthHeader(monthKey),
    width: 130,
    sortable: false,
    render: (row) => {
      const value = getMonthValue(row, monthKey);
      return value === 0 ? '-' : formatCurrency(value);
    },
  }));
}

/**
 * Generate total column
 */
export function getTotalColumn(): Column<OverdueRecord> {
  return {
    key: 'total',
    title: 'الاجمالي',
    width: 130,
    sortable: false,
    render: (row) => formatCurrency(getRowTotal(row)),
  };
}

/**
 * Get all columns for overdue report
 */
export function getOverdueReportColumns(months: string[]): Column<OverdueRecord>[] {
  const staticCols = getStaticColumns();
  const dynamicCols = getDynamicMonthColumns(months);
  const totalCol = getTotalColumn();

  return [...staticCols, ...dynamicCols, totalCol];
}
