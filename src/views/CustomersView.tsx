import React, { useState } from 'react';
import { getCustomers, getInvoices, getQuotations } from '../services/businessData';
import { formatRupees } from '../services/financeCalculations';
import { Customer } from '../types/business';
import { IconClose, IconSearch } from '../components/common/Icons';

export const CustomersView: React.FC = () => {
  const customers = getCustomers();
  const invoices = getInvoices();
  const quotations = getQuotations();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'watch'>('all');
  const [activeCustomer, setActiveCustomer] = useState<Customer | null>(null);

  const filteredCustomers = customers.filter((c) => {
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesSearch =
      c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getCustomerInvoices = (customerId: string) => {
    return invoices.filter((inv) => inv.customerId === customerId);
  };

  const getCustomerQuotations = (customerId: string) => {
    return quotations.filter((q) => q.customerId === customerId);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Title */}
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
            Customer Directory & Accounts Register
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '13px', marginTop: '2px' }}>
            Verified Indian OEM & tier-1 engineering component buyers across Pune industrial clusters.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '240px' }}>
            <input
              type="text"
              placeholder="Search company, contact, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-text"
              style={{ fontSize: '12px', paddingLeft: '28px', height: '34px' }}
            />
            <span style={{ position: 'absolute', left: '8px', top: '10px', color: 'var(--muted)' }}>
              <IconSearch size={13} />
            </span>
          </div>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div style={{ display: 'flex', gap: '6px' }}>
        {[
          { id: 'all', label: `All Accounts (${customers.length})` },
          { id: 'active', label: 'Active Standard Terms' },
          { id: 'watch', label: 'Watch / Credit Overdue' },
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

      {/* Customer Directory Table */}
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Account Code</th>
              <th>Enterprise Name</th>
              <th>Key Contact Person</th>
              <th>Industrial Hub</th>
              <th>GSTIN</th>
              <th>Credit Terms</th>
              <th className="num">Outstanding Balance (₹)</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((cust) => (
              <tr key={cust.id}>
                <td style={{ fontWeight: 600, color: 'var(--muted)' }}>{cust.code}</td>
                <td style={{ fontWeight: 600, color: 'var(--ink)' }}>{cust.companyName}</td>
                <td>
                  <div>{cust.contactPerson}</div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{cust.email}</div>
                </td>
                <td>{cust.city}</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{cust.gstin}</td>
                <td>{cust.paymentTermsDays} Days Net</td>
                <td className="num" style={{ fontWeight: 700, color: cust.outstandingBalance > 0 ? 'var(--terracotta)' : 'inherit' }}>
                  {formatRupees(cust.outstandingBalance)}
                </td>
                <td>
                  <span className={`badge ${cust.status === 'watch' ? 'badge-terracotta' : 'badge-evergreen'}`}>
                    {cust.status === 'watch' ? 'Overdue Watch' : 'Standard'}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => setActiveCustomer(cust)}
                    className="btn-secondary"
                    style={{ fontSize: '11px', padding: '3px 8px' }}
                  >
                    View Account
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Customer Detail Drawer */}
      {activeCustomer && (
        <div className="drawer-panel" role="dialog" aria-labelledby="cust-detail-title">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--hairline)' }}>
            <div>
              <span className={`badge ${activeCustomer.status === 'watch' ? 'badge-terracotta' : 'badge-evergreen'}`} style={{ fontSize: '10px' }}>
                {activeCustomer.status.toUpperCase()} ACCOUNT
              </span>
              <h3 id="cust-detail-title" style={{ fontSize: '16px', fontWeight: 600, marginTop: '2px' }}>
                {activeCustomer.companyName}
              </h3>
            </div>
            <button onClick={() => setActiveCustomer(null)} className="btn-ghost" aria-label="Close customer panel">
              <IconClose size={14} />
            </button>
          </div>

          <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase' }}>Contact Person</div>
                <div style={{ fontSize: '13px', fontWeight: 600, marginTop: '2px' }}>{activeCustomer.contactPerson}</div>
                <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{activeCustomer.phone}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase' }}>Location & GSTIN</div>
                <div style={{ fontSize: '13px', marginTop: '2px' }}>{activeCustomer.city}</div>
                <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>{activeCustomer.gstin}</div>
              </div>
            </div>

            <div style={{
              padding: '12px',
              backgroundColor: activeCustomer.outstandingBalance > 0 ? 'var(--terracotta-subtle)' : 'var(--surface-alt)',
              border: '1px solid',
              borderColor: activeCustomer.outstandingBalance > 0 ? '#E8C1B7' : 'var(--hairline)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase' }}>Outstanding Balance</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: activeCustomer.outstandingBalance > 0 ? 'var(--terracotta)' : 'var(--ink)' }}>
                  {formatRupees(activeCustomer.outstandingBalance)}
                </div>
              </div>
              <div>
                <span className="badge badge-neutral">{activeCustomer.paymentTermsDays} Days Terms</span>
              </div>
            </div>

            {/* Linked Invoices */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Linked Invoices ({getCustomerInvoices(activeCustomer.id).length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {getCustomerInvoices(activeCustomer.id).map((inv) => (
                  <div key={inv.id} style={{ padding: '8px 10px', backgroundColor: 'var(--canvas)', border: '1px solid var(--hairline)', borderRadius: 'var(--radius-sm)', fontSize: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 600 }}>{inv.invoiceNumber}</span>
                      <span className="num" style={{ fontWeight: 600 }}>{formatRupees(inv.totalAmount)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px', color: 'var(--muted)', fontSize: '11px' }}>
                      <span>Due: {inv.dueDate}</span>
                      <span style={{ color: inv.daysOverdue > 0 ? 'var(--terracotta)' : 'inherit' }}>
                        {inv.daysOverdue > 0 ? `${inv.daysOverdue}d overdue (Bal: ${formatRupees(inv.balanceDue)})` : 'Paid / On terms'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Linked Quotations */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Quotation History ({getCustomerQuotations(activeCustomer.id).length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {getCustomerQuotations(activeCustomer.id).map((q) => (
                  <div key={q.id} style={{ padding: '8px 10px', backgroundColor: 'var(--canvas)', border: '1px solid var(--hairline)', borderRadius: 'var(--radius-sm)', fontSize: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 600 }}>{q.quoteNumber}</span>
                      <span className="num">{formatRupees(q.grandTotal)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px', color: 'var(--muted)', fontSize: '11px' }}>
                      <span>Date: {q.createdDate}</span>
                      <span className={`badge ${q.status === 'accepted' ? 'badge-evergreen' : 'badge-neutral'}`} style={{ fontSize: '9px' }}>
                        {q.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
