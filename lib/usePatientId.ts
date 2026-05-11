'use client';

import { useAuth } from '@/context/AuthContext';
import { MOCK_PATIENT_ID } from '@/lib/constants';

// Returns the data-isolation key for the current session.
//
// Without this, every signed-in caregiver wrote into the shared MOCK_PATIENT_ID
// bucket — meaning a stranger who signed up could read another family's data.
// Until a real Patient model lands, scoping each session to `user.id` gives us
// per-account isolation. Anonymous preview keeps using MOCK_PATIENT_ID so the
// dashboard has something to show.
//
// NOTE: this is necessary but NOT sufficient. The Supabase project must also
// have Row-Level Security policies on each table that restrict rows to the
// authenticated user. Without RLS, anyone with the public anon key can read
// every row regardless of what this hook returns.
export function usePatientId(): string {
  const { user, configured } = useAuth();
  if (configured && user?.id) return user.id;
  return MOCK_PATIENT_ID;
}
