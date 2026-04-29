/**
 * Types for Customer Overdue Report (متأخرات العملاء حتى تاريخ اليوم)
 */

export type OverdueRecord = {
  id: number;
  clientName: string; // اسم العميل
  salesName: string; // السيلز
  creditRating: string; // تصنيف العميل الائتمانى
  guarantees: string; // الضمانات المقرره
  monthlyOverdue: Record<string, number>; // e.g., { "2025-01": 1000, "2025-02": 500 }
};

export type OverdueData = {
  records: OverdueRecord[];
  months: string[]; // sorted months like ["2025-01", "2025-02", "2025-03"]
};

export type OverdueTotals = {
  [monthKey: string]: number;
  total: number;
};
