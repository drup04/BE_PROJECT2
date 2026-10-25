import React from 'react';
import { getBusinessOverviewData, getOverdueInvoices } from '../services/businessData';
import { getApprovals } from '../services/approvalService';
import { getAuditEvents } from '../services/auditService';
import { formatRupees, formatLakhs } from '../services/financeCalculations';
import { AppRoute } from '../components/layout/AppShell';

interface OverviewViewProps {
  onNavigate: (route: AppRoute) => void;
  onRunProfitAnalysis: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  onNavigate,
  onRunProfitAnalysis,
}) => {
  const overview = getBusinessOverviewData();
  const overdueInvoices = getOverdueInvoices();
  const pendingApprovals = getApprovals().filter((a) => a.status === 'pending');
  const recentAudit = getAuditEvents().slice(0, 5);

  const { currentPeriod, previousPeriod, profitChangePercent, receivablesAging } = overview;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Title & Hero Action */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderBottom: '1px solid var(--hairline)',
        paddingBottom: '16px',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div>
          <h2 className="display-serif" style={{ fontSize: '24px', fontWeight: 600, color: 'var(--ink)' }}>
            Operating Summary • {currentPeriod.periodName}
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '13px', marginTop: '2px' }}>
            Deterministic performance metrics reconciled from Sahyadri Precision Works local ledger records.
          </p>
        </div>

        {/* Signature Prompt Jump Button */}
        <button
          onClick={onRunProfitAnalysis}
          className="btn-primary"
          style={{ padding: '8px 16px', fontSize: '13px' }}
        >
          <span>Ask Assistant: &ldquo;Why did our profit fall this month?&rdquo;</span>
          <span style={{ fontSize: '15px' }}>&rarr;</span>
        </button>
      </div>

      {/* 4-Measure Aligned Metric Strip (Zero Cards) */}
      <div className="metric-strip" aria-label="Key Business Indicators">
        <div className="metric-cell">
          <div className="metric-label">Revenue (Current Month)</div>
          <div className="metric-value">{formatLakhs(currentPeriod.revenue)}</div>
          <div className="metric-subtext">
            <span>{formatRupees(currentPeriod.revenue)}</span>
            <span style={{ color: 'var(--muted)' }}>• Oct 2026</span>
          </div>
        </div>

        <div className="metric-cell">
          <div className="metric-label">Operating Profit</div>
          <div className="metric-value">{formatLakhs(currentPeriod.operatingProfit, 2)}</div>
          <div className="metric-subtext">
            <span style={{ color: 'var(--terracotta)', fontWeight: 600 }}>
              {profitChangePercent}%
            </span>
            <span style={{ color: 'var(--muted)' }}>vs Sep ({formatLakhs(previousPeriod.operatingProfit, 2)})</span>
          </div>
        </div>

        <div className="metric-cell">
          <div className="metric-label">Operating Margin</div>
          <div className="metric-value">{currentPeriod.operatingMarginPercent}%</div>
          <div className="metric-subtext">
            <span style={{ color: 'var(--terracotta)' }}>-2.3 pp</span>
            <span style={{ color: 'var(--muted)' }}>vs Sep ({previousPeriod.operatingMarginPercent}%)</span>
          </div>
        </div>

        <div className="metric-cell">
          <div className="metric-label">Overdue Receivables</div>
          <div className="metric-value" style={{ color: 'var(--terracotta)' }}>
            {formatLakhs(receivablesAging.totalOverdue)}
          </div>
          <div className="metric-subtext">
            <span style={{ color: 'var(--terracotta)', fontWeight: 600 }}>
              {receivablesAging.overdueCount} accounts overdue
            </span>
            <span>({formatRupees(receivablesAging.totalOverdue)})</span>
          </div>
        </div>
      </div>

      {/* Period Comparison & Baseline Table */}
      <div style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--hairline)',
        borderRadius: 'var(--radius-sm)',
        padding: '20px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 600 }}>Period-Over-Period Financial Variance</h3>
            <p style={{ fontSize: '12px', color: 'var(--muted)' }}>
              Reconciliation comparing October 2026 against September 2026 baseline.
            </p>
          </div>
          <button onClick={() => onNavigate('/finance')} className="btn-secondary" style={{ fontSize: '12px' }}>
            Open Ledger &rarr;
          </button>
        </div>

        {/* Dense Comparison Table */}
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Account Head</th>
                <th className="num">September 2026 (Baseline)</th>
                <th className="num">October 2026 (Current)</th>
                <th className="num">Variance (₹)</th>
                <th className="num">Change (%)</th>
                <th>Operational Impact</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 600 }}>Gross B2B Revenue</td>
                <td className="num">{formatRupees(previousPeriod.revenue)}</td>
                <td className="num">{formatRupees(currentPeriod.revenue)}</td>
                <td className="num" style={{ color: 'var(--muted)' }}>-₹60,000</td>
                <td className="num">-1.3%</td>
                <td style={{ fontSize: '12px', color: 'var(--muted)' }}>Steady production delivery volume</td>
              </tr>
              <tr style={{ backgroundColor: 'var(--terracotta-subtle)' }}>
                <td style={{ fontWeight: 600, color: 'var(--terracotta-ink)' }}>Raw Materials (Steel & Castings)</td>
                <td className="num">{formatRupees(previousPeriod.rawMaterials)}</td>
                <td className="num" style={{ fontWeight: 600 }}>{formatRupees(currentPeriod.rawMaterials)}</td>
                <td className="num" style={{ color: 'var(--terracotta)', fontWeight: 600 }}>+₹2,61,081</td>
                <td className="num" style={{ color: 'var(--terracotta)', fontWeight: 700 }}>+18.4%</td>
                <td style={{ fontSize: '12px', color: 'var(--terracotta-ink)', fontWeight: 500 }}>
                  Primary profit drag: Forged steel billet spot price hike
                </td>
              </tr>
              <tr>
                <td>Direct Manufacturing Labor</td>
                <td className="num">{formatRupees(previousPeriod.directLabor)}</td>
                <td className="num">{formatRupees(currentPeriod.directLabor)}</td>
                <td className="num" style={{ color: 'var(--evergreen)' }}>-₹90,000</td>
                <td className="num">-7.4%</td>
                <td style={{ fontSize: '12px', color: 'var(--muted)' }}>Normalized shift overtime</td>
              </tr>
              <tr>
                <td>Power Tariffs & Tooling Overheads</td>
                <td className="num">{formatRupees(previousPeriod.factoryOverhead)}</td>
                <td className="num">{formatRupees(currentPeriod.factoryOverhead)}</td>
                <td className="num" style={{ color: 'var(--evergreen)' }}>-₹1,11,081</td>
                <td className="num">-12.9%</td>
                <td style={{ fontSize: '12px', color: 'var(--muted)' }}>Reduced tooling replacements</td>
              </tr>
              <tr>
                <td>Administration, Logistics & Sales</td>
                <td className="num">{formatRupees(previousPeriod.adminSales)}</td>
                <td className="num">{formatRupees(currentPeriod.adminSales)}</td>
                <td className="num" style={{ color: 'var(--muted)' }}>₹0</td>
                <td className="num">0.0%</td>
                <td style={{ fontSize: '12px', color: 'var(--muted)' }}>Fixed lease & compliance charges</td>
              </tr>
              <tr style={{ fontWeight: 700, backgroundColor: 'var(--surface-alt)' }}>
                <td>Operating Profit (EBIT)</td>
                <td className="num">{formatRupees(previousPeriod.operatingProfit)}</td>
                <td className="num" style={{ color: 'var(--terracotta)' }}>{formatRupees(currentPeriod.operatingProfit)}</td>
                <td className="num" style={{ color: 'var(--terracotta)' }}>-₹1,20,000</td>
                <td className="num" style={{ color: 'var(--terracotta)' }}>-14.8%</td>
                <td style={{ color: 'var(--terracotta)' }}>Margin squeezed from 16.9% to 14.6%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Two Column Section: Needs Attention & Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>
        {/* Needs Attention: Overdue Invoices & Approvals */}
        <div style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--hairline)',
          borderRadius: 'var(--radius-sm)',
          padding: '18px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--terracotta)' }} />
              Needs Attention • Overdue Accounts ({overdueInvoices.length})
            </h3>
            <button onClick={() => onNavigate('/receivables')} className="btn-ghost" style={{ fontSize: '12px' }}>
              View Receivables &rarr;
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {overdueInvoices.map((inv) => (
              <div
                key={inv.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  backgroundColor: 'var(--canvas)',
                  border: '1px solid var(--hairline)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '13px' }}>{inv.customerName}</div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>
                    {inv.invoiceNumber} • Matured {inv.dueDate}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: 'var(--terracotta)', fontSize: '13px' }}>
                    {formatRupees(inv.balanceDue)}
                  </div>
                  <span className="badge badge-terracotta" style={{ fontSize: '10px', marginTop: '2px' }}>
                    {inv.daysOverdue} Days Overdue
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pending Approvals summary callout */}
          {pendingApprovals.length > 0 && (
            <div style={{
              marginTop: '14px',
              padding: '10px 12px',
              backgroundColor: 'var(--ochre-subtle)',
              border: '1px solid #ECDAB8',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ochre-ink)' }}>
                  {pendingApprovals.length} Sensitive Action Awaiting Your Approval
                </div>
                <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
                  Customer payment follow-up email drafts ready for human review.
                </div>
              </div>
              <button
                onClick={() => onNavigate('/approvals')}
                className="btn-secondary"
                style={{ fontSize: '11px', padding: '4px 8px' }}
              >
                Review &rarr;
              </button>
            </div>
          )}
        </div>

        {/* Recent Audit Trail */}
        <div style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--hairline)',
          borderRadius: 'var(--radius-sm)',
          padding: '18px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600 }}>Recent Activity & Ledger Events</h3>
            <button onClick={() => onNavigate('/activity')} className="btn-ghost" style={{ fontSize: '12px' }}>
              Full Audit Trail &rarr;
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {recentAudit.map((event) => (
              <div
                key={event.id}
                style={{
                  padding: '9px 12px',
                  backgroundColor: 'var(--canvas)',
                  border: '1px solid var(--hairline)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{event.action}</span>
                  <span style={{ fontSize: '11px', color: 'var(--muted)' }}>{event.timestamp.split(' ')[1]}</span>
                </div>
                <div style={{ color: 'var(--muted)', marginTop: '2px', fontSize: '11px' }}>
                  {event.details}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
