// Environment lockdown protocol — the things a family does when warning
// signs are escalating. Stable item keys so progress in lockdown_progress
// stays valid across redesigns. Categorized to help the eye scan in a
// stressed state.

export type LockdownCategory = 'access' | 'finance' | 'travel' | 'substances';

export interface LockdownItem {
  id: string;
  category: LockdownCategory;
  labelKey: string;
  hintKey?: string;
}

export const LOCKDOWN_ITEMS: LockdownItem[] = [
  // Access to keys / vehicles — high-leverage, low effort.
  { id: 'car_keys', category: 'access', labelKey: 'lockdown.item.carKeys', hintKey: 'lockdown.item.carKeysHint' },
  { id: 'spare_keys', category: 'access', labelKey: 'lockdown.item.spareKeys' },
  { id: 'home_keys', category: 'access', labelKey: 'lockdown.item.homeKeys' },

  // Financial instruments — biggest reversible-damage category in mania.
  { id: 'credit_cards', category: 'finance', labelKey: 'lockdown.item.creditCards', hintKey: 'lockdown.item.creditCardsHint' },
  { id: 'id_card', category: 'finance', labelKey: 'lockdown.item.idCard' },
  { id: 'checkbook', category: 'finance', labelKey: 'lockdown.item.checkbook' },
  { id: 'bank_apps', category: 'finance', labelKey: 'lockdown.item.bankApps', hintKey: 'lockdown.item.bankAppsHint' },

  // Travel — guards against sudden departures (see also: exit-ban template).
  { id: 'passport', category: 'travel', labelKey: 'lockdown.item.passport' },
  { id: 'driver_license', category: 'travel', labelKey: 'lockdown.item.driverLicense' },

  // Substances — alcohol and old meds reduce both medical risk and lethal
  // means availability (see /safety).
  { id: 'alcohol', category: 'substances', labelKey: 'lockdown.item.alcohol' },
  { id: 'old_meds', category: 'substances', labelKey: 'lockdown.item.oldMeds', hintKey: 'lockdown.item.oldMedsHint' },
];

export const LOCKDOWN_CATEGORY_ORDER: LockdownCategory[] = [
  'access',
  'finance',
  'travel',
  'substances',
];
