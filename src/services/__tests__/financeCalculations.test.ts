import { describe, it, expect } from 'vitest';
import {
  formatRupees,
  formatLakhs,
  calculatePercentageChange,
  calculateMarginPercent,
  calculateQuotationTotals,
  calculateReceivablesAging,
} from '../financeCalculations';
import { Invoice } from '../../types/business';

describe('financeCalculations', () => {
  describe('Indian Currency Formatting', () => {
    it('formats numbers with standard Indian commas and rupee symbol', () => {
      expect(formatRupees(690000)).toBe('₹6,90,000');
      expect(formatRupees(420000)).toBe('₹4,20,000');
      expect(formatRupees(4740000)).toBe('₹47,40,000');
      expect(formatRupees(810000)).toBe('₹8,10,000');
      expect(formatRupees(500)).toBe('₹500');
      expect(formatRupees(-120000)).toBe('-₹1,20,000');
    });

    it('formats summary numbers in Lakhs', () => {
      expect(formatLakhs(4740000)).toBe('₹47.4L');
      expect(formatLakhs(690000, 2)).toBe('₹6.90L');
      expect(formatLakhs(420000)).toBe('₹4.2L');
      expect(formatLakhs(810000, 2)).toBe('₹8.10L');
    });
  });

  describe('Benchmark Percentage Calculations', () => {
    it('calculates the exact -14.8% operating profit drop from demo figures', () => {
      const currentProfit = 690000;
      const previousProfit = 810000;
      const change = calculatePercentageChange(currentProfit, previousProfit);
      expect(change).toBe(-14.8);
    });

    it('calculates the exact +18.4% raw material expense surge', () => {
      const currentRawMaterials = 1680000;
      const previousRawMaterials = 1418919;
      const change = calculatePercentageChange(currentRawMaterials, previousRawMaterials);
      expect(change).toBe(18.4);
    });

    it('calculates operating margin of ~14.6% for current month', () => {
      const revenue = 4740000;
      const profit = 690000;
      const margin = calculateMarginPercent(revenue, profit);
      expect(margin).toBe(14.6);
    });
  });

  describe('Quotation Calculations', () => {
    it('calculates subtotal, discount, 18% GST, and grand total accurately', () => {
      const result = calculateQuotationTotals({
        lines: [
          { quantity: 100, unitPrice: 450 }, // 45,000
          { quantity: 50, unitPrice: 1200 }, // 60,000
        ],
        discountPercent: 5,
        gstRate: 18,
      });

      expect(result.subtotal).toBe(105000);
      expect(result.discountAmount).toBe(5250);
      expect(result.taxableAmount).toBe(99750);
      expect(result.gstAmount).toBe(17955);
      expect(result.grandTotal).toBe(117705);
    });

    it('handles zero discount correctly', () => {
      const result = calculateQuotationTotals({
        lines: [{ quantity: 10, unitPrice: 1000 }],
        discountPercent: 0,
        gstRate: 18,
      });

      expect(result.subtotal).toBe(10000);
      expect(result.discountAmount).toBe(0);
      expect(result.taxableAmount).toBe(10000);
      expect(result.gstAmount).toBe(1800);
      expect(result.grandTotal).toBe(11800);
    });
  });

  describe('Receivables Aging Calculation', () => {
    it('aggregates overdue balances and brackets', () => {
      const mockInvoices: Partial<Invoice>[] = [
        {
          id: '1',
          status: 'overdue',
          balanceDue: 185000,
          daysOverdue: 34,
        },
        {
          id: '2',
          status: 'overdue',
          balanceDue: 145000,
          daysOverdue: 22,
        },
        {
          id: '3',
          status: 'overdue',
          balanceDue: 90000,
          daysOverdue: 15,
        },
        {
          id: '4',
          status: 'pending',
          balanceDue: 250000,
          daysOverdue: 0,
        },
        {
          id: '5',
          status: 'paid',
          balanceDue: 0,
          daysOverdue: 0,
        },
      ];

      const aging = calculateReceivablesAging(mockInvoices as Invoice[]);
      expect(aging.totalOverdue).toBe(420000);
      expect(aging.overdueCount).toBe(3);
      expect(aging.currentPending).toBe(250000);
      expect(aging.totalOutstanding).toBe(670000);
      expect(aging.brackets.bracket1_30).toBe(235000); // 145000 + 90000
      expect(aging.brackets.bracket31_60).toBe(185000); // 185000
    });
  });
});
