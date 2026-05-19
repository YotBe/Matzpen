// Demo identifiers used only when the app runs in preview mode (no Supabase
// credentials configured AND NEXT_PUBLIC_ENABLE_PREVIEW_MODE=true). Real
// deployments must leave the env flag unset so the dashboard never seeds
// itself with the fake patient.
export const MOCK_PATIENT_ID = 'demo-patient';
export const MOCK_PATIENT_NAME = 'דורון';

// Explicit preview-mode gate. When false (the default), an unconfigured app
// shows a "configure Supabase" message instead of leaking mock medical data
// that a caregiver might mistake for real records.
export const PREVIEW_MODE_ENABLED =
  process.env.NEXT_PUBLIC_ENABLE_PREVIEW_MODE === 'true';

// Contact email surfaced in the footer and the privacy page. Override via
// NEXT_PUBLIC_CONTACT_EMAIL (build-time). Falls back to a clearly-placeholder
// value so it's obvious to the operator that something needs configuring.
export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'TODO-set-NEXT_PUBLIC_CONTACT_EMAIL@example.com';
