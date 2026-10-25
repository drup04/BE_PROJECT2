import { describe, it, expect } from 'vitest';
import { INITIAL_INVOICES, INITIAL_EXPENSES, INITIAL_CUSTOMERS } from '../seedData';
import {
  calculateFinancialPeriodSummary,
  calculatePercentageChange,
  calculateReceivablesAging,
} from '../../services/financeCalculations';

describe('Seed Data Reconciliation Verification', () => {
  it('reconciles October 2026 revenue, profit, and margin exactly to benchmark targets', () => {
    const summary = calculateFinancialPeriodSummary(
      INITIAL_INVOICES,
      INITIAL_EXPENSES,
      'current',
      'October 2026'
    );

    // Headline benchmark targets
    expect(summary.revenue).toBe(4740000); // ₹47.4L
    expect(summary.operatingProfit).toBe(690000); // ₹6.90L
    expect(summary.operatingMarginPercent).toBe(14.6); // ~14.6%
    expect(summary.rawMaterials).toBe(1680000);
    expect(summary.totalExpenses).toBe(4050000);
  });

  it('reconciles September 2026 prior period profit and raw material calculations', () => {
    const currentSummary = calculateFinancialPeriodSummary(
      INITIAL_INVOICES,
      INITIAL_EXPENSES,
      'current',
      'October 2026'
    );

    const previousSummary = calculateFinancialPeriodSummary(
      INITIAL_INVOICES,
      INITIAL_EXPENSES,
      'previous',
      'September 2026'
    );

    expect(previousSummary.operatingProfit).toBe(810000); // ₹8.10L
    
    // Profit change must be exactly -14.8%
    const profitChange = calculatePercentageChange(
      currentSummary.operatingProfit,
      previousSummary.operatingProfit
    );
    expect(profitChange).toBe(-14.8);

    // Raw material surge must be exactly +18.4%
    const rawMaterialChange = calculatePercentageChange(
      currentSummary.rawMaterials,
      previousSummary.rawMaterials
    );
    expect(rawMaterialChange).toBe(18.4);
  });

  it('verifies overdue receivables sum to exactly ₹4,20,000 across overdue invoices', () => {
    const aging = calculateReceivablesAging(INITIAL_INVOICES);
    expect(aging.totalOverdue).toBe(420000);
    expect(aging.overdueCount).toBe(3);

    // Verify overdue customer outstanding balances match
    const overdueCustomerIds = ['cust-1', 'cust-2', 'cust-3'];
    const overdueCustomersBalance = INITIAL_CUSTOMERS
      .filter(c => overdueCustomerIds.includes(c.id))
      .reduce((sum, c) => sum + c.outstandingBalance, 0);
    expect(overdueCustomersBalance).toBe(420000);
  });
});
