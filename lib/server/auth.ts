import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';

// Server-side auth helper for API routes.
//
// Routes that touch caregiver data must verify the JWT they receive — not
// merely forward it to Supabase. A forwarded-but-unvalidated token still
// resolves to `auth.uid() = null` under RLS, which would silently return
// empty data instead of surfacing the auth failure. We verify explicitly so
// the route can return 401 and so we know the user before invoking RLS.

export interface AuthResult {
  user: User;
  token: string;
  db: SupabaseClient;
}

function extractToken(req: Request): string | null {
  const header = req.headers.get('authorization');
  if (header) {
    const [scheme, token] = header.split(' ');
    if (scheme?.toLowerCase() === 'bearer' && token) return token.trim();
  }
  // Legacy header name still in use by the AI chat widget.
  return req.headers.get('x-supabase-token');
}

export async function authenticateRequest(req: Request): Promise<AuthResult | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  const token = extractToken(req);
  if (!token) return null;

  const db = createClient(url, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await db.auth.getUser(token);
  if (error || !data?.user) return null;

  return { user: data.user, token, db };
}
