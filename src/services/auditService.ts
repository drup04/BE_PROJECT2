import { AuditEvent } from '../types/business';
import { INITIAL_AUDIT_EVENTS } from '../data/seedData';

const AUDIT_STORAGE_KEY = 'karyadesk_audit_events';

let memoryEvents: AuditEvent[] | null = null;

function isLocalStorageAvailable(): boolean {
  try {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined' && window.localStorage !== null;
  } catch {
    return false;
  }
}

function getStoredAuditEvents(): AuditEvent[] {
  if (memoryEvents !== null) {
    return memoryEvents;
  }

  if (isLocalStorageAvailable()) {
    try {
      const raw = window.localStorage.getItem(AUDIT_STORAGE_KEY);
      if (raw) {
        memoryEvents = JSON.parse(raw);
        return memoryEvents!;
      }
    } catch (e) {
      console.warn('Could not read audit log from localStorage:', e);
    }
  }

  memoryEvents = [...INITIAL_AUDIT_EVENTS];
  return memoryEvents;
}

function saveAuditEvents(events: AuditEvent[]) {
  memoryEvents = events;
  if (isLocalStorageAvailable()) {
    try {
      window.localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(events));
    } catch (e) {
      console.warn('Could not save audit log to localStorage:', e);
    }
  }
}

export function logAuditEvent(
  actor: string,
  action: string,
  recordReference: string,
  category: AuditEvent['category'],
  result: AuditEvent['result'],
  details: string
): AuditEvent {
  const events = getStoredAuditEvents();
  const now = new Date();
  const formattedTime = now.toISOString().replace('T', ' ').substring(0, 19);

  const newEvent: AuditEvent = {
    id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: formattedTime,
    actor,
    action,
    recordReference,
    category,
    result,
    details,
  };

  const updated = [newEvent, ...events];
  saveAuditEvents(updated);
  return newEvent;
}

export function getAuditEvents(): AuditEvent[] {
  return getStoredAuditEvents();
}

export function resetAuditLog() {
  saveAuditEvents([...INITIAL_AUDIT_EVENTS]);
}
