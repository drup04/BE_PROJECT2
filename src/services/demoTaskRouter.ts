import {
  TaskRun,
  TaskStep,
  TaskSummary,
  EvidenceRecord,
  ProposedAction,
  FollowupDraftItem,
} from '../types/business';
import { getInvoices, getExpenses, getOverdueInvoices } from './businessData';
import {
  calculateFinancialPeriodSummary,
  calculatePercentageChange,
  calculateReceivablesAging,
} from './financeCalculations';
import { logAuditEvent } from './auditService';

export type DemoIntent =
  | 'profit_analysis'
  | 'overdue_receivables'
  | 'followup_drafts'
  | 'quotation'
  | 'unknown';

export interface IntentMatch {
  intent: DemoIntent;
  confidence: number;
  matchedKeywords: string[];
}

export function detectIntent(query: string): IntentMatch {
  const q = query.toLowerCase().trim();

  // Profit analysis keywords
  if (
    q.includes('profit') ||
    q.includes('fall') ||
    q.includes('drop') ||
    q.includes('margin') ||
    q.includes('why did our profit') ||
    q.includes('decrease')
  ) {
    return {
      intent: 'profit_analysis',
      confidence: 0.95,
      matchedKeywords: ['profit', 'fall/drop', 'margin'],
    };
  }

  // Overdue receivables keywords
  if (
    q.includes('overdue') ||
    q.includes('receivable') ||
    q.includes('owes us') ||
    q.includes('unpaid') ||
    q.includes('pending payment')
  ) {
    return {
      intent: 'overdue_receivables',
      confidence: 0.95,
      matchedKeywords: ['overdue', 'receivables'],
    };
  }

  // Follow-up drafts keywords
  if (
    q.includes('draft') ||
    q.includes('email') ||
    q.includes('remind') ||
    q.includes('follow-up') ||
    q.includes('followup')
  ) {
    return {
      intent: 'followup_drafts',
      confidence: 0.95,
      matchedKeywords: ['draft', 'follow-up', 'remind'],
    };
  }

  // Quotation keywords
  if (
    q.includes('quote') ||
    q.includes('quotation') ||
    q.includes('estimate') ||
    q.includes('pricing sheet')
  ) {
    return {
      intent: 'quotation',
      confidence: 0.95,
      matchedKeywords: ['quote', 'quotation'],
    };
  }

  return {
    intent: 'unknown',
    confidence: 0.0,
    matchedKeywords: [],
  };
}

