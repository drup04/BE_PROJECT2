import React, { useState } from 'react';
import { getQuotations, getCustomers, getProducts, addQuotation } from '../services/businessData';
import { calculateQuotationTotals, formatRupees } from '../services/financeCalculations';
import { Quotation, QuotationLine, QuotationStatus } from '../types/business';
import { BRAND_CONFIG } from '../config/brand';
import { IconClose } from '../components/common/Icons';

export const QuotationsView: React.FC = () => {
  const [quotations, setQuotations] = useState<Quotation[]>(getQuotations());
  const customers = getCustomers();
  const products = getProducts();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [previewQuote, setPreviewQuote] = useState<Quotation | null>(null);
  const [statusFilter, setStatusFilter] = useState<QuotationStatus | 'all'>('all');

  // Form State
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '');
  const [validDays, setValidDays] = useState(30);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [gstRate, setGstRate] = useState(BRAND_CONFIG.defaultGstRate);
  const [notes, setNotes] = useState('Payment terms: 30 days from dispatch. Delivery at customer factory gate.');
  const [formLines, setFormLines] = useState<Array<{ productId: string; quantity: number; unitPrice: number }>>([
    { productId: products[0]?.id || '', quantity: 200, unitPrice: products[0]?.unitPrice || 450 },
  ]);
  const [formError, setFormError] = useState<string | null>(null);

  // Dynamic Totals Calculation
  const calculation = calculateQuotationTotals({
    lines: formLines,
    discountPercent,
    gstRate,
  });

  const handleAddLine = () => {
    const defaultProd = products[0];
    setFormLines([
      ...formLines,
      { productId: defaultProd.id, quantity: 100, unitPrice: defaultProd.unitPrice },
    ]);
  };

  const handleRemoveLine = (idx: number) => {
    if (formLines.length === 1) return;
    setFormLines(formLines.filter((_, i) => i !== idx));
  };

  const handleProductChange = (idx: number, productId: string) => {
    const product = products.find((p) => p.id === productId);
    const updated = [...formLines];
    updated[idx] = {
      productId,
      quantity: updated[idx].quantity,
      unitPrice: product ? product.unitPrice : 0,
    };
    setFormLines(updated);
  };

  const handleQtyChange = (idx: number, qty: number) => {
    const updated = [...formLines];
    updated[idx] = {
      ...updated[idx],
      quantity: Math.max(1, qty),
    };
    setFormLines(updated);
  };

  const handlePriceChange = (idx: number, price: number) => {
    const updated = [...formLines];
    updated[idx] = {
      ...updated[idx],
      unitPrice: Math.max(0, price),
    };
    setFormLines(updated);
  };

  const handleSaveQuotation = (asStatus: QuotationStatus = 'draft') => {
    setFormError(null);
    const customer = customers.find((c) => c.id === selectedCustomerId);
    if (!customer) {
      setFormError('Please select a valid customer.');
      return;
    }

    if (formLines.length === 0 || formLines.some((l) => l.quantity <= 0 || l.unitPrice <= 0)) {
      setFormError('All quotation lines must have positive quantities and unit prices.');
      return;
    }

    const today = new Date();
    const createdDate = today.toISOString().split('T')[0];
    const validDateObj = new Date(today);
    validDateObj.setDate(today.getDate() + validDays);
    const validUntilDate = validDateObj.toISOString().split('T')[0];

    const quoteLines: QuotationLine[] = formLines.map((fl, i) => {
      const prod = products.find((p) => p.id === fl.productId);
      return {
        id: `ql-${Date.now()}-${i}`,
        productId: fl.productId,
        description: prod ? prod.name : 'Machined Component',
        quantity: fl.quantity,
        unitPrice: fl.unitPrice,
        amount: Math.round(fl.quantity * fl.unitPrice),
      };
    });

    const newQuote: Quotation = {
      id: `qt-${Date.now()}`,
      quoteNumber: `QT-26-${String(quotations.length + 20).padStart(3, '0')}`,
      customerId: customer.id,
      customerName: customer.companyName,
      createdDate,
      validUntilDate,
      status: asStatus,
      lines: quoteLines,
      subtotal: calculation.subtotal,
      discountPercent: calculation.discountPercent,
      discountAmount: calculation.discountAmount,
      gstRate: calculation.gstRate,
      gstAmount: calculation.gstAmount,
      grandTotal: calculation.grandTotal,
      notes,
    };

    const saved = addQuotation(newQuote);
    setQuotations(getQuotations());
    setIsFormOpen(false);
    setPreviewQuote(saved);
  };

  const filteredQuotes = quotations.filter((q) => {
    return statusFilter === 'all' || q.status === statusFilter;
  });

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
            Sales & Quotations Register
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '13px', marginTop: '2px' }}>
            Prepare, calculate GST, and record formal customer price quotes for precision component orders.
          </p>
        </div>

        <button
          onClick={() => {
            setFormError(null);
            setIsFormOpen(true);
          }}
          className="btn-primary"
          style={{ padding: '8px 16px', fontSize: '13px' }}
        >
          + Prepare New Quotation
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {[
          { id: 'all', label: 'All Quotations' },
          { id: 'draft', label: 'Draft' },
          { id: 'sent_demo', label: 'Sent in Demo' },
          { id: 'accepted', label: 'Accepted Orders' },
          { id: 'expired', label: 'Expired' },
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

      {/* Quotations Register Table */}
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Quote #</th>
              <th>Customer</th>
              <th>Created</th>
              <th>Valid Until</th>
              <th className="num">Subtotal</th>
              <th className="num">18% GST</th>
              <th className="num">Grand Total (₹)</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuotes.map((q) => (
              <tr key={q.id}>
                <td style={{ fontWeight: 600, color: 'var(--ink)' }}>{q.quoteNumber}</td>
                <td style={{ fontWeight: 600 }}>{q.customerName}</td>
                <td>{q.createdDate}</td>
                <td>{q.validUntilDate}</td>
                <td className="num">{formatRupees(q.subtotal)}</td>
                <td className="num">{formatRupees(q.gstAmount)}</td>
                <td className="num" style={{ fontWeight: 700, color: 'var(--ink)' }}>
                  {formatRupees(q.grandTotal)}
                </td>
                <td>
                  <span className={`badge ${
                    q.status === 'accepted'
                      ? 'badge-evergreen'
                      : q.status === 'draft'
                      ? 'badge-ochre'
                      : q.status === 'expired'
                      ? 'badge-terracotta'
                      : 'badge-neutral'
                  }`}>
                    {q.status.replace('_', ' ')}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => setPreviewQuote(q)}
                    className="btn-secondary"
                    style={{ fontSize: '11px', padding: '3px 8px' }}
                  >
                    Preview
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Quotation Creation Modal */}
      {isFormOpen && (
        <div className="modal-overlay" onClick={() => setIsFormOpen(false)} role="dialog" aria-modal="true" aria-labelledby="new-quote-title">
          <div className="modal-content" style={{ maxWidth: '780px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--hairline)' }}>
              <div>
                <span className="badge badge-evergreen" style={{ fontSize: '10px', marginBottom: '2px' }}>
                  Interactive Calculation Form
                </span>
                <h3 id="new-quote-title" style={{ fontSize: '16px', fontWeight: 600 }}>
                  Create Customer Quotation
                </h3>
              </div>
              <button onClick={() => setIsFormOpen(false)} className="btn-ghost" aria-label="Close quote form">
                <IconClose size={14} />
              </button>
            </div>

            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {formError && (
                <div style={{
                  padding: '10px 14px',
                  backgroundColor: 'var(--terracotta-subtle)',
                  border: '1px solid #E8C1B7',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12px',
                  color: 'var(--terracotta-ink)',
                }}>
                  {formError}
                </div>
              )}

              {/* Customer & Validity row */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Customer Account *
                  </label>
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                    className="select-field"
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.companyName} ({c.city})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Validity (Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="90"
                    value={validDays}
                    onChange={(e) => setValidDays(Number(e.target.value))}
                    className="input-text"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                    GST Rate (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="28"
                    value={gstRate}
                    onChange={(e) => setGstRate(Number(e.target.value))}
                    className="input-text"
                  />
                </div>
              </div>

              {/* Line Items */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase' }}>
                    Component Line Items
                  </label>
                  <button onClick={handleAddLine} className="btn-secondary" style={{ fontSize: '11px', padding: '2px 8px' }}>
                    + Add Item
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {formLines.map((line, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '3fr 1fr 1fr 1fr auto',
                        gap: '8px',
                        alignItems: 'center',
                        padding: '8px 10px',
                        backgroundColor: 'var(--canvas)',
                        border: '1px solid var(--hairline)',
                        borderRadius: 'var(--radius-sm)',
                      }}
                    >
                      <div>
                        <select
                          value={line.productId}
                          onChange={(e) => handleProductChange(idx, e.target.value)}
                          className="select-field"
                          style={{ fontSize: '12px' }}
                        >
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} (HSN: {p.hsnCode})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <input
                          type="number"
                          min="1"
                          value={line.quantity}
                          onChange={(e) => handleQtyChange(idx, Number(e.target.value))}
                          placeholder="Qty"
                          className="input-text"
                          style={{ fontSize: '12px' }}
                        />
                      </div>

                      <div>
                        <input
                          type="number"
                          min="0"
                          value={line.unitPrice}
                          onChange={(e) => handlePriceChange(idx, Number(e.target.value))}
                          placeholder="Unit Price"
                          className="input-text"
                          style={{ fontSize: '12px' }}
                        />
                      </div>

                      <div className="num" style={{ fontWeight: 600, fontSize: '12px', textAlign: 'right' }}>
                        {formatRupees(line.quantity * line.unitPrice)}
                      </div>

                      <div>
                        <button
                          onClick={() => handleRemoveLine(idx)}
                          disabled={formLines.length === 1}
                          className="btn-ghost"
                          style={{ color: 'var(--terracotta)', padding: '4px' }}
                          title="Remove line"
                        >
                          &times;
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Discount and Summary Calculations */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'flex-start' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Special Discount (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    className="input-text"
                    style={{ width: '120px' }}
                  />

                  <div style={{ marginTop: '12px' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                      Commercial Terms / Notes
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="textarea-field"
                      rows={2}
                      style={{ fontSize: '12px' }}
                    />
                  </div>
                </div>

                {/* Calculation Summary Box */}
                <div style={{
                  padding: '12px 16px',
                  backgroundColor: 'var(--surface-alt)',
                  border: '1px solid var(--hairline-strong)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  fontSize: '13px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--muted)' }}>Subtotal:</span>
                    <span className="num" style={{ fontWeight: 500 }}>{formatRupees(calculation.subtotal)}</span>
                  </div>

                  {calculation.discountAmount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--evergreen)' }}>
                      <span>Discount ({calculation.discountPercent}%):</span>
                      <span className="num">- {formatRupees(calculation.discountAmount)}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--muted)' }}>Taxable Amount:</span>
                    <span className="num" style={{ fontWeight: 500 }}>{formatRupees(calculation.taxableAmount)}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--muted)' }}>GST @ {calculation.gstRate}%:</span>
                    <span className="num" style={{ fontWeight: 500 }}>{formatRupees(calculation.gstAmount)}</span>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderTop: '1px solid var(--hairline)',
                    paddingTop: '6px',
                    fontWeight: 700,
                    fontSize: '15px',
                    color: 'var(--ink)',
                  }}>
                    <span>Grand Total:</span>
                    <span className="num">{formatRupees(calculation.grandTotal)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', padding: '14px 20px', borderTop: '1px solid var(--hairline)', backgroundColor: 'var(--surface-alt)' }}>
              <button onClick={() => setIsFormOpen(false)} className="btn-secondary">
                Cancel
              </button>
              <button onClick={() => handleSaveQuotation('draft')} className="btn-secondary">
                Save as Draft
              </button>
              <button onClick={() => handleSaveQuotation('sent_demo')} className="btn-primary">
                Save & Simulate Send &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Quotation Preview Drawer / Modal */}
      {previewQuote && (
        <div className="modal-overlay" onClick={() => setPreviewQuote(null)} role="dialog" aria-modal="true" aria-labelledby="preview-quote-title">
          <div className="modal-content" style={{ maxWidth: '720px', backgroundColor: '#FFFFFF' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--hairline)', backgroundColor: 'var(--surface)' }}>
              <div>
                <span className="badge badge-neutral" style={{ fontSize: '10px' }}>
                  FORMAL COMMERCIAL QUOTE
                </span>
                <h3 id="preview-quote-title" style={{ fontSize: '16px', fontWeight: 600 }}>
                  {previewQuote.quoteNumber}
                </h3>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => window.print()} className="btn-secondary" style={{ fontSize: '12px' }}>
                  Print Quote
                </button>
                <button onClick={() => setPreviewQuote(null)} className="btn-ghost" aria-label="Close preview">
                  <IconClose size={14} />
                </button>
              </div>
            </div>

            {/* Printable Document Body */}
            <div style={{ padding: '30px', color: '#111111', fontSize: '13px', lineHeight: 1.5 }}>
              {/* Header Letterhead */}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #222222', paddingBottom: '16px', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#111111' }}>{BRAND_CONFIG.companyName}</h2>
                  <div style={{ fontSize: '12px', color: '#555555' }}>{BRAND_CONFIG.location}</div>
                  <div style={{ fontSize: '12px', color: '#555555' }}>GSTIN: 27AABCS9821R1Z3</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '16px', fontWeight: 700 }}>QUOTATION</div>
                  <div style={{ fontSize: '12px', color: '#555555' }}>Quote #: <strong>{previewQuote.quoteNumber}</strong></div>
                  <div style={{ fontSize: '12px', color: '#555555' }}>Date: {previewQuote.createdDate}</div>
                  <div style={{ fontSize: '12px', color: '#555555' }}>Valid Until: {previewQuote.validUntilDate}</div>
                </div>
              </div>

              {/* Recipient */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#777777', fontWeight: 600 }}>Quotation Prepared For:</div>
                <div style={{ fontSize: '15px', fontWeight: 700, marginTop: '2px' }}>{previewQuote.customerName}</div>
              </div>

              {/* Table of items */}
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #CCCCCC', backgroundColor: '#F5F5F5' }}>
                    <th style={{ padding: '8px', textAlign: 'left', fontSize: '11px' }}>#</th>
                    <th style={{ padding: '8px', textAlign: 'left', fontSize: '11px' }}>Item Description</th>
                    <th style={{ padding: '8px', textAlign: 'right', fontSize: '11px' }}>Qty</th>
                    <th style={{ padding: '8px', textAlign: 'right', fontSize: '11px' }}>Unit Rate (₹)</th>
                    <th style={{ padding: '8px', textAlign: 'right', fontSize: '11px' }}>Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {previewQuote.lines.map((l, i) => (
                    <tr key={l.id} style={{ borderBottom: '1px solid #EEEEEE' }}>
                      <td style={{ padding: '8px' }}>{i + 1}</td>
                      <td style={{ padding: '8px', fontWeight: 500 }}>{l.description}</td>
                      <td style={{ padding: '8px', textAlign: 'right' }}>{l.quantity}</td>
                      <td style={{ padding: '8px', textAlign: 'right' }}>{formatRupees(l.unitPrice)}</td>
                      <td style={{ padding: '8px', textAlign: 'right', fontWeight: 600 }}>{formatRupees(l.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals Section */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
                <div style={{ width: '260px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#666666' }}>Subtotal:</span>
                    <span style={{ fontWeight: 600 }}>{formatRupees(previewQuote.subtotal)}</span>
                  </div>
                  {previewQuote.discountAmount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2E7D32' }}>
                      <span>Discount ({previewQuote.discountPercent}%):</span>
                      <span>- {formatRupees(previewQuote.discountAmount)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#666666' }}>GST @ {previewQuote.gstRate}%:</span>
                    <span>{formatRupees(previewQuote.gstAmount)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #222222', paddingTop: '6px', fontSize: '15px', fontWeight: 700 }}>
                    <span>Grand Total:</span>
                    <span>{formatRupees(previewQuote.grandTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {previewQuote.notes && (
                <div style={{ padding: '12px', backgroundColor: '#F9F9F9', border: '1px solid #E0E0E0', borderRadius: '4px', fontSize: '12px' }}>
                  <strong>Terms & Conditions:</strong> {previewQuote.notes}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
