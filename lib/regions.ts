// Coarse geographic buckets used to route caregivers to the nearest
// psychiatric hospital / day-care option. Kept short and stable so the
// hospital DB in lib/hospitalization/hospitals.ts can key off these.
export const REGIONS = [
  'north',
  'haifa',
  'sharon',
  'center',
  'telaviv',
  'jerusalem',
  'shfela',
  'south',
] as const;

export type Region = (typeof REGIONS)[number];

export function isRegion(value: unknown): value is Region {
  return typeof value === 'string' && (REGIONS as readonly string[]).includes(value);
}
