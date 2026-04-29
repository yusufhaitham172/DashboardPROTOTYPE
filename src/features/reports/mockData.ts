import { OfferRecord } from './types';

const sample: OfferRecord[] = Array.from({ length: 24 }).map((_, i) => {
  const id = 1000 + i;
  const status: OfferRecord['status'] = i % 3 === 0 ? 'PROFITED' : i % 3 === 1 ? 'PENDING' : 'REFUSED';
  const base = {
    salesName: `مبيعات ${i}`,
    quotationId: `Q-${id}`,
    quotationDetails: `تفاصيل العرض رقم ${id} مع بعض النص الطويل للاختبار`,
    quotationDate: new Date(Date.now() - i * 86400000).toISOString(),
    estimatorName: `مقيم ${i}`,
    clientName: `عميل ${i}`,
    clientCode: `C-${200 + i}`,
    creditRating: ['A', 'B', 'C'][i % 3],
    totalPurchase: Math.round(10000 + i * 150.5),
    totalSales: Math.round(12000 + i * 180.9),
    totalProfit: Math.round(2000 + i * 30.2),
    paymentTerm: `${30 + (i % 5) * 15} يوم`,
    profitMargin: +(Math.random() * 20 + 5).toFixed(2),
    sentToProcurementDate: new Date(Date.now() - (i + 2) * 86400000).toISOString(),
    procurementDelayDays: i % 7,
    sector: ['Retail', 'Industrial', 'Services'][i % 3],
  };

  const pendingExtras = {
    followUp1: new Date(Date.now() - (i + 1) * 86400000).toISOString(),
    followUp2: new Date(Date.now() - (i + 2) * 86400000).toISOString(),
    followUp3: new Date(Date.now() - (i + 3) * 86400000).toISOString(),
    salesManagerFollowUp: new Date(Date.now() - (i + 4) * 86400000).toISOString(),
    gmReviewDate: new Date(Date.now() - (i + 5) * 86400000).toISOString(),
    actionTaken: i % 2 === 0 ? 'متابعة' : 'تعديل الأسعار',
    actionDate: new Date(Date.now() - (i + 6) * 86400000).toISOString(),
    finalStatus: 'قيد الانتظار',
    finalRejectionReason: '',
    salesSignature: `sig-${i}`,
    mainRejectionCategory: i % 2 === 0 ? '' : 'السعر',
  };

  const refusedExtras = {
    rejectionReason: 'السعر أو الشروط',
    mainRejectionCategory: 'السعر',
  };

  return {
    ...base,
    status,
    ...(status === 'PENDING' ? pendingExtras : {}),
    ...(status === 'REFUSED' ? refusedExtras : {}),
  } as OfferRecord;
});

export default sample;
