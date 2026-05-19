// Templates for urgent court / authority requests that a caregiver can fill
// in, print, and walk into court with. These are pre-filing drafts — not
// legal advice — and the printed footer makes that explicit.

export type LegalTemplateKey =
  | 'guardianship_property'
  | 'block_finance'
  | 'exit_ban';

export interface LegalTemplate {
  key: LegalTemplateKey;
  // Hebrew document title that appears at the top of the printout.
  titleHe: string;
  titleEn: string;
  // Court / authority that receives this document.
  courtHe: string;
  courtEn: string;
  // Short, caregiver-facing description of what this request does.
  summaryKey: string;
  // Sections rendered in order. Each section has a Hebrew heading and a
  // function that interpolates fields from the IncidentDetails form.
  sections: LegalTemplateSection[];
}

export interface IncidentDetails {
  patientName: string;
  patientId: string;
  patientAddress: string;
  applicantName: string;
  applicantId: string;
  applicantRelation: string;
  applicantPhone: string;
  applicantAddress: string;
  incidentDate: string;
  incidentSummary: string;
  riskDescription: string;
  evidence: string;
  requestedRelief: string;
}

export interface LegalTemplateSection {
  headingHe: string;
  headingEn: string;
  bodyHe: (d: IncidentDetails) => string;
  bodyEn: (d: IncidentDetails) => string;
}

const formalIntro = (
  court: string,
  applicant: IncidentDetails,
  patient: string,
): string =>
  `לכבוד\n${court}\n\nהמבקש/ת: ${applicant.applicantName} (ת"ז ${applicant.applicantId})\n` +
  `קרבה למתמודד/ת: ${applicant.applicantRelation}\nכתובת: ${applicant.applicantAddress}\n` +
  `טלפון: ${applicant.applicantPhone}\n\nבעניין: ${patient} (ת"ז ${applicant.patientId}), ` +
  `כתובת: ${applicant.patientAddress}\n`;

