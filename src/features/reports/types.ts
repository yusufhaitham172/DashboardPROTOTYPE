export type Status = 'PROFITED' | 'PENDING' | 'REFUSED';

export type OfferRecord = {
  salesName: string;
  quotationId: string;
  quotationDetails: string;
  quotationDate: string;
  estimatorName: string;
  clientName: string;
  clientCode: string;
  creditRating: string;
  totalPurchase: number;
  totalSales: number;
  totalProfit: number;
  paymentTerm: string;
  profitMargin: number;
  sentToProcurementDate: string;
  procurementDelayDays: number;
  sector: string;
  status: Status;
  // Pending extras
  followUp1?: string;
  followUp2?: string;
  followUp3?: string;
  salesManagerFollowUp?: string;
  gmReviewDate?: string;
  actionTaken?: string;
  actionDate?: string;
  finalStatus?: string;
  finalRejectionReason?: string;
  salesSignature?: string;
  mainRejectionCategory?: string;
  // Refused extras
  rejectionReason?: string;
};
