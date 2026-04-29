/**
 * Utility functions for Overdue Report calculations
 * Handles all business logic separately from UI
 */

import type { OverdueRecord, OverdueTotals } from './overdueTypes';

/**
 * Extract unique months from all records, sorted chronologically
 */
export function extractMonthsFromData(records: OverdueRecord[]): string[] {
  const monthSet = new Set<string>();
  
  records.forEach((record) => {
    Object.keys(record.monthlyOverdue).forEach((month) => {
      monthSet.add(month);
    });
  });

  return Array.from(monthSet).sort(); // Chronological order
}

/**
 * Calculate total overdue for a single record across all months
 */
export function getRowTotal(record: OverdueRecord): number {
  return Object.values(record.monthlyOverdue).reduce((sum, amount) => sum + amount, 0);
}

/**
 * Calculate column totals (sum for each month + overall total)
 */
export function getColumnTotals(
  records: OverdueRecord[],
  months: string[]
): OverdueTotals {
  const totals: OverdueTotals = { total: 0 };

  // Sum each month column
  months.forEach((month) => {
    totals[month] = records.reduce((sum, record) => {
      return sum + (record.monthlyOverdue[month] || 0);
    }, 0);
    totals.total += totals[month];
  });

  return totals;
}

/**
 * Format currency in English locale (no Arabic numerals)
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Convert month key (e.g., "2025-01") to Arabic month name
 */
export function formatMonthHeader(monthKey: string): string {
  const [year, month] = monthKey.split('-');
  const monthIndex = parseInt(month, 10) - 1;
  
  const arabicMonths = [
    'يناير', // January
    'فبراير', // February
    'مارس', // March
    'إبريل', // April
    'مايو', // May
    'يونيو', // June
    'يوليو', // July
    'أغسطس', // August
    'سبتمبر', // September
    'أكتوبر', // October
    'نوفمبر', // November
    'ديسمبر', // December
  ];

  return `${arabicMonths[monthIndex]} ${year}`;
}

/**
 * Get a specific month value for a record, or 0 if not found
 */
export function getMonthValue(record: OverdueRecord, monthKey: string): number {
  return record.monthlyOverdue[monthKey] || 0;
}

/**
 * Format any number in English format (no Arabic numerals)
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
