import { MemberData } from '../types/registration';
import {
  subscribeToFirestoreRegistrations,
  approveRegistrationInFirestore,
  rejectRegistrationInFirestore,
  updateRegistrationInFirestore,
  deleteRegistrationInFirestore,
  seedDemoRegistrationsInFirestore
} from './firebaseDb';

export type PaymentStatus = 'pending' | 'approved' | 'rejected';

export interface AuditLog {
  id: string;
  adminName: string;
  action: 'Approve Payment' | 'Reject Payment' | 'Edit Team' | 'Delete Team' | 'Bulk Approve';
  teamName: string;
  timestamp: string;
  details?: string;
}

export interface TeamRecord {
  id: string;
  teamName: string;
  createdAt: string;
  memberCount: number;
  members: MemberData[];
  paymentStatus: PaymentStatus;
  transactionId: string;
  amount: number;
  submittedAt: string;
  screenshotUrl?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectReason?: string;
  registeredByEmail?: string;
  timeline: {
    title: string;
    timestamp: string;
    completed: boolean;
  }[];
}

export interface AdminNotification {
  id: string;
  title: string;
  time: string;
  type: 'registration' | 'payment_submitted' | 'approved' | 'rejected';
  read: boolean;
}

const INITIAL_TEAMS: TeamRecord[] = [];

const INITIAL_NOTIFICATIONS: AdminNotification[] = [];

const INITIAL_LOGS: AuditLog[] = [];

const STORAGE_KEY_TEAMS = 'disfrutar_admin_teams';
const STORAGE_KEY_LOGS = 'disfrutar_admin_logs';
const STORAGE_KEY_NOTIFS = 'disfrutar_admin_notifs';

export function getStoredTeams(): TeamRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TEAMS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse admin teams:', e);
  }
  return [];
}

export function saveStoredTeams(teams: TeamRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_TEAMS, JSON.stringify(teams));
  } catch (e) {
    console.error('Failed to save admin teams:', e);
  }
}

export function getStoredLogs(): AuditLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LOGS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse audit logs:', e);
  }
  return INITIAL_LOGS;
}

export function saveStoredLogs(logs: AuditLog[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs));
  } catch (e) {
    console.error('Failed to save audit logs:', e);
  }
}

export function getStoredNotifs(): AdminNotification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_NOTIFS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse notifications:', e);
  }
  return INITIAL_NOTIFICATIONS;
}

export function saveStoredNotifs(notifs: AdminNotification[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(notifs));
  } catch (e) {
    console.error('Failed to save notifications:', e);
  }
}

// Export Firebase helpers for store operations
export {
  subscribeToFirestoreRegistrations,
  approveRegistrationInFirestore,
  rejectRegistrationInFirestore,
  updateRegistrationInFirestore,
  deleteRegistrationInFirestore,
  seedDemoRegistrationsInFirestore
};
