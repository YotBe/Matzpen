'use client';

import { supabase } from '@/lib/supabaseClient';

// Client-side helpers for the web-push lifecycle.
//
// We deliberately DO NOT prompt for notifications on page load — that's a
// classic anti-pattern. The user opts in from the war room via
// `subscribeToBackupPush()`, which only runs after a clear "yes, send me
// SOS alerts" click.

const PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? '';

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const normalized = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(normalized);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

export function pushSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window &&
    Boolean(PUBLIC_KEY)
  );
}

export type PushOptInStatus = 'unsupported' | 'unconfigured' | 'denied' | 'granted' | 'default';

export function pushStatus(): PushOptInStatus {
  if (typeof window === 'undefined') return 'unsupported';
  if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) {
    return 'unsupported';
  }
  if (!PUBLIC_KEY) return 'unconfigured';
  return Notification.permission as PushOptInStatus;
}

export async function subscribeToBackupPush(patientId: string): Promise<boolean> {
  if (!pushSupported()) return false;

  // 1. Permission.
  let perm = Notification.permission;
  if (perm === 'default') perm = await Notification.requestPermission();
  if (perm !== 'granted') return false;

  // 2. Subscribe via the existing service worker.
  const reg = await navigator.serviceWorker.ready;
  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      // Cast: lib.dom typings narrowed `BufferSource` to `ArrayBuffer`-backed
      // buffers in newer versions; runtime accepts a Uint8Array.
      applicationServerKey: urlBase64ToUint8Array(PUBLIC_KEY) as unknown as BufferSource,
    });
  }

  // 3. Send to our server, attached to this patient_id (envelope-scoped).
  const json = sub.toJSON();
  const token = supabase ? (await supabase.auth.getSession()).data.session?.access_token : null;
  if (!token) return false;
  const res = await fetch('/api/push/subscribe', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      patient_id: patientId,
      endpoint: sub.endpoint,
      p256dh: json.keys?.p256dh ?? '',
      auth: json.keys?.auth ?? '',
      user_agent: navigator.userAgent,
    }),
  });
  return res.ok;
}

export async function unsubscribeFromBackupPush(): Promise<void> {
  if (!pushSupported()) return;
  const reg = await navigator.serviceWorker.ready;
  const sub = await reg.pushManager.getSubscription();
  if (!sub) return;
  const endpoint = sub.endpoint;
  await sub.unsubscribe();
  const token = supabase ? (await supabase.auth.getSession()).data.session?.access_token : null;
  if (!token) return;
  await fetch('/api/push/subscribe', {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ endpoint }),
  });
}

export interface DispatchPayload {
  title: string;
  body: string;
  url?: string;
  tag?: string;
}

export async function dispatchPushNotification(
  patientId: string,
  payload: DispatchPayload,
): Promise<void> {
  if (!supabase) return;
  const token = (await supabase.auth.getSession()).data.session?.access_token;
  if (!token) return;
  await fetch('/api/push/dispatch', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ patient_id: patientId, payload }),
  }).catch(() => {
    /* push is best-effort; the SOS row is already in the DB and visible
       to anyone with the tab open. */
  });
}
