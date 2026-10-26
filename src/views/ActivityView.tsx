import React, { useState } from 'react';
import { getAuditEvents } from '../services/auditService';
import { AuditEvent } from '../types/business';
import { IconSearch } from '../components/common/Icons';

export const ActivityView: React.FC = () => {
  const [events] = useState<AuditEvent[]>(getAuditEvents());
  const [selectedCategory, setSelectedCategory] = useState<AuditEvent['category'] | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = events.filter((ev) => {
    const matchesCategory = selectedCategory === 'all' || ev.category === selectedCategory;
    const matchesSearch =
      ev.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.recordReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.actor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
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
            Chronological Audit & Activity Log
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '13px', marginTop: '2px' }}>
            Immutable trace recording deterministic task runs, ledger verifications, human approvals, and simulated actions.
          </p>
        </div>

        <div style={{ position: 'relative', width: '260px' }}>
          <input
            type="text"
            placeholder="Search audit trail..."
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

      {/* Category Filter Tabs */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {[
          { id: 'all', label: `All Events (${events.length})` },
          { id: 'task', label: 'Task Runs' },
          { id: 'calculation', label: 'Deterministic Math' },
          { id: 'approval', label: 'Human Approvals' },
          { id: 'simulation', label: 'Simulations' },
          { id: 'sales', label: 'Sales & Quotes' },
          { id: 'system', label: 'System' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setSelectedCategory(f.id as any)}
            className={selectedCategory === f.id ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '11px', padding: '4px 10px' }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Audit Log Table */}
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Actor</th>
              <th>Category</th>
              <th>Action Taken</th>
              <th>Record Reference</th>
              <th>Result</th>
              <th>Operational Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((ev) => (
              <tr key={ev.id}>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', whiteSpace: 'nowrap' }}>
                  {ev.timestamp}
                </td>
                <td style={{ fontWeight: 600, fontSize: '12px', whiteSpace: 'nowrap' }}>
                  {ev.actor}
                </td>
                <td>
                  <span className="badge badge-neutral" style={{ fontSize: '10px' }}>
                    {ev.category}
                  </span>
                </td>
                <td style={{ fontWeight: 600, color: 'var(--ink)' }}>{ev.action}</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)' }}>
                  {ev.recordReference}
                </td>
                <td>
                  <span className={`badge ${
                    ev.result === 'success'
                      ? 'badge-evergreen'
                      : ev.result === 'warning'
                      ? 'badge-ochre'
                      : ev.result === 'rejected'
                      ? 'badge-terracotta'
                      : 'badge-neutral'
                  }`} style={{ fontSize: '10px' }}>
                    {ev.result}
                  </span>
                </td>
                <td style={{ fontSize: '12px', color: 'var(--ink-secondary)', maxWidth: '420px', lineHeight: 1.4 }}>
                  {ev.details}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
