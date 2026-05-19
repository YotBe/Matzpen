'use client';

import { useAuth } from '@/context/AuthContext';
import { MOCK_PATIENT_ID, PREVIEW_MODE_ENABLED } from '@/lib/constants';

// Returns the data-isolation key for the current session.
//
// Signed-in caregivers are scoped to their own `auth.uid()` and Row-Level
// Security policies (see supabase/migrations/20260512_rls_and_patient_ownership.sql)
// enforce that they can only read/write rows where `caregiver_id = auth.uid()`.
// The MOCK_PATIENT_ID fallback only applies when the operator has explicitly
// opted into NEXT_PUBLIC_ENABLE_PREVIEW_MODE — otherwise AuthGate blocks the
// app and this hook is never reached.
export function usePatientId(): string {
  const { user, configured } = useAuth();
  if (configured && user?.id) return user.id;
  if (PREVIEW_MODE_ENABLED) return MOCK_PATIENT_ID;
  // Should be unreachable: AuthGate blocks unconfigured non-preview deploys.
  return '';
}
