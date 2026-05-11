import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit as fbLimit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { getDb } from '@/lib/firebaseConfig';
import type {
  BureaucracyChecklist,
  BureaucracySection,
  DailyLog,
  GoldenRecord,
  Patient,
} from '@/lib/types';

function requireDb() {
  const db = getDb();
  if (!db) {
    throw new Error(
      'Firebase is not configured. Set NEXT_PUBLIC_FIREBASE_* env vars (see .env.example).',
    );
  }
  return db;
}

function unwrap<T>(snap: QueryDocumentSnapshot<DocumentData>): T {
  return { id: snap.id, ...(snap.data() as DocumentData) } as T;
}

export async function createPatient(
  patientData: Omit<Patient, 'id' | 'createdAt'>,
): Promise<string> {
  const db = requireDb();
  const ref = await addDoc(collection(db, 'patients'), {
    ...patientData,
    createdAt: Date.now(),
    serverCreatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function addDailyLog(
  patientId: string,
  logData: Omit<DailyLog, 'id' | 'patientId' | 'createdAt'>,
): Promise<string> {
  const db = requireDb();
  const payload: Omit<DailyLog, 'id'> = {
    ...logData,
    patientId,
    createdAt: Date.now(),
  };
  const ref = await addDoc(collection(db, 'daily_logs'), {
    ...payload,
    serverCreatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getRecentLogs(
  patientId: string,
  limitCount: number,
): Promise<DailyLog[]> {
  const db = requireDb();
  const q = query(
    collection(db, 'daily_logs'),
    where('patientId', '==', patientId),
    orderBy('createdAt', 'desc'),
    fbLimit(limitCount),
  );
  const snaps = await getDocs(q);
  return snaps.docs.map((d) => unwrap<DailyLog>(d));
}

export async function getChecklist(
  patientId: string,
): Promise<BureaucracyChecklist[]> {
  const db = requireDb();
  const q = query(
    collection(db, 'bureaucracy_tracking'),
    where('patientId', '==', patientId),
  );
  const snaps = await getDocs(q);
  return snaps.docs.map((d) => unwrap<BureaucracyChecklist>(d));
}

export async function setChecklistItem(
  patientId: string,
  section: BureaucracySection,
  itemKey: string,
  done: boolean,
  updatedBy?: string,
): Promise<void> {
  const db = requireDb();
  const id = `${patientId}__${section}__${itemKey}`;
  await setDoc(doc(db, 'bureaucracy_tracking', id), {
    patientId,
    section,
    itemKey,
    done,
    updatedAt: Date.now(),
    updatedBy: updatedBy ?? null,
  });
}

export async function saveGoldenRecord(
  patientId: string,
  data: Omit<GoldenRecord, 'id' | 'patientId' | 'updatedAt'>,
): Promise<void> {
  const db = requireDb();
  await setDoc(doc(db, 'golden_records', patientId), {
    ...data,
    patientId,
    updatedAt: Date.now(),
  });
}

export async function getGoldenRecord(
  patientId: string,
): Promise<GoldenRecord | null> {
  const db = requireDb();
  const q = query(
    collection(db, 'golden_records'),
    where('patientId', '==', patientId),
    fbLimit(1),
  );
  const snaps = await getDocs(q);
  if (snaps.empty) return null;
  return unwrap<GoldenRecord>(snaps.docs[0]);
}
