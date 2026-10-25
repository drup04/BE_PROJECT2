import React, { useState, useEffect } from 'react';
import {
  TaskRun,
  EvidenceRecord,
} from '../types/business';
import {
  generateProfitAnalysisTaskRun,
  detectIntent,
} from '../services/demoTaskRouter';
import { addApprovalItems } from '../services/approvalService';
import { formatRupees, formatLakhs } from '../services/financeCalculations';
import { AppRoute } from '../components/layout/AppShell';
import { IconSearch, IconCheck, IconClose } from '../components/common/Icons';

interface AssistantViewProps {
  onNavigate: (route: AppRoute) => void;
  autoRunPrompt?: boolean;
}

export const AssistantView: React.FC<AssistantViewProps> = ({
  onNavigate,
  autoRunPrompt = false,
}) => {
  const [inputText, setInputText] = useState('Why did our profit fall this month?');
  const [isRunning, setIsRunning] = useState(false);
  const [completedStepsCount, setCompletedStepsCount] = useState(0);
  const [currentTaskRun, setCurrentTaskRun] = useState<TaskRun | null>(null);
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceRecord | null>(null);
  const [unsupportedQuery, setUnsupportedQuery] = useState<string | null>(null);
  const [actionSuccessNotice, setActionSuccessNotice] = useState<string | null>(null);

  const samplePrompts = [
    'Why did our profit fall this month?',
    'Show overdue customer invoices',
    'Draft follow-up emails for overdue accounts',
    'Prepare a new quotation',
  ];

  const runTask = (promptToRun: string) => {
    setUnsupportedQuery(null);
    setActionSuccessNotice(null);
    setSelectedEvidence(null);
    const intentMatch = detectIntent(promptToRun);

    if (intentMatch.intent === 'unknown') {
      setUnsupportedQuery(promptToRun);
      setCurrentTaskRun(null);
      return;
    }

    if (intentMatch.intent === 'overdue_receivables') {
      onNavigate('/receivables');
      return;
    }

    if (intentMatch.intent === 'quotation') {
      onNavigate('/sales/quotations');
      return;
    }

    // Profit analysis (The signature agent demo)
    setIsRunning(true);
    setCompletedStepsCount(0);
    setCurrentTaskRun(null);

    // Subtle stepped execution simulation
    const run = generateProfitAnalysisTaskRun(promptToRun);

    const stepInterval = setInterval(() => {
      setCompletedStepsCount((prev) => {
        if (prev < 5) {
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          setIsRunning(false);
          setCurrentTaskRun(run);
          return 5;
        }
      });
    }, 280);
  };

  useEffect(() => {
    if (autoRunPrompt) {
      runTask('Why did our profit fall this month?');
    }
  }, [autoRunPrompt]);

  const handleQueueDrafts = () => {
    if (!currentTaskRun?.proposedAction) return;

    const draftsToQueue = currentTaskRun.proposedAction.drafts.map((d) => ({
      type: 'customer_email' as const,
      title: `Payment Follow-up: Invoice ${d.invoiceNumber} (${d.daysOverdue} days overdue)`,
      rationale: `Invoice ${d.invoiceNumber} for ₹${d.amountOverdue.toLocaleString('en-IN')} is ${d.daysOverdue} days overdue from ${d.customerName}.`,
      recipientName: d.contactPerson,
      recipientEmail: d.email,
      referenceRecord: `${d.invoiceNumber} / ${d.customerName}`,
      amount: d.amountOverdue,
      draftSubject: d.subject,
      draftBody: d.bodyText,
    }));

    addApprovalItems(draftsToQueue);
    setActionSuccessNotice(`3 email drafts added to Approvals Queue. Human review required before any simulation.`);

    setTimeout(() => {
      onNavigate('/approvals');
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Task Input Section */}
      <div style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--hairline)',
        borderRadius: 'var(--radius-sm)',
        padding: '20px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <span className="badge badge-evergreen" style={{ fontSize: '11px', marginBottom: '6px' }}>
              Deterministic Agentic Workspace
            </span>
            <h2 className="display-serif" style={{ fontSize: '20px', fontWeight: 600 }}>
              Natural Language Operations Assistant
            </h2>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
            Demo run • Sample analysis
          </span>
        </div>

        <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '16px' }}>
          State an operational query or business goal. The system consults verified Pune ledger records, computes exact math, traces supporting evidence, and proposes human-gated actions.
        </p>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (inputText.trim() && !isRunning) {
              runTask(inputText.trim());
            }
          }}
          style={{ display: 'flex', gap: '10px' }}
        >
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g. Why did our profit fall this month?"
              className="input-text"
              style={{ paddingLeft: '32px', height: '40px', fontSize: '14px' }}
              disabled={isRunning}
            />
            <span style={{ position: 'absolute', left: '10px', top: '13px', color: 'var(--muted)' }}>
              <IconSearch size={15} />
            </span>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ height: '40px', padding: '0 20px', fontSize: '14px' }}
            disabled={isRunning || !inputText.trim()}
          >
            {isRunning ? 'Verifying Records...' : 'Execute Task'}
          </button>
        </form>

        {/* Quick Sample Prompts */}
        <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Quick Prompts:
          </span>
          {samplePrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => {
                setInputText(prompt);
                runTask(prompt);
              }}
              disabled={isRunning}
              className="btn-secondary"
              style={{ fontSize: '11px', padding: '3px 8px' }}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Unsupported Query Warning */}
      {unsupportedQuery && (
        <div style={{
          backgroundColor: 'var(--ochre-subtle)',
          border: '1px solid #ECDAB8',
          borderRadius: 'var(--radius-sm)',
          padding: '16px 20px',
        }}>
          <h4 style={{ color: 'var(--ochre-ink)', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>
            Prototype Scope Notice: Query Not Handled
          </h4>
          <p style={{ fontSize: '13px', color: 'var(--ink-secondary)', lineHeight: 1.5 }}>
            This educational prototype only executes deterministic local mock workflows for financial variance analysis, overdue receivables, follow-up email drafts, and quotations.
          </p>
          <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '6px' }}>
            Please try: &ldquo;Why did our profit fall this month?&rdquo; or select a prompt from the quick list above.
          </p>
        </div>
      )}

      {/* Success Notification */}
      {actionSuccessNotice && (
        <div style={{
          backgroundColor: 'var(--evergreen-subtle)',
          border: '1px solid #BCD3C5',
          borderRadius: 'var(--radius-sm)',
          padding: '12px 16px',
          color: 'var(--evergreen-ink)',
          fontSize: '13px',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <IconCheck size={16} />
          <span>{actionSuccessNotice}</span>
        </div>
      )}

      {/* Execution Plan & Steps Sequence */}
      {(isRunning || currentTaskRun) && (
        <div style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--hairline)',
          borderRadius: 'var(--radius-sm)',
          padding: '18px 20px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--muted)' }}>
              Deterministic Execution Plan • 5 Verification Stages
            </h3>
            {isRunning && (
              <span className="badge badge-ochre" style={{ fontSize: '11px' }}>
                Executing step {completedStepsCount + 1} of 5...
              </span>
            )}
            {!isRunning && (
              <span className="badge badge-evergreen" style={{ fontSize: '11px' }}>
                Verified via Pure Calculation Functions
              </span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { id: '1', title: 'Read Sales Invoices for October and September 2026', desc: '18 invoices audited across current and previous cycles.' },
              { id: '2', title: 'Compare Expense Ledger and Supplier Invoices', desc: 'Analyzed steel raw material hikes vs prior contracted rates.' },
              { id: '3', title: 'Recalculate Revenue, Costs, Profit, and Product Margins', desc: 'Reconciled gross margin decline across primary machined parts.' },
              { id: '4', title: 'Audit Overdue Receivables Against Agreed Payment Terms', desc: 'Identified ₹4.20L outstanding across 3 overdue accounts.' },
              { id: '5', title: 'Verify Ledger Integrity and Formulate Plain Explanation', desc: 'Cross-checked math to ensure zero discrepancy across registers.' },
            ].map((step, idx) => {
              const isDone = !isRunning || completedStepsCount > idx;
              const isCurrent = isRunning && completedStepsCount === idx;

              return (
                <div
                  key={step.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 12px',
                    backgroundColor: isCurrent ? 'var(--ochre-subtle)' : isDone ? 'var(--canvas)' : 'transparent',
                    border: '1px solid',
                    borderColor: isCurrent ? '#ECDAB8' : isDone ? 'var(--hairline)' : 'transparent',
                    borderRadius: 'var(--radius-sm)',
                    opacity: isDone || isCurrent ? 1 : 0.4,
                  }}
                >
                  <span style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: isDone ? 'var(--evergreen)' : isCurrent ? 'var(--ochre)' : 'var(--hairline)',
                    color: '#FFFFFF',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 600,
                  }}>
                    {isDone ? '✓' : idx + 1}
                  </span>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>
                      {step.title}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
                      {isCurrent ? 'Running verification against mock database...' : step.desc}
                    </div>
                  </div>

                  {isCurrent && (
                    <div style={{ width: '80px' }}>
                      <div className="skeleton-line" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Task Findings & Result Display */}
      {currentTaskRun?.summary && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Headline Variance Summary Strip */}
          <div className="metric-strip">
            <div className="metric-cell">
              <div className="metric-label">Current Operating Profit</div>
              <div className="metric-value">{formatLakhs(currentTaskRun.summary.currentProfit, 2)}</div>
              <div className="metric-subtext">
                <span>{formatRupees(currentTaskRun.summary.currentProfit)}</span>
                <span style={{ color: 'var(--muted)' }}>• Oct 2026</span>
              </div>
            </div>

            <div className="metric-cell">
              <div className="metric-label">Operating Profit Change</div>
              <div className="metric-value" style={{ color: 'var(--terracotta)' }}>
                {currentTaskRun.summary.profitChangePercent}%
              </div>
              <div className="metric-subtext">
                <span>Prior: {formatLakhs(currentTaskRun.summary.previousProfit, 2)}</span>
                <span style={{ color: 'var(--terracotta)', fontWeight: 600 }}>(-₹1,20,000)</span>
              </div>
            </div>

            <div className="metric-cell">
              <div className="metric-label">Raw Material Expense Surge</div>
              <div className="metric-value" style={{ color: 'var(--terracotta)' }}>
                +{currentTaskRun.summary.rawMaterialChangePercent}%
              </div>
              <div className="metric-subtext">
                <span>Steel billets & castings cost spike</span>
              </div>
            </div>

            <div className="metric-cell">
              <div className="metric-label">Overdue Receivables</div>
              <div className="metric-value" style={{ color: 'var(--terracotta)' }}>
                {formatLakhs(currentTaskRun.summary.overdueAmount)}
              </div>
              <div className="metric-subtext">
                <span style={{ color: 'var(--terracotta)', fontWeight: 600 }}>3 invoices overdue</span>
              </div>
            </div>
          </div>

          {/* Plain Language Explanation */}
          <div style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--hairline)',
            borderRadius: 'var(--radius-sm)',
            padding: '20px',
          }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px' }}>
              Root Cause Operational Analysis
            </h3>
            <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--ink)' }}>
              {currentTaskRun.summary.explanation}
            </p>

            {/* Product Margins Comparison Table */}
            <div style={{ marginTop: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Impacted Product Line Margins
              </div>
              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th className="num">September Margin</th>
                      <th className="num">October Margin</th>
                      <th className="num">Change</th>
                      <th>Primary Cause</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTaskRun.summary.productMargins.map((pm) => (
                      <tr key={pm.productId}>
                        <td style={{ fontWeight: 600 }}>{pm.productName}</td>
                        <td className="num">{pm.previousMarginPercent}%</td>
                        <td className="num" style={{ fontWeight: 600 }}>{pm.currentMarginPercent}%</td>
                        <td className="num" style={{ color: 'var(--terracotta)', fontWeight: 600 }}>
                          {pm.changePercentagePoints} pp
                        </td>
                        <td style={{ fontSize: '12px', color: 'var(--muted)' }}>
                          Raw steel billets (EN8/EN19) procurement cost surge
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sourced Evidence Section */}
          <div style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--hairline)',
            borderRadius: 'var(--radius-sm)',
            padding: '20px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 600 }}>
                  Sourced Business Evidence (Verified Records)
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--muted)' }}>
                  Click any evidence row to inspect underlying local records.
                </p>
              </div>
              <span className="badge badge-neutral" style={{ fontSize: '11px' }}>
                {currentTaskRun.summary.evidenceRecords.length} Verified Sources
              </span>
            </div>

            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Record ID</th>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Entity</th>
                    <th className="num">Amount</th>
                    <th>Verified Finding</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTaskRun.summary.evidenceRecords.map((ev) => (
                    <tr
                      key={ev.id}
                      onClick={() => setSelectedEvidence(ev)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td style={{ fontWeight: 600, color: 'var(--evergreen-ink)' }}>{ev.referenceNumber}</td>
                      <td>{ev.date}</td>
                      <td>
                        <span className={`badge ${ev.type === 'expense' ? 'badge-terracotta' : 'badge-ochre'}`} style={{ fontSize: '10px' }}>
                          {ev.type}
                        </span>
                      </td>
                      <td style={{ fontWeight: 500 }}>{ev.entityName}</td>
                      <td className="num" style={{ fontWeight: 600 }}>{formatRupees(ev.amount)}</td>
                      <td style={{ fontSize: '12px', color: 'var(--muted)' }}>{ev.note}</td>
                      <td>
                        <button className="btn-secondary" style={{ fontSize: '11px', padding: '2px 8px' }}>
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Proposed Next Action & Human Approval Gate */}
          {currentTaskRun.proposedAction && (
            <div style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--evergreen)',
              borderRadius: 'var(--radius-sm)',
              padding: '20px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <span className="badge badge-ochre" style={{ marginBottom: '6px' }}>
                    Human Approval Required
                  </span>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ink)' }}>
                    {currentTaskRun.proposedAction.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px', maxWidth: '750px' }}>
                    {currentTaskRun.proposedAction.reason}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={handleQueueDrafts}
                    className="btn-primary"
                    style={{ padding: '8px 16px', fontSize: '13px' }}
                  >
                    Draft 3 Follow-up Emails & Open Review &rarr;
                  </button>
                </div>
              </div>

              {/* Preview of the 3 accounts */}
              <div style={{
                marginTop: '16px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '12px',
              }}>
                {currentTaskRun.proposedAction.drafts.map((d) => (
                  <div
                    key={d.id}
                    style={{
                      padding: '12px',
                      backgroundColor: 'var(--canvas)',
                      border: '1px solid var(--hairline)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 600 }}>{d.customerName}</span>
                      <span style={{ color: 'var(--terracotta)', fontWeight: 700 }}>{formatRupees(d.amountOverdue)}</span>
                    </div>
                    <div style={{ color: 'var(--muted)', marginTop: '2px' }}>
                      {d.invoiceNumber} • {d.daysOverdue} days overdue
                    </div>
                    <div style={{ color: 'var(--ink-secondary)', marginTop: '6px', fontSize: '11px' }}>
                      Contact: {d.contactPerson} ({d.email})
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                marginTop: '12px',
                fontSize: '11px',
                color: 'var(--muted)',
                fontStyle: 'italic',
              }}>
                Safety Gate: No emails are transmitted automatically. Drafts are sent to your Human Approvals queue where you can edit, approve, or reject each draft.
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sourced Evidence Detail Drawer */}
      {selectedEvidence && (
        <div className="drawer-panel" role="dialog" aria-labelledby="evidence-detail-title">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--hairline)' }}>
            <div>
              <span className="badge badge-neutral" style={{ fontSize: '10px', marginBottom: '2px' }}>
                {selectedEvidence.type.toUpperCase()} EVIDENCE
              </span>
              <h3 id="evidence-detail-title" style={{ fontSize: '16px', fontWeight: 600 }}>
                {selectedEvidence.referenceNumber}
              </h3>
            </div>
            <button onClick={() => setSelectedEvidence(null)} className="btn-ghost" aria-label="Close evidence panel">
              <IconClose size={14} />
            </button>
          </div>

          <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase' }}>Entity</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)', marginTop: '2px' }}>
                {selectedEvidence.entityName}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase' }}>Date</div>
                <div style={{ fontSize: '13px', fontWeight: 500, marginTop: '2px' }}>{selectedEvidence.date}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase' }}>Amount</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)', marginTop: '2px' }}>
                  {formatRupees(selectedEvidence.amount)}
                </div>
              </div>
            </div>

            <div style={{
              padding: '12px',
              backgroundColor: 'var(--canvas)',
              border: '1px solid var(--hairline)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '16px',
            }}>
              <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Operational Auditor Finding
              </div>
              <div style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.5 }}>
                {selectedEvidence.note}
              </div>
            </div>

            <div style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.5 }}>
              Deterministic traceability verified from Sahyadri Precision Works synthetic Pune ledger records. All records reconcile against headline financial metrics.
            </div>
          </div>

          <div style={{ padding: '14px 20px', borderTop: '1px solid var(--hairline)', backgroundColor: 'var(--surface-alt)' }}>
            <button
              onClick={() => {
                if (selectedEvidence.type === 'invoice') {
                  onNavigate('/receivables');
                } else {
                  onNavigate('/finance');
                }
              }}
              className="btn-primary"
              style={{ width: '100%', fontSize: '13px' }}
            >
              View In {selectedEvidence.type === 'invoice' ? 'Receivables' : 'Finance'} Register &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
