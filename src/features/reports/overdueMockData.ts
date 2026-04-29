/**
 * Mock data for Customer Overdue Report (متأخرات العملاء حتى تاريخ اليوم)
 */

import type { OverdueRecord } from './overdueTypes';

export const overdueMockData: OverdueRecord[] = [
  {
    id: 1,
    clientName: 'شركة النيل للتوزيع',
    salesName: 'أحمد محمود',
    creditRating: 'ممتاز',
    guarantees: 'شيك',
    monthlyOverdue: {
      '2025-01': 5000,
      '2025-02': 3000,
      '2025-03': 0,
      '2025-04': 1500,
    },
  },
  {
    id: 2,
    clientName: 'مصنع الإسكندرية للمنتجات',
    salesName: 'فاطمة أحمد',
    creditRating: 'جيد جداً',
    guarantees: 'كمبيالة',
    monthlyOverdue: {
      '2025-01': 2000,
      '2025-02': 2500,
      '2025-03': 1000,
      '2025-04': 500,
    },
  },
  {
    id: 3,
    clientName: 'تجارة القاهرة الحديثة',
    salesName: 'محمد علي',
    creditRating: 'جيد',
    guarantees: 'ضمان بنكي',
    monthlyOverdue: {
      '2025-01': 7500,
      '2025-02': 5000,
      '2025-03': 2500,
      '2025-04': 0,
    },
  },
  {
    id: 4,
    clientName: 'شركة الصناعات المتحدة',
    salesName: 'سارة خالد',
    creditRating: 'مقبول',
    guarantees: 'سند إذني',
    monthlyOverdue: {
      '2025-01': 3500,
      '2025-02': 3500,
      '2025-03': 3500,
      '2025-04': 3500,
    },
  },
  {
    id: 5,
    clientName: 'مؤسسة التجارة العالمية',
    salesName: 'علي محمد',
    creditRating: 'ممتاز',
    guarantees: 'شيك مصرفي',
    monthlyOverdue: {
      '2025-01': 1000,
      '2025-02': 0,
      '2025-03': 2000,
      '2025-04': 1000,
    },
  },
  {
    id: 6,
    clientName: 'الشركة الهندسية الحديثة',
    salesName: 'نور الدين',
    creditRating: 'جيد جداً',
    guarantees: 'كفالة',
    monthlyOverdue: {
      '2025-01': 4500,
      '2025-02': 3000,
      '2025-03': 1500,
      '2025-04': 0,
    },
  },
  {
    id: 7,
    clientName: 'تجارة الإسكندرية',
    salesName: 'ليلى أحمد',
    creditRating: 'جيد',
    guarantees: 'ضمان',
    monthlyOverdue: {
      '2025-01': 2500,
      '2025-02': 2500,
      '2025-03': 0,
      '2025-04': 2500,
    },
  },
  {
    id: 8,
    clientName: 'مصنع القليوبية للمنتجات',
    salesName: 'إبراهيم سالم',
    creditRating: 'ممتاز',
    guarantees: 'شيك',
    monthlyOverdue: {
      '2025-01': 6000,
      '2025-02': 4000,
      '2025-03': 2000,
      '2025-04': 1000,
    },
  },
];