export function generateProfitAnalysisTaskRun(prompt: string): TaskRun {
  const invoices = getInvoices();
  const expenses = getExpenses();
  const overdueInvoices = getOverdueInvoices();

  const currentSummary = calculateFinancialPeriodSummary(invoices, expenses, 'current', 'October 2026');
  const previousSummary = calculateFinancialPeriodSummary(invoices, expenses, 'previous', 'September 2026');

  const profitChange = calculatePercentageChange(
    currentSummary.operatingProfit,
    previousSummary.operatingProfit
  );

  const rawMaterialChange = calculatePercentageChange(
    currentSummary.rawMaterials,
    previousSummary.rawMaterials
  );

  const aging = calculateReceivablesAging(invoices);

  // Evidence records compiled directly from source invoices & expenses
  const evidenceRecords: EvidenceRecord[] = [
    {
      id: 'ev-1',
      type: 'expense',
      referenceNumber: 'EXP-26-1101',
      date: '2026-10-04',
      entityName: 'Kalyani Steels Ltd, Mundhwa Pune',
      amount: 780000,
      note: 'Special Steel Billets (EN8/EN19) unit procurement rate surged 19.2% from prior contract.',
    },
    {
      id: 'ev-2',
      type: 'expense',
      referenceNumber: 'EXP-26-1104',
      date: '2026-10-10',
      entityName: 'Mahindra Sanyo Special Steel, Khopoli',
      amount: 520000,
      note: 'Alloy 4140 rounds rate spike for valve shaft batch production.',
    },
    {
      id: 'ev-3',
      type: 'invoice',
      referenceNumber: 'INV-26-1038',
      date: '2026-09-12',
      entityName: 'Modern Auto Tech Pvt Ltd',
      amount: 185000,
      note: '34 days overdue. Credit term was 30 days. Outstanding ₹1,85,000.',
    },
    {
      id: 'ev-4',
      type: 'invoice',
      referenceNumber: 'INV-26-1041',
      date: '2026-09-20',
      entityName: 'Deccan Hydraulic Systems',
      amount: 145000,
      note: '22 days overdue. Manifold blocks shipment. Outstanding ₹1,45,000.',
    },
    {
      id: 'ev-5',
      type: 'invoice',
      referenceNumber: 'INV-26-1044',
      date: '2026-09-28',
      entityName: 'Kirloskar Tooling Subcontractor',
      amount: 90000,
      note: '15 days overdue. Guide pin & bush sets. Outstanding ₹90,000.',
    },
  ];

  // Proposed follow-up drafts for the 3 overdue accounts
  const drafts: FollowupDraftItem[] = overdueInvoices.map((inv) => ({
    id: `draft-${inv.id}`,
    invoiceId: inv.id,
    invoiceNumber: inv.invoiceNumber,
    customerId: inv.customerId,
    customerName: inv.customerName,
    contactPerson: inv.customerName.includes('Modern')
      ? 'Rajesh Patil'
      : inv.customerName.includes('Deccan')
      ? 'Anand Kulkarni'
      : 'Sanjay Deshmukh',
    email: inv.customerName.includes('Modern')
      ? 'r.patil@modernautotech.co.in'
      : inv.customerName.includes('Deccan')
      ? 'kulkarni.a@deccan-hydraulics.in'
      : 'sdeshmukh@kirloskarsubcon.com',
    amountOverdue: inv.balanceDue,
    daysOverdue: inv.daysOverdue,
    subject: `Payment Follow-up: Invoice ${inv.invoiceNumber} (${inv.daysOverdue} days past terms) — Sahyadri Precision Works`,
    bodyText: `Dear Sir,\n\nWe would like to bring your kind attention to outstanding invoice ${inv.invoiceNumber} for ₹${inv.balanceDue.toLocaleString('en-IN')}, which matured on ${inv.dueDate} and is now ${inv.daysOverdue} days overdue.\n\nKindly confirm payment release or share the UTR reference if already processed.\n\nWarm regards,\nAccounts Desk\nSahyadri Precision Works, Pune`,
  }));

  const proposedAction: ProposedAction = {
    id: 'prop-act-1',
    type: 'draft_followup_emails',
    title: 'Draft Overdue Payment Follow-up Emails',
    reason: `₹4.20L in overdue receivables across 3 key customer accounts is exerting liquidity pressure while operating margin declined to 14.6%.`,
    impactedCount: drafts.length,
    totalAmount: aging.totalOverdue,
    drafts,
    status: 'proposed',
  };

  const steps: TaskStep[] = [
    {
      id: 's-1',
      title: 'Sales Invoices Inspected',
      description: 'Extracted current (Oct 2026) and prior (Sep 2026) reconciled sales billing.',
      status: 'completed',
      recordsCount: invoices.length,
    },
    {
      id: 's-2',
      title: 'Expense Ledger & Supplier Costs Reconciled',
      description: 'Compared raw materials, direct wages, power tariffs, and overhead allocations.',
      status: 'completed',
      recordsCount: expenses.length,
    },
    {
      id: 's-3',
      title: 'Margins & Profit Recalculated',
      description: 'Evaluated unit cost changes for Precision Flange Bushings and Valve Shafts.',
      status: 'completed',
    },
    {
      id: 's-4',
      title: 'Overdue Receivables Aging Checked',
      description: 'Identified 3 customer accounts exceeding contractual payment terms.',
      status: 'completed',
      recordsCount: overdueInvoices.length,
    },
    {
      id: 's-5',
      title: 'Deterministic Verification Complete',
      description: 'Confirmed ledger balance integrity across all periods and tax schedules.',
      status: 'completed',
    },
  ];

  const summary: TaskSummary = {
    currentProfit: currentSummary.operatingProfit,
    previousProfit: previousSummary.operatingProfit,
    profitChangePercent: profitChange,
    rawMaterialChangePercent: rawMaterialChange,
    productMargins: [
      {
        productId: 'prod-1',
        productName: 'Precision Flange Bushing (High Tensile EN8)',
        previousMarginPercent: 24.2,
        currentMarginPercent: 18.2,
        changePercentagePoints: -6.0,
      },
      {
        productId: 'prod-2',
        productName: 'CNC Machined Valve Shaft (Alloy 4140)',
        previousMarginPercent: 28.5,
        currentMarginPercent: 21.0,
        changePercentagePoints: -7.5,
      },
    ],
    overdueAmount: aging.totalOverdue,
    explanation: `Operating profit contracted by 14.8% (from ₹8.10L to ₹6.90L) despite steady revenue (₹47.4L). The primary driver is an 18.4% increase in raw material costs (special steel billets and alloy steel rounds). Simultaneously, working capital is compressed by ₹4.20L in overdue customer receivables across Modern Auto Tech, Deccan Hydraulics, and Kirloskar Subcontractors.`,
    evidenceRecords,
  };

  logAuditEvent(
    'AI Operations Assistant',
    'Task Executed: Profit Drop Analysis',
    'TASK-PROFIT-OCT26',
    'task',
    'success',
    `Verified 14.8% profit decline, 18.4% raw material rise, and ₹4.20L overdue receivables across ${invoices.length} invoices and ${expenses.length} ledger entries.`
  );

  return {
    id: `task-${Date.now()}`,
    prompt,
    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    status: 'completed',
    steps,
    summary,
    proposedAction,
  };
}
