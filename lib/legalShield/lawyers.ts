// Mock directory of mental-health-specialized attorneys.
//
// These entries are illustrative only — populate from a vetted partner list
// before launch. Costs are typical ranges in ILS for an initial paid
// consultation as of writing; the actual fee is negotiated per case.
export interface Lawyer {
  id: string;
  name: string;
  specialty: LawyerSpecialty[];
  region: string;
  phone?: string;
  email?: string;
  website?: string;
  consultationFeeIls?: [number, number];
  proBono?: boolean;
  languages: string[];
  notes?: string;
}

export type LawyerSpecialty =
  | 'guardianship'
  | 'involuntary'
  | 'criminal_mental_health'
  | 'national_insurance'
  | 'rehab_basket'
  | 'financial_protection';

export const LAWYERS: Lawyer[] = [
  {
    id: 'mock-1',
    name: 'עו״ד דוגמה א׳',
    specialty: ['guardianship', 'financial_protection'],
    region: 'telaviv',
    phone: '03-0000000',
    email: 'example1@example.org',
    consultationFeeIls: [600, 900],
    languages: ['he', 'en'],
    notes: 'מתמחה במינוי אפוטרופוס זמני לרכוש ובקשות חסימה בנקאית דחופות.',
  },
  {
    id: 'mock-2',
    name: 'עו״ד דוגמה ב׳',
    specialty: ['involuntary', 'criminal_mental_health'],
    region: 'jerusalem',
    phone: '02-0000000',
    consultationFeeIls: [500, 800],
    languages: ['he'],
    notes: 'ייצוג בוועדה פסיכיאטרית, התנגדויות לאשפוז כפוי, ערעורים במחוזי.',
  },
  {
    id: 'mock-3',
    name: 'עו״ד דוגמה ג׳',
    specialty: ['national_insurance', 'rehab_basket'],
    region: 'center',
    phone: '09-0000000',
    proBono: true,
    languages: ['he', 'ru'],
    notes: 'סיוע ללא תשלום לזכאים בקצבת נכות נפשית וועדות סל שיקום.',
  },
  {
    id: 'mock-4',
    name: 'עו״ד דוגמה ד׳',
    specialty: ['guardianship', 'involuntary'],
    region: 'haifa',
    phone: '04-0000000',
    consultationFeeIls: [700, 1000],
    languages: ['he', 'ar'],
  },
  {
    id: 'mock-5',
    name: 'עו״ד דוגמה ה׳',
    specialty: ['criminal_mental_health', 'financial_protection'],
    region: 'south',
    phone: '08-0000000',
    consultationFeeIls: [550, 850],
    languages: ['he', 'ru'],
    notes: 'התמחות בעיכוב יציאה מהארץ ועיקול חשבונות בנק במצבי משבר.',
  },
];
