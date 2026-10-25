import React, { useState, useEffect } from 'react';
import { BRAND_CONFIG } from '../../config/brand';
import {
  IconOverview,
  IconAssistant,
  IconFinance,
  IconQuotations,
  IconReceivables,
  IconCustomers,
  IconApprovals,
  IconActivity,
  IconMenu,
  IconClose,
} from '../common/Icons';
import { ConfirmModal } from '../common/ConfirmModal';
import { resetAllDemoData } from '../../services/businessData';
import { getApprovals } from '../../services/approvalService';

export type AppRoute =
  | '/overview'
  | '/assistant'
  | '/finance'
  | '/sales/quotations'
  | '/receivables'
  | '/customers'
  | '/approvals'
  | '/activity'
  | '/settings/privacy'
  | '/terms';

interface AppShellProps {
  currentRoute: AppRoute;
  onRouteChange: (route: AppRoute) => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentRoute,
  onRouteChange,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [pendingApprovalCount, setPendingApprovalCount] = useState(0);

  const refreshApprovalCount = () => {
    const pending = getApprovals().filter((a) => a.status === 'pending');
    setPendingApprovalCount(pending.length);
  };

  useEffect(() => {
    refreshApprovalCount();
    const interval = setInterval(refreshApprovalCount, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const handleResetConfirm = () => {
    resetAllDemoData();
    setIsResetModalOpen(false);
    refreshApprovalCount();
    window.location.reload();
  };

  const navItems = [
    { route: '/overview' as AppRoute, label: 'Overview', icon: <IconOverview /> },
    { route: '/assistant' as AppRoute, label: 'Operations Assistant', icon: <IconAssistant />, badge: 'Agent' },
    { route: '/finance' as AppRoute, label: 'Finance & Ledger', icon: <IconFinance /> },
    { route: '/sales/quotations' as AppRoute, label: 'Sales & Quotes', icon: <IconQuotations /> },
    { route: '/receivables' as AppRoute, label: 'Receivables', icon: <IconReceivables />, badgeCount: 3 },
    { route: '/customers' as AppRoute, label: 'Customers', icon: <IconCustomers /> },
    {
      route: '/approvals' as AppRoute,
      label: 'Approvals Queue',
      icon: <IconApprovals />,
      badgeCount: pendingApprovalCount,
      badgeVariant: pendingApprovalCount > 0 ? 'ochre' : 'neutral',
    },
    { route: '/activity' as AppRoute, label: 'Activity & Audit', icon: <IconActivity /> },
  ];

  const getPageTitle = (route: AppRoute): string => {
    switch (route) {
      case '/overview': return 'Business Overview';
      case '/assistant': return 'Agentic Operations Assistant';
      case '/finance': return 'Financial Ledger & Performance';
      case '/sales/quotations': return 'Sales & Quotation Register';
      case '/receivables': return 'Invoices & Receivables Aging';
      case '/customers': return 'Customer Directory';
      case '/approvals': return 'Human-in-the-Loop Approvals';
      case '/activity': return 'Chronological Audit Log';
      case '/settings/privacy': return 'Privacy & Demo Data Notice';
      case '/terms': return 'Terms of Prototype Use';
      default: return 'KaryaDesk Operations';
    }
  };

  return (
    <div className="app-container">
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="mobile-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation (Desktop Persistent / Mobile Drawer) */}
      <aside
        className={`app-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}
        aria-label="Sidebar Navigation"
      >
        {/* Brand Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--hairline)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                display: 'inline-block',
                width: '10px',
                height: '10px',
                backgroundColor: 'var(--evergreen)',
                borderRadius: '2px',
              }} />
              <h1 style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
                {BRAND_CONFIG.productName}
              </h1>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Operations Dispatch
            </div>
          </div>

          {/* Close button inside mobile drawer */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="btn-ghost mobile-only"
            aria-label="Close navigation menu"
            style={{ padding: '6px 8px', minWidth: '40px', minHeight: '40px' }}
          >
            <IconClose size={16} />
          </button>
        </div>

        {/* Active Entity Workspace */}
        <div style={{
          padding: '12px 20px',
          backgroundColor: 'var(--surface-alt)',
          borderBottom: '1px solid var(--hairline)',
        }}>
          <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Active Workspace
          </div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {BRAND_CONFIG.companyName}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
            Pune Industrial Unit • Demo Data
          </div>
        </div>

        {/* Primary Navigation Links */}
        <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }} aria-label="Main Navigation">
          <ul style={{ listStyle: 'none' }}>
            {navItems.map((item) => {
              const isActive = currentRoute === item.route;
              return (
                <li key={item.route} style={{ marginBottom: '3px' }}>
                  <button
                    onClick={() => {
                      onRouteChange(item.route);
                      setMobileMenuOpen(false);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: isActive ? 'var(--canvas)' : 'transparent',
                      color: isActive ? 'var(--evergreen-ink)' : 'var(--ink-secondary)',
                      fontWeight: isActive ? 600 : 500,
                      border: isActive ? '1px solid var(--hairline-strong)' : '1px solid transparent',
                      textAlign: 'left',
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: isActive ? 'var(--evergreen)' : 'var(--muted)' }}>
                        {item.icon}
                      </span>
                      <span style={{ fontSize: '13px' }}>{item.label}</span>
                    </span>

                    {item.badge && (
                      <span className="badge badge-evergreen" style={{ fontSize: '10px', padding: '1px 5px' }}>
                        {item.badge}
                      </span>
                    )}

                    {typeof item.badgeCount === 'number' && item.badgeCount > 0 && (
                      <span
                        className={`badge ${item.badgeVariant === 'ochre' ? 'badge-ochre' : 'badge-neutral'}`}
                        style={{ fontSize: '11px', padding: '1px 6px' }}
                      >
                        {item.badgeCount}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--hairline)',
          backgroundColor: 'var(--surface)',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
            <button
              onClick={() => {
                onRouteChange('/settings/privacy');
                setMobileMenuOpen(false);
              }}
              className="btn-ghost"
              style={{ padding: '4px 6px', fontSize: '11px' }}
            >
              Privacy & Demo Info
            </button>
            <button
              onClick={() => {
                onRouteChange('/terms');
                setMobileMenuOpen(false);
              }}
              className="btn-ghost"
              style={{ padding: '4px 6px', fontSize: '11px' }}
            >
              Terms
            </button>
          </div>
          <div style={{ fontSize: '10px', color: 'var(--muted)', textAlign: 'center' }}>
            KaryaDesk v1.0 • MSME Architecture
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="app-main">
        {/* Top Header Bar */}
        <header className="app-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 auto', minWidth: 0 }}>
            {/* Mobile menu toggle */}
            <button
              className="btn-secondary mobile-only-flex"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ padding: '6px 10px', alignItems: 'center', gap: '6px', minHeight: '38px', flexShrink: 0 }}
              aria-label="Toggle navigation menu"
            >
              <IconMenu size={16} />
              <span style={{ fontSize: '12px', fontWeight: 600 }}>Menu</span>
              {pendingApprovalCount > 0 && (
                <span className="badge badge-ochre" style={{ fontSize: '10px', padding: '0 4px', minWidth: '16px' }}>
                  {pendingApprovalCount}
                </span>
              )}
            </button>

            <div style={{ minWidth: 0, overflow: 'hidden' }}>
              <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                KaryaDesk / {BRAND_CONFIG.companyName}
              </div>
              <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {getPageTitle(currentRoute)}
              </h2>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {/* Always visible Demo Workspace Indicator (Desktop) */}
            <div
              className="desktop-only"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '3px 10px',
                backgroundColor: 'var(--surface-alt)',
                border: '1px solid var(--hairline)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '11px',
                color: 'var(--muted)',
                fontWeight: 500,
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--ochre)' }} />
              {BRAND_CONFIG.demoLabel}
            </div>

            {/* Reporting Period Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '4px 8px',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--hairline-strong)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '11px',
              color: 'var(--ink)',
              fontWeight: 500,
              whiteSpace: 'nowrap',
            }}>
              {BRAND_CONFIG.reportingPeriod.current}
            </div>

            {/* Reset Demo Data Button */}
            <button
              onClick={() => setIsResetModalOpen(true)}
              className="btn-secondary"
              style={{ fontSize: '11px', padding: '5px 9px', minHeight: '32px' }}
              title="Reset all demo records back to clean synthetic seed state"
            >
              Reset
            </button>
          </div>
        </header>

        {/* Routed View Body */}
        <main className="app-content">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Thumb Navigation */}
      <nav className="mobile-bottom-nav" aria-label="Mobile quick navigation">
        <button
          className={`mobile-bottom-nav-item ${currentRoute === '/overview' ? 'active' : ''}`}
          onClick={() => onRouteChange('/overview')}
          aria-label="Business Overview"
        >
          <IconOverview size={17} />
          <span>Overview</span>
        </button>

        <button
          className={`mobile-bottom-nav-item ${currentRoute === '/assistant' ? 'active' : ''}`}
          onClick={() => onRouteChange('/assistant')}
          aria-label="Operations Assistant"
        >
          <IconAssistant size={17} />
          <span>Assistant</span>
        </button>

        <button
          className={`mobile-bottom-nav-item ${currentRoute === '/approvals' ? 'active' : ''}`}
          onClick={() => onRouteChange('/approvals')}
          aria-label="Approvals Queue"
        >
          <IconApprovals size={17} />
          <span>Approvals</span>
          {pendingApprovalCount > 0 && (
            <span className="mobile-nav-badge badge-ochre">
              {pendingApprovalCount}
            </span>
          )}
        </button>

        <button
          className={`mobile-bottom-nav-item ${currentRoute === '/receivables' ? 'active' : ''}`}
          onClick={() => onRouteChange('/receivables')}
          aria-label="Receivables"
        >
          <IconReceivables size={17} />
          <span>Receivables</span>
        </button>

        <button
          className={`mobile-bottom-nav-item ${mobileMenuOpen ? 'active' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Open Full Navigation Menu"
        >
          <IconMenu size={17} />
          <span>Menu</span>
        </button>
      </nav>

      {/* Demo Reset Confirmation Modal */}
      <ConfirmModal
        isOpen={isResetModalOpen}
        title="Reset Demo Workspace Data?"
        message="This will restore all customer invoices, expense records, quotation registers, and human approval queues back to the original synthetic seed dataset."
        warningText="All temporary changes made during this session will be reverted to the October 2026 baseline."
        confirmLabel="Reset to Seed Data"
        cancelLabel="Keep Current State"
        isDanger={true}
        onConfirm={handleResetConfirm}
        onCancel={() => setIsResetModalOpen(false)}
      />
    </div>
  );
};
