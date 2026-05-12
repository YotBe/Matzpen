'use client';

import posthog from 'posthog-js';

// PostHog wrapper. We don't initialize unless an API key is present, so
// dev runs and self-hosted deployments without analytics keys stay clean.
// All identifiers passed in are the caregiver's auth.uid() — no PII (name,
// email, patient details) is sent. Property values must be primitives or
// short strings; we sanitize at the call site.

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY ?? '';
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com';
let ready = false;

export function initAnalytics(): void {
  if (typeof window === 'undefined') return;
  if (ready || !KEY) return;
  posthog.init(KEY, {
    api_host: HOST,
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: false, // explicit events only — we don't want random DOM noise
    persistence: 'localStorage+cookie',
    person_profiles: 'identified_only',
  });
  ready = true;
}

export function identifyCaregiver(caregiverId: string): void {
  if (!ready) return;
  posthog.identify(caregiverId);
}

export function resetAnalytics(): void {
  if (!ready) return;
  posthog.reset();
}

// Strict event name list — keeps the dashboard signal high.
export type AnalyticsEvent =
  // dashboard / daily log
  | 'daily_log_submitted'
  | 'alert_banner_yellow_shown'
  | 'alert_banner_red_shown'
  | 'pulse_submitted'
  // golden record
  | 'golden_record_saved'
  | 'share_token_created'
  | 'share_token_revoked'
  // war room
  | 'shift_created'
  | 'shared_task_created'
  | 'shared_task_completed'
  | 'backup_request_sent'
  | 'envelope_invite_created'
  | 'envelope_invite_redeemed'
  // crisis tools
  | 'lockdown_item_toggled'
  | 'playbook_scenario_opened'
  | 'vault_file_uploaded'
  // ai
  | 'assistant_message_sent';

export function track(
  event: AnalyticsEvent,
  properties?: Record<string, string | number | boolean | null | undefined>,
): void {
  if (!ready) return;
  posthog.capture(event, properties);
}
