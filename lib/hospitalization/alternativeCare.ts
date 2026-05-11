import type { Region } from '@/lib/regions';

// "Alternative care" — balancing homes (בתים מאזנים) and day hospitals
// (אשפוז יום). Listed for educational reference; verify availability and
// funding directly with the provider before relying on these details.
export type AltCareKind = 'balancing_home' | 'day_hospital';

export type Funding =
  | 'kupat_holim' // covered by your HMO referral
  | 'rehab_basket' // covered as part of סל שיקום
  | 'private' // out-of-pocket
  | 'subsidized'; // partial subsidy / sliding scale

export interface AltCareOption {
  id: string;
  kind: AltCareKind;
  name: string;
  region: Region;
  city: string;
  mapsQuery: string;
  phone?: string;
  website?: string;
  // Who is NOT a good fit. Helps caregivers avoid wasted phone calls.
  exclusions: string[];
  funding: Funding[];
  approxDailyCostIls?: [number, number];
  capacity?: number;
  notes?: string;
}

export const ALT_CARE_OPTIONS: AltCareOption[] = [
  {
    id: 'soteria_jerusalem',
    kind: 'balancing_home',
    name: 'סוטריה ירושלים',
    region: 'jerusalem',
    city: 'ירושלים',
    mapsQuery: 'סוטריה ירושלים',
    phone: '02-0000000',
    exclusions: [
      'אלימות פעילה',
      'אובדנות חריפה הדורשת השגחה רפואית 24/7',
      'גמילה אקטיבית מסמים/אלכוהול',
    ],
    funding: ['rehab_basket', 'subsidized'],
    capacity: 8,
    notes:
      'קהילה טיפולית קצרת מועד למבוגרים במשבר נפשי חריף, ללא הסתמכות עיקרית על תרופות.',
  },
  {
    id: 'soteria_kfar_saba',
    kind: 'balancing_home',
    name: 'סוטריה השרון',
    region: 'sharon',
    city: 'כפר סבא',
    mapsQuery: 'סוטריה השרון, כפר סבא',
    phone: '09-0000000',
    exclusions: ['אלימות פעילה', 'אובדנות חריפה הדורשת השגחה 24/7'],
    funding: ['rehab_basket', 'subsidized'],
    capacity: 8,
  },
  {
    id: 'mishan_safe_house',
    kind: 'balancing_home',
    name: 'בית מאזן מישען',
    region: 'center',
    city: 'רמת גן',
    mapsQuery: 'מישען רמת גן',
    phone: '03-0000000',
    exclusions: ['ילדים ונוער'],
    funding: ['rehab_basket', 'private'],
    approxDailyCostIls: [1200, 1700],
    capacity: 10,
    notes: 'התמחות בהתקפי דיכאון חריפים וחרדה ללא צורך באשפוז סגור.',
  },
  {
    id: 'haifa_day',
    kind: 'day_hospital',
    name: 'אשפוז יום פסיכיאטרי, רמב"ם',
    region: 'haifa',
    city: 'חיפה',
    mapsQuery: 'בית חולים רמב"ם, חיפה',
    phone: '04-7771111',
    exclusions: ['חוסר יכולת בסיסית להגיע לבית החולים ולחזור הביתה'],
    funding: ['kupat_holim'],
    notes: 'מתאים לחולים שעברו שלב אשפוז ראשוני וזקוקים להמשך טיפול אינטנסיבי בקהילה.',
  },
  {
    id: 'geha_day',
    kind: 'day_hospital',
    name: 'אשפוז יום, גהה',
    region: 'center',
    city: 'פתח תקווה',
    mapsQuery: 'אשפוז יום גהה, פתח תקווה',
    phone: '03-9258200',
    exclusions: ['פסיכוזה לא יציבה', 'אובדנות פעילה'],
    funding: ['kupat_holim'],
    notes: 'תכנית של 5-6 שבועות, 5 ימים בשבוע. הפניה דרך פסיכיאטר מטפל.',
  },
  {
    id: 'soroka_day',
    kind: 'day_hospital',
    name: 'אשפוז יום פסיכיאטרי, סורוקה',
    region: 'south',
    city: 'באר שבע',
    mapsQuery: 'בית חולים סורוקה, באר שבע',
    phone: '08-6400111',
    exclusions: ['מצב פסיכוטי חריף'],
    funding: ['kupat_holim'],
  },
];

export function altCareForRegion(
  region: Region | null | undefined,
  kind?: AltCareKind,
): AltCareOption[] {
  const filtered = kind ? ALT_CARE_OPTIONS.filter((o) => o.kind === kind) : ALT_CARE_OPTIONS;
  if (!region) return filtered;
  // Region-first ordering; entries in the same region float to the top.
  return [...filtered].sort((a, b) => {
    const ra = a.region === region ? 0 : 1;
    const rb = b.region === region ? 0 : 1;
    return ra - rb;
  });
}
