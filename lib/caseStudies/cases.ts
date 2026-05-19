// Anonymized composite scenarios drawn from common caregiver experiences.
// These are educational only — they describe what other families have
// done, NOT a recommended treatment path. The UI surfaces this caveat.

export type CaseDiagnosis =
  | 'bipolar_mania'
  | 'bipolar_depression'
  | 'psychotic_break'
  | 'postpartum_psychosis'
  | 'major_depression'
  | 'suicidality_crisis'
  | 'eating_disorder';

export type AgeBand = 'adolescent' | 'young_adult' | 'adult' | 'older_adult';

export type Trigger =
  | 'med_noncompliance'
  | 'sleep_disruption'
  | 'substance_use'
  | 'major_life_event'
  | 'postpartum'
  | 'unknown';

export interface CaseStudy {
  id: string;
  diagnosis: CaseDiagnosis;
  ageBand: AgeBand;
  triggers: Trigger[];
  // Caregiver-facing summary of the situation.
  situation: string;
  // What the family / treating team actually did, in order.
  actionTaken: string[];
  // Total time from first warning sign to stable functional baseline.
  durationLabel: string;
  // The single thing the family wishes they'd done sooner.
  keyTakeaway: string;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'mania_spending',
    diagnosis: 'bipolar_mania',
    ageBand: 'young_adult',
    triggers: ['med_noncompliance', 'sleep_disruption'],
    situation:
      'בן 26 עם אבחנת ביפולר 1, מאוזן שנתיים, הפסיק עצמאית את הליתיום. תוך שבועיים: שינה 2-3 שעות בלילה, פתח חמישה כרטיסי אשראי חדשים, רכש רכב יקר בתשלומים, התקשר לחברים בלילה עם רעיונות עסקיים מהירים. סירב להגיע למרפאה.',
    actionTaken: [
      'המשפחה תיעדה במצפן את שעות השינה והשיחות הליליות במשך שלושה ימים.',
      'פנייה דחופה לפסיכיאטר המחוזי עם דפי הדיווח — הוצאה הוראת בדיקה.',
      'אשפוז של 17 ימים בבית חולים פסיכיאטרי, איזון תרופתי מחודש.',
      'במקביל הוגשה בקשה לבית משפט לאפוטרופסות זמנית לרכוש — אושרה לתקופה של 90 יום.',
      'מעבר לאשפוז יום ל-6 שבועות לאחר השחרור.',
    ],
    durationLabel: '3 חודשים עד התייצבות תפקודית',
    keyTakeaway:
      'הקפיאו מסגרות אשראי באות הראשון של חוסר שינה. נזק כספי קל יותר להחזיר מהפסד אמון.',
  },
  {
    id: 'first_psychotic_break',
    diagnosis: 'psychotic_break',
    ageBand: 'young_adult',
    triggers: ['substance_use', 'major_life_event'],
    situation:
      'סטודנט בן 22, התקף פסיכוטי ראשון לאחר מעבר לדירה חדשה ושימוש בקנאביס. שמע קולות, האמין שעוקבים אחריו. סירב להיכנס לרכב המשפחתי. נעל את עצמו בחדר במשך 36 שעות.',
    actionTaken: [
      'הורים פנו ל-101 כדי לשלוח צוות פראמדיקים שיוכל להעריך מצב גופני.',
      'במקביל פנייה לפסיכיאטר מחוזי — קיבלו הוראת בדיקה בטלפון.',
      'הצוות הגיע, הסכים לשתף פעולה כשהובטח שלא יעצרו אותו.',
      'אשפוז של 4 שבועות, אבחנה ראשונית של פסיכוזה אקוטית.',
      'מעקב במרפאת חוץ עם פסיכיאטר ועובדת סוציאלית קבועה.',
    ],
    durationLabel: '5 חודשים עד חזרה לחיים סטודנטיאליים',
    keyTakeaway:
      '101 ולא 100. צוות רפואי במצבי פסיכוזה ראשונה מפחית הסלמה יותר ממשטרה.',
  },
  {
    id: 'deep_depression_day',
    diagnosis: 'major_depression',
    ageBand: 'adult',
    triggers: ['major_life_event', 'unknown'],
    situation:
      'אישה בת 48 חודש לאחר פיטורין. הפסיקה לאכול ארוחות מסודרות, ירדה 9 ק"ג בחודש, ישנה 14-16 שעות. הזכירה פעמיים שהיא "מעמסה". ללא היסטוריה פסיכיאטרית קודמת.',
    actionTaken: [
      'בן הזוג רשם במצפן את שעות השינה והמשקל למשך שבועיים.',
      'פנייה לפסיכיאטר במרפאת קופת חולים — קיבלה תור תוך 3 ימים.',
      'התחילה SSRI ו-CBT. בשבועיים הראשונים החמרה — שמרו אותה לא לבד.',
      'הצטרפה לאשפוז יום פסיכיאטרי ב-6 שבועות, 4 ימים בשבוע.',
      'תמיכה במציאת עבודה זמנית במקביל לטיפול.',
    ],
    durationLabel: '4 חודשים מהאזכור הראשון של אובדנות עד תפקוד מלא',
    keyTakeaway:
      'אזכור של "מעמסה" או "אין טעם" אינו רטוריקה — הוא אינדיקציה. דיברו מיד עם פסיכיאטר, גם אם אין אבחנה קודמת.',
  },
  {
    id: 'postpartum_psychosis',
    diagnosis: 'postpartum_psychosis',
    ageBand: 'adult',
    triggers: ['postpartum', 'sleep_disruption'],
    situation:
      'אמא טריה, 5 ימים לאחר לידה. ערה כמעט ברציפות, מבוהלת מהתינוקת, חשבה שלא היא הילדה שלה. הצוות ביולדות שחרר אותה כי "זה רק עייפות".',
    actionTaken: [
      'בן הזוג צילם את ההתנהגות וחזר עם הסרטון למיון בית חולים כללי.',
      'הופנו דחוף ליחידה פסיכיאטרית עם מומחית פסיכיאטריה פרי-נטלית.',
      'אשפוז של 12 ימים עם אפשרות שהתינוקת תהיה בקרבת מקום שעות יום.',
      'איזון תרופתי תוך התחשבות בהנקה.',
      'ליווי הדרגתי בחזרה הביתה, אחות יועצת הנקה שביקרה פעמיים בשבוע.',
    ],
    durationLabel: '6 שבועות עד חזרה לטיפול עצמאי בתינוקת',
    keyTakeaway:
      'פסיכוזה פוסט-פרטום היא מצב חירום רפואי, לא "בייבי בלוז". אל תקבלו "זה רק עייפות" מבית החולים — דרשו הערכה פסיכיאטרית מפורשת.',
  },
  {
    id: 'suicidality_crisis',
    diagnosis: 'suicidality_crisis',
    ageBand: 'adolescent',
    triggers: ['major_life_event', 'unknown'],
    situation:
      'נער בן 16. החל לדבר על "להיעלם", העלה בחשבון אינסטגרם תמונות פרידה. ההורים מצאו תיק עם תרופות אצורות. ההורים פחדו ש"דיבור על זה יחמיר".',
    actionTaken: [
      'הורידו את התרופות, אקדח של הסבא הוצא מהבית בפועל.',
      'פנייה למוקד ער"ן (1201) למתן הדרכה למשפחה במקביל לתיאום פסיכיאטר.',
      'הגיעו למיון כללי — ביקשו "הערכה פסיכיאטרית עם פסיכיאטר ילדים".',
      'אושפז 9 ימים ביחידה פסיכיאטרית לנוער. ההורים נכחו יום-יום.',
      'מעבר ל-DBT שבועי וקבוצת תמיכה לנוער.',
    ],
    durationLabel: '8 חודשים של טיפול אינטנסיבי עד התייצבות',
    keyTakeaway:
      'הוצאת אמצעים קטלניים מהבית (תרופות, נשק) היא הצעד הכי חשוב — מחקרים מראים שהיא מפחיתה תמותה גם בלי טיפול נוסף.',
  },
  {
    id: 'bipolar_depression_relapse',
    diagnosis: 'bipolar_depression',
    ageBand: 'older_adult',
    triggers: ['med_noncompliance'],
    situation:
      'גבר בן 62 עם אבחנת ביפולר 2 ב-30 השנים האחרונות. הצוות הרפואי הוריד את מינון הלמוטריג\'ין בגלל תופעות לוואי. תוך 3 שבועות — אנרגיה אפסית, לא קם מהמיטה, הפסיק לאכול.',
    actionTaken: [
      'הבת תיעדה את הצריכה היומית ושעות השינה במצפן.',
      'פנייה לפסיכיאטר המטפל עם דפי הדיווח. הוחלט להעלות חזרה את המינון בהדרגה.',
      'במקביל — אשפוז יום פסיכיאטרי שלוש פעמים בשבוע למשך חודשיים.',
      'בני המשפחה התחלקו בארוחות יומיות (אבא לא היה לבד בארוחות).',
      'חזרה לשגרה תפקודית לאחר 10 שבועות.',
    ],
    durationLabel: '10 שבועות מהשינוי במינון עד התייצבות',
    keyTakeaway:
      'שינוי תרופתי הוא טריגר ידוע. אחרי כל התאמת מינון — הגבירו את תדירות הדיווח היומי למשך 4 שבועות.',
  },
];

export function filterCases(
  cases: CaseStudy[],
  filters: {
    diagnosis?: CaseDiagnosis | '';
    ageBand?: AgeBand | '';
    trigger?: Trigger | '';
  },
): CaseStudy[] {
  return cases.filter((c) => {
    if (filters.diagnosis && c.diagnosis !== filters.diagnosis) return false;
    if (filters.ageBand && c.ageBand !== filters.ageBand) return false;
    if (filters.trigger && !c.triggers.includes(filters.trigger)) return false;
    return true;
  });
}
