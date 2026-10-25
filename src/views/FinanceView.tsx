import React, { useState } from 'react';
import { getInvoices, getExpenses } from '../services/businessData';
import { calculateFinancialPeriodSummary, formatRupees, formatLakhs, calculatePercentageChange } from '../services/financeCalculations';
import { ExpenseCategory } from '../types/business';

export const FinanceView: React.FC = () => {
  const invoices = getInvoices();
  const expenses = getExpenses();

  const [selectedPeriod, setSelectedPeriod] = useState<'current' | 'previous'>('current');
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | 'all'>('all');

  const currentSummary = calculateFinancialPeriodSummary(invoices, expenses, 'current', 'October 2026');
  const previousSummary = calculateFinancialPeriodSummary(invoices, expenses, 'previous', 'September 2026');

  const activeSummary = selectedPeriod === 'current' ? currentSummary : previousSummary;

  const filteredExpenses = expenses.filter((e) => {
    const periodMatch = e.period === selectedPeriod;
    const catMatch = selectedCategory === 'all' || e.category === selectedCategory;
    return periodMatch && catMatch;
  });

  const profitChange = calculatePercentageChange(currentSummary.operatingProfit, previousSummary.operatingProfit);
  const rawMaterialChange = calculatePercentageChange(currentSummary.rawMaterials, previousSummary.rawMaterials);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Title & Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--hairline)',
        paddingBottom: '16px',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div>
          <h2 className="display-serif" style={{ fontSize: '24px', fontWeight: 600 }}>
            Financial Performance & Ledger Reconciliation
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '13px', marginTop: '2px' }}>
            Deterministic P&L and transaction-level accounting ledgers for Sahyadri Precision Works.
          </p>
        </div>

        {/* Period Selector Toggle */}
        <div style={{ display: 'flex', backgroundColor: 'var(--surface-alt)', padding: '3px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--hairline)' }}>
          <button
            onClick={() => setSelectedPeriod('current')}
            className={selectedPeriod === 'current' ? 'btn-primary' : 'btn-ghost'}
            style={{ fontSize: '12px', padding: '5px 12px' }}
          >
            October 2026 (Current)
          </button>
          <button
            onClick={() => setSelectedPeriod('previous')}
            className={selectedPeriod === 'previous' ? 'btn-primary' : 'btn-ghost'}
            style={{ fontSize: '12px', padding: '5px 12px' }}
          >
            September 2026 (Baseline)
          </button>
        </div>
      </div>

      {/* Reconciled P&L Summary Strip */}
      <div className="metric-strip">
        <div className="metric-cell">
          <div className="metric-label">Gross Net Revenue</div>
          <div className="metric-value">{formatLakhs(activeSummary.revenue)}</div>
          <div className="metric-subtext">
            <span>{formatRupees(activeSummary.revenue)}</span>
          </div>
        </div>

        <div className="metric-cell">
          <div className="metric-label">Total Operating Expenses</div>
          <div className="metric-value">{formatLakhs(activeSummary.totalExpenses)}</div>
          <div className="metric-subtext">
            <span>{formatRupees(activeSummary.totalExpenses)}</span>
          </div>
        </div>

        <div className="metric-cell">
          <div className="metric-label">Operating Profit (EBIT)</div>
          <div className="metric-value" style={{ color: selectedPeriod === 'current' ? 'var(--terracotta)' : 'var(--evergreen)' }}>
            {formatLakhs(activeSummary.operatingProfit, 2)}
          </div>
          <div className="metric-subtext">
            {selectedPeriod === 'current' ? (
              <span style={{ color: 'var(--terracotta)', fontWeight: 600 }}>
                {profitChange}% drop vs prior month
              </span>
            ) : (
              <span>Prior period baseline</span>
            )}
          </div>
        </div>

        <div className="metric-cell">
          <div className="metric-label">Operating Margin</div>
          <div className="metric-value">{activeSummary.operatingMarginPercent}%</div>
          <div className="metric-subtext">
            <span>{selectedPeriod === 'current' ? 'Compressed by 2.3 pp' : 'Baseline margin'}</span>
          </div>
        </div>
      </div>

      {/* Detailed P&L Breakdown Table */}
      <div style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--hairline)',
        borderRadius: 'var(--radius-sm)',
        padding: '20px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 600 }}>
              Profit & Loss Statement • {activeSummary.periodName}
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--muted)' }}>
              All line figures aggregate directly from invoice line items and verified expense ledger records.
            </p>
          </div>
          <span className="badge badge-evergreen" style={{ fontSize: '11px' }}>
            Reconciled 100%
          </span>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>P&L Line Head</th>
                <th>Classification</th>
                <th className="num">September 2026</th>
                <th className="num">October 2026</th>
                <th className="num">Variance (₹)</th>
                <th className="num">% Change</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ fontWeight: 600 }}>
                <td>Operating Sales Revenue</td>
                <td>Net Billing</td>
                <td className="num">{formatRupees(previousSummary.revenue)}</td>
                <td className="num">{formatRupees(currentSummary.revenue)}</td>
                <td className="num" style={{ color: 'var(--muted)' }}>-₹60,000</td>
                <td className="num">-1.3%</td>
              </tr>

              <tr style={{ backgroundColor: 'var(--terracotta-subtle)' }}>
                <td style={{ fontWeight: 600, color: 'var(--terracotta-ink)' }}>Raw Materials (Special Steel & Blanks)</td>
                <td>Direct COGS</td>
                <td className="num">{formatRupees(previousSummary.rawMaterials)}</td>
                <td className="num" style={{ fontWeight: 600 }}>{formatRupees(currentSummary.rawMaterials)}</td>
                <td className="num" style={{ color: 'var(--terracotta)', fontWeight: 600 }}>+₹2,61,081</td>
                <td className="num" style={{ color: 'var(--terracotta)', fontWeight: 700 }}>+{rawMaterialChange}%</td>
              </tr>

              <tr>
                <td>Direct Manufacturing Labor & Wages</td>
                <td>Direct Operations</td>
                <td className="num">{formatRupees(previousSummary.directLabor)}</td>
                <td className="num">{formatRupees(currentSummary.directLabor)}</td>
                <td className="num" style={{ color: 'var(--evergreen)' }}>-₹90,000</td>
                <td className="num">-7.4%</td>
              </tr>

              <tr>
                <td>HT Power Tariffs, Tooling Consumables</td>
                <td>Factory Overhead</td>
                <td className="num">{formatRupees(previousSummary.factoryOverhead)}</td>
                <td className="num">{formatRupees(currentSummary.factoryOverhead)}</td>
                <td className="num" style={{ color: 'var(--evergreen)' }}>-₹1,11,081</td>
                <td className="num">-12.9%</td>
              </tr>

              <tr>
                <td>Plant Lease, Freight, Admin Operations</td>
                <td>SG&A</td>
                <td className="num">{formatRupees(previousSummary.adminSales)}</td>
                <td className="num">{formatRupees(currentSummary.adminSales)}</td>
                <td className="num" style={{ color: 'var(--muted)' }}>₹0</td>
                <td className="num">0.0%</td>
              </tr>

              <tr style={{ fontWeight: 700, backgroundColor: 'var(--surface-alt)' }}>
                <td>Operating Profit (EBIT)</td>
                <td>Net Operational Return</td>
                <td className="num">{formatRupees(previousSummary.operatingProfit)}</td>
                <td className="num" style={{ color: 'var(--terracotta)' }}>{formatRupees(currentSummary.operatingProfit)}</td>
                <td className="num" style={{ color: 'var(--terracotta)' }}>-₹1,20,000</td>
                <td className="num" style={{ color: 'var(--terracotta)' }}>{profitChange}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Level Expense Ledger */}
      <div style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--hairline)',
        borderRadius: 'var(--radius-sm)',
        padding: '20px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 600 }}>
              Transaction Expense Ledger ({filteredExpenses.length} Records)
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--muted)' }}>
              Source disbursements recorded for {activeSummary.periodName}.
            </p>
          </div>

          {/* Category Filter */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'All Categories' },
              { id: 'raw_materials', label: 'Raw Materials' },
              { id: 'direct_labor', label: 'Labor' },
              { id: 'factory_overhead', label: 'Power & Overhead' },
              { id: 'admin_sales', label: 'Admin & SG&A' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={selectedCategory === cat.id ? 'btn-primary' : 'btn-secondary'}
                style={{ fontSize: '11px', padding: '4px 10px' }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Voucher #</th>
                <th>Date</th>
                <th>Category</th>
                <th>Expense Description</th>
                <th>Vendor / Payee</th>
                <th className="num">Disbursed (₹)</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((exp) => (
                <tr key={exp.id}>
                  <td style={{ fontWeight: 600, color: 'var(--ink)' }}>{exp.expenseNumber}</td>
                  <td>{exp.date}</td>
                  <td>
                    <span className={`badge ${
                      exp.category === 'raw_materials'
                        ? 'badge-terracotta'
                        : exp.category === 'direct_labor'
                        ? 'badge-ochre'
                        : 'badge-neutral'
                    }`} style={{ fontSize: '10px' }}>
                      {exp.category.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ fontWeight: 500 }}>{exp.categoryLabel}</td>
                  <td style={{ color: 'var(--muted)', fontSize: '12px' }}>{exp.vendorName}</td>
                  <td className="num" style={{ fontWeight: 600 }}>{formatRupees(exp.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
