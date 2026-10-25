import React from 'react';
import { AppRoute } from '../components/layout/AppShell';

interface NotFoundViewProps {
  onNavigate: (route: AppRoute) => void;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({ onNavigate }) => {
  return (
    <div style={{
      maxWidth: '600px',
      margin: '60px auto',
      backgroundColor: 'var(--surface)',
      border: '1px solid var(--hairline)',
      borderRadius: 'var(--radius-sm)',
      padding: '36px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px',
    }}>
      <span className="badge badge-terracotta" style={{ fontSize: '11px' }}>
        Route Not Found
      </span>
      <h2 className="display-serif" style={{ fontSize: '24px', fontWeight: 600 }}>
        404 • Workspace Page Not Found
      </h2>
      <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: 1.5, maxWidth: '440px' }}>
        The requested workspace address does not correspond to an active operational module in KaryaDesk.
      </p>
      <button
        onClick={() => onNavigate('/overview')}
        className="btn-primary"
        style={{ padding: '8px 20px', fontSize: '13px' }}
      >
        Return to Business Overview &rarr;
      </button>
    </div>
  );
};