export const LEGAL_TEMPLATES: Record<LegalTemplateKey, LegalTemplate> = {
  guardianship_property: {
    key: 'guardianship_property',
    titleHe: 'בקשה דחופה למינוי אפוטרופוס זמני לרכוש',
    titleEn: 'Urgent application for temporary property guardianship',
    courtHe: 'בית המשפט לענייני משפחה',
    courtEn: 'Family Court',
    summaryKey: 'legal.template.guardianship.summary',
    sections: [
      {
        headingHe: 'פרטי הצדדים',
        headingEn: 'Parties',
        bodyHe: (d) =>
          formalIntro('בית המשפט לענייני משפחה', d, d.patientName) +
          `\nהבקשה מוגשת בהתאם לסעיפים 33-68 לחוק הכשרות המשפטית והאפוטרופסות, התשכ"ב-1962, ולסעיף 64 לחוק.`,
        bodyEn: (d) =>
          `Family Court — application by ${d.applicantName} (ID ${d.applicantId}) regarding ${d.patientName} (ID ${d.patientId}), under the Capacity & Guardianship Law, 5722-1962, sections 33-68 and 64.`,
      },
      {
        headingHe: 'תיאור המצב והעובדות הרלוונטיות',
        headingEn: 'Background and facts',
        bodyHe: (d) =>
          `תאריך האירוע / תחילת ההידרדרות: ${d.incidentDate}\n\n${d.incidentSummary}\n\n` +
          `מצבו של המתמודד/ת כיום מצדיק התערבות דחופה מאחר שאינו/ה מסוגל/ת לדאוג ` +
          `לענייניו/ה הכלכליים, ומחויבויות פיננסיות שמתבצעות במצב זה גורמות נזק בלתי הפיך.`,
        bodyEn: (d) =>
          `Onset / incident date: ${d.incidentDate}.\n\n${d.incidentSummary}\n\nThe respondent is currently unable to manage their financial affairs and ongoing decisions are causing irreversible harm.`,
      },
      {
        headingHe: 'סיכון פיננסי קונקרטי',
        headingEn: 'Specific financial risk',
        bodyHe: (d) => d.riskDescription,
        bodyEn: (d) => d.riskDescription,
      },
      {
        headingHe: 'ראיות מצורפות',
        headingEn: 'Supporting evidence',
        bodyHe: (d) =>
          d.evidence ||
          'מצורפים: סיכומים רפואיים, צילומי תנועות בנק / אשראי, תיעוד התקשרויות, אישורי שיחות עם המוקדים.',
        bodyEn: (d) =>
          d.evidence ||
          'Attached: medical summaries, bank/credit transaction screenshots, communications log, dispatcher confirmations.',
      },
      {
        headingHe: 'הסעדים המבוקשים (סעדים זמניים, במעמד צד אחד)',
        headingEn: 'Requested relief (ex parte interim)',
        bodyHe: (d) =>
          d.requestedRelief ||
          'מינוי המבקש/ת כאפוטרופוס/ה זמני/ת לרכוש לתקופה של 90 יום;\n' +
            'הוראת בנק לאסור משיכות וביצוע פעולות מעל סך 1,000 ש"ח ללא חתימת האפוטרופוס/ה;\n' +
            'הקפאת מסגרת אשראי וכרטיסי אשראי שאינם מאושרים על־ידי האפוטרופוס/ה;\n' +
            'איסור על העברת כספים, נטילת הלוואות וביצוע עסקאות מקרקעין במהלך תקופת המינוי.',
        bodyEn: (d) =>
          d.requestedRelief ||
          'Appoint the applicant as temporary property guardian for 90 days; freeze withdrawals over 1,000 ILS without guardian co-signature; freeze credit lines and unauthorized credit cards; bar money transfers, new loans, and real-estate transactions during the period.',
      },
    ],
  },

  block_finance: {
    key: 'block_finance',
    titleHe: 'בקשה דחופה להקפאת חשבון בנק וחסימת אשראי',
    titleEn: 'Urgent application to freeze bank account & credit',
    courtHe: 'בית המשפט לענייני משפחה',
    courtEn: 'Family Court',
    summaryKey: 'legal.template.blockFinance.summary',
    sections: [
      {
        headingHe: 'פרטי הצדדים',
        headingEn: 'Parties',
        bodyHe: (d) => formalIntro('בית המשפט לענייני משפחה', d, d.patientName),
        bodyEn: (d) =>
          `Family Court — application by ${d.applicantName} (ID ${d.applicantId}) regarding ${d.patientName} (ID ${d.patientId}).`,
      },
      {
        headingHe: 'רקע ועובדות',
        headingEn: 'Background',
        bodyHe: (d) =>
          `תאריך תחילת ההידרדרות: ${d.incidentDate}\n${d.incidentSummary}\n\n` +
          `במצב הנוכחי, הוצאות אימפולסיביות וקבלת החלטות כלכליות שגויות גורמות לנזקים מתמשכים ` +
          `שלא ניתן יהיה להחזירם לאחר התייצבות.`,
        bodyEn: (d) =>
          `Onset: ${d.incidentDate}.\n${d.incidentSummary}\n\nImpulsive spending and impaired financial judgement are creating ongoing, irreversible damage.`,
      },
      {
        headingHe: 'הסעדים המבוקשים',
        headingEn: 'Relief sought',
        bodyHe: (d) =>
          d.requestedRelief ||
          'צו זמני לבנק/חברות האשראי לאיסור משיכות מעל סך 500 ש"ח ביום;\n' +
            'הקפאת כל מסגרות האשראי לתקופה של 60 יום או עד החלטה אחרת;\n' +
            'איסור פתיחת מסגרות אשראי חדשות, נטילת הלוואות וקבלת ערבויות;\n' +
            'איסור פתיחת חשבונות בבנקים אחרים בתקופה זו.',
        bodyEn: (d) =>
          d.requestedRelief ||
          'Interim injunction to bank & credit providers: no withdrawals over 500 ILS/day; freeze all credit lines for 60 days; bar new credit lines, loans, or guarantees; bar opening new accounts at other banks.',
      },
      {
        headingHe: 'אסמכתאות וראיות',
        headingEn: 'Evidence',
        bodyHe: (d) => d.evidence || 'מצורף: דפי חשבון, תנועות, התראות הונאה, סיכומים רפואיים.',
        bodyEn: (d) => d.evidence || 'Attached: bank statements, transaction logs, fraud alerts, medical summaries.',
      },
    ],
  },

  exit_ban: {
    key: 'exit_ban',
    titleHe: 'בקשה דחופה לעיכוב יציאה מהארץ',
    titleEn: 'Urgent application for exit ban',
    courtHe: 'בית המשפט לענייני משפחה',
    courtEn: 'Family Court',
    summaryKey: 'legal.template.exitBan.summary',
    sections: [
      {
        headingHe: 'פרטי הצדדים',
        headingEn: 'Parties',
        bodyHe: (d) => formalIntro('בית המשפט לענייני משפחה', d, d.patientName),
        bodyEn: (d) =>
          `Family Court — application by ${d.applicantName} (ID ${d.applicantId}) regarding ${d.patientName} (ID ${d.patientId}).`,
      },
      {
        headingHe: 'רקע ועובדות',
        headingEn: 'Background',
        bodyHe: (d) =>
          `${d.incidentSummary}\n\nיש חשש ממשי כי המתמודד/ת בכוונתו/ה לעזוב את הארץ במצב לא יציב, ` +
          `דבר שעלול לסכן את חייו/ה, לחשוף אותו/ה למצוקה במדינה זרה ללא רשת תמיכה רפואית, ` +
          `ולמנוע את האפשרות לאשפוז דחוף או למתן טיפול מציל חיים.`,
        bodyEn: (d) =>
          `${d.incidentSummary}\n\nThere is a real concern the respondent intends to leave Israel while unstable, risking life, leaving them without medical safety net abroad, and preventing urgent hospitalization or life-saving treatment.`,
      },
      {
        headingHe: 'התרשמות רפואית / סיכון',
        headingEn: 'Clinical / risk note',
        bodyHe: (d) => d.riskDescription,
        bodyEn: (d) => d.riskDescription,
      },
      {
        headingHe: 'הסעדים המבוקשים',
        headingEn: 'Relief sought',
        bodyHe: (d) =>
          d.requestedRelief ||
          'צו עיכוב יציאה מהארץ עד 90 יום או עד התייצבות מצבו/ה הרפואי של המתמודד/ת לפי קביעת פסיכיאטר מוסמך;\n' +
            'הודעה למשטרת ההגירה ולשירותי גבולות לאכיפת הצו.',
        bodyEn: (d) =>
          d.requestedRelief ||
          'Exit ban for up to 90 days or until stabilization confirmed by a licensed psychiatrist; notice to immigration and border control to enforce.',
      },
      {
        headingHe: 'אסמכתאות',
        headingEn: 'Evidence',
        bodyHe: (d) =>
          d.evidence ||
          'הזמנת טיסה / טופס יציאה, תכתובות מהן עולה הכוונה לעזוב, סיכומים רפואיים עדכניים.',
        bodyEn: (d) =>
          d.evidence ||
          'Flight booking, correspondence indicating intent to leave, recent medical summaries.',
      },
    ],
  },
};
