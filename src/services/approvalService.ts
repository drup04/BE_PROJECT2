import { ApprovalItem } from '../types/business';
import { logAuditEvent } from './auditService';

const APPROVALS_STORAGE_KEY = 'karyadesk_approvals';

export const INITIAL_APPROVALS: ApprovalItem[] = [
  {
    id: 'appr-1',
    type: 'customer_email',
    title: 'Payment Reminder: Invoice INV-26-1038 (34 Days Overdue)',
    rationale: 'Invoice balance of ₹1,85,000 exceeded 30-day payment terms by 34 days.',
    recipientName: 'Rajesh Patil (Purchase Head)',
    recipientEmail: 'r.patil@modernautotech.co.in',
    referenceRecord: 'INV-26-1038 / Modern Auto Tech',
    amount: 185000,
    draftSubject: 'Urgent: Payment Status for Outstanding Invoice INV-26-1038 — Sahyadri Precision Works',
    draftBody: `Dear Mr. Rajesh Patil,\n\nWe hope this finds you well.\n\nThis is a polite follow-up regarding invoice INV-26-1038 for ₹1,85,000 (Precision Flange Bushing & Housing Spacers), which matured on 21st September 2026 and is currently 34 days past terms.\n\nPlease let us know if this payment has been scheduled in your upcoming weekly RTGS run, or if any reconciled ledger statement is required from our accounts desk.\n\nWarm regards,\nAccounts & Dispatch Team\nSahyadri Precision Works, Pune`,
    status: 'pending',
    createdAt: '2026-10-25 09:30:00',
  },
];

let memoryApprovals: ApprovalItem[] | null = null;

function isLocalStorageAvailable(): boolean {
  try {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined' && window.localStorage !== null;
  } catch {
    return false;
  }
}

function getStoredApprovals(): ApprovalItem[] {
  if (memoryApprovals !== null) {
    return memoryApprovals;
  }

  if (isLocalStorageAvailable()) {
    try {
      const raw = window.localStorage.getItem(APPROVALS_STORAGE_KEY);
      if (raw) {
        memoryApprovals = JSON.parse(raw);
        return memoryApprovals!;
      }
    } catch (e) {
      console.warn('Could not read approvals from localStorage:', e);
    }
  }

  memoryApprovals = [...INITIAL_APPROVALS];
  return memoryApprovals;
}

function saveApprovals(items: ApprovalItem[]) {
  memoryApprovals = items;
  if (isLocalStorageAvailable()) {
    try {
      window.localStorage.setItem(APPROVALS_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Could not save approvals to localStorage:', e);
    }
  }
}

export function getApprovals(): ApprovalItem[] {
  return getStoredApprovals();
}

export function addApprovalItems(items: Array<Omit<ApprovalItem, 'id' | 'createdAt' | 'status'>>): ApprovalItem[] {
  const current = getStoredApprovals();
  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

  const newItems: ApprovalItem[] = items.map((it, idx) => ({
    ...it,
    id: `appr-${Date.now()}-${idx}`,
    status: 'pending',
    createdAt: now,
  }));

  const updated = [...newItems, ...current];
  saveApprovals(updated);

  newItems.forEach((item) => {
    logAuditEvent(
      'AI Operations Assistant',
      'Action Proposed to Human Queue',
      item.referenceRecord,
      'approval',
      'info',
      `Queued sensitive proposal for review: "${item.title}" (${item.recipientName})`
    );
  });

  return newItems;
}

export function updateApprovalItem(
  id: string,
  updates: Partial<Pick<ApprovalItem, 'draftSubject' | 'draftBody' | 'notes'>>,
  actor: string = 'Human Reviewer'
): ApprovalItem | null {
  const current = [...getStoredApprovals()];
  const index = current.findIndex((i) => i.id === id);
  if (index === -1) return null;

  const updatedItem = {
    ...current[index],
    ...updates,
  };

  current[index] = updatedItem;
  saveApprovals(current);

  logAuditEvent(
    actor,
    'Draft Action Content Edited',
    updatedItem.referenceRecord,
    'approval',
    'info',
    `User modified draft text for "${updatedItem.title}"`
  );

  return updatedItem;
}

export function approveApprovalItem(id: string, actor: string = 'Rajesh Sharma (Owner)'): ApprovalItem | null {
  const current = [...getStoredApprovals()];
  const index = current.findIndex((i) => i.id === id);
  if (index === -1) return null;

  const item = current[index];
  if (item.status !== 'pending') return item;

  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const updatedItem: ApprovalItem = {
    ...item,
    status: 'approved',
    reviewedAt: now,
  };

  current[index] = updatedItem;
  saveApprovals(current);

  logAuditEvent(
    actor,
    'Human Approval Granted',
    updatedItem.referenceRecord,
    'approval',
    'success',
    `Explicit approval given for: "${updatedItem.title}". Ready for simulated dispatch.`
  );

  return updatedItem;
}

export function rejectApprovalItem(
  id: string,
  reason: string,
  actor: string = 'Rajesh Sharma (Owner)'
): ApprovalItem | null {
  const current = [...getStoredApprovals()];
  const index = current.findIndex((i) => i.id === id);
  if (index === -1) return null;

  const item = current[index];
  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const updatedItem: ApprovalItem = {
    ...item,
    status: 'rejected',
    reviewedAt: now,
    notes: reason,
  };

  current[index] = updatedItem;
  saveApprovals(current);

  logAuditEvent(
    actor,
    'Human Action Rejected',
    updatedItem.referenceRecord,
    'approval',
    'rejected',
    `Proposal rejected by reviewer: "${updatedItem.title}". Reason: ${reason}`
  );

  return updatedItem;
}

export function simulateSendApprovalItem(
  id: string,
  actor: string = 'Rajesh Sharma (Owner)'
): { success: boolean; item?: ApprovalItem; error?: string } {
  const current = [...getStoredApprovals()];
  const index = current.findIndex((i) => i.id === id);
  if (index === -1) {
    return { success: false, error: 'Item not found in approvals queue.' };
  }

  const item = current[index];
  if (item.status !== 'approved') {
    return {
      success: false,
      error: `Cannot simulate send: item status is "${item.status}". Explicit human approval is required first.`,
    };
  }

  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const updatedItem: ApprovalItem = {
    ...item,
    status: 'simulated_sent',
    reviewedAt: now,
  };

  current[index] = updatedItem;
  saveApprovals(current);

  logAuditEvent(
    actor,
    'Simulated Email Dispatch Completed',
    updatedItem.referenceRecord,
    'simulation',
    'success',
    `Simulated customer transmission to ${updatedItem.recipientEmail} (${updatedItem.recipientName}). No live email was dispatched.`
  );

  return { success: true, item: updatedItem };
}

export function resetApprovals() {
  saveApprovals([...INITIAL_APPROVALS]);
}
