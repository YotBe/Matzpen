export type AffectiveState = 'depression' | 'euthymia' | 'euphoria' | 'irritability';

export const AFFECTIVE_LABELS: Record<AffectiveState, string> = {
  depression: 'דיכאון עמוק',
  euthymia: 'יציב',
  euphoria: 'אופוריה / היי',
  irritability: 'עצבנות ורוגזנות',
};

export interface DailyLog {
  id?: string;
  patientId: string;
  loggedBy: string;
  loggedByName?: string;
  sleepHours: number;
  affectiveState: AffectiveState;
  psychomotorSpeed: number;
  impulsivityEvent: boolean;
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

export interface AlertResult {
  level: AlertLevel;
  reasons: string[];
}

export type BureaucracySection = 'national_insurance' | 'rehab_basket' | 'legal';

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
  diagnosis: string;
  comorbidities: string;
  medications: string[];
  allergies: string;
  riskVectors: string;
  contacts: string;
  updatedAt: number;
}
