import React from 'react';
import { BRAND_CONFIG } from '../config/brand';

export const TermsView: React.FC = () => {
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
        <span className="badge badge-neutral" style={{ marginBottom: '8px' }}>
          Educational Prototype Terms
        </span>
        <h2 className="display-serif" style={{ fontSize: '26px', fontWeight: 600 }}>
          Terms of Prototype Demonstration
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: '13px', marginTop: '4px' }}>
          Draft copy • Subject to formal legal and commercial review.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px', lineHeight: 1.6, color: 'var(--ink)' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600 }}>1. Demonstration Purpose Only</h3>
        <p>
          {BRAND_CONFIG.productName} is provided solely as an interactive academic and engineering proof of concept. The software demonstrates how agentic goal decomposition, deterministic financial calculations, transparent invoice tracing, and human authorization gates can function inside MSME operational workflows.
        </p>

        <h3 style={{ fontSize: '16px', fontWeight: 600 }}>2. No Financial, Tax, or Legal Advice</h3>
        <p>
          Calculations performed within this software (including 18% GST computations, gross margins, period-over-period profit movement, and receivables aging) are illustrative and must not be used for actual commercial tax filing, legal claims, statutory audit submission, or banking covenants.
        </p>

        <h3 style={{ fontSize: '16px', fontWeight: 600 }}>3. Human-in-the-Loop Requirement</h3>
        <p>
          The system design strictly mandates human verification before any proposed action is recorded or executed. Users acknowledge that automated task analyses are operational suggestions based on local sample records and require explicit confirmation by authorized business personnel.
        </p>

        <h3 style={{ fontSize: '16px', fontWeight: 600 }}>4. Limitation of Liability</h3>
        <p>
          This prototype is provided &ldquo;as is&rdquo; without warranty of any kind, either expressed or implied. The creators and developers disclaim all liability for any direct, indirect, or consequential damages resulting from the use or interpretation of this software demonstration.
        </p>
      </div>
    </div>
  );
};
