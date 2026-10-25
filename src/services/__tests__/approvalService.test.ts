import { describe, it, expect, beforeEach } from 'vitest';
import {
  getApprovals,
  addApprovalItems,
  approveApprovalItem,
  rejectApprovalItem,
  simulateSendApprovalItem,
  resetApprovals,
} from '../approvalService';
import { getAuditEvents } from '../auditService';

describe('Approval Service State Machine', () => {
  beforeEach(() => {
    resetApprovals();
  });

  it('initializes with default sample approval item', () => {
    const items = getApprovals();
    expect(items.length).toBeGreaterThan(0);
    expect(items[0].status).toBe('pending');
  });

  it('prevents simulated send when item is still pending approval', () => {
    const items = getApprovals();
    const pendingItem = items[0];
    const result = simulateSendApprovalItem(pendingItem.id);
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('Explicit human approval is required first');
  });

  it('allows simulation only after explicit approval', () => {
    const items = getApprovals();
    const itemId = items[0].id;

    // Step 1: Explicit human approval
    const approved = approveApprovalItem(itemId, 'Owner');
    expect(approved?.status).toBe('approved');

    // Step 2: Now simulation must succeed
    const simResult = simulateSendApprovalItem(itemId, 'Owner');
    expect(simResult.success).toBe(true);
    expect(simResult.item?.status).toBe('simulated_sent');
  });

  it('records rejection and stores the rejection notes', () => {
    const items = getApprovals();
    const itemId = items[0].id;

    const rejected = rejectApprovalItem(itemId, 'Customer requested 5-day grace period on phone call', 'Owner');
    expect(rejected?.status).toBe('rejected');
    expect(rejected?.notes).toBe('Customer requested 5-day grace period on phone call');
  });

  it('queues multiple draft items into approvals and creates audit entries', () => {
    const initialCount = getApprovals().length;
    const newItems = addApprovalItems([
      {
        type: 'customer_email',
        title: 'Follow up: INV-26-1041',
        rationale: 'Overdue balance',
        recipientName: 'Anand Kulkarni',
        recipientEmail: 'kulkarni@deccan.in',
        referenceRecord: 'INV-26-1041',
        amount: 145000,
        draftSubject: 'Reminder: INV-26-1041',
        draftBody: 'Please clear balance.',
      },
    ]);

    expect(newItems.length).toBe(1);
    expect(getApprovals().length).toBe(initialCount + 1);

    const auditEvents = getAuditEvents();
    const latestEvent = auditEvents[0];
    expect(latestEvent.category).toBe('approval');
  });
});
