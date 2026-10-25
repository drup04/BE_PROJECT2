import React from 'react';
import { BRAND_CONFIG } from '../config/brand';

export const PrivacyView: React.FC = () => {
  return (
    <div style={{
      maxWidth: '820px',
      margin: '0 auto',
      backgroundColor: 'var(--surface)',
      border: '1px solid var(--hairline)',
      borderRadius: 'var(--radius-sm)',
      padding: '32px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    }}>
      <div>
        <span className="badge badge-ochre" style={{ marginBottom: '8px' }}>
          Prototype Scope Disclaimer
        </span>
        <h2 className="display-serif" style={{ fontSize: '26px', fontWeight: 600 }}>
          Privacy & Synthetic Demo Data Statement
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: '13px', marginTop: '4px' }}>
          Document draft version 1.0 • For prototype verification only. Not legal advice.
        </p>
      </div>

      <div style={{
        padding: '14px 16px',
        backgroundColor: 'var(--ochre-subtle)',
        border: '1px solid #ECDAB8',
        borderRadius: 'var(--radius-sm)',
        fontSize: '13px',
        lineHeight: 1.5,
        color: 'var(--ochre-ink)',
      }}>
        <strong>Notice:</strong> {BRAND_CONFIG.productName} is an educational prototype demonstrating agentic workflows, deterministic ledger arithmetic, and human-in-the-loop approvals. No live customer data or external communication systems are connected.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px', lineHeight: 1.6, color: 'var(--ink)' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ink)', marginTop: '8px' }}>
          1. Synthetic Sample Data
        </h3>
        <p>
          All corporate entities (e.g. Modern Auto Tech Pvt Ltd, Deccan Hydraulic Systems, etc.), individuals, contact addresses, phone numbers, GSTIN numbers, invoice values, and expense records in this application are purely fictitious synthetic data generated for software demonstration purposes. Any resemblance to real commercial entities or living individuals is purely coincidental.
        </p>

        <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ink)', marginTop: '8px' }}>
          2. Simulated Communications & Network Isolation
        </h3>
        <p>
          The platform does not connect to any live SMTP email server, SMS gateway, WhatsApp API, or third-party messaging service. Actions labeled &ldquo;Simulate send&rdquo; only record an event within the local prototype audit database to demonstrate state transitions. No real network transmission to customers or suppliers will ever occur.
        </p>

        <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ink)', marginTop: '8px' }}>
          3. Local Client-Side Execution
        </h3>
        <p>
          This Phase 1 prototype runs completely inside your browser using deterministic TypeScript calculation functions and browser local storage. No financial data or prompt queries are transmitted to third-party large language models, cloud servers, or commercial tracking networks.
        </p>

        <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ink)', marginTop: '8px' }}>
          4. Prototype Legal Notice
        </h3>
        <p>
          This document represents draft prototype descriptive text. It does not constitute a formal privacy policy, terms of service, regulatory compliance claim (such as under the Digital Personal Data Protection Act of India), or warranty of data fitness for accounting decisions.
        </p>
      </div>
    </div>
  );
};
