export type AffectiveState = 'depression' | 'euthymia' | 'euphoria' | 'irritability';

// Adherence-to-medication answer from the daily log.
// `unknown` is the default for legacy rows / unanswered submissions.
export type MedicationTaken = 'yes' | 'no' | 'refused' | 'unknown';

export interface DailyLog {
  id?: string;
  patientId: string;
  loggedBy: string;
  loggedByName?: string;
  sleepHours: number;
  affectiveState: AffectiveState;
  psychomotorSpeed: number;
  impulsivityEvent: boolean;
  medicationTaken?: MedicationTaken;
  notes?: string;
  createdAt: number;
}

export interface Patient {
  id?: string;
  name: string;
  caregivers: string[];
  baselineDiagnosis?: string;
  createdAt: number;
}

export type AlertLevel = 'STABLE' | 'YELLOW_ALERT' | 'RED_ALERT';

export interface AlertReason {
  key: string;
  vars?: Record<string, string | number>;
}

export interface AlertResult {
  level: AlertLevel;
  reasons: AlertReason[];
}

// Section IDs are used as DB keys for `checklist_items.section`. The first three
// are legacy (institution-grouped); the latter five are the situation-based
// reorganization. Old rows in the DB remain valid but no longer shown in the UI.
export type BureaucracySection =
  | 'national_insurance'
  | 'rehab_basket'
  | 'legal'
  | 'first_hospitalization'
  | 'discharge_followup'
  | 'deterioration'
  | 'disability_claim'
  | 'advance_planning';

export interface BureaucracyChecklist {
  id?: string;
  patientId: string;
  section: BureaucracySection;
  itemKey: string;
  done: boolean;
  updatedAt: number;
  updatedBy?: string;
}

export interface GoldenRecord {
  id?: string;
  patientId: string;
  // The person being cared for. Optional because legacy rows predate this
  // field — the UI prompts the caregiver to fill it on first visit.
  patientName?: string;
  // Free-text relationship of the caregiver to the patient (e.g. "בני",
  // "אחותי", "בן זוגי"). Helps personalize AI responses.
  relationship?: string;
  diagnosis: string;
  comorbidities: string;
  medications: string[];
  allergies: string;
  riskVectors: string;
  contacts: string;
  updatedAt: number;
}
