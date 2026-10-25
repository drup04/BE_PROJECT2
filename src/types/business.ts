export type InvoiceStatus = 'paid' | 'overdue' | 'pending';
export type QuotationStatus = 'draft' | 'sent_demo' | 'accepted' | 'expired';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'simulated_sent';
export type ExpenseCategory = 'raw_materials' | 'direct_labor' | 'factory_overhead' | 'admin_sales';

export interface Customer {
  id: string;
  code: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  city: string;
  gstin: string;
  paymentTermsDays: number;
  status: 'active' | 'watch' | 'inactive';
  totalOrders: number;
  outstandingBalance: number;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  category: string;
  unit: string;
  hsnCode: string;
  unitPrice: number;
  currentCostPrice: number;
  previousCostPrice: number;
  currentMarginPercent: number;
  previousMarginPercent: number;
}

export interface InvoiceLine {
  id: string;
  productId: string;
  description: string;
  hsnCode: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  invoiceDate: string;
  dueDate: string;
  status: InvoiceStatus;
  subtotal: number;
  gstAmount: number;
  totalAmount: number;
  amountPaid: number;
  balanceDue: number;
  lines: InvoiceLine[];
  daysOverdue: number;
  period: 'current' | 'previous';
}

export interface Expense {
  id: string;
  expenseNumber: string;
  category: ExpenseCategory;
  categoryLabel: string;
  description: string;
  vendorName: string;
  date: string;
  amount: number;
  period: 'current' | 'previous';
}

export interface QuotationLine {
  id: string;
  productId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Quotation {
  id: string;
  quoteNumber: string;
  customerId: string;
  customerName: string;
  createdDate: string;
  validUntilDate: string;
  status: QuotationStatus;
  lines: QuotationLine[];
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  gstRate: number;
  gstAmount: number;
  grandTotal: number;
  notes?: string;
}

export interface ProductMarginComparison {
  productId: string;
  productName: string;
  previousMarginPercent: number;
  currentMarginPercent: number;
  changePercentagePoints: number;
}

export interface EvidenceRecord {
  id: string;
  type: 'invoice' | 'expense' | 'customer' | 'quotation';
  referenceNumber: string;
  date: string;
  entityName: string;
  amount: number;
  note: string;
}

export interface FollowupDraftItem {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  contactPerson: string;
  email: string;
  amountOverdue: number;
  daysOverdue: number;
  subject: string;
  bodyText: string;
}

export interface ProposedAction {
  id: string;
  type: 'draft_followup_emails';
  title: string;
  reason: string;
  impactedCount: number;
  totalAmount: number;
  drafts: FollowupDraftItem[];
  status: 'proposed' | 'queued_for_approval';
}

export interface TaskStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  recordsCount?: number;
}

export interface TaskSummary {
  currentProfit: number;
  previousProfit: number;
  profitChangePercent: number;
  rawMaterialChangePercent: number;
  productMargins: ProductMarginComparison[];
  overdueAmount: number;
  explanation: string;
  evidenceRecords: EvidenceRecord[];
}

export interface TaskRun {
  id: string;
  prompt: string;
  createdAt: string;
  status: 'running' | 'completed' | 'failed';
  steps: TaskStep[];
  summary?: TaskSummary;
  proposedAction?: ProposedAction;
}

export interface ApprovalItem {
  id: string;
  type: 'customer_email' | 'quotation_approval';
  title: string;
  rationale: string;
  recipientName: string;
  recipientEmail: string;
  referenceRecord: string;
  amount?: number;
  draftSubject: string;
  draftBody: string;
  status: ApprovalStatus;
  createdAt: string;
  reviewedAt?: string;
  notes?: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  recordReference: string;
  category: 'task' | 'calculation' | 'approval' | 'simulation' | 'sales' | 'system';
  result: 'success' | 'warning' | 'rejected' | 'info';
  details: string;
}

export interface FinancialPeriodSummary {
  periodName: string;
  revenue: number;
  rawMaterials: number;
  directLabor: number;
  factoryOverhead: number;
  adminSales: number;
  totalExpenses: number;
  operatingProfit: number;
  operatingMarginPercent: number;
}
