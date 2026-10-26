import React, { useState } from 'react';
import { getInvoices, getCustomers } from '../services/businessData';
import { calculateReceivablesAging, formatRupees, formatLakhs } from '../services/financeCalculations';
import { addApprovalItems } from '../services/approvalService';
import { Invoice, InvoiceStatus } from '../types/business';
import { AppRoute } from '../components/layout/AppShell';
import { IconClose, IconCheck, IconSearch } from '../components/common/Icons';

interface ReceivablesViewProps {
  onNavigate: (route: AppRoute) => void;
}

export const ReceivablesView: React.FC<ReceivablesViewProps> = ({ onNavigate }) => {
  const invoices = getInvoices();
  const customers = getCustomers();
  const aging = calculateReceivablesAging(invoices);

  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<string[]>([]);
  const [activeInvoiceDetail, setActiveInvoiceDetail] = useState<Invoice | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const filteredInvoices = invoices.filter((inv) => {
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const overdueInvoices = invoices.filter((inv) => inv.status === 'overdue' || inv.daysOverdue > 0);

  const handleSelectAllOverdue = () => {
    if (selectedInvoiceIds.length === overdueInvoices.length) {
      setSelectedInvoiceIds([]);
    } else {
      setSelectedInvoiceIds(overdueInvoices.map((inv) => inv.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    if (selectedInvoiceIds.includes(id)) {
      setSelectedInvoiceIds(selectedInvoiceIds.filter((item) => item !== id));
    } else {
      setSelectedInvoiceIds([...selectedInvoiceIds, id]);
    }
  };

  const handleCreateDraftsFromSelected = () => {
    const targets = invoices.filter((inv) => selectedInvoiceIds.includes(inv.id));
    if (targets.length === 0) return;

    const draftsToQueue = targets.map((inv) => {
      const customer = customers.find((c) => c.id === inv.customerId);
      const contactPerson = customer ? customer.contactPerson : 'Finance / Accounts Desk';
      const email = customer ? customer.email : 'accounts@client.in';

      return {
        type: 'customer_email' as const,
        title: `Payment Follow-up: Invoice ${inv.invoiceNumber} (${inv.daysOverdue} days past terms)`,
        rationale: `Invoice ${inv.invoiceNumber} for ₹${inv.balanceDue.toLocaleString('en-IN')} matured on ${inv.dueDate} and remains unpaid.`,
        recipientName: `${contactPerson} (${inv.customerName})`,
        recipientEmail: email,
        referenceRecord: `${inv.invoiceNumber} / ${inv.customerName}`,
        amount: inv.balanceDue,
        draftSubject: `Payment Status Query: Invoice ${inv.invoiceNumber} — Sahyadri Precision Works`,
        draftBody: `Dear ${contactPerson},\n\nWe trust you are doing well.\n\nWe are writing to follow up on overdue invoice ${inv.invoiceNumber} for ₹${inv.balanceDue.toLocaleString('en-IN')}, which fell due on ${inv.dueDate} (${inv.daysOverdue} days ago).\n\nPlease let us know if payment has been released or scheduled in your next RTGS cycle. Let us know if you require another copy of the invoice or delivery challan.\n\nWarm regards,\nAccounts & Dispatch\nSahyadri Precision Works, Pune`,
      };
    });

    addApprovalItems(draftsToQueue);
    setSelectedInvoiceIds([]);
    setSuccessBanner(`Queued ${draftsToQueue.length} draft reminder email(s) into the Human Approvals Queue.`);

    setTimeout(() => {
      onNavigate('/approvals');
    }, 1500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Title & Actions */}
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
            Receivables & Invoice Aging Management
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '13px', marginTop: '2px' }}>
            Monitor credit aging, filter overdue balances, and initiate human-gated payment reminder drafts.
          </p>
        </div>

        {selectedInvoiceIds.length > 0 && (
          <button
            onClick={handleCreateDraftsFromSelected}
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: '13px' }}
          >
            Create {selectedInvoiceIds.length} Follow-up Draft(s) & Send to Approvals &rarr;
          </button>
        )}
      </div>

      {/* Receivables Aging Metric Strip */}
      <div className="metric-strip">
        <div className="metric-cell">
          <div className="metric-label">Total Outstanding Balance</div>
          <div className="metric-value">{formatLakhs(aging.totalOutstanding)}</div>
          <div className="metric-subtext">
            <span>{formatRupees(aging.totalOutstanding)} across all accounts</span>
          </div>
        </div>

        <div className="metric-cell">
          <div className="metric-label">Total Overdue Receivables</div>
          <div className="metric-value" style={{ color: 'var(--terracotta)' }}>
            {formatLakhs(aging.totalOverdue)}
          </div>
          <div className="metric-subtext">
            <span style={{ color: 'var(--terracotta)', fontWeight: 600 }}>
              {aging.overdueCount} invoices past credit period
            </span>
          </div>
        </div>

        <div className="metric-cell">
          <div className="metric-label">Aging: 1 – 30 Days Past Due</div>
          <div className="metric-value">{formatLakhs(aging.brackets.bracket1_30)}</div>
          <div className="metric-subtext">
            <span>Deccan & Kirloskar accounts ({formatRupees(aging.brackets.bracket1_30)})</span>
          </div>
        </div>

        <div className="metric-cell">
          <div className="metric-label">Aging: 31 – 60 Days Past Due</div>
          <div className="metric-value" style={{ color: 'var(--terracotta)' }}>
            {formatLakhs(aging.brackets.bracket31_60)}
          </div>
          <div className="metric-subtext">
            <span>Modern Auto Tech ({formatRupees(aging.brackets.bracket31_60)})</span>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {successBanner && (
        <div style={{
          padding: '12px 16px',
          backgroundColor: 'var(--evergreen-subtle)',
          border: '1px solid #BCD3C5',
          borderRadius: 'var(--radius-sm)',
          color: 'var(--evergreen-ink)',
          fontSize: '13px',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <IconCheck size={16} />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Invoices List with Search and Filters */}
      <div style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--hairline)',
        borderRadius: 'var(--radius-sm)',
        padding: '20px',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {[
              { id: 'all', label: `All (${invoices.length})` },
              { id: 'overdue', label: `Overdue (${overdueInvoices.length})` },
              { id: 'pending', label: 'Due Soon' },
              { id: 'paid', label: 'Paid' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id as any)}
                className={statusFilter === f.id ? 'btn-primary' : 'btn-secondary'}
                style={{ fontSize: '11px', padding: '4px 10px' }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Search bar & Select All Overdue */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '220px' }}>
              <input
                type="text"
                placeholder="Search invoice or customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-text"
                style={{ fontSize: '12px', paddingLeft: '28px', height: '32px' }}
              />
              <span style={{ position: 'absolute', left: '8px', top: '9px', color: 'var(--muted)' }}>
                <IconSearch size={13} />
              </span>
            </div>

            <button
              onClick={handleSelectAllOverdue}
              className="btn-secondary"
              style={{ fontSize: '11px', padding: '6px 10px' }}
            >
              {selectedInvoiceIds.length === overdueInvoices.length ? 'Deselect Overdue' : 'Select All Overdue'}
            </button>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '36px' }}>Select</th>
                <th>Invoice #</th>
                <th>Customer</th>
                <th>Invoice Date</th>
                <th>Due Date</th>
                <th className="num">Invoice Total</th>
                <th className="num">Balance Due (₹)</th>
                <th>Overdue Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((inv) => {
                const isSelected = selectedInvoiceIds.includes(inv.id);
                const isOverdue = inv.status === 'overdue' || inv.daysOverdue > 0;

                return (
                  <tr
                    key={inv.id}
                    style={{
                      backgroundColor: isSelected ? 'var(--ochre-subtle)' : isOverdue ? 'var(--terracotta-subtle)' : 'transparent',
                    }}
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(inv.id)}
                        disabled={inv.status === 'paid'}
                        aria-label={`Select invoice ${inv.invoiceNumber}`}
                      />
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--ink)' }}>{inv.invoiceNumber}</td>
                    <td style={{ fontWeight: 600 }}>{inv.customerName}</td>
                    <td>{inv.invoiceDate}</td>
                    <td>{inv.dueDate}</td>
                    <td className="num">{formatRupees(inv.totalAmount)}</td>
                    <td className="num" style={{ fontWeight: 700, color: isOverdue ? 'var(--terracotta)' : 'var(--ink)' }}>
                      {formatRupees(inv.balanceDue)}
                    </td>
                    <td>
                      {isOverdue ? (
                        <span className="badge badge-terracotta">
                          {inv.daysOverdue} Days Overdue
                        </span>
                      ) : inv.status === 'paid' ? (
                        <span className="badge badge-evergreen">
                          Settled in Full
                        </span>
                      ) : (
                        <span className="badge badge-neutral">
                          Within Terms
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => setActiveInvoiceDetail(inv)}
                        className="btn-secondary"
                        style={{ fontSize: '11px', padding: '2px 8px' }}
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Detail Drawer */}
      {activeInvoiceDetail && (
        <div className="drawer-panel" role="dialog" aria-labelledby="inv-detail-title">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--hairline)' }}>
            <div>
              <span className={`badge ${activeInvoiceDetail.status === 'overdue' ? 'badge-terracotta' : 'badge-evergreen'}`} style={{ fontSize: '10px' }}>
                {activeInvoiceDetail.status.toUpperCase()}
              </span>
              <h3 id="inv-detail-title" style={{ fontSize: '16px', fontWeight: 600, marginTop: '2px' }}>
                {activeInvoiceDetail.invoiceNumber}
              </h3>
            </div>
            <button onClick={() => setActiveInvoiceDetail(null)} className="btn-ghost" aria-label="Close invoice panel">
              <IconClose size={14} />
            </button>
          </div>

          <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase' }}>Customer</div>
              <div style={{ fontSize: '14px', fontWeight: 600, marginTop: '2px' }}>
                {activeInvoiceDetail.customerName}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase' }}>Invoice Date</div>
                <div style={{ fontSize: '13px', marginTop: '2px' }}>{activeInvoiceDetail.invoiceDate}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase' }}>Payment Due Date</div>
                <div style={{ fontSize: '13px', marginTop: '2px', fontWeight: 600, color: activeInvoiceDetail.daysOverdue > 0 ? 'var(--terracotta)' : 'inherit' }}>
                  {activeInvoiceDetail.dueDate} ({activeInvoiceDetail.daysOverdue > 0 ? `${activeInvoiceDetail.daysOverdue}d overdue` : 'On terms'})
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase' }}>Total Invoiced</div>
                <div style={{ fontSize: '14px', fontWeight: 600, marginTop: '2px' }}>
                  {formatRupees(activeInvoiceDetail.totalAmount)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase' }}>Outstanding Balance</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--terracotta)', marginTop: '2px' }}>
                  {formatRupees(activeInvoiceDetail.balanceDue)}
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Billed Components
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {activeInvoiceDetail.lines.map((l) => (
                  <div key={l.id} style={{ padding: '8px 10px', backgroundColor: 'var(--canvas)', border: '1px solid var(--hairline)', borderRadius: 'var(--radius-sm)', fontSize: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 500 }}>
                      <span>{l.description}</span>
                      <span className="num">{formatRupees(l.amount)}</span>
                    </div>
                    <div style={{ color: 'var(--muted)', fontSize: '11px', marginTop: '2px' }}>
                      Qty: {l.quantity} {l.unit} @ {formatRupees(l.unitPrice)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ padding: '14px 20px', borderTop: '1px solid var(--hairline)', backgroundColor: 'var(--surface-alt)' }}>
            {activeInvoiceDetail.balanceDue > 0 && (
              <button
                onClick={() => {
                  setSelectedInvoiceIds([activeInvoiceDetail.id]);
                  handleCreateDraftsFromSelected();
                  setActiveInvoiceDetail(null);
                }}
                className="btn-primary"
                style={{ width: '100%', fontSize: '13px' }}
              >
                Draft Follow-up Email for this Account &rarr;
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
