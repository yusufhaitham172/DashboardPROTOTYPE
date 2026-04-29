/**
 * Utility functions for filtering Overdue Report data
 */

import type { OverdueRecord } from './overdueTypes';

export interface FilterState {
  searchText: string; // Search by client or sales name
  creditRating: string; // Filter by credit rating (empty = all)
  minTotal: number; // Filter by minimum total overdue
}

/**
 * Get unique credit ratings from data
 */
export function getUniqueCreditRatings(records: OverdueRecord[]): string[] {
  const ratings = new Set<string>();
  records.forEach((record) => {
    ratings.add(record.creditRating);
  });
  return Array.from(ratings).sort();
}

/**
 * Apply filters to records
 */
export function filterRecords(
  records: OverdueRecord[],
  filters: FilterState
): OverdueRecord[] {
  return records.filter((record) => {
    // Search filter (client name or sales name)
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      const matchesClient = record.clientName.toLowerCase().includes(searchLower);
      const matchesSales = record.salesName.toLowerCase().includes(searchLower);
      if (!matchesClient && !matchesSales) return false;
    }

    // Credit rating filter
    if (filters.creditRating && record.creditRating !== filters.creditRating) {
      return false;
    }

    // Minimum total filter
    if (filters.minTotal > 0) {
      const total = Object.values(record.monthlyOverdue).reduce((sum, val) => sum + val, 0);
      if (total < filters.minTotal) return false;
    }

    return true;
  });
}

/**
 * Reset filters to default
 */
export function getDefaultFilters(): FilterState {
  return {
    searchText: '',
    creditRating: '',
    minTotal: 0,
  };
}

/**
 * Credit rating badge color mapping
 */
export function getCreditRatingColor(rating: string): string {
  const colors: Record<string, string> = {
    'ممتاز': 'bg-green-100 text-green-800 border-green-300',
    'جيد جداً': 'bg-blue-100 text-blue-800 border-blue-300',
    'جيد': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'مقبول': 'bg-orange-100 text-orange-800 border-orange-300',
    'ضعيف': 'bg-red-100 text-red-800 border-red-300',
  };
  return colors[rating] || 'bg-gray-100 text-gray-800 border-gray-300';
}

/**
 * Get icon for credit rating
 */
export function getCreditRatingIcon(rating: string): string {
  const icons: Record<string, string> = {
    'ممتاز': '⭐',
    'جيد جداً': '✓✓',
    'جيد': '✓',
    'مقبول': '~',
    'ضعيف': '⚠',
  };
  return icons[rating] || '•';
}
