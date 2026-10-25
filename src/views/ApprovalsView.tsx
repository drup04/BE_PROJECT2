import React, { useState } from 'react';
import {
  getApprovals,
  updateApprovalItem,
  approveApprovalItem,
  rejectApprovalItem,
  simulateSendApprovalItem,
} from '../services/approvalService';
import { ApprovalItem, ApprovalStatus } from '../types/business';
import { formatRupees } from '../services/financeCalculations';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { IconCheck, IconClose } from '../components/common/Icons';

export const ApprovalsView: React.FC = () => {
  const [approvals, setApprovals] = useState<ApprovalItem[]>(getApprovals());
  const [activeItem, setActiveItem] = useState<ApprovalItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedSubject, setEditedSubject] = useState('');
  const [editedBody, setEditedBody] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApprovalStatus | 'all'>('all');

  // Confirmation Modals
  const [simulateModalItem, setSimulateModalItem] = useState<ApprovalItem | null>(null);
  const [rejectModalItem, setRejectModalItem] = useState<ApprovalItem | null>(null);
  const [rejectReason, setRejectReason] = useState('Payment terms granted extension on direct telephonic call with partner.');
  const [notification, setNotification] = useState<string | null>(null);

  const refreshList = () => {
    setApprovals([...getApprovals()]);
  };

  const openItemDetail = (item: ApprovalItem) => {
    setActiveItem(item);
    setIsEditing(false);
    setEditedSubject(item.draftSubject);
    setEditedBody(item.draftBody);
  };

  const handleSaveEdits = () => {
    if (!activeItem) return;
    const updated = updateApprovalItem(activeItem.id, {
      draftSubject: editedSubject,
      draftBody: editedBody,
    });
    if (updated) {
      setActiveItem(updated);
      setIsEditing(false);
      refreshList();
      setNotification(`Draft text updated for ${updated.referenceRecord}.`);
    }
  };

  const handleApprove = (item: ApprovalItem) => {
    const updated = approveApprovalItem(item.id, 'Rajesh Sharma (Owner)');
    if (updated) {
      setActiveItem(updated);
      refreshList();
      setNotification(`Action approved. You can now execute a simulated transmission.`);
    }
  };

  const handleConfirmReject = () => {
    if (!rejectModalItem) return;
    const updated = rejectApprovalItem(rejectModalItem.id, rejectReason, 'Rajesh Sharma (Owner)');
    if (updated) {
      setActiveItem(updated);
      refreshList();
      setRejectModalItem(null);
      setNotification(`Action rejected and retained in audit log.`);
    }
  };

  const handleConfirmSimulateSend = () => {
    if (!simulateModalItem) return;
    const result = simulateSendApprovalItem(simulateModalItem.id, 'Rajesh Sharma (Owner)');
    if (result.success && result.item) {
      setActiveItem(result.item);
      refreshList();
      setSimulateModalItem(null);
      setNotification(`Simulated dispatch logged for ${result.item.referenceRecord}. No live email was sent.`);
    }
  };

  const filteredApprovals = approvals.filter((a) => {
    return statusFilter === 'all' || a.status === statusFilter;
  });

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
            Human-in-the-Loop Approval Queue
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '13px', marginTop: '2px' }}>
            Sensitive proposals require explicit human review, inline editing, and verified authorization before execution.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <span className="badge badge-ochre" style={{ fontSize: '12px', padding: '4px 10px' }}>
            {approvals.filter((a) => a.status === 'pending').length} Actions Pending Review
          </span>
        </div>
      </div>

      {/* Notification Banner */}
      {notification && (
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
          <span>{notification}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '6px' }}>
        {[
          { id: 'all', label: `All (${approvals.length})` },
          { id: 'pending', label: 'Pending Review' },
          { id: 'approved', label: 'Approved (Ready for Simulation)' },
          { id: 'simulated_sent', label: 'Simulated Sent' },
          { id: 'rejected', label: 'Rejected' },
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

      {/* Approvals Table */}
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Proposed Action</th>
              <th>Customer / Reference</th>
              <th>Recipient</th>
              <th className="num">Balance (₹)</th>
              <th>Created Timestamp</th>
              <th>Review Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApprovals.map((item) => (
              <tr key={item.id}>
                <td>
                  <span className={`badge ${
                    item.status === 'approved'
                      ? 'badge-evergreen'
                      : item.status === 'pending'
                      ? 'badge-ochre'
                      : item.status === 'rejected'
                      ? 'badge-terracotta'
                      : 'badge-neutral'
                  }`}>
                    {item.status.replace('_', ' ')}
                  </span>
                </td>
                <td style={{ fontWeight: 600 }}>{item.title}</td>
                <td>{item.referenceRecord}</td>
                <td style={{ fontSize: '12px', color: 'var(--muted)' }}>{item.recipientName}</td>
                <td className="num" style={{ fontWeight: 600 }}>
                  {item.amount ? formatRupees(item.amount) : '—'}
                </td>
                <td style={{ fontSize: '12px', color: 'var(--muted)' }}>{item.createdAt}</td>
                <td>
                  <span style={{ fontSize: '12px', fontWeight: 500 }}>
                    {item.status === 'pending' && 'Awaiting Human Decision'}
                    {item.status === 'approved' && 'Authorized • Simulation Ready'}
                    {item.status === 'simulated_sent' && 'Simulated Send Complete'}
                    {item.status === 'rejected' && 'Action Declined'}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => openItemDetail(item)}
                    className="btn-secondary"
                    style={{ fontSize: '11px', padding: '3px 8px' }}
                  >
                    Review / Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Approval Item Detail Drawer */}
      {activeItem && (
        <div className="drawer-panel" style={{ width: '560px' }} role="dialog" aria-labelledby="approval-detail-title">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--hairline)' }}>
            <div>
              <span className={`badge ${
                activeItem.status === 'approved'
                  ? 'badge-evergreen'
                  : activeItem.status === 'pending'
                  ? 'badge-ochre'
                  : activeItem.status === 'rejected'
                  ? 'badge-terracotta'
                  : 'badge-neutral'
              }`} style={{ fontSize: '10px' }}>
                STATUS: {activeItem.status.toUpperCase().replace('_', ' ')}
              </span>
              <h3 id="approval-detail-title" style={{ fontSize: '16px', fontWeight: 600, marginTop: '2px' }}>
                {activeItem.title}
              </h3>
            </div>
            <button onClick={() => setActiveItem(null)} className="btn-ghost" aria-label="Close approval panel">
              <IconClose size={14} />
            </button>
          </div>

          <div style={{ padding: '20px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* System Rationale & Boundary */}
            <div style={{ padding: '12px', backgroundColor: 'var(--canvas)', border: '1px solid var(--hairline)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '2px' }}>
                Operational Rationale
              </div>
              <div style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.5 }}>
                {activeItem.rationale}
              </div>
            </div>

            {/* Impacted Entity Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase' }}>Recipient</div>
                <div style={{ fontSize: '13px', fontWeight: 600, marginTop: '2px' }}>{activeItem.recipientName}</div>
                <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{activeItem.recipientEmail}</div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase' }}>Overdue Balance</div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--terracotta)', marginTop: '2px' }}>
                  {activeItem.amount ? formatRupees(activeItem.amount) : '—'}
                </div>
              </div>
            </div>

            {/* Draft Content (With Inline Editing) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase' }}>
                  Email Draft Text (Human Editable)
                </label>
                {activeItem.status === 'pending' && !isEditing && (
                  <button onClick={() => setIsEditing(true)} className="btn-secondary" style={{ fontSize: '11px', padding: '2px 8px' }}>
                    Edit Draft
                  </button>
                )}
                {isEditing && (
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => setIsEditing(false)} className="btn-ghost" style={{ fontSize: '11px', padding: '2px 6px' }}>
                      Cancel
                    </button>
                    <button onClick={handleSaveEdits} className="btn-primary" style={{ fontSize: '11px', padding: '2px 8px' }}>
                      Save Edits
                    </button>
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Subject: </span>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedSubject}
                    onChange={(e) => setEditedSubject(e.target.value)}
                    className="input-text"
                    style={{ fontSize: '12px', marginTop: '4px' }}
                  />
                ) : (
                  <strong style={{ fontSize: '13px' }}>{activeItem.draftSubject}</strong>
                )}
              </div>

              {isEditing ? (
                <textarea
                  value={editedBody}
                  onChange={(e) => setEditedBody(e.target.value)}
                  className="textarea-field"
                  rows={8}
                  style={{ fontSize: '12px', fontFamily: 'inherit' }}
                />
              ) : (
                <div style={{
                  padding: '12px',
                  backgroundColor: 'var(--surface-alt)',
                  border: '1px solid var(--hairline)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12px',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                }}>
                  {activeItem.draftBody}
                </div>
              )}
            </div>

            {/* Notes if rejected */}
            {activeItem.notes && (
              <div style={{ padding: '10px 12px', backgroundColor: 'var(--terracotta-subtle)', border: '1px solid #E8C1B7', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '11px', color: 'var(--terracotta-ink)', fontWeight: 600, textTransform: 'uppercase' }}>
                  Rejection Reason
                </div>
                <div style={{ fontSize: '12px', color: 'var(--terracotta-ink)', marginTop: '2px' }}>
                  {activeItem.notes}
                </div>
              </div>
            )}

            {/* Human Gate Disclaimer */}
            <div style={{ fontSize: '11px', color: 'var(--muted)', fontStyle: 'italic', lineHeight: 1.4 }}>
              Safety Protocol: The system cannot simulate transmission until explicit human approval is confirmed. No real email or network message leaves this prototype environment.
            </div>
          </div>

          {/* Action Footer */}
          <div style={{
            padding: '16px 20px',
            borderTop: '1px solid var(--hairline)',
            backgroundColor: 'var(--surface-alt)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            {activeItem.status === 'pending' && (
              <>
                <button
                  onClick={() => setRejectModalItem(activeItem)}
                  className="btn-danger"
                  style={{ fontSize: '12px' }}
                >
                  Reject Proposal
                </button>
                <button
                  onClick={() => handleApprove(activeItem)}
                  className="btn-primary"
                  style={{ fontSize: '12px' }}
                >
                  Authorize & Approve Action &rarr;
                </button>
              </>
            )}

            {activeItem.status === 'approved' && (
              <button
                onClick={() => setSimulateModalItem(activeItem)}
                className="btn-primary"
                style={{ width: '100%', fontSize: '13px' }}
              >
                Execute Simulated Email Transmission &rarr;
              </button>
            )}

            {(activeItem.status === 'simulated_sent' || activeItem.status === 'rejected') && (
              <div style={{ fontSize: '12px', color: 'var(--muted)', textAlign: 'center', width: '100%' }}>
                Decision finalized and permanently logged in audit trail.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Modal for Simulated Send */}
      {simulateModalItem && (
        <ConfirmModal
          isOpen={true}
          title="Confirm Simulated Email Transmission"
          message={`You are about to simulate sending this follow-up email to ${simulateModalItem.recipientName} (${simulateModalItem.recipientEmail}).`}
          warningText="This action logs a simulated dispatch event into the audit trail. No real emails or third-party SMTP transmissions will occur."
          confirmLabel="Execute Simulated Send"
          cancelLabel="Go Back"
          onConfirm={handleConfirmSimulateSend}
          onCancel={() => setSimulateModalItem(null)}
        />
      )}

      {/* Modal for Rejection with editable reason */}
      {rejectModalItem && (
        <div className="modal-overlay" onClick={() => setRejectModalItem(null)} role="dialog" aria-modal="true" aria-labelledby="reject-title">
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--hairline)' }}>
              <h3 id="reject-title" style={{ fontSize: '16px', fontWeight: 600, color: 'var(--terracotta)' }}>
                Reject Proposed Action
              </h3>
              <button onClick={() => setRejectModalItem(null)} className="btn-ghost" aria-label="Close dialog">
                <IconClose size={14} />
              </button>
            </div>
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p style={{ fontSize: '13px', color: 'var(--ink)' }}>
                Please state the operational rationale for declining this proposal for <strong>{rejectModalItem.referenceRecord}</strong>.
              </p>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Rejection Reason (Recorded in Audit Trail) *
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="textarea-field"
                  rows={3}
                  style={{ fontSize: '12px' }}
                />
              </div>
              <div style={{
                backgroundColor: 'var(--terracotta-subtle)',
                border: '1px solid #E8C1B7',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 12px',
                fontSize: '12px',
                color: 'var(--terracotta-ink)',
              }}>
                <strong>Audit Note:</strong> The rejected draft and this rationale will be permanently retained in the activity audit trail.
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', padding: '14px 20px', borderTop: '1px solid var(--hairline)', backgroundColor: 'var(--surface-alt)' }}>
              <button onClick={() => setRejectModalItem(null)} className="btn-secondary">
                Cancel
              </button>
              <button onClick={handleConfirmReject} className="btn-danger">
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
