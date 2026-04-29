import { useMemo } from 'react';
import type { OfferRecord, Status } from './types';

export type Column<T> = {
  key: keyof T | string;
  title: string;
  width?: number | string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
};

const baseColumns: Column<OfferRecord>[] = [
  { key: 'salesName', title: 'اسم السيليز', width: 160, sortable: true },
  { key: 'quotationId', title: 'رقم طلب التسعير', width: 120, sortable: true },
  { key: 'quotationDetails', title: 'بيانات طلب التسعير', width: 300 },
  { key: 'quotationDate', title: 'تاريخ طلب التسعير', width: 160, sortable: true, render: (r) => r.quotationDate },
  { key: 'estimatorName', title: 'اسم القائم بالتسعير', width: 160, sortable: true },
  { key: 'clientName', title: 'اسم العميل', width: 160, sortable: true },
  { key: 'clientCode', title: 'كود العميل', width: 120, sortable: true },
  { key: 'creditRating', title: 'تصنيف العميل الائتمانى', width: 120, sortable: true },
  { key: 'totalPurchase', title: 'اجمالى الشراء', width: 120, sortable: true },
  { key: 'totalSales', title: 'اجمالى البيع', width: 120, sortable: true },
  { key: 'totalProfit', title: 'اجمالى الربح', width: 120, sortable: true },
  { key: 'paymentTerm', title: 'مده الاجل الفعليه', width: 120, sortable: true },
  { key: 'profitMargin', title: 'نسبه الربحيه', width: 120, sortable: true },
  { key: 'sentToProcurementDate', title: 'تاريخ الارسال للمشتريات', width: 160, sortable: true },
  { key: 'procurementDelayDays', title: 'عدد ايام تاخير المشتريات', width: 140, sortable: true },
  { key: 'sector', title: 'القطاع', width: 140, sortable: true },
];

export function useColumnsForStatus(status: Status) {
  return useMemo(() => {
    if (status === 'PENDING') {
      return [
        ...baseColumns,
        { key: 'followUp1', title: 'تاريخ متابعه السيلز 1', width: 160, sortable: true },
        { key: 'followUp2', title: 'تاريخ متابعه السيلز 2', width: 160, sortable: true },
        { key: 'followUp3', title: 'تاريخ متابعه السيلز 3', width: 160, sortable: true },
        { key: 'salesManagerFollowUp', title: 'تاريخ متابعه مدير المبيعات', width: 160, sortable: true },
        { key: 'gmReviewDate', title: 'تاريخ العرض على مدير الشركة', width: 160, sortable: true },
        { key: 'actionTaken', title: 'الاجراء المتخذ', width: 160 },
        { key: 'actionDate', title: 'تاريخ الاجراء', width: 140, sortable: true },
        { key: 'finalStatus', title: 'موقف العرض النهائى', width: 140 },
        { key: 'finalRejectionReason', title: 'سبب الرفض النهائى', width: 200 },
        { key: 'salesSignature', title: 'توقيع السيلز', width: 140 },
        { key: 'mainRejectionCategory', title: 'البند الرئيسى للرفض', width: 160 },
      ];
    }

    if (status === 'REFUSED') {
      return [
        ...baseColumns,
        { key: 'rejectionReason', title: 'سبب الرفض', width: 240 },
        { key: 'mainRejectionCategory', title: 'البند الرئيسى للرفض', width: 160 },
      ];
    }

    // PROFITED
    return baseColumns;
  }, [status]);
}

export type { Column };
