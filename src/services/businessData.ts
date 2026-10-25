import {
  Customer,
  Product,
  Invoice,
  Expense,
  Quotation,
  FinancialPeriodSummary,
} from '../types/business';
import {
  INITIAL_CUSTOMERS,
  INITIAL_PRODUCTS,
  INITIAL_INVOICES,
  INITIAL_EXPENSES,
  INITIAL_QUOTATIONS,
} from '../data/seedData';
import {
  calculateFinancialPeriodSummary,
  calculateReceivablesAging,
  ReceivablesAging,
  calculatePercentageChange,
} from './financeCalculations';
import { logAuditEvent, resetAuditLog } from './auditService';
import { resetApprovals } from './approvalService';

const STORAGE_KEYS = {
  CUSTOMERS: 'karyadesk_customers',
  PRODUCTS: 'karyadesk_products',
  INVOICES: 'karyadesk_invoices',
  EXPENSES: 'karyadesk_expenses',
  QUOTATIONS: 'karyadesk_quotations',
};

let memoryCustomers: Customer[] | null = null;
let memoryProducts: Product[] | null = null;
let memoryInvoices: Invoice[] | null = null;
let memoryExpenses: Expense[] | null = null;
let memoryQuotations: Quotation[] | null = null;

function isLocalStorageAvailable(): boolean {
  try {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined' && window.localStorage !== null;
  } catch {
    return false;
  }
}

function loadFromStorage<T>(key: string, fallback: T[]): T[] {
  if (isLocalStorageAvailable()) {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn(`Could not read ${key} from storage:`, e);
    }
  }
  return [...fallback];
}

function saveToStorage<T>(key: string, data: T[]) {
  if (isLocalStorageAvailable()) {
    try {
      window.localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn(`Could not save ${key} to storage:`, e);
    }
  }
}

// Customers
export function getCustomers(): Customer[] {
  if (!memoryCustomers) {
    memoryCustomers = loadFromStorage(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
  }
  return memoryCustomers;
}

export function getCustomerById(id: string): Customer | undefined {
  return getCustomers().find((c) => c.id === id);
}

// Products
export function getProducts(): Product[] {
  if (!memoryProducts) {
    memoryProducts = loadFromStorage(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  }
  return memoryProducts;
}

export function getProductById(id: string): Product | undefined {
  return getProducts().find((p) => p.id === id);
}

// Invoices
export function getInvoices(): Invoice[] {
  if (!memoryInvoices) {
    memoryInvoices = loadFromStorage(STORAGE_KEYS.INVOICES, INITIAL_INVOICES);
  }
  return memoryInvoices;
}

export function getInvoiceById(id: string): Invoice | undefined {
  return getInvoices().find((inv) => inv.id === id);
}

export function getOverdueInvoices(): Invoice[] {
  return getInvoices().filter((inv) => inv.status === 'overdue' || inv.daysOverdue > 0);
}

// Expenses
export function getExpenses(): Expense[] {
  if (!memoryExpenses) {
    memoryExpenses = loadFromStorage(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES);
  }
  return memoryExpenses;
}

// Quotations
export function getQuotations(): Quotation[] {
  if (!memoryQuotations) {
    memoryQuotations = loadFromStorage(STORAGE_KEYS.QUOTATIONS, INITIAL_QUOTATIONS);
  }
  return memoryQuotations;
}

export function getQuotationById(id: string): Quotation | undefined {
  return getQuotations().find((q) => q.id === id);
}

export function addQuotation(newQuote: Quotation): Quotation {
  const current = getQuotations();
  const updated = [newQuote, ...current];
  memoryQuotations = updated;
  saveToStorage(STORAGE_KEYS.QUOTATIONS, updated);

  logAuditEvent(
    'Rajesh Sharma (Owner)',
    'Quotation Created',
    newQuote.quoteNumber,
    'sales',
    'success',
    `Created quotation ${newQuote.quoteNumber} for ${newQuote.customerName} (₹${newQuote.grandTotal.toLocaleString('en-IN')})`
  );

  return newQuote;
}

// Business Overview data
export interface BusinessOverviewData {
  currentPeriod: FinancialPeriodSummary;
  previousPeriod: FinancialPeriodSummary;
  profitChangePercent: number;
  receivablesAging: ReceivablesAging;
}

export function getBusinessOverviewData(): BusinessOverviewData {
  const invoices = getInvoices();
  const expenses = getExpenses();

  const currentPeriod = calculateFinancialPeriodSummary(invoices, expenses, 'current', 'October 2026');
  const previousPeriod = calculateFinancialPeriodSummary(invoices, expenses, 'previous', 'September 2026');
  const profitChangePercent = calculatePercentageChange(currentPeriod.operatingProfit, previousPeriod.operatingProfit);
  const receivablesAging = calculateReceivablesAging(invoices);

  return {
    currentPeriod,
    previousPeriod,
    profitChangePercent,
    receivablesAging,
  };
}

// Reset mechanism
export function resetAllDemoData() {
  memoryCustomers = [...INITIAL_CUSTOMERS];
  memoryProducts = [...INITIAL_PRODUCTS];
  memoryInvoices = [...INITIAL_INVOICES];
  memoryExpenses = [...INITIAL_EXPENSES];
  memoryQuotations = [...INITIAL_QUOTATIONS];

  if (isLocalStorageAvailable()) {
    try {
      window.localStorage.removeItem(STORAGE_KEYS.CUSTOMERS);
      window.localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
      window.localStorage.removeItem(STORAGE_KEYS.INVOICES);
      window.localStorage.removeItem(STORAGE_KEYS.EXPENSES);
      window.localStorage.removeItem(STORAGE_KEYS.QUOTATIONS);
    } catch (e) {
      console.warn('Could not clear localStorage:', e);
    }
  }

  resetAuditLog();
  resetApprovals();

  logAuditEvent(
    'System Administrator',
    'Demo Workspace Reset',
    'GLOBAL-RESET',
    'system',
    'info',
    'Restored all synthetic seed records, financial ledger, quotation registry, and approval queue to initial baseline.'
  );
}
