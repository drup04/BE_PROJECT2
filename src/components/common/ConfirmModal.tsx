import React, { useEffect } from 'react';
import { IconClose } from './Icons';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  warningText?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDanger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  warningText,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDanger = false,
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--hairline)' }}>
          <h3 id="modal-title" style={{ fontSize: '16px', fontWeight: 600 }}>{title}</h3>
          <button onClick={onCancel} className="btn-ghost" aria-label="Close dialog" style={{ padding: '4px' }}>
            <IconClose size={14} />
          </button>
        </div>

        <div style={{ padding: '20px' }}>
          <p style={{ color: 'var(--ink)', fontSize: '14px', lineHeight: 1.5, marginBottom: warningText ? '12px' : '0' }}>
            {message}
          </p>

          {warningText && (
            <div style={{
              backgroundColor: 'var(--ochre-subtle)',
              border: '1px solid #ECDAB8',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 12px',
              fontSize: '12px',
              color: 'var(--ochre-ink)',
            }}>
              <strong>Notice:</strong> {warningText}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', padding: '14px 20px', borderTop: '1px solid var(--hairline)', backgroundColor: 'var(--surface-alt)' }}>
          <button onClick={onCancel} className="btn-secondary">
            {cancelLabel}
          </button>
          <button onClick={onConfirm} className={isDanger ? 'btn-danger' : 'btn-primary'}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
