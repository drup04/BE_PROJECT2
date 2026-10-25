import { Invoice, Expense, FinancialPeriodSummary } from '../types/business';

/**
 * Formats a number according to the Indian Rupee numbering system (lakhs and crores).
 * Example: 690000 -> "₹6,90,000"
 * Example: -120000 -> "-₹1,20,000"
 */
export function formatRupees(amount: number): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(Math.round(amount));
  const amountStr = absAmount.toString();

  if (amountStr.length <= 3) {
    return `${isNegative ? '-' : ''}₹${amountStr}`;
  }

  const lastThree = amountStr.substring(amountStr.length - 3);
  const otherNumbers = amountStr.substring(0, amountStr.length - 3);
  const formattedOther = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');

  return `${isNegative ? '-' : ''}₹${formattedOther},${lastThree}`;
}

/**
 * Formats an amount in Lakhs (L) for dense summary metric strips.
 * Example: 4740000 -> "₹47.4L"
 * Example: 690000 -> "₹6.90L"
 */
export function formatLakhs(amount: number, decimals: number = 1): string {
  const isNegative = amount < 0;
  const absLakhs = Math.abs(amount) / 100000;
  return `${isNegative ? '-' : ''}₹${absLakhs.toFixed(decimals)}L`;
}

/**
 * Calculates percentage change between current and previous values.
 * Returns signed change rounded to 1 decimal place.
 * Example: current 690000, previous 810000 -> -14.8
 */
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  const change = ((current - previous) / previous) * 100;
  return Math.round(change * 10) / 10;
}

/**
 * Calculates operating margin percentage.
 * Example: revenue 4740000, profit 690000 -> 14.6%
 */
export function calculateMarginPercent(revenue: number, profit: number): number {
  if (revenue === 0) return 0;
  const margin = (profit / revenue) * 100;
  return Math.round(margin * 10) / 10;
}

/**
 * Pure calculation for quotation totals including line items, discount, and GST.
 */
export interface QuotationCalculationInput {
  lines: Array<{ quantity: number; unitPrice: number }>;
  discountPercent: number;
  gstRate: number;
}

export interface QuotationCalculationResult {
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  taxableAmount: number;
  gstRate: number;
  gstAmount: number;
  grandTotal: number;
}

export function calculateQuotationTotals(input: QuotationCalculationInput): QuotationCalculationResult {
  const subtotal = input.lines.reduce((sum, line) => {
    const qty = Math.max(0, line.quantity || 0);
    const price = Math.max(0, line.unitPrice || 0);
    return sum + Math.round(qty * price);
  }, 0);

  const safeDiscount = Math.min(100, Math.max(0, input.discountPercent || 0));
  const discountAmount = Math.round(subtotal * (safeDiscount / 100));
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  
  const safeGst = Math.max(0, input.gstRate || 0);
  const gstAmount = Math.round(taxableAmount * (safeGst / 100));
  const grandTotal = taxableAmount + gstAmount;

  return {
    subtotal,
    discountPercent: safeDiscount,
    discountAmount,
    taxableAmount,
    gstRate: safeGst,
    gstAmount,
    grandTotal,
  };
}

/**
 * Reconciles financial period summary directly from transaction records.
 */
export function calculateFinancialPeriodSummary(
  invoices: Invoice[],
  expenses: Expense[],
  period: 'current' | 'previous',
  periodName: string
): FinancialPeriodSummary {
  const periodInvoices = invoices.filter((inv) => inv.period === period);
  const periodExpenses = expenses.filter((exp) => exp.period === period);

  const revenue = periodInvoices.reduce((sum, inv) => sum + inv.subtotal, 0);

  const rawMaterials = periodExpenses
    .filter((e) => e.category === 'raw_materials')
    .reduce((sum, e) => sum + e.amount, 0);

  const directLabor = periodExpenses
    .filter((e) => e.category === 'direct_labor')
    .reduce((sum, e) => sum + e.amount, 0);

  const factoryOverhead = periodExpenses
    .filter((e) => e.category === 'factory_overhead')
    .reduce((sum, e) => sum + e.amount, 0);

  const adminSales = periodExpenses
    .filter((e) => e.category === 'admin_sales')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalExpenses = rawMaterials + directLabor + factoryOverhead + adminSales;
  const operatingProfit = revenue - totalExpenses;
  const operatingMarginPercent = calculateMarginPercent(revenue, operatingProfit);

  return {
    periodName,
    revenue,
    rawMaterials,
    directLabor,
    factoryOverhead,
    adminSales,
    totalExpenses,
    operatingProfit,
    operatingMarginPercent,
  };
}

/**
 * Aging breakdown of receivables.
 */
export interface ReceivablesAging {
  totalOutstanding: number;
  totalOverdue: number;
  overdueCount: number;
  currentPending: number;
  brackets: {
    bracket1_30: number;
    bracket31_60: number;
    bracket61_90: number;
    bracket90Plus: number;
  };
}

export function calculateReceivablesAging(invoices: Invoice[]): ReceivablesAging {
  let totalOutstanding = 0;
  let totalOverdue = 0;
  let overdueCount = 0;
  let currentPending = 0;

  const brackets = {
    bracket1_30: 0,
    bracket31_60: 0,
    bracket61_90: 0,
    bracket90Plus: 0,
  };

  invoices.forEach((inv) => {
    if (inv.status === 'paid') return;

    totalOutstanding += inv.balanceDue;

    if (inv.status === 'overdue' || inv.daysOverdue > 0) {
      totalOverdue += inv.balanceDue;
      overdueCount += 1;

      if (inv.daysOverdue <= 30) {
        brackets.bracket1_30 += inv.balanceDue;
      } else if (inv.daysOverdue <= 60) {
        brackets.bracket31_60 += inv.balanceDue;
      } else if (inv.daysOverdue <= 90) {
        brackets.bracket61_90 += inv.balanceDue;
      } else {
        brackets.bracket90Plus += inv.balanceDue;
      }
    } else {
      currentPending += inv.balanceDue;
    }
  });

  return {
    totalOutstanding,
    totalOverdue,
    overdueCount,
    currentPending,
    brackets,
  };
}
