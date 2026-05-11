import type { Region } from '@/lib/regions';

// Public-record Israeli psychiatric hospitals.
//
// Names and locations are public information. Phone numbers should be
// VERIFIED via the hospital website before relying on them — they change,
// and a wrong number in a crisis is worse than no number. The UI surfaces
// this caveat prominently. `mapsQuery` is the address string fed to Waze
// and Google Maps deep links.
export interface PsychHospital {
  id: string;
  name: string;
  region: Region;
  city: string;
  mapsQuery: string;
  // Primary switchboard. Always present.
  phone: string;
  // Direct line to the ER / psychiatric admitting unit if publicly listed.
  erPhone?: string;
  // True when the facility runs a 24/7 psychiatric ER. Without one a
  // caregiver is better off routed to a general-hospital ER for evaluation.
  hasPsychER: boolean;
  acceptsMinors: boolean;
  acceptsCivilCommitment: boolean;
  notes?: string;
  website?: string;
}

export const PSYCH_HOSPITALS: PsychHospital[] = [
  {
    id: 'abarbanel',
    name: 'המרכז לבריאות הנפש אברבנאל',
    region: 'telaviv',
    city: 'בת ים',
    mapsQuery: 'המרכז לבריאות הנפש אברבנאל, בת ים',
    phone: '03-5552555',
    hasPsychER: true,
    acceptsMinors: false,
    acceptsCivilCommitment: true,
    website: 'https://www.abarbanel.org.il',
  },
  {
    id: 'shalvata',
    name: 'המרכז לבריאות הנפש שלוותה',
    region: 'sharon',
    city: 'הוד השרון',
    mapsQuery: 'בית חולים שלוותה, הוד השרון',
    phone: '09-7478555',
    hasPsychER: true,
    acceptsMinors: true,
    acceptsCivilCommitment: true,
    website: 'https://hospitals.clalit.co.il/shalvata',
  },
  {
    id: 'geha',
    name: 'המרכז לבריאות הנפש גהה',
    region: 'center',
    city: 'פתח תקווה',
    mapsQuery: 'המרכז לבריאות הנפש גהה, פתח תקווה',
    phone: '03-9258222',
    hasPsychER: true,
    acceptsMinors: true,
    acceptsCivilCommitment: true,
  },
  {
    id: 'lev_hasharon',
    name: 'המרכז לבריאות הנפש לב השרון',
    region: 'sharon',
    city: 'פרדסיה',
    mapsQuery: 'בית חולים לב השרון, פרדסיה',
    phone: '09-8981888',
    hasPsychER: false,
    acceptsMinors: false,
    acceptsCivilCommitment: true,
    notes: 'אין חדר מיון פסיכיאטרי 24/7 — קבלה בתיאום עם הפסיכיאטר המחוזי.',
  },
  {
    id: 'sheba_mental',
    name: 'מערך בריאות הנפש שיבא תל השומר',
    region: 'center',
    city: 'רמת גן',
    mapsQuery: 'בית חולים שיבא, תל השומר, רמת גן',
    phone: '03-5302222',
    hasPsychER: true,
    acceptsMinors: true,
    acceptsCivilCommitment: true,
  },
  {
    id: 'mazra',
    name: 'המרכז לבריאות הנפש מזרע',
    region: 'north',
    city: 'עכו',
    mapsQuery: 'בית חולים מזרע, עכו',
    phone: '04-9559555',
    hasPsychER: true,
    acceptsMinors: false,
    acceptsCivilCommitment: true,
  },
  {
    id: 'shaar_menashe',
    name: 'המרכז לבריאות הנפש שער מנשה',
    region: 'haifa',
    city: 'חדרה',
    mapsQuery: 'המרכז לבריאות הנפש שער מנשה, חדרה',
    phone: '04-6278888',
    hasPsychER: true,
    acceptsMinors: false,
    acceptsCivilCommitment: true,
  },
  {
    id: 'tirat_carmel',
    name: 'המרכז לבריאות הנפש טירת הכרמל',
    region: 'haifa',
    city: 'טירת כרמל',
    mapsQuery: 'בית חולים טירת הכרמל, טירת כרמל',
    phone: '04-8559500',
    hasPsychER: true,
    acceptsMinors: false,
    acceptsCivilCommitment: true,
  },
  {
    id: 'kfar_shaul',
    name: 'המרכז לבריאות הנפש כפר שאול',
    region: 'jerusalem',
    city: 'ירושלים',
    mapsQuery: 'בית חולים כפר שאול, ירושלים',
    phone: '02-6555000',
    hasPsychER: true,
    acceptsMinors: false,
    acceptsCivilCommitment: true,
  },
  {
    id: 'eitanim',
    name: 'המרכז לבריאות הנפש איתנים',
    region: 'jerusalem',
    city: 'ירושלים',
    mapsQuery: 'בית חולים איתנים, ירושלים',
    phone: '02-5602345',
    hasPsychER: true,
    acceptsMinors: true,
    acceptsCivilCommitment: true,
  },
  {
    id: 'beer_yaakov',
    name: 'המרכז לבריאות הנפש באר יעקב נס ציונה',
    region: 'shfela',
    city: 'באר יעקב',
    mapsQuery: 'המרכז לבריאות הנפש באר יעקב, באר יעקב',
    phone: '08-9258444',
    hasPsychER: true,
    acceptsMinors: true,
    acceptsCivilCommitment: true,
  },
  {
    id: 'mbn_beer_sheva',
    name: 'המרכז לבריאות הנפש באר שבע',
    region: 'south',
    city: 'באר שבע',
    mapsQuery: 'המרכז לבריאות הנפש באר שבע, באר שבע',
    phone: '08-6401400',
    hasPsychER: true,
    acceptsMinors: true,
    acceptsCivilCommitment: true,
  },
];

// How "close" two regions are. Used to fall back gracefully when no
// hospital is registered in the exact bucket the caregiver picked.
const REGION_NEIGHBORS: Record<Region, Region[]> = {
  north: ['haifa', 'sharon'],
  haifa: ['north', 'sharon'],
  sharon: ['haifa', 'center', 'telaviv'],
  center: ['telaviv', 'sharon', 'shfela'],
  telaviv: ['center', 'sharon', 'shfela'],
  jerusalem: ['shfela', 'center'],
  shfela: ['center', 'telaviv', 'jerusalem', 'south'],
  south: ['shfela', 'jerusalem'],
};

export function hospitalsForRegion(region: Region | null | undefined): {
  near: PsychHospital[];
  other: PsychHospital[];
} {
  if (!region) return { near: [], other: PSYCH_HOSPITALS };
  const neighbors = new Set<Region>([region, ...REGION_NEIGHBORS[region]]);
  const near: PsychHospital[] = [];
  const other: PsychHospital[] = [];
  for (const h of PSYCH_HOSPITALS) {
    if (h.region === region) near.unshift(h);
    else if (neighbors.has(h.region)) near.push(h);
    else other.push(h);
  }
  return { near, other };
}

export function wazeLink(mapsQuery: string): string {
  return `https://waze.com/ul?q=${encodeURIComponent(mapsQuery)}&navigate=yes`;
}

export function googleMapsLink(mapsQuery: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`;
}
