import 'server-only';
import webPush, { type PushSubscription } from 'web-push';
import { createClient } from '@supabase/supabase-js';

// VAPID keys are operator-supplied. Generate once with:
//   npx web-push generate-vapid-keys
// Set the public key as NEXT_PUBLIC_VAPID_PUBLIC_KEY and the private key
// as VAPID_PRIVATE_KEY (server-only). VAPID_SUBJECT is a mailto: / https:
// URL identifying the application owner.
const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;
const subject = process.env.VAPID_SUBJECT || 'mailto:noreply@example.org';

let configured = false;
function ensureConfigured(): boolean {
  if (configured) return true;
  if (!publicKey || !privateKey) return false;
  webPush.setVapidDetails(subject, publicKey, privateKey);
  configured = true;
  return true;
}

export interface PushTarget {
  caregiverId: string;
  endpoint: string;
  p256dh: string;
  auth: string;
}

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
  tag?: string;
}

// Fans out a payload to a list of subscriptions, cleaning up any that
// return 410 Gone (the subscription has been revoked client-side). We
// purge those rows via a SECURITY DEFINER RPC because RLS on
// push_subscriptions would otherwise prevent the server from deleting a
// row that belongs to a different caregiver.
export async function dispatchPush(
  serviceRoleSupabaseUrl: string,
  serviceRoleKey: string,
  callerToken: string,
  patientId: string,
  payload: PushPayload,
): Promise<{ sent: number; pruned: number }> {
  if (!ensureConfigured()) {
    return { sent: 0, pruned: 0 };
  }

  const db = createClient(serviceRoleSupabaseUrl, serviceRoleKey, {
    global: { headers: { Authorization: `Bearer ${callerToken}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await db.rpc('get_envelope_push_subscriptions', {
    p_patient_id: patientId,
  });
  if (error || !data) return { sent: 0, pruned: 0 };

  const targets = data as PushTarget[];
  const body = JSON.stringify(payload);
  let sent = 0;
  let pruned = 0;

  await Promise.all(
    targets.map(async (target) => {
      const subscription: PushSubscription = {
        endpoint: target.endpoint,
        keys: { p256dh: target.p256dh, auth: target.auth },
      };
      try {
        await webPush.sendNotification(subscription, body, {
          TTL: 600,
        });
        sent += 1;
      } catch (err) {
        const status = (err as { statusCode?: number }).statusCode;
        if (status === 404 || status === 410) {
          try {
            await db.rpc('delete_push_subscription_by_endpoint', {
              p_endpoint: target.endpoint,
            });
            pruned += 1;
          } catch {
            /* best-effort */
          }
        }
      }
    }),
  );

  return { sent, pruned };
}
