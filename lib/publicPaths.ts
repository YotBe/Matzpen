// Routing policy for unauthenticated visitors, shared by AuthGate (the
// client-side gate) and the login page (the ?next= redirect target).
//
// Keep this list tight: every entry is reachable with zero auth, so nothing
// here may render patient data except through a server-validated token RPC.

// Exact-match public routes.
export const PUBLIC_PATHS = [
  '/login',
  // Legal pages must be readable BEFORE sign-up — the consent checkbox on
  // the sign-up form links to /terms, and privacy law expects the policy to
  // be available pre-consent.
  '/terms',
  '/privacy',
];

// Prefix-match public routes (token-addressed pages for people outside the
// account: ER staff opening a shared golden record, invited caregivers
// redeeming an envelope link — the join page renders its own sign-in CTA
// that preserves the token via ?next=).
export const PUBLIC_PREFIXES = ['/share/', '/envelope/join/'];

export function isPublicPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  if (PUBLIC_PATHS.includes(pathname)) return true;
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

// Validate a ?next= value before redirecting to it. Only same-origin
// absolute paths pass; protocol-relative (`//evil.com`), full URLs, and
// backslash tricks are rejected so login can never be an open redirect.
export function safeInternalPath(raw: string | null | undefined): string | null {
  if (!raw) return null;
  if (!raw.startsWith('/')) return null;
  if (raw.startsWith('//')) return null;
  if (raw.includes('\\')) return null;
  return raw;
}
