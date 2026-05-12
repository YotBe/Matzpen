export type Locale = 'he' | 'en';

export const LOCALES: { code: Locale; label: string; dir: 'rtl' | 'ltr' }[] = [
  { code: 'he', label: 'עברית', dir: 'rtl' },
  { code: 'en', label: 'English', dir: 'ltr' },
];

// One flat dictionary per locale. Keep keys stable; only the values move.
export const TRANSLATIONS: Record<Locale, Record<string, string>> = {
  he: {
    // ── Generic ────────────────────────────────────────────────────────────
    'common.loading': 'טוען…',
    'common.cancel': 'ביטול',
    'common.save': 'שמירה',
    'common.saving': 'שומר…',
    'common.edit': 'עריכה',
    'common.print': 'הדפסה',
    'common.yes': 'כן',
    'common.no': 'לא',
    'common.previewMode': 'תצוגה',
    'configBanner.kicker': 'המערכת אינה מוגדרת',
    'configBanner.title': 'נדרשת הגדרת Supabase',
    'configBanner.body':
      'כדי להפעיל את מצפן יש להגדיר את משתני הסביבה NEXT_PUBLIC_SUPABASE_URL ו־NEXT_PUBLIC_SUPABASE_ANON_KEY. כל עוד הם חסרים האפליקציה לא תציג נתונים, כדי שלא יוצגו נתוני דמו כאילו היו אמיתיים.',
    'common.langName': 'EN',
    'common.skip': 'דלג',
    'common.next': 'הבא',
    'common.done': 'התחל',
    'common.back': 'חזרה',
    'common.step': 'שלב {{current}} מתוך {{total}}',

    // Onboarding
    'onboarding.welcome': 'ברוכים הבאים למצפן',
    'onboarding.intro': 'מצפן עוזר לכם לתמוך במתמודד שלכם — בקצרה, מה תמצאו פה.',
    'onboarding.s1.title': 'מצפן בכל יום',
    'onboarding.s1.body':
      'כדקה ביום: שינה, מצב רגשי, פעילות, אירועים חריגים. כל דיווח עוזר לזהות מגמות וסימני אזהרה מוקדמים.',
    'onboarding.s2.title': 'כשמשהו משתבש',
    'onboarding.s2.body':
      '"מצב חירום" מוביל אתכם דרך עץ החלטה: למי לפנות (משטרה / מד״א / פסיכיאטר מחוזי), ומה להקריא למוקדן.',
    'onboarding.s3.title': 'מיון, זכויות, ובירוקרטיה',
    'onboarding.s3.body':
      '"תיק למיון" מרכז את המידע הרפואי שצוות חדר המיון יזדקק לו. "זכויות ובירוקרטיה" שומר על ההתקדמות שלכם מול ביטוח לאומי וסל שיקום.',

    // Emergency shortcuts
    'emergency.shortcutsTitle': 'יודעים מה צריך? עברו ישר',
    'emergency.safetyLink': 'מדריך הגבלת אמצעים בבית →',
    'emergency.shortcut.violence': 'סכנה מיידית או אלימות',
    'emergency.shortcut.violenceHint': 'משטרה — חיוג 100',
    'emergency.shortcut.suicide': 'אובדנות / סכנה לעצמו',
    'emergency.shortcut.suicideHint': 'מד״א — חיוג 101',
    'emergency.shortcut.involuntary': 'פסיכוזה ללא אלימות',
    'emergency.shortcut.involuntaryHint': 'הוראת בדיקה מהפסיכיאטר המחוזי',
    'emergency.orQuestions': 'או ענו על השאלות',

    // ── Navigation ─────────────────────────────────────────────────────────
    'nav.daily': 'מעקב יומי',
    'nav.dailyShort': 'מעקב',
    'nav.dailyHelper': 'זיהוי הידרדרות בזמן',
    'nav.emergency': 'מצב חירום',
    'nav.emergencyShort': 'חירום',
    'nav.emergencyHelper': 'מה עושים עכשיו',
    'nav.goldenRecord': 'תיק למיון',
    'nav.goldenRecordShort': 'תיק',
    'nav.goldenRecordHelper': 'מסמך אחד למוקדן',
    'nav.bureaucracy': 'זכויות ובירוקרטיה',
    'nav.bureaucracyShort': 'זכויות',
    'nav.bureaucracyHelper': 'מסלול וצ׳קליסטים',
    'nav.assistant': 'מצפן AI',
    'nav.assistantShort': 'עוזר',
    'nav.assistantHelper': 'מענה חי לשאלות בירוקרטיה ומשבר',
    'nav.tools': 'כלים',
    'nav.toolsHelper': 'משפט, אשפוז, מקרי בוחן',
    'nav.warRoom': 'חדר מבצעים',
    'nav.warRoomHelper': 'משמרות, משימות, חילוץ',
    'nav.lockdown': 'נעילת סביבה',
    'nav.lockdownHelper': 'צ׳קליסט פעולות חירום',
    'nav.playbook': 'תסריטי הרגעה',
    'nav.playbookHelper': 'מה לומר כשהמצב מתלהט',
    'nav.vault': 'כספת מדיה',
    'nav.vaultHelper': 'תיעוד התנהגות לרופאים',
    'nav.selfCare': 'תמיכה למשפחה',
    'nav.selfCareHelper': 'משאבי שחיקה ותמיכה',
    'nav.legal': 'מגן משפטי',
    'nav.legalHelper': 'אפוטרופסות, חסימת אשראי, עיכוב יציאה',
    'nav.hospitalization': 'חלופות ואשפוז',
    'nav.hospitalizationHelper': 'בתי חולים, בתים מאזנים, אשפוז יום',
    'nav.cases': 'מקרי בוחן',
    'nav.casesHelper': 'איך משפחות אחרות התמודדו',
    'nav.moreShort': 'עוד',
    'nav.moreSheetTitle': 'כלים נוספים',
    'nav.signIn': 'כניסה',
    'nav.signOut': 'יציאה',
    'nav.privacy': 'פרטיות',
    'nav.feedback': 'משוב',

    // ── Auth gate / config banner ──────────────────────────────────────────
    'config.previewLocal':
      'מצב תצוגה: Supabase לא מוגדר. ראה .env.local להפעלת אימות ושמירה.',
    'config.previewVercel':
      'מצב תצוגה: Supabase לא מוגדר. הגדירו את משתני הסביבה ב־Vercel והפעילו פריסה מחדש.',

    // ── Login ──────────────────────────────────────────────────────────────
    'login.welcome': 'ברוכים הבאים למצפן',
    'login.subSignIn': 'התחברו לחשבון משפחתי קיים',
    'login.subSignUp': 'יצירת חשבון משפחתי חדש',
    'login.notConfigured':
      'Supabase לא מוגדר. ההתחברות תיכשל עד שיוזנו משתני סביבה ב־.env.local.',
    'login.email': 'דוא״ל',
    'login.password': 'סיסמה',
    'login.busy': 'מתחבר…',
    'login.signIn': 'כניסה',
    'login.signUp': 'יצירת חשבון',
    'login.or': 'או',
    'login.google': 'כניסה עם Google',
    'login.noAccount': 'אין חשבון?',
    'login.haveAccount': 'יש כבר חשבון?',
    'login.toSignUp': 'הירשמו כאן',
    'login.toSignIn': 'התחברו',
    'login.unknownError': 'שגיאה לא ידועה',
    'login.consentLabel':
      'אני מבין/ה ש"מצפן" הוא כלי תיעוד לעזרה עצמית למשפחות ואינו תחליף לטיפול רפואי, אבחון או החלטה קלינית. ההתראות הן היוריסטיקה שלא קיבלה אישור קליני. במצבי חירום פניתי קודם ל-101 (מד״א), 100 (משטרה) או 1201 (ער״ן). אני מאשר/ת שמידע שאזין (כולל תיק רפואי ושיחות עם העוזר החכם) יעובד גם אצל ספק הבינה המלאכותית (Google Gemini) לצורך מתן התשובה.',
    'login.consentRequired': 'אנא אשרו את ההצהרה כדי להמשיך.',

    // ── Dashboard ──────────────────────────────────────────────────────────
    'dashboard.greeting': 'שלום, {{name}}',
    'dashboard.defaultName': 'בן/בת משפחה',
    'dashboard.title': 'דיווח מעקב יומי',
    'dashboard.subtitle':
      'המצפן של {{patient}} · המעקב היומי לוקח כדקה ועוזר לזהות סימני אזהרה מוקדמים.',
    'dashboard.subtitleGeneric':
      'המעקב היומי לוקח כדקה ועוזר לזהות סימני אזהרה מוקדמים.',
    'dashboard.setup.kicker': 'בואו נתחיל',
    'dashboard.setup.title': 'מי האדם שאתם מלווים?',
    'dashboard.setup.body':
      'הוסיפו שם וקשר בסיסי כדי שהמצפן יהיה אישי וגם כדי שלצוות המיון יהיה את המידע הדרוש ברגע האמת.',
    'dashboard.setup.cta': 'מילוי פרטים בתיק הרפואי',
    'dashboard.valueProp':
      'מרכז ניהול משבר למשפחות — מעקב, חירום, תיק למיון וזכויות במקום אחד.',
    'dashboard.disclaimer':
      'המערכת נועדה לעזור לכם לזהות הידרדרות בזמן, לא להחליף טיפול מקצועי.',
    'dashboard.weekTitle': 'סיכום השבוע',
    'dashboard.weekStable': 'מתוך {{total}} ימי דיווח השבוע, המצב היה יציב ב־{{stable}}.',
    'dashboard.weekNone': 'אין עדיין דיווחים לשבוע האחרון.',
    'dashboard.weekTrend': 'מגמת הסיכון: {{trend}}',
    'dashboard.weekStableTag': 'יציבה',
    'dashboard.weekRisingTag': 'במגמת עלייה',
    'dashboard.weekFallingTag': 'במגמת ירידה',

    // ── Daily log form ─────────────────────────────────────────────────────
    'dailyLog.sectionSleep': 'שינה',
    'dailyLog.sectionAffect': 'מצב רגשי',
    'dailyLog.sectionActivity': 'פעילות',
    'dailyLog.sectionEvents': 'אירועים חריגים',
    'dailyLog.sleepLabel': 'שעות שינה אתמול',
    'dailyLog.sleepUnit': 'שעות',
    'dailyLog.sleepHigh': '⚠ סיכון גבוה — שינה קצרה מאוד',
    'dailyLog.sleepLow': 'מתחת לטווח המומלץ',
    'dailyLog.sleepOk': 'בטווח התקין',
    'dailyLog.sleepSummary': '{{hours}} שעות · {{note}}',
    'dailyLog.affectiveLabel': 'מצב אפקטיבי כעת',
    'dailyLog.psychoLabel': 'קצב פעילות ותנועה',
    'dailyLog.psychoSlow': 'איטי',
    'dailyLog.psychoRestless': 'חסר מנוח',
    'dailyLog.psycho1': 'איטי מאוד',
    'dailyLog.psycho2': 'איטי',
    'dailyLog.psycho3': 'תקין',
    'dailyLog.psycho4': 'מואץ',
    'dailyLog.psycho5': 'מואץ מאוד / חסר מנוח',
    'dailyLog.psychoLegend': '1 – איטי מאוד · 3 – תקין · 5 – חסר מנוח',
    'dailyLog.impulsivityLabel': 'האם היה היום אירוע חריג של פזרנות או אימפולסיביות?',
    'dailyLog.notesLabel': 'הערות (אופציונלי)',
    'dailyLog.notesPlaceholder': 'לדוגמה: יזם נסיעה פתאומית, דיבור מואץ ולא קשור',
    'dailyLog.submit': 'שמירת דיווח יומי',
    'dailyLog.submitting': 'שומר…',
    'dailyLog.successTitle': 'הדיווח נשמר ✓',
    'dailyLog.successBody':
      'המידע נכלל במעקב היומי ויסונכרן עם שאר בני המשפחה.',
    'dailyLog.successSummaryTitle': 'מה דיווחתם היום',
    'dailyLog.nextStableTitle': 'המצב יציב',
    'dailyLog.nextStableBody':
      'המשיכו במעקב יומי. אם תראו שינוי משמעותי במשך יומיים-שלושה ברציפות, עברו ל"מצב חירום" להנחיות.',
    'dailyLog.nextWatchTitle': 'מומלץ לעקוב מקרוב',
    'dailyLog.nextWatchBody':
      'זוהו סימנים מוקדמים. שווה לדבר עם הצוות המטפל בקהילה ולא לחכות.',
    'dailyLog.nextEscalateTitle': 'שווה לפעול',
    'dailyLog.nextEscalateBody':
      'המדדים החריגים מסתמנים כמגמה. עברו למסך "מצב חירום" לקבלת מסלול פעולה.',
    'dailyLog.fieldImpulsivityYes': 'היה אירוע אימפולסיבי',
    'dailyLog.fieldImpulsivityNo': 'ללא אירועים חריגים',
    'dailyLog.sectionMeds': 'תרופות',
    'dailyLog.medsLabel': 'האם המטופל נטל היום את התרופות כסדרן?',
    'dailyLog.medsYes': 'כן',
    'dailyLog.medsNo': 'לא',
    'dailyLog.medsRefused': 'סירב לקבל',
    'dailyLog.medsField.yes': 'נטל כסדרן',
    'dailyLog.medsField.no': 'לא נטל',
    'dailyLog.medsField.refused': 'סירב לקבל',
    'dailyLog.medsField.unknown': 'לא צוין',
    'dailyLog.addAnother': 'הוסף דיווח נוסף',
    'dailyLog.previewNote':
      'מצב תצוגה: הדיווח לא נשמר עד שהגדרות Supabase יוזנו ב־.env.local.',

    // Affective states
    'affective.depression': 'דיכאון עמוק',
    'affective.euthymia': 'יציב',
    'affective.euphoria': 'אופוריה / היי',
    'affective.irritability': 'עצבנות ורוגזנות',

    // ── Alert banner ───────────────────────────────────────────────────────
    'alert.stableTitle': 'המצב יציב',
    'alert.stableBody': 'המדדים בטווח הנורמלי. המשיכו במעקב יומי.',
    'alert.yellowKicker': 'התראה צהובה · חלון הזדמנויות פתוח',
    'alert.yellowBody':
      'שים לב: זוהתה ירידה משמעותית בשעות השינה ועלייה בקצב הפעילות. מומלץ ליצור קשר עם הרופא המטפל בקהילה להתאמת טיפול.',
    'alert.redKicker': 'התראה אדומה · הסלמה במדדים',
    'alert.redBody':
      'נראה שישנה הסלמה במדדים. אנא שקול מעבר למודול חירום או פנייה מיידית לעזרה מקצועית.',
    'alert.openEmergency': 'פתח את מודול החירום',
    'alert.reason.sleepActivity':
      '{{days}} ימים רצופים של שינה מתחת ל-{{hours}} שעות וקצב פעילות גבוה',
    'alert.reason.yellowCrossed':
      'התראה צהובה נמשכת {{days}} ימים — חציית סף לאדום',
    'alert.reason.impulsivityStreak':
      '{{days}} ימים רצופים של דיווח על אירוע אימפולסיבי חריג',
    'alert.reason.medsMissed':
      '{{days}} ימים רצופים שבהם המטופל לא נטל את התרופות',
    'alert.reason.medsMissedLowSleep':
      'במהלך הימים שלא ניטלו תרופות, השינה ירדה מתחת ל-{{hours}} שעות — סיכון מוגבר',
    'alert.howCalculated': 'איך חושבה ההתראה?',
    'alert.nonClinicalNote':
      'ההתראה היא היוריסטיקה שמבוססת על דפוסים שדווחו על־ידי משפחות (שינה קצרה מתמשכת, פעילות מואצת, חוסר היענות לטיפול). היא אינה הנחיה רפואית, לא קיבלה אישור קליני, ולא מתחשבת במצב הבסיס של המתמודד שלכם (למשל נדודי שינה כרוניים). השתמשו בה רק כתזכורת לבדוק את המצב ולעדכן את הצוות המטפל — לא כאבחון.',

    // ── Emergency ──────────────────────────────────────────────────────────
    'emergency.kicker': 'מצב חירום',
    'emergency.title': 'עץ קבלת החלטות',
    'emergency.reset': 'חזרה לתחילה',
    'emergency.breadcrumbAriaLabel': 'התקדמות בעץ החלטה',
    'emergency.stepCount': 'שלב {{current}} מתוך {{total}}',
    'emergency.crumb.violence': 'סכנה מיידית?',
    'emergency.crumb.evacuation': 'פינוי דחוף?',
    'emergency.crumb.police': 'מסלול: משטרה',
    'emergency.crumb.ambulance': 'מסלול: מד״א',
    'emergency.crumb.psych': 'מסלול: פסיכיאטר מחוזי',
    'emergency.calm':
      'נשמו עמוק. עץ ההחלטה יעזור לזהות את הגוף הנכון לפנייה. אין צורך למלא הכל — בחרו את התרחיש הקרוב למצב כעת.',
    'emergency.qViolence': 'האם יש כרגע סכנה מיידית, אלימות פעילה או נשק?',
    'emergency.qViolenceHelp':
      'אלימות פיזית, איומים בנשק, או סכנה לעצמכם או למתמודד עכשיו.',
    'emergency.recommendedRoute': 'המסלול המומלץ',
    'emergency.routePoliceTitle': 'משטרת ישראל',
    'emergency.routePoliceBody':
      'המשטרה מוסמכת להגיע במצבי אלימות. בקשו במפורש "נוהל אדם עם מוגבלות נפשית" — מנוע הסלמה.',
    'emergency.dial.emergency': 'חיוג מהיר — חירום',
    'emergency.dial.mda': 'מד״א — חירום רפואי',
    'emergency.scriptLabel': 'הקראה למוקדן',
    'emergency.beforeTeam': 'לפני הגעת הצוות',
    'emergency.policeStep1': 'הרחיקו ילדים וקרובים פגיעים מהאזור.',
    'emergency.policeStep2': 'אל תתעמתו עם המתמודד; צאו מהחדר אם צריך.',
    'emergency.policeStep3': 'ציינו במפורש: משבר פסיכיאטרי, לא פלילי.',
    'emergency.policeStep4': 'בקשו ליווי לאמבולנס לאחר ייצוב המצב.',
    'emergency.qEvacuation': 'האם נדרש פינוי דחוף למיון פסיכיאטרי?',
    'emergency.qEvacuationHelp':
      'מצב מסכן חיים שאינו אלים: אובדנות, ניתוק מהמציאות, סכנה רפואית.',
    'emergency.routeAmbulanceTitle': 'מד״א — פינוי רפואי',
    'emergency.routeAmbulanceBody':
      'בקשו פראמדיק או צוות התערבות במשבר לבריאות הנפש (פיילוט מד״א ת״א).',
    'emergency.ambulanceNoteTitle': 'חשוב לדעת',
    'emergency.ambulanceNoteBody':
      'פינוי שאינו מסתיים באשפוז גורר לעיתים חיוב כספי. אם הצוות מאשפז, הקופה מכסה את העלות.',
    'emergency.routePsychTitle': 'פסיכיאטר מחוזי',
    'emergency.routePsychBody':
      'כשהמתמודד פסיכוטי ומסרב טיפול אך אינו אלים — מסלול הוראת בדיקה כפויה (סעיף 6/7 לחוק).',
    'emergency.psychChecklistTitle': 'צ׳קליסט שלבי הפעולה',
    'emergency.psych.doctor.label':
      'השגת מכתב מרופא בקהילה (משפחה / פסיכיאטר מטפל / רופא משפחה).',
    'emergency.psych.doctor.hint':
      'מכתב הממליץ על בדיקה כפויה עקב סירוב המטופל להגיע למרפאה.',
    'emergency.psych.family.label': 'כתיבת מכתב משפחתי מפורט וכרונולוגי.',
    'emergency.psych.family.hint':
      'תיאור התנהגות פסיכוטית, אמירות אובדניות / איומים, חוסר שינה.',
    'emergency.psych.welfare.label': 'התקשרות למוקד הרווחה העירוני 106 לערב עו״ס.',
    'emergency.psych.welfare.hint':
      'עו״ס שמבקש את הצו מצמצם דחיות של "סכסוך משפחתי".',
    'emergency.psych.district.label':
      'איתור לשכת הפסיכיאטר המחוזי הרלוונטית ושיגור הבקשה.',
    'emergency.psych.district.hint':
      'תוקף הוראת בדיקה כפויה — 10 ימים. דרשו זירוז ביצוע.',
    'emergency.psych.verify.label': 'אימות קליטת הפנייה תוך שעה — שיחת טלפון ללשכה.',
    'emergency.psych.verify.hint': 'ללא אישור קליטה, הבקשה לא מטופלת.',
    'emergency.psychEscalate':
      'אם המצב מחמיר במהלך הטיפול — חזרו לתחילת עץ ההחלטה ובחרו במסלול 100 / 101.',
    'emergency.backToDashboard': '← חזרה למסך המעקב',

    // ── Golden record ──────────────────────────────────────────────────────
    'gr.kicker': 'תיק רפואי דיגיטלי',
    'gr.title': 'תיק למיון פסיכיאטרי',
    'gr.subtitle':
      'ה־Golden Record — מסמך אחד שמכיל את כל המידע הקריטי שצוות המיון צריך תוך דקות. ניתן להדפיס או להציג למוקדן.',
    'gr.mode.edit': 'מצב עריכה',
    'gr.mode.view': 'מצב תצוגה להדפסה',
    'gr.viewEmpty.title': 'אין עדיין תיק שמור',
    'gr.viewEmpty.body':
      'עברו ל"מצב עריכה" ומלאו את התיק כדי שתוכלו להציג אותו לצוות המיון.',
    'gr.printPdf': 'הדפס כ-PDF',
    'gr.cancelEdit': 'ביטול ושמירת הגרסה הקיימת',
    'gr.docHeader': 'תיק רפואי למיון',
    'gr.updated': 'עודכן: {{when}}',
    'gr.unnamedPatient': 'ללא שם',
    'gr.relationshipLine': 'הקשר למלא/ה: {{relationship}}',
    'gr.section.diagnosis': 'אבחנה בסיסית',
    'gr.section.comorbidities': 'מחלות רקע',
    'gr.section.medications': 'רשימת תרופות נוכחית',
    'gr.section.allergies': 'אלרגיות ותופעות לוואי חריגות בעבר',
    'gr.section.risk': 'גורמי סיכון (אובדנות / סמים)',
    'gr.section.contacts': 'אנשי קשר רפואיים בקהילה',
    'gr.noMeds': 'לא הוזנו תרופות.',
    'gr.empty': 'לא הוזן.',
    'gr.disclaimer':
      'מסמך זה הופק על ידי משפחת המטופל על מנת לספק רקע רפואי קריטי לצוות המיון ולשמור על רצף טיפולי, גם במקרים של התנגדות המטופל למסירת מידע.',
    'gr.form.identity.kicker': 'פרטי המתמודד',
    'gr.form.patientName.label': 'שם פרטי',
    'gr.form.patientName.hint':
      'השם שיופיע על מסמך המיון ובברכת הפתיחה במצפן. ניתן להזין רק שם פרטי כדי לשמור על פרטיות.',
    'gr.form.patientName.placeholder': 'למשל: דורון',
    'gr.form.relationship.label': 'הקשר אליכם',
    'gr.form.relationship.hint':
      'מי האדם עבורכם? עוזר למצפן ולעוזר ה־AI להתייחס בהקשר הנכון.',
    'gr.form.relationship.placeholder': 'למשל: בני, אחותי, בן/בת זוגי, אמא',
    'gr.form.region.label': 'אזור מגורים',
    'gr.form.region.hint':
      'הבחירה משמשת רק לניתוב אוטומטי לבית החולים הפסיכיאטרי הקרוב ולחלופות אשפוז באזורכם.',
    'gr.form.region.placeholder': 'בחרו אזור',
    'gr.form.city.label': 'עיר / יישוב',
    'gr.form.city.hint': 'עיר המגורים המדויקת — מופיעה גם בתיק למיון.',
    'gr.form.city.placeholder': 'למשל: רמת גן, באר שבע',
    'region.north': 'גליל וגולן',
    'region.haifa': 'חיפה והקריות',
    'region.sharon': 'השרון',
    'region.center': 'מרכז',
    'region.telaviv': 'תל אביב והסביבה',
    'region.jerusalem': 'ירושלים והסביבה',
    'region.shfela': 'שפלה',
    'region.south': 'דרום והנגב',
    'gr.form.diagnosis.label': 'אבחנה בסיסית',
    'gr.form.diagnosis.hint': 'לדוגמה: Bipolar 1 Disorder.',
    'gr.form.comorbidities.label': 'מחלות רקע',
    'gr.form.comorbidities.hint':
      'סוכרת, יתר לחץ דם, מחלות לב, השמנת יתר וכו׳ — קריטי לבחירת תרופות.',
    'gr.form.meds.label': 'רשימת תרופות נוכחית',
    'gr.form.meds.hint': 'שורה לכל תרופה: שם · מינון · תזמון.',
    'gr.form.allergies.label': 'אלרגיות ותופעות לוואי חריגות',
    'gr.form.allergies.hint':
      'תרופות שגרמו לרעד, נוקשות, טוקסיות — להימנע מהן במיון.',
    'gr.form.risk.label': 'גורמי סיכון (אובדנות / סמים / נשק)',
    'gr.form.risk.hint':
      'ניסיונות אובדנות בעבר, שימוש בחומרים, החזקת רישיון נשק.',
    'gr.form.contacts.label': 'אנשי קשר רפואיים בקהילה',
    'gr.form.contacts.hint':
      'פסיכיאטר מטפל, מסגרת שיקומית, רופא משפחה — שם וטלפון.',
    'gr.form.submit': 'שמירת התיק',
    'gr.form.saveError': 'השמירה נכשלה. אנא נסו שוב או רעננו את הדף.',
    'warningSigns.kicker': 'סימני אזהרה אישיים',
    'warningSigns.intro':
      '3–7 משפטים קצרים שאתם מזהים כסימן ההידרדרות הספציפי של בן/בת המשפחה שלכם. לדוגמה: "מפסיק/ה לענות לטלפון", "מתחיל/ה לקנות באינטרנט בלילה", "מדבר/ת מהר על רעיונות חדשים". במצב חירום נשתמש בהם להתראה לפני האלגוריתם הכללי.',
    'warningSigns.empty': 'עדיין לא הגדרתם סימני אזהרה אישיים.',
    'warningSigns.placeholder': 'למשל: מפסיק/ה לישון בלילה',
    'warningSigns.add': 'הוסיפו סימן',
    'warningSigns.remove': 'הסר',
    'warningSigns.maxHint': 'הגענו למקסימום — 7 סימנים. שווה למקד.',
    'dailyLog.warningSignsKicker': 'סימני האזהרה שלכם',
    'dailyLog.warningSignsHint': 'סמנו אילו מהסימנים זוהו היום. ריבוי ימי סימון יעלה את רמת ההתראה.',
    'alert.reason.personalSigns':
      '{{days}} ימים רצופים שבהם סומנו סימני אזהרה אישיים שהגדרתם',
    'alert.reason.personalSignsRed':
      '{{days}} ימים של סימני אזהרה אישיים — מצב מצריך התערבות',

    // AI extraction dropzone (Golden Record)
    'gr.extract.title': 'העלה סיכום אשפוז או ביקור רופא (PDF/תמונה) למילוי אוטומטי של התיק',
    'gr.extract.subtitle':
      'גררו לכאן קובץ או בחרו ידנית. הקובץ מעובד בזיכרון בלבד ואינו נשמר על השרת.',
    'gr.extract.choose': 'בחירת קובץ',
    'gr.extract.loading': 'פענוח מסמך רפואי בעזרת בינה מלאכותית…',
    'gr.extract.done': 'המסמך פוענח — בדקו ועדכנו את השדות לפני שמירה',
    'gr.extract.reviewHint': 'עברו על השדות הממולאים, תקנו במידת הצורך, ולחצו שמירה.',
    'gr.extract.another': 'העלאת מסמך נוסף',
    'gr.extract.failed': 'הפענוח נכשל. נסו שוב או מלאו ידנית.',
    'gr.extract.rejected': 'סוג קובץ לא נתמך או גדול מ־15MB.',

    // ── AI Assistant ───────────────────────────────────────────────────────
    'assistant.kicker': 'עוזר חכם',
    'assistant.title': 'מצפן AI',
    'assistant.pageSubtitle':
      'שאלו אותי על אשפוז כפוי, ביטוח לאומי, סל שיקום, או כל בלבול בירוקרטי אחר. אני לא רופא — אך אדע להפנות אתכם נכון.',
    'assistant.welcomeTitle': 'במה אפשר לעזור?',
    'assistant.welcomeSubtitle':
      'שאלות על בירוקרטיה, זכויות, אשפוז ומשבר — באופן רגוע וברור. בעת סכנה מיידית: 100 / 101.',
    'assistant.inputPlaceholder': 'כתבו שאלה… (Enter לשליחה, Shift+Enter לשורה חדשה)',
    'assistant.send': 'שליחה',
    'assistant.openLabel': 'פתח את מצפן AI',
    'assistant.close': 'סגירה',
    'assistant.disclaimer':
      'מצפן AI אינו תחליף לייעוץ רפואי או משפטי. בעת סכנה מיידית: חייגו 100 או 101.',
    'assistant.error': 'התקבלה שגיאה מהשירות. נסו שוב בעוד רגע.',
    'assistant.errorRetry': 'נסה שוב',
    'assistant.starter.involuntary': 'מה התהליך לאשפוז כפוי בישראל?',
    'assistant.starter.bituachLeumi': 'איך מגישים תביעה לביטוח לאומי?',
    'assistant.starter.refusesMeds': 'הוא מסרב לקחת תרופות, מה לעשות?',

    // ── Bureaucracy ────────────────────────────────────────────────────────
    'bur.kicker': 'מעקב ארוך טווח',
    'bur.title': 'זכויות ובירוקרטיה',
    'bur.subtitle':
      'המסלולים שלכם מול המוסדות, עם ציוני דרך וצ׳קליסטים — שמיעת קליק שומרת התקדמות.',
    'bur.progress': '{{done}} מתוך {{total}} שלבים',
    'bur.previewNote': 'מצב תצוגה: ההתקדמות נשמרת רק לאחר חיבור Supabase.',
    'bur.legal.proactive': 'פרואקטיבי',
    'bur.legal.epoa.title': 'ייפוי כוח מתמשך',
    'bur.legal.epoa.body':
      'נחתם כאשר המתמודד צלול וכשיר. הוא בוחר מראש מי יקבל החלטות עבורו ובאילו תחומים. ללא פיקוח שוטף ודוחות שגרתיים — שמירה על ריבונותו וכבודו.',
    'bur.legal.reactive': 'ריאקטיבי',
    'bur.legal.guard.title': 'אפוטרופסות',
    'bur.legal.guard.body':
      'הליך כפוי דרך בית משפט לאחר אובדן כשרות. נטילת עצמאות מהמתמודד, פיקוח של האפוטרופוס הכללי ודוחות תקופתיים. נדרש כשלא הוכן ייפוי כוח מראש.',
    'bur.ni.title': 'ביטוח לאומי — נכות כללית נפשית',
    'bur.ni.badge': 'טופס 7801',
    'bur.ni.intro':
      'תהליך 9–12 חודשים. ההצלחה תלויה במלאי מסמכים מלא לפני זימון הוועדה הרפואית.',
    'bur.ni.psych.label': 'חוות דעת פסיכיאטרית (נספח רפואי)',
    'bur.ni.psych.hint':
      'מפרט אבחנה לפי סעיף 33/34 ופגיעה תפקודית. חובה — חתום ע״י פסיכיאטר מומחה.',
    'bur.ni.discharge.label': 'סיכומי אשפוז ודוחות מיון',
    'bur.ni.discharge.hint': 'מוכיחים אירועי קצה ומשבריות לאורך השנים.',
    'bur.ni.waiver.label': 'טופס ויתור סודיות חתום',
    'bur.ni.waiver.hint': 'בלעדיו התביעה לא תיפתח.',
    'bur.ni.income.label': 'מסמכי הכנסה (15 חודשי תלושים / שומות מס)',
    'bur.ni.income.hint': 'הוכחת פגיעה בכושר השתכרות.',
    'bur.ni.comorbid.label': 'אישורים על ליקויים גופניים נוספים',
    'bur.ni.comorbid.hint':
      'מצטרפים לחישוב הנכות המשוקללת — קריטי לחציית סף 40%.',
    'bur.ni.submit.label': 'הגשת הבקשה באתר ביטוח לאומי',
    'bur.ni.submit.hint': 'ההגשה המקוונת מקצרת זמני קליטה.',
    'bur.rehab.title': 'סל שיקום — משרד הבריאות',
    'bur.rehab.badge': '40% נכות ומעלה',
    'bur.rehab.intro':
      'אדם שנקבעה לו נכות נפשית של 40%+ ובמעקב פסיכיאטרי סדיר זכאי לסל שיקום: דיור, תעסוקה, סומך, תמיכת משפחה.',
    'bur.rehab.note': 'ניתן להגשה רק לאחר קבלת 40% נכות ומעלה.',
    'bur.rehab.coord.label': 'פנייה לרכזת השיקום המחוזית',
    'bur.rehab.coord.hint': 'דרך עו״ס בקופה / בית חולים / מסגרת קהילתית.',
    'bur.rehab.form.label': 'מילוי טופס בקשה + ויתור סודיות',
    'bur.rehab.form.hint': 'בצירוף מכתב הזכאות מביטוח לאומי.',
    'bur.rehab.committee.label': 'הופעה בפני ועדת שיקום עם מלווה',
    'bur.rehab.committee.hint':
      'הביאו עמכם בן/בת משפחה לתיאור התפקוד היומיומי.',
    'bur.rehab.choice.label': 'בחירת מסגרת (דיור / תעסוקה / חונכות)',
    'bur.rehab.choice.hint': 'מומלץ לבקר בכל אופציה לפני ההחלטה.',
    'bur.legal.title': 'היערכות משפטית',
    'bur.legal.badge': 'תכנון מקדים',
    'bur.legal.intro':
      'הכלים המשפטיים שמגינים על המתמודד ועל המשפחה — קריטי להפעיל אותם בתקופות יציבות, לא במשבר.',
    'bur.legal.epoa-discussed.label': 'שיחה משפחתית על ייפוי כוח מתמשך',
    'bur.legal.epoa-discussed.hint':
      'תכנון מקדים בתקופת הפוגה — לפני שנדרשת התערבות.',
    'bur.legal.epoa-signed.label': 'הושלם ייפוי כוח מתמשך',
    'bur.legal.epoa-signed.hint':
      'נחתם מול עו״ד מורשה ונרשם אצל האפוטרופוס הכללי.',
    'bur.legal.lawyer.label': 'איש קשר משפטי לשעת חירום',
    'bur.legal.lawyer.hint':
      'עו״ד המכיר את חוק הטיפול בחולי נפש (תשנ״א-1991).',

    // Situation 1: first hospitalization
    'bur.situation.firstHosp.title': 'אשפוז ראשון',
    'bur.situation.firstHosp.badge': 'מה לעשות עכשיו',
    'bur.situation.firstHosp.intro':
      'אשפוז ראשון מטלטל. השלבים האלה שומרים לכם תיק מסודר ותומך לכל מה שיבוא אחרי.',
    'bur.firstHosp.familyLetter.label': 'התחלת כתיבת מכתב משפחתי כרונולוגי',
    'bur.firstHosp.familyLetter.hint':
      'תאריכים, התנהגות, אמירות, חוסר שינה — כל דיווח מאומת יחזק את התיק.',
    'bur.firstHosp.discharge.label': 'איסוף סיכומי אשפוז ודוחות מיון',
    'bur.firstHosp.discharge.hint':
      'בקשו עותקים בכתב — תזדקקו להם גם לטיפול עתידי וגם לטופס נכות.',
    'bur.firstHosp.waiver.label': 'חתימה על טופס ויתור סודיות',
    'bur.firstHosp.waiver.hint':
      'מאפשר לבני משפחה לתקשר עם הצוות המטפל ולקבל מידע.',
    'bur.firstHosp.psychiatrist.label': 'איתור פסיכיאטר מטפל בקהילה',
    'bur.firstHosp.psychiatrist.hint':
      'דרך הקופה או המסגרת הקהילתית — קביעת תור מיד לאחר השחרור.',

    // Situation 2: discharge & follow-up
    'bur.situation.discharge.title': 'שחרור מאשפוז',
    'bur.situation.discharge.badge': 'המשכיות טיפול',
    'bur.situation.discharge.intro':
      'הימים הראשונים אחרי שחרור הם החשובים ביותר. וודאו רצף תרופתי, ייעוץ וזכויות.',
    'bur.discharge.summary.label': 'קבלת מכתב שחרור בכתב',
    'bur.discharge.summary.hint':
      'בלעדיו לא ניתן יהיה לחדש תרופות ולקבוע מעקב.',
    'bur.discharge.followup.label': 'תיאום פגישת מעקב פסיכיאטרי תוך 14 יום',
    'bur.discharge.followup.hint':
      'הסיכון לאשפוז חוזר גבוה ביותר בשבועיים הראשונים.',
    'bur.discharge.meds.label': 'המשכיות תרופתית — מרשמים בקופה',
    'bur.discharge.meds.hint':
      'בקשו מרשם לחודש מלא לפני שתום המלאי הקיים.',
    'bur.discharge.rehab.label': 'בדיקת זכאות לסל שיקום (לאחר 40%+ נכות)',
    'bur.discharge.rehab.hint':
      'אם יש כבר אישור נכות — פנו לרכזת השיקום המחוזית.',
    'bur.discharge.work.label': 'הודעה למקום עבודה / מוסד לימודים',
    'bur.discharge.work.hint':
      'הסבר על תקופת התאוששות והגבלות זמניות, בליווי מכתב הרופא.',

    // Situation 3: deterioration
    'bur.situation.deterioration.title': 'החמרה במצב',
    'bur.situation.deterioration.badge': 'פעולה מיידית',
    'bur.situation.deterioration.intro':
      'כשהמדדים מסתמנים — אל תחכו. הצעדים האלה ממקמים אתכם בעמדה הכי טובה לעזרה מהירה.',
    'bur.deter.emergency.label': 'פתחו את מסך "מצב חירום" עכשיו',
    'bur.deter.emergency.hint':
      'עץ ההחלטה יזהה איזה מסלול נדרש: 100 / 101 / פסיכיאטר מחוזי.',
    'bur.deter.team.label': 'יצירת קשר עם הצוות המטפל בקהילה',
    'bur.deter.team.hint':
      'עדכון הפסיכיאטר המטפל לפני הסלמה לעיתים מונע אשפוז.',
    'bur.deter.golden.label': 'עדכון "תיק למיון" עם תרופות ומידע עדכני',
    'bur.deter.golden.hint':
      'אם תגיעו למיון — התיק חוסך זמן יקר לצוות.',
    'bur.deter.familyLetter.label': 'התחלת מכתב משפחתי עדכני',
    'bur.deter.familyLetter.hint':
      'תיעוד כרונולוגי של האירועים האחרונים, נחוץ לפסיכיאטר המחוזי.',

    // Situation 4: disability claim
    'bur.situation.disability.title': 'תג נכה וקצבת נכות',
    'bur.situation.disability.badge': 'ביטוח לאומי + סל שיקום',
    'bur.situation.disability.intro':
      'תהליך 9–12 חודשים. ההצלחה תלויה במלאי מסמכים מלא לפני זימון הוועדה הרפואית.',
    'bur.disability.psych.label': 'חוות דעת פסיכיאטרית (נספח רפואי)',
    'bur.disability.psych.hint':
      'מפרט אבחנה לפי סעיף 33/34 ופגיעה תפקודית. חובה — חתום ע״י פסיכיאטר מומחה.',
    'bur.disability.discharge.label': 'תיק סיכומי אשפוז ודוחות מיון',
    'bur.disability.discharge.hint':
      'מוכיחים אירועי קצה ומשבריות לאורך השנים.',
    'bur.disability.waiver.label': 'טופס ויתור סודיות חתום',
    'bur.disability.waiver.hint': 'בלעדיו התביעה לא תיפתח.',
    'bur.disability.income.label': 'מסמכי הכנסה (15 חודשי תלושים / שומות מס)',
    'bur.disability.income.hint': 'הוכחת פגיעה בכושר השתכרות.',
    'bur.disability.comorbid.label': 'אישורים על ליקויים גופניים נוספים',
    'bur.disability.comorbid.hint':
      'מצטרפים לחישוב הנכות המשוקללת — קריטי לחציית סף 40%.',
    'bur.disability.submit.label': 'הגשת הבקשה באתר ביטוח לאומי',
    'bur.disability.submit.hint': 'ההגשה המקוונת מקצרת זמני קליטה.',
    'bur.disability.rehabCoord.label': 'פנייה לרכזת השיקום המחוזית (לאחר אישור)',
    'bur.disability.rehabCoord.hint':
      'דרך עו״ס בקופה / בית חולים / מסגרת קהילתית.',
    'bur.disability.rehabForm.label': 'טופס בקשת סל שיקום + ויתור סודיות',
    'bur.disability.rehabForm.hint':
      'בצירוף מכתב הזכאות מביטוח לאומי.',
    'bur.disability.rehabCommittee.label': 'הופעה בפני ועדת שיקום עם מלווה',
    'bur.disability.rehabCommittee.hint':
      'הביאו עמכם בן/בת משפחה לתיאור התפקוד היומיומי.',
    'bur.disability.rehabChoice.label': 'בחירת מסגרת שיקום',
    'bur.disability.rehabChoice.hint':
      'דיור / תעסוקה / חונכות — מומלץ לבקר בכל אופציה לפני ההחלטה.',

    // Situation 5: advance planning
    'bur.situation.planning.title': 'היערכות מקדימה',
    'bur.situation.planning.badge': 'בתקופת יציבות',
    'bur.situation.planning.intro':
      'הכלים המשפטיים שמגינים על המתמודד ועל המשפחה — מפעילים אותם בתקופות יציבות, לא במשבר.',
    'bur.planning.epoaTalk.label': 'שיחה משפחתית על ייפוי כוח מתמשך',
    'bur.planning.epoaTalk.hint':
      'תכנון מקדים בתקופת הפוגה — לפני שנדרשת התערבות.',
    'bur.planning.epoaSigned.label': 'הושלם ייפוי כוח מתמשך',
    'bur.planning.epoaSigned.hint':
      'נחתם מול עו״ד מורשה ונרשם אצל האפוטרופוס הכללי.',
    'bur.planning.lawyer.label': 'איש קשר משפטי לשעת חירום',
    'bur.planning.lawyer.hint':
      'עו״ד המכיר את חוק הטיפול בחולי נפש (תשנ״א-1991).',

    // ── Legal & Financial Shield ──────────────────────────────────────────
    'legal.kicker': 'מגן משפטי ופיננסי',
    'legal.title': 'הגנה משפטית במצב משבר',
    'legal.intro':
      'במצבי משבר נדרשת לעיתים פעולה משפטית דחופה כדי למנוע נזק בלתי הפיך — מינוי אפוטרופוס, חסימת אשראי, או עיכוב יציאה מהארץ. כאן תוכלו להכין מסמכי בקשה לבית המשפט ולמצוא עורך/ת דין מתאים/ה לליווי. אין מדובר בייעוץ משפטי.',
    'legal.disclaimer':
      'תבניות אלה הן עזר ולא תחליף לייעוץ משפטי. כל בקשה כפופה לבדיקת עו"ד המתמחה בתחום, ולהוראות בית המשפט באזורכם. הגישו את המסמך רק לאחר שעו"ד אישר/ה את תוכנו.',

    'legal.actions.title': 'פעולות זמינות',
    'legal.actions.cta': 'מילוי בקשה',

    'legal.template.guardianship_property.kicker': 'אפוטרופסות',
    'legal.template.guardianship.summary':
      'בקשה דחופה למינוי אפוטרופוס/ה זמני/ת לרכוש למקרה שבו המתמודד/ת אינו/ה מסוגל/ת לנהל את ענייניו/ה הכלכליים והפעולות שלו/ה גורמות נזק מתמשך.',
    'legal.template.block_finance.kicker': 'חסימת אשראי',
    'legal.template.blockFinance.summary':
      'צו זמני לבנק ולחברות האשראי שמטרתו להגביל משיכות והקפאת מסגרות אשראי עד התייצבות.',
    'legal.template.exit_ban.kicker': 'עיכוב יציאה',
    'legal.template.exitBan.summary':
      'בקשה לעיכוב יציאה מהארץ כאשר יש חשש ממשי שהמתמודד/ת יעזוב/תעזוב את הארץ במצב לא יציב.',

    'legal.form.kicker': 'הכנת בקשה דחופה',
    'legal.form.preview': 'הצגת תצוגת הדפסה',
    'legal.form.patientSection': 'פרטי המתמודד/ת',
    'legal.form.patientName': 'שם מלא',
    'legal.form.patientId': 'תעודת זהות',
    'legal.form.patientAddress': 'כתובת מגורים',
    'legal.form.applicantSection': 'פרטי המבקש/ת',
    'legal.form.applicantName': 'שם מלא',
    'legal.form.applicantId': 'תעודת זהות',
    'legal.form.applicantRelation': 'קרבה למתמודד/ת',
    'legal.form.applicantRelationPlaceholder': 'למשל: אם, אח, בן זוג',
    'legal.form.applicantPhone': 'טלפון נייד',
    'legal.form.applicantAddress': 'כתובת',
    'legal.form.incidentSection': 'תיאור האירוע',
    'legal.form.incidentDate': 'תאריך האירוע / תחילת ההידרדרות',
    'legal.form.incidentSummary': 'תיאור עובדתי קצר',
    'legal.form.incidentSummaryHint':
      'מה קרה, ממתי, מי היה נוכח. עובדות ולא רגשות — בית המשפט קורא עובדות.',
    'legal.form.riskDescription': 'הסיכון הקונקרטי כעת',
    'legal.form.riskDescriptionHint':
      'איזה נזק מתמשך נגרם או צפוי להיגרם אם לא תינתן החלטה דחופה (כספי, פיזי, יציאה מהארץ).',
    'legal.form.evidence': 'ראיות שיוגשו',
    'legal.form.evidenceHint':
      'רשימת מסמכים מצורפים (סיכומים רפואיים, צילומי תנועות בנק, תכתובות).',
    'legal.form.requestedRelief': 'הסעדים המבוקשים (אופציונלי — אם תשאירו ריק יוצג נוסח ברירת מחדל)',
    'legal.form.requestedReliefHint':
      'אפשר להתאים את הצווים הזמניים המבוקשים לנסיבות הספציפיות שלכם.',

    'legal.printable.print': 'הדפסה / שמירה כ-PDF',
    'legal.printable.dateLabel': 'תאריך',
    'legal.printable.signatureLabel': 'בכבוד רב,',
    'legal.printable.idLabel': 'ת"ז',
    'legal.printable.signatureLine': 'חתימה: ____________________',
    'legal.printable.disclaimer':
      'מסמך זה הוא טיוטה שהוכנה על־ידי המבקש/ת באמצעות מצפן. הוא אינו מהווה ייעוץ משפטי. מומלץ להעבירו לעיון עו"ד לפני הגשה לבית המשפט.',

    'legal.lawyers.title': 'עורכי/ות דין מומחים לבריאות הנפש',
    'legal.lawyers.filters': 'סינון',
    'legal.lawyers.region': 'אזור',
    'legal.lawyers.allRegions': 'כל הארץ',
    'legal.lawyers.specialty': 'תחום',
    'legal.lawyers.allSpecialties': 'כל התחומים',
    'legal.lawyers.proBonoOnly': 'רק ייצוג ללא תשלום',
    'legal.lawyers.proBonoTag': 'ללא תשלום',
    'legal.lawyers.feeUnit': 'ייעוץ ראשוני',
    'legal.lawyers.website': 'אתר',
    'legal.lawyers.empty': 'אין תוצאות לסינון. נסו להרחיב את החיפוש.',
    'legal.lawyers.disclaimer':
      'המידע מובא לעזרה בלבד. אין למצפן זיקה לעורכי/ות הדין ברשימה ואין כאן המלצה אישית. ודאו תעריפים וסמכות במשרד הרלוונטי לפני התקשרות.',
    'legal.lawyers.sampleBadge': 'נתוני דוגמה',
    'legal.lawyers.sampleBannerKicker': 'אזהרה: רשימה זו אינה אמיתית',
    'legal.lawyers.sampleBannerBody':
      'הערכים בלוח עורכי הדין הם נתוני דמו בלבד. מספרי הטלפון אינם פעילים. אל תחייגו אליהם במצב חירום. רשימה עם עורכי דין אמיתיים תתווסף בהמשך — בינתיים פנו דרך לשכת עורכי הדין, אנוש, או עוצמה.',
    'legal.lawyers.specialty.guardianship': 'אפוטרופסות',
    'legal.lawyers.specialty.involuntary': 'אשפוז כפוי וועדות פסיכיאטריות',
    'legal.lawyers.specialty.criminal_mental_health': 'פלילי בריאות הנפש',
    'legal.lawyers.specialty.national_insurance': 'ביטוח לאומי',
    'legal.lawyers.specialty.rehab_basket': 'סל שיקום',
    'legal.lawyers.specialty.financial_protection': 'הגנה פיננסית',

    // ── Hospitalization & alternative care ────────────────────────────────
    'hosp.kicker': 'אשפוז וחלופות',
    'hosp.title': 'איפה לפנות עכשיו',
    'hosp.intro':
      'במצב משבר, ברגע שמחליטים שיש צורך באשפוז או בהתערבות אינטנסיבית, הזמן והמרחק קריטיים. הרשימה הזו מציגה את בתי החולים הפסיכיאטריים הקרובים לאזור המגורים, ולצידם חלופות אשפוז ואשפוזי יום.',
    'hosp.disclaimer':
      'הפרטים נאספו ממקורות פומביים והם עשויים להשתנות. ודאו את מספר הטלפון באתר בית החולים לפני התקשרות במצב חירום. במקרה של סכנת חיים מיידית — חיוג 101 (מד״א) או 100 (משטרה) עדיף תמיד על הגעה עצמית.',

    'hosp.regionPicker': 'אזור המגורים',
    'hosp.regionHint': 'לא מצאנו אזור שמור בתיק הרפואי.',
    'hosp.regionHintCta': 'הוסיפו אזור בתיק הרפואי',
    'hosp.clearRegion': 'נקה',

    'hosp.tab.hospitals': 'בתי חולים פסיכיאטריים',
    'hosp.tab.alternative': 'חלופות אשפוז ואשפוז יום',

    'hosp.nearbyHeading': 'באזורכם וקרוב',
    'hosp.otherHeading': 'אזורים נוספים',
    'hosp.allHeading': 'כל בתי החולים הפסיכיאטריים',

    'hosp.callSwitchboard': 'מרכזיה',
    'hosp.callER': 'חדר מיון',
    'hosp.openWaze': 'פתח ב-Waze',
    'hosp.openMaps': 'פתח ב-Google Maps',
    'hosp.website': 'אתר בית החולים',

    'hosp.tag.psychER': 'חדר מיון פסיכיאטרי 24/7',
    'hosp.tag.noPsychER': 'אין מיון פסיכיאטרי — קבלה בתיאום',
    'hosp.tag.minors': 'מקבל נוער',
    'hosp.tag.commitment': 'מוסמך לאשפוז כפוי',
    'hosp.tag.unverified': 'לא אומת',
    'hosp.unverifiedNotice':
      'הפרטים לא אומתו מול אתר בית החולים לאחרונה. ודאו את מספר הטלפון לפני התקשרות במצב חירום — מספרים עשויים להתעדכן.',

    'hosp.altFilter.all': 'הכל',
    'hosp.altFilter.balancing': 'בתים מאזנים',
    'hosp.altFilter.day': 'אשפוז יום',
    'hosp.altEmpty': 'לא נמצאו חלופות לסינון הזה.',

    'hosp.altAI.title': 'לבדוק עכשיו עם העוזר',
    'hosp.altAI.body':
      'העוזר יכול לעזור לבדוק זמינות, התאמה לקופת החולים שלכם, וקריטריוני קבלה לפני שמתקשרים.',
    'hosp.altAI.cta': 'חפש עבורי בתים מאזנים שמתאימים',
    'hosp.altAIPromptRegion':
      'אני מחפש/ת בית מאזן או אשפוז יום פסיכיאטרי באזור {{region}} שמתאים לקופת החולים שלנו. אילו אפשרויות פנויות כיום ולמי כדאי לפנות קודם?',
    'hosp.altAIPromptGeneric':
      'אני מחפש/ת בית מאזן או אשפוז יום פסיכיאטרי שמתאים לקופת החולים שלנו. אילו אפשרויות פנויות כיום ולמי כדאי לפנות קודם?',

    'altCare.kind.balancing_home': 'בית מאזן',
    'altCare.kind.day_hospital': 'אשפוז יום',
    'altCare.capacity': 'עד {{n}} מקומות',
    'altCare.dailyCost': 'עלות יומית משוערת',
    'altCare.notAccepted': 'לא מתאים ל:',
    'altCare.funding.kupat_holim': 'בכיסוי קופת חולים',
    'altCare.funding.rehab_basket': 'במסגרת סל שיקום',
    'altCare.funding.private': 'פרטי',
    'altCare.funding.subsidized': 'בסבסוד / סקאלה',

    // ── Case studies ──────────────────────────────────────────────────────
    'cases.kicker': 'מקרי בוחן',
    'cases.title': 'איך משפחות אחרות התמודדו',
    'cases.intro':
      'תרחישים אנונימיים שמשפחות אחרות חוו — מה הצליח, מה הן היו עושות אחרת. השתמשו בזה כמקור השראה, לא כתוכנית טיפול. כל מקרה ייחודי.',
    'cases.disclaimer':
      'הסיפורים הם תרכיב חינוכי המבוסס על דיווחי משפחות וספרות פתוחה. הם לא תחליף לייעוץ פסיכיאטרי או משפטי, והצעדים שהובילו להצלחה אצל משפחה אחת לא בהכרח יעבדו אצל אחרת.',
    'cases.filters': 'סינון',
    'cases.diagnosis': 'אבחנה',
    'cases.age': 'גיל',
    'cases.trigger': 'טריגר',
    'cases.allDiagnoses': 'כל האבחנות',
    'cases.allAges': 'כל הגילאים',
    'cases.allTriggers': 'כל הטריגרים',
    'cases.count': '{{n}} מקרים מתאימים',
    'cases.empty': 'לא נמצאו מקרים לסינון. נסו להרחיב.',
    'cases.clearFilters': 'איפוס סינון',
    'cases.situation': 'המצב',
    'cases.action': 'מה נעשה',
    'cases.takeaway': 'הלקח למשפחה',
    'cases.durationLabel': 'משך הטיפול',
    'cases.diagnosis.bipolar_mania': 'מאניה (Bipolar 1)',
    'cases.diagnosis.bipolar_depression': 'דיכאון ביפולרי',
    'cases.diagnosis.psychotic_break': 'התקף פסיכוטי',
    'cases.diagnosis.postpartum_psychosis': 'פסיכוזה פוסט-פרטום',
    'cases.diagnosis.major_depression': 'דיכאון מאז\'ורי',
    'cases.diagnosis.suicidality_crisis': 'משבר אובדנות',
    'cases.diagnosis.eating_disorder': 'הפרעת אכילה',
    'cases.age.adolescent': 'נוער (13–17)',
    'cases.age.young_adult': 'צעיר (18–29)',
    'cases.age.adult': 'בוגר (30–55)',
    'cases.age.older_adult': 'מבוגר (55+)',
    'cases.trigger.med_noncompliance': 'הפסקת תרופות',
    'cases.trigger.sleep_disruption': 'הפרעת שינה',
    'cases.trigger.substance_use': 'שימוש בחומרים',
    'cases.trigger.major_life_event': 'אירוע חיים משמעותי',
    'cases.trigger.postpartum': 'לאחר לידה',
    'cases.trigger.unknown': 'לא ידוע',

    // ── Trend chart ────────────────────────────────────────────────────────
    'trend.kicker': 'מגמת השבועיים האחרונים',
    'trend.title': 'שינה, מצב רגשי ותרופות · {{days}} ימים',
    'trend.empty': 'אין מספיק דיווחים יומיים כדי להציג מגמה. דווחו לכמה ימים והגרף יופיע כאן.',
    'trend.legend.sleep': 'שינה',
    'trend.legend.missed': 'תרופות שדולגו',
    'trend.today': 'היום',

    // ── Refill banner ──────────────────────────────────────────────────────
    'refill.kicker': 'תזכורת תרופות',
    'refill.overdue': 'מועד החידוש היה ב־{{date}} ({{n}} ימים אחורה). הפסקת תרופות אצור היא טריגר ידוע — צרו קשר עם הרוקח/ת או הפסיכיאטר/ית כעת.',
    'refill.dueToday': 'מועד חידוש המרשם הוא היום ({{date}}).',
    'refill.upcoming': 'מועד חידוש המרשם הוא ב־{{date}} (בעוד {{n}} ימים).',
    'refill.updateCta': 'עדכון מועד',

    // ── Post-discharge timeline ────────────────────────────────────────────
    'postDischarge.kicker': '30 הימים שאחרי',
    'postDischarge.title': 'מסלול שיקום ראשוני',
    'postDischarge.intro':
      'החודש הראשון אחרי אשפוז הוא תקופת הסיכון הגבוהה ביותר לאשפוז חוזר. הצ׳קליסט מסודר לפי שלבים — סמנו את מה שכבר נעשה.',
    'postDischarge.bannerBody': 'יום {{day}} אחרי השחרור — בדקו את המשימות לתקופה הזאת.',
    'postDischarge.bannerCta': 'פתח מסלול',
    'postDischarge.dischargeOn': 'תאריך שחרור: {{date}}',
    'postDischarge.dayLabel': 'יום {{day}}',
    'postDischarge.progress': '{{done}} מתוך {{total}} הושלמו',
    'postDischarge.currentPhase': 'שלב נוכחי',
    'postDischarge.pastPhase': 'הסתיים',
    'postDischarge.disclaimer':
      'הצ׳קליסט אינו תחליף להוראות שחרור רפואיות. תמיד הולכים לפי ההמלצות של הצוות המטפל. הוא נועד לעזור לזכור מה לשאול ולמתי לתאם.',
    'postDischarge.noDate.title': 'אין תאריך שחרור שמור',
    'postDischarge.noDate.body':
      'הוסיפו את תאריך השחרור בתיק הרפואי כדי לקבל מסלול מותאם לימים שעברו מאז.',
    'postDischarge.noDate.cta': 'עדכון בתיק הרפואי',
    'postDischarge.phase.day0.title': 'יום 0–2',
    'postDischarge.phase.day0.intent': 'יציאה בטוחה הביתה',
    'postDischarge.phase.day3.title': 'יום 3–6',
    'postDischarge.phase.day3.intent': 'בניית שגרה',
    'postDischarge.phase.day7.title': 'יום 7–13',
    'postDischarge.phase.day7.intent': 'מעקב ראשון בקהילה',
    'postDischarge.phase.day14.title': 'יום 14–20',
    'postDischarge.phase.day14.intent': 'חידוש מרשמים וביקור שני',
    'postDischarge.phase.day21.title': 'יום 21–29',
    'postDischarge.phase.day21.intent': 'חזרה הדרגתית לתפקוד',
    'postDischarge.phase.day30.title': 'יום 30+',
    'postDischarge.phase.day30.intent': 'סיכום ראשון ותכנון המשך',
    'postDischarge.item.dischargeSummary': 'איסוף סיכום שחרור (מודפס + דיגיטלי).',
    'postDischarge.item.meds7day': 'ודאו אספקת תרופות ל־7 ימים הראשונים.',
    'postDischarge.item.bookNextAppt': 'תיאום ביקור מעקב ראשון (פסיכיאטר/ית בקהילה) תוך 7 ימים.',
    'postDischarge.item.homeSafety': 'מעבר על הבית — הוצאת אמצעים מסכנים.',
    'postDischarge.item.homeSafetyHint': 'תרופות במנעול, אקדח/סכין מחוץ לבית, אלכוהול בכמות מוגבלת.',
    'postDischarge.item.followUpConfirmed': 'אישור הביקור אצל הפסיכיאטר/ית בטלפון.',
    'postDischarge.item.familyRoutine': 'הקצאת תפקידים במשפחה (מי נוסע לביקור, מי דואג לתרופות).',
    'postDischarge.item.sleepLogged': 'הדיווח היומי במצפן רץ במשך 3 ימים רצופים.',
    'postDischarge.item.firstOutpatient': 'הביקור הראשון בקהילה התקיים.',
    'postDischarge.item.escalationScript': 'אם הביקור לא התקיים — הפעלת תסריט ההסלמה.',
    'postDischarge.item.escalationScriptHint':
      'תקשרו לפסיכיאטר המחוזי, וציינו: "שוחרר ביום X ולא נקבע מעקב". הוא יסייע לתאם תור דחוף.',
    'postDischarge.item.sideEffects': 'תיעוד תופעות לוואי מהתרופות החדשות.',
    'postDischarge.item.refillScheduled': 'תאריך חידוש המרשם הבא נקבע ועודכן במצפן.',
    'postDischarge.item.secondVisit': 'תיאום ביקור מעקב שני (יום 21–30).',
    'postDischarge.item.communityReengage': 'חזרה הדרגתית למוקדי תמיכה (קבוצה, מועדון).',
    'postDischarge.item.sickLeave': 'הגשת אישורי מחלה למקום העבודה / לימודים.',
    'postDischarge.item.insuranceClaim': 'פתיחת תיק בביטוח לאומי אם רלוונטי (טופס 7801).',
    'postDischarge.item.returnPlan': 'תכנון חזרה הדרגתית לעבודה / לימודים עם הצוות המטפל.',
    'postDischarge.item.threeMonthReview': 'תיאום ביקור סיכום ב־3 חודשים.',
    'postDischarge.item.familyDebrief': 'שיחת משפחה: מה עבד, מה היינו עושים אחרת.',
    'postDischarge.item.warningSignsUpdated': 'עדכון סימני האזהרה האישיים בתיק.',

    // ── Safety / lethal means ──────────────────────────────────────────────
    'safety.kicker': 'בטיחות בבית',
    'safety.title': 'הגבלת גישה לאמצעים מסכנים',
    'safety.intro':
      'במצבי משבר, צמצום הגישה לאמצעים שעלולים לשמש לפגיעה עצמית הוא הצעד המוכח ביותר במניעת אובדנות. השיחה לא קלה — וזה בסדר. הדף הזה מסביר מה לעשות, ואיך לדבר על זה בלי להפיל את האמון.',
    'safety.why.title': 'למה זה עובד',
    'safety.why.body':
      'מחקרים עקביים מראים שצמצום נגישות לאמצעים קטלניים מוריד תמותה — גם בלי טיפול נוסף. מצבי אובדנות לרוב חולפים תוך שעות; אם האמצעי לא בהישג יד באותו רגע, רוב האנשים שורדים.',
    'safety.scriptLabel': 'מה אפשר לומר',
    'safety.item.meds': 'תרופות',
    'safety.item.medsBody':
      'אחסנו את כל התרופות (כולל משככי כאבים, שינה, ואנטי־דיכאון) בארון נעול. רק מבוגר אחד מחזיק את המפתח. הוציאו תרופות ישנות / לא בשימוש מהבית.',
    'safety.item.medsScript':
      'אני שם את התרופות בארון נעול לחודש הקרוב — לא כי אני לא סומך/ת, אלא כי בזמן משבר זה כלל יסוד. אעזור לך לקחת אותן בכל בוקר.',
    'safety.item.firearms': 'נשק חם',
    'safety.item.firearmsBody':
      'אם יש נשק בבית — הוציאו אותו לאחסון אצל קרוב/ה, שכן/ה אחראי/ת, או בתחנת המשטרה. בעלי רישיון יכולים לבקש "החזקה זמנית" אצל ספק רישיונות. אם הוצאה אינה אפשרית מיידית — נעלו במנעול שונה מהתחמושת.',
    'safety.item.firearmsScript':
      'הנשק שלך יישאר אצל [שם] לכמה שבועות. ברגע שתחזור/י לעצמך נחזיר אותו. אני רוצה שתישאר/י בטוח/ה.',
    'safety.item.sharps': 'סכינים וחפצים חדים',
    'safety.item.sharpsBody':
      'במצב אובדנות חריף — הוציאו סכינים גדולים, סכיני גילוח, וחבלים ארוכים מתחום הגישה. לא חייבים לעשות "בית סטרילי" — רק להעביר את החפצים הספציפיים שצוינו על־ידי הצוות המטפל.',
    'safety.item.car': 'רכב ומפתחות',
    'safety.item.carBody':
      'אם המתמודד/ת נוהג/ת בזמן אפיזודה לא יציבה — שמרו את המפתחות בארון נעול או החזיקו אותם איתכם. נסיעה מסוכנת היא טריגר לאירועים פיזיים.',
    'safety.item.disposal': 'השלכת תרופות עודפות',
    'safety.item.disposalBody':
      'בתי המרקחת בקופות החולים מקבלים תרופות לא בשימוש להשמדה. אל תזרקו לזבל ביתי או לאסלה. הוצאת תרופות מיותרות מהבית מורידה סיכון במידה משמעותית.',
    'safety.crisis.title': 'אם הסיכון נראה מיידי',
    'safety.crisis.body':
      'אם המתמודד/ת אמר/ה משהו על פגיעה עצמית, אובדנות, או אם מצאתם תיק עם תרופות / סכין מוסתרים — אל תחכו. חייגו 101.',
    'safety.crisis.callMDA': 'חייגו 101 (מד״א)',
    'safety.crisis.callEran': 'חייגו 1201 (ער״ן)',
    'safety.crisis.openEmergency': 'פתח מצב חירום',
    'safety.disclaimer':
      'הדף הזה מבוסס על המלצות פתוחות בתחום מניעת אובדנות (Means Matter, משרד הבריאות). הוא אינו ייעוץ קליני. אם יש סיכון מיידי — חיוג 101 קודם לכל.',

    // ── "Who is my person when well" ───────────────────────────────────────
    'whenWell.kicker': 'מי זה המתמודד/ת כשהוא/היא בריא/ה',
    'whenWell.heading': 'מי הוא/היא כשהוא/היא בריא/ה',
    'whenWell.intro':
      'מסמך קצר שעוזר לצוות במיון או לפסיכיאטר/ית חדש/ה לראות אדם, לא רק תיק. ממלאים פעם אחת, מדפיסים, נוטלים איתכם.',
    'whenWell.loves.label': 'מה הוא/היא אוהב/ת',
    'whenWell.loves.hint': 'מוזיקה, אוכל, אנשים, מקומות — דברים שמרגיעים ומחברים.',
    'whenWell.loves.placeholder': 'לדוגמה: ארץ נהדרת, כלבים, פלאפל, סבתא',
    'whenWell.calms.label': 'מה מרגיע',
    'whenWell.calms.hint': 'דברים שעוזרים במצב מתח — מוזיקה, שתיקה, להחזיק יד.',
    'whenWell.calms.placeholder': 'לדוגמה: לשמוע מוזיקה שקטה, לצאת לאוויר, חיבוק',
    'whenWell.neverSay.label': 'מה לעולם לא להגיד',
    'whenWell.neverSay.hint': 'משפטים או נושאים שמסלימים מצב — חשוב לצוות המיון לדעת.',
    'whenWell.neverSay.placeholder': 'לדוגמה: "תירגע!", "אתה מגזים", להזכיר את האקס',

    // ── Golden record: dates + refill section ──────────────────────────────
    'gr.form.dates.kicker': 'תאריכים קליניים (אופציונלי)',
    'gr.form.dischargeDate.label': 'תאריך שחרור אחרון',
    'gr.form.dischargeDate.hint': 'משמש לתכנון מסלול 30 הימים שאחרי האשפוז.',
    'gr.form.nextRefillDate.label': 'תאריך חידוש מרשם הבא',
    'gr.form.nextRefillDate.hint': 'תזכורת תופיע בלוח הראשי 3 ימים לפני.',

    // ── Share manager + share viewer ───────────────────────────────────────
    'share.title': 'שיתוף עם צוות מטפל',
    'share.kicker': 'קישור שיתוף זמני',
    'share.intro':
      'יצירת קישור לקריאה־בלבד של הרשומה הרפואית. שלחו אותו לפסיכיאטר/ית או הראו במיון. הקישור פג אוטומטית במועד שתבחרו, וניתן לבטל ידנית בכל עת.',
    'share.ttlLabel': 'תוקף',
    'share.ttl.24h': '24 שעות',
    'share.ttl.7d': '7 ימים',
    'share.ttl.30d': '30 ימים',
    'share.createCta': 'צור קישור',
    'share.copy': 'העתקה',
    'share.copied': 'הועתק ✓',
    'share.revoke': 'ביטול',
    'share.expiresAt': 'פג ב־{{when}}',
    'share.disclaimer':
      'מי שיש לו את הקישור יכול לקרוא את הרשומה. שלחו רק לכתובות אמינות (פסיכיאטר/ית, חדר מיון) ובטלו את הקישור כשלא צריך יותר.',
    'share.notConfigured': 'אי אפשר ליצור קישור — Supabase אינו מוגדר.',
    'share.viewer.kicker': 'רשומה רפואית — לעיון',
    'share.viewer.unnamed': 'מתמודד/ת',
    'share.viewer.relationship': 'מטפל/ת ראשי/ת: {{rel}}',
    'share.viewer.updated': 'עודכן: {{when}}',
    'share.viewer.dischargeDate': 'תאריך שחרור אחרון',
    'share.viewer.empty': '—',
    'share.viewer.loading': 'טוען רשומה…',
    'share.viewer.expiredTitle': 'הקישור אינו תקף',
    'share.viewer.expiredBody':
      'הקישור פג, בוטל, או אינו קיים. בקשו מהמשפחה ליצור קישור חדש.',
    'share.viewer.errorTitle': 'שגיאה בטעינת הרשומה',
    'share.viewer.notConfigured': 'השירות אינו מוגדר.',
    'share.viewer.disclaimer':
      'הרשומה מוצגת לעיון בלבד. אינה תחליף לתיק רפואי מלא ואינה מתועדכת בזמן אמת.',

    // ── War Room ───────────────────────────────────────────────────────────
    'warRoom.kicker': 'חדר מבצעים',
    'warRoom.title': 'ניהול משבר משותף',
    'warRoom.intro':
      'מקום אחד שבו כל המעטפת רואה את אותו דבר: מי במשמרת, מה צריך לעשות, ומי זקוק לחילוץ עכשיו. עדכונים מסונכרנים בזמן אמת.',
    'warRoom.disclaimer':
      'חדר המבצעים נועד לתיאום משפחתי, לא להחלפת הצוות הרפואי. במצב חירום מיידי חיוג 100/101 קודם לכל.',
    'warRoom.notConfigured': 'חדר המבצעים זמין רק לאחר חיבור ל־Supabase.',
    'warRoom.tab.shifts': 'משמרות',
    'warRoom.tab.tasks': 'משימות',
    'warRoom.tab.envelope': 'המעטפת',

    'warRoom.shifts.heading': 'לוח משמרות השגחה',
    'warRoom.shifts.startAt': 'תחילת המשמרת',
    'warRoom.shifts.endAt': 'סוף המשמרת',
    'warRoom.shifts.note': 'הערה למשמרת (אופציונלי)',
    'warRoom.shifts.notePlaceholder': 'למשל: לוקח לטיפול בשעה 17:00',
    'warRoom.shifts.signUp': 'הרשמה למשמרת',
    'warRoom.shifts.empty': 'אף משמרת לא נרשמה עדיין. מי לוקח את הראשונה?',
    'warRoom.shifts.activeNow': 'במשמרת כעת',
    'warRoom.shifts.unnamedMember': 'בן משפחה',
    'warRoom.shifts.errorBadDate': 'תאריך לא תקין.',
    'warRoom.shifts.errorEndBeforeStart': 'סוף המשמרת חייב להיות אחרי תחילתה.',

    'warRoom.tasks.heading': 'משימות המעטפת',
    'warRoom.tasks.placeholder': 'משימה חדשה (למשל: לקנות תרופות)',
    'warRoom.tasks.add': 'הוסף',
    'warRoom.tasks.empty': 'אין משימות פתוחות. הוסיפו את הראשונה.',
    'warRoom.tasks.completed': 'משימות שהושלמו ({{n}})',
    'warRoom.tasks.doneBy': 'הושלם · {{name}} · {{when}}',
    'warRoom.tasks.createdBy': 'נוסף · {{name}}',
    'warRoom.tasks.remove': 'הסר',

    'warRoom.backup.heading': 'בקשת חילוץ',
    'warRoom.backup.sosCta': '⚡ צריך/ה חילוץ — קרא/י לעזרה',
    'warRoom.backup.activeBanner': 'בקשת חילוץ פעילה',
    'warRoom.backup.requestedBy': '{{name}} מבקש/ת חילוץ',
    'warRoom.backup.yoursWaiting': 'הבקשה שלך פעילה — בני המשפחה רואים אותה',
    'warRoom.backup.confirmIntro':
      'הבקשה תופיע מיד אצל כל מי שמחובר עכשיו לחדר המבצעים. השתמשו רק כשבאמת צריך — שמירת אמינות הסימן חשובה.',
    'warRoom.backup.messageLabel': 'הודעה (אופציונלי)',
    'warRoom.backup.messagePlaceholder': 'למשל: צריך מישהו בבית עוד שעה',
    'warRoom.backup.send': 'שלח/י בקשה',
    'warRoom.backup.resolve': 'טופל',
    'warRoom.backup.disclaimer':
      'הבקשה גלויה רק לבני המעטפת. היא לא מתחלפת לשירות חירום — להוזעה דחופה חייגו 101/100.',
    'push.sos.title': '⚡ בקשת חילוץ במצפן',
    'push.sos.fallbackBody': 'בני משפחה זקוקים לעזרה כרגע. פתח את חדר המבצעים.',
    'push.optIn.body':
      'הפעלת התראות דחיפה תאפשר לכם לקבל סימן גם כשהאפליקציה סגורה. מומלץ למי שאחראי/ת על המעטפת.',
    'push.optIn.cta': 'הפעלת התראות',
    'push.optIn.denied':
      'התראות חסומות לדפדפן הזה. כדי להפעיל — עברו להגדרות האתר ואפשרו "Notifications".',

    'warRoom.envelope.heading': 'המעטפת — מי איתי',
    'warRoom.envelope.intro':
      'הוסיפו בני משפחה וחברים לחדר המבצעים. רק חברי המעטפת רואים את המשמרות, המשימות ובקשות החילוץ. בני המעטפת לא רואים את הדיווחים היומיים הפרטיים שלכם.',
    'warRoom.envelope.inviteCta': 'יצירת קישור הזמנה',
    'warRoom.envelope.ownerTag': 'בעלים',
    'warRoom.envelope.disclaimer':
      'מי שיש לו את הקישור יכול להצטרף לחדר המבצעים. שלחו רק לאנשים שאתם סומכים עליהם, ובטלו קישורים שלא נוצלו.',

    'warRoom.envelope.join.title': 'הצטרפות למעטפת',
    'warRoom.envelope.join.needsLogin':
      'כדי להצטרף יש להתחבר או להירשם. אחרי ההתחברות תוחזרו לכאן אוטומטית.',
    'warRoom.envelope.join.redeeming': 'מצטרפים לחדר המבצעים…',
    'warRoom.envelope.join.ok': 'הצטרפתם בהצלחה ✓',
    'warRoom.envelope.join.redirecting': 'מעבירים אתכם לחדר המבצעים…',
    'warRoom.envelope.join.errorTitle': 'הקישור אינו תקף',
    'warRoom.envelope.join.notConfigured': 'השירות אינו מוגדר.',
    'warRoom.envelope.join.backHome': 'חזרה לבית',

    // ── Lockdown protocol ─────────────────────────────────────────────────
    'lockdown.kicker': 'פרוטוקול חירום',
    'lockdown.title': 'נעילת הסביבה',
    'lockdown.intro':
      'כשמדדי האזהרה עולים — צמצום גישה לכלים שעלולים להזיק הוא הצעד היחיד שבני המשפחה יכולים לעשות מיד. סמנו כל פריט שהושלם — כל בני המעטפת רואים את ההתקדמות בזמן אמת.',
    'lockdown.disclaimer':
      'הצ׳קליסט הוא עזר משפחתי, לא תחליף לטיפול. גם אם הכל סומן — אם הסכנה מיידית, חיוג 101/100 קודם.',
    'lockdown.progress': '{{done}} מתוך {{total}} הושלמו',
    'lockdown.resetCta': 'איפוס',
    'lockdown.resetConfirm': 'לאפס את כל הצ׳קליסט?',
    'lockdown.doneBy': 'בוצע · {{name}} · {{when}}',
    'lockdown.category.access': 'גישה למפתחות וכלי רכב',
    'lockdown.category.finance': 'אשראי, מזומן ופיננסים',
    'lockdown.category.travel': 'דרכון ויציאה מהארץ',
    'lockdown.category.substances': 'אלכוהול ותרופות',
    'lockdown.item.carKeys': 'הסתרת מפתחות הרכב',
    'lockdown.item.carKeysHint': 'כולל פתח רזרבי בגלאי / בכיס מעיל / אצל שכן.',
    'lockdown.item.spareKeys': 'הסתרת מפתחות חליפיים נוספים',
    'lockdown.item.homeKeys': 'מפתחות הבית — לוודא שאי אפשר לצאת ולחזור באמצע הלילה ללא ידיעה',
    'lockdown.item.creditCards': 'איסוף כרטיסי אשראי',
    'lockdown.item.creditCardsHint':
      'כולל כרטיסים נוספים מצורפים. שקלו להקפיא דרך אפליקציית הבנק לפני שמסתירים.',
    'lockdown.item.idCard': 'הסתרת תעודת זהות',
    'lockdown.item.checkbook': 'הסתרת פנקס צ׳קים',
    'lockdown.item.bankApps': 'הסרה זמנית של אפליקציות בנק מהטלפון',
    'lockdown.item.bankAppsHint':
      'במיוחד אפליקציות שמאפשרות העברה מהירה (ביט, פייבוקס) או פתיחת מסגרת אשראי.',
    'lockdown.item.passport': 'הסתרת דרכון',
    'lockdown.item.driverLicense': 'הסתרת רישיון נהיגה',
    'lockdown.item.alcohol': 'הוצאת אלכוהול מהבית',
    'lockdown.item.oldMeds': 'הוצאת תרופות ישנות / לא בשימוש',
    'lockdown.item.oldMedsHint':
      'בית המרקחת בקופת החולים מקבל תרופות עודפות להשמדה. השאירו רק את הטיפול הנוכחי, בארון נעול.',
    'lockdown.banner.kicker': 'מדדי אזהרה עלו',
    'lockdown.banner.body':
      'הופעלה התראה. הפעלת פרוטוקול נעילת הסביבה מקצרת את חלון הסיכון.',
    'lockdown.banner.cta': 'פתח פרוטוקול נעילה',
    'lockdown.followUp.title': 'הצעדים הבאים',
    'lockdown.followUp.body':
      'אחרי שהסביבה נעולה — הצעדים המשלימים: בקשות משפטיות דחופות, תיאום משמרות, ובדיקת בטיחות נוספת.',
    'lockdown.followUp.legalCta': 'מגן משפטי',
    'lockdown.followUp.warRoomCta': 'חדר מבצעים',
    'lockdown.followUp.safetyCta': 'מדריך בטיחות',

    // ── De-escalation playbook (LEAP) ─────────────────────────────────────
    'playbook.kicker': 'תסריטי הרגעה',
    'playbook.title': 'איך מדברים כשהמצב מתלהט',
    'playbook.intro':
      'תסריטי תקשורת מבוססי שיטת LEAP. המטרה: לתקף את הרגש מבלי להסכים עם הדלוזיה. משפט מאמת ("אתה נשמע מבוהל") נותן חיבור; הסכמה עם תוכן הדלוזיה ("כן, השכנים באמת מצותתים") מבססת אותה.',
    'playbook.disclaimer':
      'התסריטים הם נקודות פתיחה ולא נוסחה. כל מצב ייחודי — קראו את בן המשפחה שלכם והתאימו. אין כאן ייעוץ קליני.',
    'playbook.leap.title': 'שיטת LEAP — בקצרה',
    'playbook.leap.body':
      'L — הקשבה אקטיבית, ללא ויכוח על העובדות.\nE — אמפתיה — תקפו את הרגש.\nA — הסכמה על מטרות משותפות (לישון, להרגיש בטוח), לא על האבחנה.\nP — שותפות — בנו משימה משותפת קטנה.',
    'playbook.allScenarios': 'כל התסריטים',
    'playbook.signsLabel': 'סימני זיהוי',
    'playbook.doLabel': 'מה לעשות',
    'playbook.dontLabel': 'מה לא לעשות',
    'playbook.scriptLabel': 'נוסח לפתיחה',
    'playbook.scriptAltLabel': 'נוסח חלופי',
    'playbook.askAssistant.title': 'לא מצאתם תרחיש שמתאים?',
    'playbook.askAssistant.body':
      'העוזר יכול לעזור לכם לחבר תסריט מותאם למצב שאתם בו עכשיו.',
    'playbook.askAssistant.cta': 'שאל את העוזר',
    'playbook.askAssistant.prompt':
      'אני מתמודד/ת עכשיו עם מצב מורכב מול בן/בת המשפחה. תוכל/י לעזור לי לבחור נוסח לפי שיטת LEAP?',

    'playbook.paranoid.title': 'דלוזיות פרנואידיות',
    'playbook.paranoid.signs':
      'תחושה שעוקבים, מאמין/ה ששמים לו דברים באוכל, חוסר אמון פתאומי בקרובים, סגירת חלונות וזכוכיות.',
    'playbook.paranoid.do':
      'תקפו את הרגש ("נשמע ממש מפחיד"), שמרו על מרחק פיזי שלא מאיים, דברו בקול נמוך ואיטי, הציעו לעשות משהו פיזי קטן יחד (כוס מים).',
    'playbook.paranoid.dont':
      'אל תתווכחו על העובדות. אל תצחקו. אל תאמרו "תירגע" או "אין על מה לחשוש". אל תיגעו פתאום מאחור.',
    'playbook.paranoid.script':
      'אני שומע/ת אותך. אני לא חייב/ת לדעת מי בדיוק עוקב — מה שחשוב לי זה שאתה מרגיש מאוים. אני כאן. אפשר לשבת ביחד דקה?',
    'playbook.paranoid.scriptAlt':
      'אני מבין/ה למה אתה לא רוצה לאכול את זה עכשיו. אין בעיה. אולי משהו אחר מהבית, שהכנתי לפניך?',

    'playbook.grandiosity.title': 'גרנדיוזיות',
    'playbook.grandiosity.signs':
      'תכניות עסקיות גדולות, רכישות יקרות, תחושת שליחות, ביטחון יוצא דופן, דיבור מהיר, חוסר שינה מבלי שזה מפריע.',
    'playbook.grandiosity.do':
      'הביעו עניין בלי לאשר את הסיפור. מקדו את השיחה בצעד אחד קטן ("בוא נדבר על מה שאתה רוצה לעשות מחר"). הסיטו לעיסוק שמרגיע (טבע, מוזיקה).',
    'playbook.grandiosity.dont':
      'אל תתעמתו עם הרעיון הגדול. אל תאמרו "אתה לא חושב נכון". אל תנסו לחתום הסכמים פיננסיים בזמן הזה.',
    'playbook.grandiosity.script':
      'אני שומע/ת רעיון גדול וזה מרגיש לך אמיתי מאוד. בוא נעשה אחד קטן ביחד היום — לישון לפחות 5-6 שעות, ומחר נחזור לדבר על השאר.',
    'playbook.grandiosity.scriptAlt':
      'הרעיון מעניין. כדי לעשות אותו טוב כדאי לבדוק עם [שם אדם אמין] לפני שמשקיעים. אפשר לדחות בשבועיים?',

    'playbook.agitation.title': 'אגיטציה ועצבנות',
    'playbook.agitation.signs':
      'הליכה הלוך ושוב, צעקות, הקפצה של דלתות, התקפי זעם פתאומיים, חוסר יכולת לשבת.',
    'playbook.agitation.do':
      'הוציאו ילדים ובעלי חיים מהחדר. עמדו זוויתית (לא מולו), עם דלת מוצא פנויה. דברו לאט. הציעו אפשרויות פשוטות ("רוצה מים, או צאת לאוויר?"). תנו זמן.',
    'playbook.agitation.dont':
      'אל תרימו את הקול. אל תחסמו את היציאה. אל תיגעו בכוח. אל תיתנו אולטימטומים ("או שאתה רגוע, או…").',
    'playbook.agitation.script':
      'אני רואה שיש בך עומס גדול עכשיו. אני לא הולך/ת לדבר על שום דבר חשוב כרגע. אני רק כאן. אם תרצה — אצא לדקה ואחזור אחר כך.',

    'playbook.refusalMeds.title': 'סירוב לתרופות',
    'playbook.refusalMeds.signs':
      'התווכחות על המינון, "אני לא צריך/ה את זה יותר", הסתרת כדורים, האשמת הרופא, חוסר אמון בטיפול.',
    'playbook.refusalMeds.do':
      'הקשיבו ראשית. שאלו מה התופעה שמפריעה ("אילו תופעות אתה מרגיש?"). הציעו לדבר על זה עם הרופא ביחד. הזכירו מטרה משותפת, לא אבחנה.',
    'playbook.refusalMeds.dont':
      'אל תאמרו "אתה חייב". אל תחביאו תרופה באוכל ללא ידיעתו (פוגע באמון לתמיד). אל תחזרו על "אתה חולה ואתה צריך".',
    'playbook.refusalMeds.script':
      'אני שומע/ת שהתרופה הזאת עושה לך משהו לא נעים. ספר/י לי מה בדיוק. אני יכול/ה לתאם פגישה עם הרופא, ולשבת איתך — שתגיד/י לו בעצמך.',
    'playbook.refusalMeds.scriptAlt':
      'אני מבין/ה את ההחלטה לעצור. בקשה אחת — לפני שמפסיקים לגמרי, בוא נדבר עם הרופא ביחד. שלא יקרה משהו שלא ראינו.',

    'playbook.suicidal.title': 'מחשבות אובדניות',
    'playbook.suicidal.signs':
      'דיבור על "להיעלם", פרידה מאנשים, חלוקת חפצים, חיפוש שיטות, "לכולם יהיה יותר טוב בלעדיי", שינוי פתאומי לרוגע אחרי תקופת מצוקה.',
    'playbook.suicidal.do':
      'שאלו ישירות ("האם אתה חושב לפגוע בעצמך?"). הקשיבו בלי לתקן. הוציאו אמצעים קטלניים מהבית (תרופות, נשק, ראו /safety). אל תשאירו לבד. הזעיקו 101.',
    'playbook.suicidal.dont':
      'אל תאמרו "אל תהיה דרמטי". אל תבטיחו "אני לא אספר לאף אחד" — אם המצב מסכן חיים, חייבים להזעיק. אל תשאירו את האדם לבד.',
    'playbook.suicidal.script':
      'אני שומע/ת אותך. אני לא הולך/ת ללכת לשום מקום. נספר את זה לרופא ביחד. אני איתך.',

    'playbook.withdrawal.title': 'התכנסות ודיכאון עמוק',
    'playbook.withdrawal.signs':
      'לא קם/ה מהמיטה, מסרב/ת לאכול, מפסיק/ה לענות לטלפון, היגיינה ירדה, "אין לי כוח", השתקה.',
    'playbook.withdrawal.do':
      'דבר/י באמירות קצרות, חיוביות, לא דורשות. הציעו פעולה זעירה ("בוא נצא דקה לחלון"). הביאו אוכל ושתייה לחדר. נגעו רק אם זה מתקבל.',
    'playbook.withdrawal.dont':
      'אל תאמרו "תקום, אין סיבה לעצב". אל תכריחו לדבר. אל תפעילו מוזיקה רעשנית או "תפנקו את עצמך".',
    'playbook.withdrawal.script':
      'אני יודע/ת שזה רגע נורא קשה. אני לא מצפה ממך לכלום. אני כאן, מביא/ה לך כוס מים, ואני נשאר/ת ליד עד שתרצה/י משהו.',

    // ── Caregiver pulse + burnout ─────────────────────────────────────────
    'pulse.kicker': 'איך אתם?',
    'pulse.title': 'בדיקה קצרה — לכם, לא לאדם שאתם מלווים',
    'pulse.intro':
      'דקה אחת ביום. עוזר לכם לזכור שאתם גם בני אדם, ומאפשר לשאר בני המעטפת לראות אם מישהו שוחק.',
    'pulse.notNow': 'לא עכשיו',
    'pulse.sleepLabel': 'כמה שעות ישנתם בלילה האחרון?',
    'pulse.moodLabel': 'איך אתם מרגישים?',
    'pulse.mood.1': 'מותש/ת',
    'pulse.mood.2': 'קשה',
    'pulse.mood.3': 'באמצע',
    'pulse.mood.4': 'בסדר',
    'pulse.mood.5': 'טוב',
    'pulse.noteLabel': 'מה הכי כבד עכשיו? (אופציונלי)',
    'pulse.notePlaceholder': 'כל דבר שעוזר לכם לבטא',
    'pulse.save': 'שמירה',
    'pulse.savedKicker': 'נשמר',
    'pulse.savedBody': 'תודה שדאגתם גם לעצמכם.',

    'burnout.kicker': 'שימו לב למעטפת',
    'burnout.noSleep':
      '{{name}} דיווח/ה היום על שינה אפסית. שווה לבדוק איך הוא/היא ולהציע חילוץ.',
    'burnout.solo48h':
      '{{name}} מנהל/ת לבד את הזירה כבר 48 שעות. הזמן הכי טוב לקפוץ פנימה הוא עכשיו.',
    'burnout.selfCareCta': 'משאבי תמיכה',
    'burnout.dismiss': 'התעלם',

    'selfCare.kicker': 'מעטפת בריאה',
    'selfCare.title': 'תמיכה למשפחה המלווה',
    'selfCare.intro':
      'משפחה ששוחקת לא יכולה לעזור לאף אחד. כאן רשימת משאבים בישראל לליווי שלכם — לא של המתמודד/ת, אלא שלכם.',
    'selfCare.why.title': 'למה זה חיוני',
    'selfCare.why.body':
      'מחקרים מראים שמשפחות מלוות מתמודדים פסיכיאטריים נמצאות בסיכון גבוה לדיכאון, חרדה ושחיקה. תמיכה למלווים היא חלק מהטיפול בחולה — לא תוספת.',
    'selfCare.callCta': 'חיוג {{number}}',
    'selfCare.openCta': 'פתח אתר',
    'selfCare.disclaimer':
      'המידע נכון למיטב ידיעתנו. ודאו פרטים באתרי הארגונים — הם משתנים מעת לעת.',
    'selfCare.enosh.title': 'אנוש — קבוצות תמיכה למשפחות',
    'selfCare.enosh.body':
      'הארגון הישראלי לבריאות הנפש מפעיל קבוצות תמיכה אזוריות למשפחות. ייעוץ ראשוני ללא תשלום.',
    'selfCare.ozma.title': 'עוצמה — פורום בני משפחה',
    'selfCare.ozma.body':
      'עוצמה הוא ארגון של בני משפחה למתמודדי נפש. מציע ליווי, קבוצות תמיכה והדרכה זוגית.',
    'selfCare.eran.title': 'ער"ן — עזרה ראשונה נפשית',
    'selfCare.eran.body':
      'מענה אנונימי 24/7. אפשר להתקשר גם בשבילכם — לא רק בשם המתמודד.',
    'selfCare.yad_sarah.title': 'יד שרה — סיוע ביתי',
    'selfCare.yad_sarah.body':
      'השאלת ציוד רפואי, סיוע בבית, ותחבורה מותאמת — פוחת את העומס היומיומי.',
    'selfCare.kupa_therapy.title': 'טיפול פסיכולוגי לעצמכם דרך קופת חולים',
    'selfCare.kupa_therapy.body':
      'גם אתם זכאים לטיפול במסגרת ההסכמים. פנו לרופא המשפחה ובקשו הפניה לפסיכולוג/ית — לא של המתמודד, שלכם.',
    'selfCare.support_group.title': 'קבוצת תמיכה מקוונת',
    'selfCare.support_group.body':
      'אם יציאה לפיזית לקבוצה לא אפשרית — חפשו "קבוצת תמיכה למשפחות מתמודדי נפש" בפייסבוק או דרך אנוש/עוצמה.',
    'selfCare.shareLoad.title': 'חלקו את העומס',
    'selfCare.shareLoad.body':
      'אם בני המעטפת לא מצטרפים — הזמינו אותם לחדר המבצעים. שיתוף משמרות ומשימות מוריד את העומס מהאיש האחד שמוביל.',
    'selfCare.shareLoad.cta': 'פתח חדר מבצעים',

    // ── Visual vault ──────────────────────────────────────────────────────
    'vault.kicker': 'כספת מאובטחת',
    'vault.title': 'תיעוד התנהגות לרופאים',
    'vault.intro':
      'רישומי וידאו / שמע / תמונות שמתעדים את ההתנהגות החריגה. שימושי לפסיכיאטר המחוזי, חדר מיון ופסיכיאטר/ית מטפל/ת — לרוב במהלך משבר לא רואים את הדפוס, ובלי הוכחה ההחלטה מתקבלת על סמך עדות בלבד.',
    'vault.disclaimer':
      'הקבצים גלויים רק לבני המעטפת. אין להציג את הקבצים בפומבי או לשתף אותם בקבוצות. השימוש אמור להיות מול אנשי מקצוע בלבד.',
    'vault.encryptionNote':
      'הקבצים מוצפנים ברמת השרת (Supabase Storage), והגישה דרך לינקים זמניים בלבד. אין כאן הצפנה צד-לקוח אמיתית — מי שיש לו גישה לחשבון בני המעטפת יכול לראות את הקבצים. ודאו שכל אחד שמורשה הוא באמת בני המעטפת.',
    'vault.recorder.title': 'הקלטה מהטלפון',
    'vault.recorder.audio': 'שמע',
    'vault.recorder.video': 'וידאו',
    'vault.recorder.start': '● התחל הקלטה',
    'vault.recorder.stop': '■ סיים והעלה',
    'vault.recorder.maxLabel': '(מקסימום 5 דקות)',
    'vault.recorder.hint':
      'אישור גישה למיקרופון / מצלמה נדרש בפעם הראשונה. ההקלטה לא נשמרת עד שמאשרים בשלב הבא.',
    'vault.upload.title': 'או העלאה מהגלריה',
    'vault.upload.body': 'בחרו וידאו, שמע או תמונה קיימים מהטלפון או המחשב. מקסימום 50MB.',
    'vault.upload.pick': 'בחירת קובץ',
    'vault.pending.title': 'מוכן להעלאה',
    'vault.pending.newRecording': 'הקלטה חדשה',
    'vault.pending.captionLabel': 'תיאור קצר (מומלץ — עוזר לרופא לזהות מהר)',
    'vault.pending.captionPlaceholder': 'למשל: אופוריה ודיבור מהיר, יום שלישי בערב',
    'vault.pending.save': 'שמירה בכספת',
    'vault.items.heading': 'הקבצים בכספת',
    'vault.items.empty': 'הכספת ריקה. הקליטו או העלו את הראייה הראשונה.',
    'vault.deleteConfirm': 'למחוק את הקובץ? הפעולה אינה הפיכה.',

    'gr.vaultLink.title': 'תיעוד התנהגות לרופא',
    'gr.vaultLink.body':
      'אפשר להוסיף סרטונים קצרים או הקלטות שמע של ההתנהגות החריגה — לטובת מיון או ביקור פסיכיאטר.',
    'gr.vaultLink.cta': 'פתח כספת',

    'assistant.starter.playbook': 'איך אני מדבר/ת איתו/ה כשמתלהט?',
    'assistant.playbookLink': 'פתח תסריטי הרגעה →',

    // ── Privacy ────────────────────────────────────────────────────────────
    'privacy.kicker': 'שקיפות ואמון',
    'privacy.title': 'פרטיות ואבטחת מידע',
    'privacy.intro':
      'אנחנו מבינים שמדובר במידע רגיש במיוחד. הדף הזה מסביר איפה הנתונים נשמרים, מי יכול לראות אותם, ואיך מוחקים חשבון.',
    'privacy.where.title': 'איפה הנתונים נשמרים',
    'privacy.where.body':
      'הנתונים שלכם נשמרים ב־Supabase, שירות מסדי נתונים מאובטח. כל תעבורה מוצפנת ב־TLS. אין לנו שרת ביניים — האפליקציה מדברת ישירות מול Supabase.',
    'privacy.who.title': 'מי יכול לראות',
    'privacy.who.body':
      'רק החשבון המחובר רואה את הדיווחים. אנחנו לא חולקים נתונים עם צד ג׳, לא מציגים פרסומות, ולא משתמשים בנתונים שלכם לאימון מודלים.',
    'privacy.delete.title': 'מחיקת חשבון',
    'privacy.delete.body':
      'כדי למחוק חשבון וכל הנתונים שלו, שלחו לנו אימייל לכתובת שמופיעה למטה ונבצע מחיקה תוך 14 יום.',
    'privacy.contactTitle': 'יצירת קשר',
    'privacy.contactBody': 'לשאלות, בקשות מחיקה או דיווח על תקלה:',
  },

  en: {
    'common.loading': 'Loading…',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.saving': 'Saving…',
    'common.edit': 'Edit',
    'common.print': 'Print',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.previewMode': 'Preview',
    'configBanner.kicker': 'App not configured',
    'configBanner.title': 'Supabase configuration required',
    'configBanner.body':
      'To run Matzpen, set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY. The app will not render any data until these are provided, so demo records are never mistaken for real medical history.',
    'common.langName': 'עב',
    'common.skip': 'Skip',
    'common.next': 'Next',
    'common.done': 'Get started',
    'common.back': 'Back',
    'common.step': 'Step {{current}} of {{total}}',

    'onboarding.welcome': 'Welcome to Matzpen',
    'onboarding.intro':
      'Matzpen helps you support your loved one — here is a quick tour of what you will find.',
    'onboarding.s1.title': 'Matzpen every day',
    'onboarding.s1.body':
      'About a minute a day: sleep, mood, activity, unusual events. Each check-in helps surface trends and early warning signs.',
    'onboarding.s2.title': 'When something goes wrong',
    'onboarding.s2.body':
      'The Emergency module walks you through a decision tree: who to call (police / MDA / district psychiatrist), and what to read to the dispatcher.',
    'onboarding.s3.title': 'Triage and rights',
    'onboarding.s3.body':
      'The "Triage record" holds the medical information an ER team needs. "Rights & paperwork" tracks your progress with National Insurance and the rehab basket.',

    'emergency.shortcutsTitle': 'Know what you need? Skip ahead',
    'emergency.safetyLink': 'Lethal-means restriction guide →',
    'emergency.shortcut.violence': 'Immediate danger or violence',
    'emergency.shortcut.violenceHint': 'Police — dial 100',
    'emergency.shortcut.suicide': 'Suicidality / danger to self',
    'emergency.shortcut.suicideHint': 'MDA — dial 101',
    'emergency.shortcut.involuntary': 'Psychosis without violence',
    'emergency.shortcut.involuntaryHint': 'District psychiatrist exam order',
    'emergency.orQuestions': 'Or answer the questions',

    'nav.daily': 'Daily check-in',
    'nav.dailyShort': 'Daily',
    'nav.dailyHelper': 'Spot deterioration early',
    'nav.emergency': 'Emergency',
    'nav.emergencyShort': 'SOS',
    'nav.emergencyHelper': 'What to do right now',
    'nav.goldenRecord': 'Triage record',
    'nav.goldenRecordShort': 'Record',
    'nav.goldenRecordHelper': 'One sheet for the ER',
    'nav.bureaucracy': 'Rights & paperwork',
    'nav.bureaucracyShort': 'Rights',
    'nav.bureaucracyHelper': 'Tracks and checklists',
    'nav.assistant': 'Matzpen AI',
    'nav.assistantShort': 'Assistant',
    'nav.assistantHelper': 'Live answers on bureaucracy & crisis',
    'nav.tools': 'Tools',
    'nav.toolsHelper': 'Legal, hospitals, case studies',
    'nav.warRoom': 'War room',
    'nav.warRoomHelper': 'Shifts, tasks, backup',
    'nav.lockdown': 'Lockdown',
    'nav.lockdownHelper': 'Emergency-action checklist',
    'nav.playbook': 'Playbook',
    'nav.playbookHelper': 'What to say when things heat up',
    'nav.vault': 'Vault',
    'nav.vaultHelper': 'Behavioral evidence for clinicians',
    'nav.selfCare': 'Self-care',
    'nav.selfCareHelper': 'Burnout & family resources',
    'nav.legal': 'Legal shield',
    'nav.legalHelper': 'Guardianship, credit freeze, exit ban',
    'nav.hospitalization': 'Hospitalization',
    'nav.hospitalizationHelper': 'Hospitals, balancing homes, day care',
    'nav.cases': 'Case studies',
    'nav.casesHelper': 'How other families coped',
    'nav.moreShort': 'More',
    'nav.moreSheetTitle': 'More tools',
    'nav.signIn': 'Sign in',
    'nav.signOut': 'Sign out',
    'nav.privacy': 'Privacy',
    'nav.feedback': 'Feedback',

    'config.previewLocal':
      'Preview mode: Supabase is not configured. See .env.local to enable auth and persistence.',
    'config.previewVercel':
      'Preview mode: Supabase is not configured. Set the env vars on Vercel and redeploy.',

    'login.welcome': 'Welcome to Matzpen',
    'login.subSignIn': 'Sign in to an existing family account',
    'login.subSignUp': 'Create a new family account',
    'login.notConfigured':
      'Supabase is not configured. Sign-in will fail until env vars are set in .env.local.',
    'login.email': 'Email',
    'login.password': 'Password',
    'login.busy': 'Signing in…',
    'login.signIn': 'Sign in',
    'login.signUp': 'Create account',
    'login.or': 'or',
    'login.google': 'Continue with Google',
    'login.noAccount': "Don't have an account?",
    'login.haveAccount': 'Already have an account?',
    'login.toSignUp': 'Register here',
    'login.toSignIn': 'Sign in',
    'login.unknownError': 'Unknown error',
    'login.consentLabel':
      'I understand that Matzpen is a self-help documentation tool for families and is not a substitute for medical care, diagnosis, or clinical judgement. Alerts are heuristics and have not been clinically validated. In an emergency I will call 101 (MDA), 100 (police), or 1201 (ERAN) first. I acknowledge that data I enter (including the medical record and AI assistant conversations) is processed by an AI provider (Google Gemini) to generate responses.',
    'login.consentRequired': 'Please confirm the disclosure to continue.',

    'dashboard.greeting': 'Hello, {{name}}',
    'dashboard.defaultName': 'family member',
    'dashboard.title': 'Daily check-in',
    'dashboard.subtitle':
      "{{patient}}'s compass · the daily log takes about a minute and helps surface early warning signs.",
    'dashboard.subtitleGeneric':
      'The daily log takes about a minute and helps surface early warning signs.',
    'dashboard.setup.kicker': "Let's get started",
    'dashboard.setup.title': 'Who are you caring for?',
    'dashboard.setup.body':
      'Add a name and your relationship so the Compass feels personal — and so the triage team has what they need when it matters.',
    'dashboard.setup.cta': 'Fill in the medical record',
    'dashboard.valueProp':
      'A crisis-management home base for families — tracking, emergency, triage record, and rights in one place.',
    'dashboard.disclaimer':
      'This tool is designed to help you spot deterioration in time, not to replace professional care.',
    'dashboard.weekTitle': 'This week at a glance',
    'dashboard.weekStable':
      '{{stable}} of {{total}} days logged this week were stable.',
    'dashboard.weekNone': 'No check-ins logged in the past week yet.',
    'dashboard.weekTrend': 'Risk trend: {{trend}}',
    'dashboard.weekStableTag': 'steady',
    'dashboard.weekRisingTag': 'rising',
    'dashboard.weekFallingTag': 'easing',

    'dailyLog.sectionSleep': 'Sleep',
    'dailyLog.sectionAffect': 'Mood',
    'dailyLog.sectionActivity': 'Activity',
    'dailyLog.sectionEvents': 'Unusual events',
    'dailyLog.sleepLabel': 'Hours of sleep last night',
    'dailyLog.sleepUnit': 'hours',
    'dailyLog.sleepHigh': '⚠ High risk — very short sleep',
    'dailyLog.sleepLow': 'Below the recommended range',
    'dailyLog.sleepOk': 'Within the typical range',
    'dailyLog.sleepSummary': '{{hours}} hrs · {{note}}',
    'dailyLog.affectiveLabel': 'Current affective state',
    'dailyLog.psychoLabel': 'Activity & motor pace',
    'dailyLog.psychoSlow': 'Slow',
    'dailyLog.psychoRestless': 'Restless',
    'dailyLog.psycho1': 'Very slow',
    'dailyLog.psycho2': 'Slow',
    'dailyLog.psycho3': 'Normal',
    'dailyLog.psycho4': 'Accelerated',
    'dailyLog.psycho5': 'Very accelerated / restless',
    'dailyLog.psychoLegend': '1 – very slow · 3 – normal · 5 – restless',
    'dailyLog.impulsivityLabel':
      'Was there an unusual impulsivity or spending event today?',
    'dailyLog.notesLabel': 'Notes (optional)',
    'dailyLog.notesPlaceholder':
      'e.g. initiated a sudden trip, rapid speech with loose associations',
    'dailyLog.submit': 'Save daily check-in',
    'dailyLog.submitting': 'Saving…',
    'dailyLog.successTitle': 'Check-in saved ✓',
    'dailyLog.successBody':
      'Included in the daily log and synced to the rest of the family.',
    'dailyLog.successSummaryTitle': "Today's check-in",
    'dailyLog.nextStableTitle': 'Stable',
    'dailyLog.nextStableBody':
      'Keep the daily log going. If you see a meaningful change for 2–3 consecutive days, open the emergency screen.',
    'dailyLog.nextWatchTitle': 'Worth watching closely',
    'dailyLog.nextWatchBody':
      'Early signs detected. Worth contacting the community treating team and not waiting.',
    'dailyLog.nextEscalateTitle': 'Time to act',
    'dailyLog.nextEscalateBody':
      'Concerning metrics are forming a trend. Open the emergency screen for an action path.',
    'dailyLog.fieldImpulsivityYes': 'Impulsivity event',
    'dailyLog.fieldImpulsivityNo': 'No unusual events',
    'dailyLog.sectionMeds': 'Medication',
    'dailyLog.medsLabel': 'Did the patient take their medication today?',
    'dailyLog.medsYes': 'Yes',
    'dailyLog.medsNo': 'No',
    'dailyLog.medsRefused': 'Refused',
    'dailyLog.medsField.yes': 'Taken as prescribed',
    'dailyLog.medsField.no': 'Not taken',
    'dailyLog.medsField.refused': 'Refused',
    'dailyLog.medsField.unknown': 'Not specified',
    'dailyLog.addAnother': 'Add another check-in',
    'dailyLog.previewNote':
      'Preview mode: check-ins are not persisted until Supabase env vars are set in .env.local.',

    'affective.depression': 'Deep depression',
    'affective.euthymia': 'Stable',
    'affective.euphoria': 'Euphoria / high',
    'affective.irritability': 'Irritability',

    'alert.stableTitle': 'Stable',
    'alert.stableBody': 'Metrics are in the normal range. Keep up the daily log.',
    'alert.yellowKicker': 'Yellow alert · window of opportunity is open',
    'alert.yellowBody':
      'Heads up: a meaningful drop in sleep and a rise in activity pace were detected. Consider contacting the treating community clinician to adjust treatment.',
    'alert.redKicker': 'Red alert · metrics escalating',
    'alert.redBody':
      'Metrics appear to be escalating. Consider opening the emergency module or seeking immediate professional help.',
    'alert.openEmergency': 'Open the emergency module',
    'alert.reason.sleepActivity':
      '{{days}} consecutive days of sleep below {{hours}} hrs with elevated activity',
    'alert.reason.yellowCrossed':
      'Yellow alert sustained for {{days}} days — crossed into red',
    'alert.reason.impulsivityStreak':
      '{{days}} consecutive days reporting an unusual impulsivity event',
    'alert.reason.medsMissed':
      '{{days}} consecutive days of missed medication',
    'alert.reason.medsMissedLowSleep':
      'On days medication was missed, sleep dropped below {{hours}} hours — elevated risk',
    'alert.howCalculated': 'How was this calculated?',
    'alert.nonClinicalNote':
      'This alert is a heuristic based on patterns commonly reported by families (sustained short sleep, accelerated activity, missed medication). It is not a clinical guideline, has not been validated, and does not account for your loved one\'s personal baseline (e.g. chronic insomnia). Treat it only as a reminder to check in and update the treating team — not as a diagnosis.',

    'emergency.kicker': 'Emergency',
    'emergency.title': 'Decision tree',
    'emergency.reset': 'Back to start',
    'emergency.breadcrumbAriaLabel': 'Progress through the decision tree',
    'emergency.stepCount': 'Step {{current}} of {{total}}',
    'emergency.crumb.violence': 'Immediate danger?',
    'emergency.crumb.evacuation': 'Urgent evacuation?',
    'emergency.crumb.police': 'Route: police',
    'emergency.crumb.ambulance': 'Route: MDA',
    'emergency.crumb.psych': 'Route: district psychiatrist',
    'emergency.calm':
      'Take a deep breath. This decision tree helps identify the right body to call. You don\'t need to fill everything in — pick the scenario closest to right now.',
    'emergency.qViolence':
      'Is there immediate danger, active violence, or a weapon right now?',
    'emergency.qViolenceHelp':
      'Physical violence, threats with a weapon, or danger to yourself or your loved one right now.',
    'emergency.recommendedRoute': 'Recommended route',
    'emergency.routePoliceTitle': 'Israel Police',
    'emergency.routePoliceBody':
      'Police are authorized to respond to violent incidents. Explicitly ask for the "person with a mental disability" protocol — it dampens escalation.',
    'emergency.dial.emergency': 'Quick dial — emergency',
    'emergency.dial.mda': 'MDA — medical emergency',
    'emergency.scriptLabel': 'Read aloud to the dispatcher (Hebrew)',
    'emergency.beforeTeam': 'Before the team arrives',
    'emergency.policeStep1': 'Move children and vulnerable family away from the area.',
    'emergency.policeStep2': 'Do not confront the person; leave the room if needed.',
    'emergency.policeStep3': 'State explicitly: psychiatric crisis, not criminal.',
    'emergency.policeStep4': 'Request escort to an ambulance once stabilized.',
    'emergency.qEvacuation':
      'Is urgent evacuation to a psychiatric ER needed?',
    'emergency.qEvacuationHelp':
      'A non-violent life-threatening state: suicidality, breaking from reality, medical danger.',
    'emergency.routeAmbulanceTitle': 'MDA — medical evacuation',
    'emergency.routeAmbulanceBody':
      'Request a paramedic or a mental-health crisis-intervention team (MDA Tel Aviv pilot).',
    'emergency.ambulanceNoteTitle': 'Important to know',
    'emergency.ambulanceNoteBody':
      'An evacuation that does not end in hospitalization may incur a fee. If the team admits the patient, the HMO covers the cost.',
    'emergency.routePsychTitle': 'District psychiatrist',
    'emergency.routePsychBody':
      'When the person is psychotic and refuses treatment but is not violent — the path of an involuntary examination order (sections 6/7 of the law).',
    'emergency.psychChecklistTitle': 'Action checklist',
    'emergency.psych.doctor.label':
      'Obtain a letter from a community physician (family / treating psychiatrist / GP).',
    'emergency.psych.doctor.hint':
      'A letter recommending an involuntary exam because the patient refuses to attend a clinic.',
    'emergency.psych.family.label':
      'Write a detailed, chronological family letter.',
    'emergency.psych.family.hint':
      'Describe psychotic behavior, suicidal/threatening statements, lack of sleep.',
    'emergency.psych.welfare.label':
      'Call the municipal welfare hotline 106 to involve a social worker.',
    'emergency.psych.welfare.hint':
      'A social worker requesting the order reduces "family dispute" dismissals.',
    'emergency.psych.district.label':
      'Locate the relevant district psychiatrist office and submit the request.',
    'emergency.psych.district.hint':
      'An involuntary exam order is valid 10 days — request expedited execution.',
    'emergency.psych.verify.label':
      'Verify the request was received within an hour — call the office.',
    'emergency.psych.verify.hint':
      'Without confirmation of intake, the request is not processed.',
    'emergency.psychEscalate':
      'If the situation worsens during treatment — return to the start of the decision tree and pick the 100 / 101 route.',
    'emergency.backToDashboard': '← Back to the dashboard',

    'gr.kicker': 'Digital medical file',
    'gr.title': 'Triage record',
    'gr.subtitle':
      'The Golden Record — one document with all the critical information the ER team needs in minutes. Printable or shown to the dispatcher.',
    'gr.mode.edit': 'Edit mode',
    'gr.mode.view': 'View / print mode',
    'gr.viewEmpty.title': 'No record yet',
    'gr.viewEmpty.body':
      'Switch to edit mode and fill in the record so you can display it to the ER team.',
    'gr.printPdf': 'Print as PDF',
    'gr.cancelEdit': 'Cancel and keep the current version',
    'gr.docHeader': 'Triage medical file',
    'gr.updated': 'Updated: {{when}}',
    'gr.unnamedPatient': 'Unnamed',
    'gr.relationshipLine': 'Caregiver relationship: {{relationship}}',
    'gr.section.diagnosis': 'Primary diagnosis',
    'gr.section.comorbidities': 'Comorbidities',
    'gr.section.medications': 'Current medications',
    'gr.section.allergies': 'Allergies and unusual past side effects',
    'gr.section.risk': 'Risk factors (suicidality / substances)',
    'gr.section.contacts': 'Community medical contacts',
    'gr.noMeds': 'No medications listed.',
    'gr.empty': 'Not provided.',
    'gr.disclaimer':
      "This document was produced by the patient's family to provide critical medical context to the triage team and preserve continuity of care, even when the patient refuses to share information.",
    'gr.form.identity.kicker': 'About the person',
    'gr.form.patientName.label': 'First name',
    'gr.form.patientName.hint':
      "The name that appears on the triage record and in the Compass greeting. First name only is fine — keeps things private.",
    'gr.form.patientName.placeholder': 'e.g., Doron',
    'gr.form.relationship.label': 'Your relationship',
    'gr.form.relationship.hint':
      'Who is this person to you? Helps the Compass and the AI assistant talk in the right context.',
    'gr.form.relationship.placeholder': 'e.g., my son, my sister, my partner, my mom',
    'gr.form.region.label': 'Region of residence',
    'gr.form.region.hint':
      'Used only to route you to the closest psychiatric hospital and to alternative-care options in your area.',
    'gr.form.region.placeholder': 'Select a region',
    'gr.form.city.label': 'City / town',
    'gr.form.city.hint': 'Exact city of residence — also appears on the triage record.',
    'gr.form.city.placeholder': 'e.g. Ramat Gan, Be\'er Sheva',
    'region.north': 'Galilee & Golan',
    'region.haifa': 'Haifa & Krayot',
    'region.sharon': 'Sharon',
    'region.center': 'Center',
    'region.telaviv': 'Tel Aviv & surroundings',
    'region.jerusalem': 'Jerusalem & surroundings',
    'region.shfela': 'Shfela',
    'region.south': 'South & Negev',
    'gr.form.diagnosis.label': 'Primary diagnosis',
    'gr.form.diagnosis.hint': 'e.g. Bipolar 1 Disorder.',
    'gr.form.comorbidities.label': 'Comorbidities',
    'gr.form.comorbidities.hint':
      'Diabetes, hypertension, heart disease, obesity, etc. — critical for drug choices.',
    'gr.form.meds.label': 'Current medications',
    'gr.form.meds.hint': 'One line per drug: name · dose · timing.',
    'gr.form.allergies.label': 'Allergies and unusual side effects',
    'gr.form.allergies.hint':
      'Drugs that caused tremor, rigidity, toxicity — to avoid in the ER.',
    'gr.form.risk.label': 'Risk factors (suicidality / substances / weapons)',
    'gr.form.risk.hint':
      'Past suicide attempts, substance use, firearm licenses.',
    'gr.form.contacts.label': 'Community medical contacts',
    'gr.form.contacts.hint':
      'Treating psychiatrist, rehab framework, family physician — name and phone.',
    'gr.form.submit': 'Save record',
    'gr.form.saveError': 'Save failed. Please try again or refresh the page.',
    'warningSigns.kicker': 'Personal warning signs',
    'warningSigns.intro':
      '3–7 short phrases you recognize as your person\'s specific prodrome. e.g. "stops answering the phone," "starts online shopping at night," "talks fast about new ideas." When marked, we use these for alerts before the generic algorithm fires.',
    'warningSigns.empty': "You haven't set personal warning signs yet.",
    'warningSigns.placeholder': 'e.g. stops sleeping at night',
    'warningSigns.add': 'Add sign',
    'warningSigns.remove': 'Remove',
    'warningSigns.maxHint': "You've reached the maximum — 7 signs. Worth focusing.",
    'dailyLog.warningSignsKicker': 'Your warning signs',
    'dailyLog.warningSignsHint': "Mark which signs appeared today. Several days in a row raises the alert level.",
    'alert.reason.personalSigns':
      '{{days}} consecutive days with personal warning signs marked',
    'alert.reason.personalSignsRed':
      '{{days}} days of personal warning signs — likely needs intervention',

    'gr.extract.title':
      'Upload a hospital summary or doctor’s letter (PDF/image) to auto-fill the record',
    'gr.extract.subtitle':
      'Drop a file here or pick one. It is processed in memory only — never stored on the server.',
    'gr.extract.choose': 'Choose file',
    'gr.extract.loading': 'Reading the medical document with AI…',
    'gr.extract.done': 'Document parsed — review and edit the fields before saving',
    'gr.extract.reviewHint':
      'Look over the auto-filled fields, correct anything that looks off, then save.',
    'gr.extract.another': 'Upload another document',
    'gr.extract.failed': 'Extraction failed. Try again or fill in manually.',
    'gr.extract.rejected': 'Unsupported file type or larger than 15MB.',

    'assistant.kicker': 'Smart assistant',
    'assistant.title': 'Matzpen AI',
    'assistant.pageSubtitle':
      'Ask about involuntary hospitalization, Bituach Leumi, the rehab basket, or anything else that feels overwhelming. I’m not a doctor — but I’ll point you the right way.',
    'assistant.welcomeTitle': 'How can I help?',
    'assistant.welcomeSubtitle':
      'Questions about rights, bureaucracy, hospitalization and crisis — calmly and clearly. In immediate danger: call 100 / 101.',
    'assistant.inputPlaceholder':
      'Type a question… (Enter to send, Shift+Enter for newline)',
    'assistant.send': 'Send',
    'assistant.openLabel': 'Open Matzpen AI',
    'assistant.close': 'Close',
    'assistant.disclaimer':
      'Matzpen AI is not a substitute for medical or legal advice. In immediate danger: call 100 or 101.',
    'assistant.error': 'The service returned an error. Please try again.',
    'assistant.errorRetry': 'Retry',
    'assistant.starter.involuntary': 'What is the involuntary hospitalization process in Israel?',
    'assistant.starter.bituachLeumi': 'How do I file a Bituach Leumi claim?',
    'assistant.starter.refusesMeds': 'He refuses to take his meds — what should I do?',

    'bur.kicker': 'Long-term tracking',
    'bur.title': 'Rights & paperwork',
    'bur.subtitle':
      'Your paths through the institutions, with milestones and checklists — each tick saves your progress.',
    'bur.progress': '{{done}} of {{total}} steps',
    'bur.previewNote':
      'Preview mode: progress is only saved once Supabase is connected.',
    'bur.legal.proactive': 'Proactive',
    'bur.legal.epoa.title': 'Durable power of attorney',
    'bur.legal.epoa.body':
      'Signed while the person is lucid and competent. They choose in advance who will make decisions for them and in which areas. No ongoing oversight or routine reports — preserves sovereignty and dignity.',
    'bur.legal.reactive': 'Reactive',
    'bur.legal.guard.title': 'Guardianship',
    'bur.legal.guard.body':
      'A coerced court process after loss of capacity. Strips autonomy, with general-guardian oversight and periodic reports. Needed when a power of attorney was not prepared in advance.',
    'bur.ni.title': 'National Insurance — general mental disability',
    'bur.ni.badge': 'Form 7801',
    'bur.ni.intro':
      'A 9–12 month process. Success depends on a complete document set before the medical committee is convened.',
    'bur.ni.psych.label': 'Psychiatric assessment (medical appendix)',
    'bur.ni.psych.hint':
      'Details diagnosis per section 33/34 and functional impact. Mandatory — signed by a specialist psychiatrist.',
    'bur.ni.discharge.label': 'Discharge summaries and ER reports',
    'bur.ni.discharge.hint':
      'Demonstrate critical events and crisis history over the years.',
    'bur.ni.waiver.label': 'Signed confidentiality waiver',
    'bur.ni.waiver.hint': 'Without it the claim will not be opened.',
    'bur.ni.income.label': 'Income documents (15 months of pay slips / tax assessments)',
    'bur.ni.income.hint': 'Proof of impaired earning capacity.',
    'bur.ni.comorbid.label': 'Certificates for additional physical disabilities',
    'bur.ni.comorbid.hint':
      'Combine into the weighted disability calculation — critical for crossing the 40% threshold.',
    'bur.ni.submit.label': 'Submit the claim on the National Insurance website',
    'bur.ni.submit.hint': 'Online submission speeds up intake.',
    'bur.rehab.title': 'Rehabilitation basket — Ministry of Health',
    'bur.rehab.badge': '40% disability and above',
    'bur.rehab.intro':
      'A person with 40%+ mental disability in regular psychiatric follow-up is entitled to a rehabilitation basket: housing, employment, mentor, family support.',
    'bur.rehab.note':
      'Can only be submitted after receiving 40% disability or more.',
    'bur.rehab.coord.label': 'Contact the district rehab coordinator',
    'bur.rehab.coord.hint':
      'Via a social worker at the HMO / hospital / community framework.',
    'bur.rehab.form.label': 'Fill the application + confidentiality waiver',
    'bur.rehab.form.hint': 'Attach the eligibility letter from National Insurance.',
    'bur.rehab.committee.label': 'Attend the rehab committee with a companion',
    'bur.rehab.committee.hint':
      'Bring a family member to describe day-to-day functioning.',
    'bur.rehab.choice.label': 'Choose a framework (housing / employment / mentoring)',
    'bur.rehab.choice.hint': 'Visit each option before deciding.',
    'bur.legal.title': 'Legal preparation',
    'bur.legal.badge': 'Advance planning',
    'bur.legal.intro':
      'The legal tools that protect the person and the family — critical to activate during stable periods, not in crisis.',
    'bur.legal.epoa-discussed.label':
      'Family conversation about durable power of attorney',
    'bur.legal.epoa-discussed.hint':
      'Advance planning during a remission period — before intervention is required.',
    'bur.legal.epoa-signed.label': 'Durable power of attorney completed',
    'bur.legal.epoa-signed.hint':
      'Signed with a licensed attorney and registered with the General Guardian.',
    'bur.legal.lawyer.label': 'Legal contact for emergencies',
    'bur.legal.lawyer.hint':
      'An attorney familiar with the Treatment of Mental Patients Law (5751-1991).',

    'bur.situation.firstHosp.title': 'First hospitalization',
    'bur.situation.firstHosp.badge': 'What to do right now',
    'bur.situation.firstHosp.intro':
      'A first hospitalization is destabilizing. These steps keep an organized record that will support everything that follows.',
    'bur.firstHosp.familyLetter.label': 'Start a chronological family letter',
    'bur.firstHosp.familyLetter.hint':
      'Dates, behavior, statements, sleeplessness — every documented detail strengthens the record.',
    'bur.firstHosp.discharge.label': 'Collect hospitalization summaries and ER reports',
    'bur.firstHosp.discharge.hint':
      'Ask for written copies — you will need them both for future care and for the disability claim.',
    'bur.firstHosp.waiver.label': 'Sign the confidentiality waiver',
    'bur.firstHosp.waiver.hint':
      'Lets family members talk to the treating team and receive information.',
    'bur.firstHosp.psychiatrist.label': 'Find a community-based treating psychiatrist',
    'bur.firstHosp.psychiatrist.hint':
      'Via the HMO or community framework — schedule a visit immediately after discharge.',

    'bur.situation.discharge.title': 'Discharge from hospital',
    'bur.situation.discharge.badge': 'Care continuity',
    'bur.situation.discharge.intro':
      'The first days after discharge are the most important. Secure medication continuity, follow-up care, and rights.',
    'bur.discharge.summary.label': 'Receive the written discharge summary',
    'bur.discharge.summary.hint':
      'Without it you cannot renew medications or schedule follow-up care.',
    'bur.discharge.followup.label': 'Schedule a psychiatric follow-up within 14 days',
    'bur.discharge.followup.hint':
      'The risk of re-hospitalization is highest in the first two weeks.',
    'bur.discharge.meds.label': 'Medication continuity — prescriptions at the HMO',
    'bur.discharge.meds.hint':
      'Request a full month\'s prescription before the existing supply runs out.',
    'bur.discharge.rehab.label': 'Check rehabilitation basket eligibility (once 40%+ disability)',
    'bur.discharge.rehab.hint':
      'If you already have a disability rating — contact the district rehab coordinator.',
    'bur.discharge.work.label': 'Notify the workplace / school',
    'bur.discharge.work.hint':
      'Explain recovery period and temporary limitations, accompanied by a physician note.',

    'bur.situation.deterioration.title': 'Deterioration',
    'bur.situation.deterioration.badge': 'Immediate action',
    'bur.situation.deterioration.intro':
      'When the metrics are trending wrong — do not wait. These steps put you in the best position for fast help.',
    'bur.deter.emergency.label': 'Open the Emergency screen now',
    'bur.deter.emergency.hint':
      'The decision tree will identify which route is needed: 100 / 101 / district psychiatrist.',
    'bur.deter.team.label': 'Contact the community treating team',
    'bur.deter.team.hint':
      'Updating the treating psychiatrist before escalation sometimes prevents hospitalization.',
    'bur.deter.golden.label': 'Update the Triage record with current meds and info',
    'bur.deter.golden.hint':
      'If you do reach the ER — the record saves precious time for the team.',
    'bur.deter.familyLetter.label': 'Start an updated family letter',
    'bur.deter.familyLetter.hint':
      'Chronological log of recent events, needed by the district psychiatrist.',

    'bur.situation.disability.title': 'Disability tag & pension',
    'bur.situation.disability.badge': 'National Insurance + rehab basket',
    'bur.situation.disability.intro':
      'A 9–12 month process. Success depends on a complete document set before the medical committee is convened.',
    'bur.disability.psych.label': 'Psychiatric assessment (medical appendix)',
    'bur.disability.psych.hint':
      'Details diagnosis per section 33/34 and functional impact. Mandatory — signed by a specialist psychiatrist.',
    'bur.disability.discharge.label': 'File of hospitalization summaries and ER reports',
    'bur.disability.discharge.hint':
      'Demonstrate critical events and crisis history over the years.',
    'bur.disability.waiver.label': 'Signed confidentiality waiver',
    'bur.disability.waiver.hint': 'Without it the claim will not be opened.',
    'bur.disability.income.label': 'Income documents (15 months of pay slips / tax assessments)',
    'bur.disability.income.hint': 'Proof of impaired earning capacity.',
    'bur.disability.comorbid.label': 'Certificates for additional physical disabilities',
    'bur.disability.comorbid.hint':
      'Combine into the weighted disability calculation — critical for crossing the 40% threshold.',
    'bur.disability.submit.label': 'Submit the claim on the National Insurance website',
    'bur.disability.submit.hint': 'Online submission speeds up intake.',
    'bur.disability.rehabCoord.label':
      'Contact the district rehab coordinator (after approval)',
    'bur.disability.rehabCoord.hint':
      'Via a social worker at the HMO / hospital / community framework.',
    'bur.disability.rehabForm.label':
      'Fill the rehab basket application + confidentiality waiver',
    'bur.disability.rehabForm.hint':
      'Attach the eligibility letter from National Insurance.',
    'bur.disability.rehabCommittee.label': 'Attend the rehab committee with a companion',
    'bur.disability.rehabCommittee.hint':
      'Bring a family member to describe day-to-day functioning.',
    'bur.disability.rehabChoice.label': 'Choose a rehab framework',
    'bur.disability.rehabChoice.hint':
      'Housing / employment / mentoring — visit each option before deciding.',

    'bur.situation.planning.title': 'Advance planning',
    'bur.situation.planning.badge': 'During stable times',
    'bur.situation.planning.intro':
      'The legal tools that protect the person and the family — activate them during stable periods, not in crisis.',
    'bur.planning.epoaTalk.label': 'Family conversation about durable power of attorney',
    'bur.planning.epoaTalk.hint':
      'Advance planning during a remission period — before intervention is required.',
    'bur.planning.epoaSigned.label': 'Durable power of attorney completed',
    'bur.planning.epoaSigned.hint':
      'Signed with a licensed attorney and registered with the General Guardian.',
    'bur.planning.lawyer.label': 'Legal contact for emergencies',
    'bur.planning.lawyer.hint':
      'An attorney familiar with the Treatment of Mental Patients Law (5751-1991).',

    'legal.kicker': 'Legal & financial shield',
    'legal.title': 'Legal protection in a crisis',
    'legal.intro':
      "When a crisis escalates, urgent legal action may be needed to prevent irreversible harm — temporary guardianship, blocking credit, or an exit ban. Here you can prepare court filings and find a specialized attorney. This is not legal advice.",
    'legal.disclaimer':
      'These templates are an aid, not a substitute for legal counsel. Every filing should be reviewed by an attorney specializing in mental-health law and adapted to your local court rules. File only after counsel has approved the wording.',

    'legal.actions.title': 'Available actions',
    'legal.actions.cta': 'Fill in',

    'legal.template.guardianship_property.kicker': 'Guardianship',
    'legal.template.guardianship.summary':
      'Urgent application to appoint a temporary property guardian when the respondent cannot manage their financial affairs and their actions are causing ongoing harm.',
    'legal.template.block_finance.kicker': 'Credit freeze',
    'legal.template.blockFinance.summary':
      'Interim order to bank & credit providers limiting withdrawals and freezing credit lines until stabilization.',
    'legal.template.exit_ban.kicker': 'Exit ban',
    'legal.template.exitBan.summary':
      'Application to bar exit from the country when there is real concern the respondent intends to leave while unstable.',

    'legal.form.kicker': 'Prepare an urgent application',
    'legal.form.preview': 'Show print preview',
    'legal.form.patientSection': 'Respondent details',
    'legal.form.patientName': 'Full name',
    'legal.form.patientId': 'National ID',
    'legal.form.patientAddress': 'Address',
    'legal.form.applicantSection': 'Applicant details',
    'legal.form.applicantName': 'Full name',
    'legal.form.applicantId': 'National ID',
    'legal.form.applicantRelation': 'Relation to respondent',
    'legal.form.applicantRelationPlaceholder': 'e.g. mother, brother, spouse',
    'legal.form.applicantPhone': 'Mobile phone',
    'legal.form.applicantAddress': 'Address',
    'legal.form.incidentSection': 'Incident',
    'legal.form.incidentDate': 'Incident / onset date',
    'legal.form.incidentSummary': 'Brief factual summary',
    'legal.form.incidentSummaryHint':
      'What happened, since when, who was present. Facts, not feelings — the court reads facts.',
    'legal.form.riskDescription': 'Specific present risk',
    'legal.form.riskDescriptionHint':
      'What ongoing harm has occurred or is expected without urgent intervention (financial, physical, departure).',
    'legal.form.evidence': 'Evidence to be submitted',
    'legal.form.evidenceHint':
      'List of attached documents (medical summaries, bank statements, communications).',
    'legal.form.requestedRelief': 'Requested relief (optional — leave blank for default text)',
    'legal.form.requestedReliefHint':
      'You can tailor the interim orders to your specific circumstances.',

    'legal.printable.print': 'Print / Save as PDF',
    'legal.printable.dateLabel': 'Date',
    'legal.printable.signatureLabel': 'Respectfully,',
    'legal.printable.idLabel': 'ID',
    'legal.printable.signatureLine': 'Signature: ____________________',
    'legal.printable.disclaimer':
      'This document is a draft prepared by the applicant via Matzpen. It is not legal advice. Have it reviewed by an attorney before filing.',

    'legal.lawyers.title': 'Mental-health attorneys',
    'legal.lawyers.filters': 'Filter',
    'legal.lawyers.region': 'Region',
    'legal.lawyers.allRegions': 'All regions',
    'legal.lawyers.specialty': 'Specialty',
    'legal.lawyers.allSpecialties': 'All specialties',
    'legal.lawyers.proBonoOnly': 'Pro bono only',
    'legal.lawyers.proBonoTag': 'Pro bono',
    'legal.lawyers.feeUnit': 'initial consultation',
    'legal.lawyers.website': 'Website',
    'legal.lawyers.empty': 'No matches for these filters. Try broadening.',
    'legal.lawyers.disclaimer':
      'Listed for reference only. Matzpen has no affiliation with these attorneys and this is not a recommendation. Confirm fees and standing with the firm before retaining.',
    'legal.lawyers.sampleBadge': 'sample data',
    'legal.lawyers.sampleBannerKicker': 'Warning: this list is not real',
    'legal.lawyers.sampleBannerBody':
      'The entries in the lawyer directory are placeholder data only. The phone numbers are inactive. Do not dial them in a crisis. A real list will be added in the future — for now reach out via the Israel Bar Association, ENOSH, or OZMA.',
    'legal.lawyers.specialty.guardianship': 'Guardianship',
    'legal.lawyers.specialty.involuntary': 'Involuntary commitment & boards',
    'legal.lawyers.specialty.criminal_mental_health': 'Criminal mental-health',
    'legal.lawyers.specialty.national_insurance': 'National Insurance',
    'legal.lawyers.specialty.rehab_basket': 'Rehab basket',
    'legal.lawyers.specialty.financial_protection': 'Financial protection',

    'hosp.kicker': 'Hospitalization & alternatives',
    'hosp.title': 'Where to turn right now',
    'hosp.intro':
      'When you decide hospitalization or intensive intervention is needed, time and distance matter. This page shows psychiatric hospitals nearest to your region, plus alternative-care options and day-hospitals.',
    'hosp.disclaimer':
      'Phone numbers are public information and may change. Verify on the hospital website before calling in a crisis. In a life-threatening emergency, 101 (MDA) or 100 (police) is always preferable to driving yourself.',
    'hosp.regionPicker': 'Region',
    'hosp.regionHint': "We didn't find a saved region in the medical record.",
    'hosp.regionHintCta': 'Add a region to the record',
    'hosp.clearRegion': 'Clear',
    'hosp.tab.hospitals': 'Psychiatric hospitals',
    'hosp.tab.alternative': 'Alternative care & day hospitals',
    'hosp.nearbyHeading': 'In your area',
    'hosp.otherHeading': 'Other regions',
    'hosp.allHeading': 'All psychiatric hospitals',
    'hosp.callSwitchboard': 'Switchboard',
    'hosp.callER': 'ER',
    'hosp.openWaze': 'Open in Waze',
    'hosp.openMaps': 'Open in Google Maps',
    'hosp.website': 'Hospital website',
    'hosp.tag.psychER': '24/7 psychiatric ER',
    'hosp.tag.noPsychER': 'No psych ER — admission by coordination',
    'hosp.tag.minors': 'Accepts minors',
    'hosp.tag.commitment': 'Authorized for civil commitment',
    'hosp.tag.unverified': 'Unverified',
    'hosp.unverifiedNotice':
      "Details have not been verified against the hospital's official site recently. Confirm the phone number before calling in a crisis — numbers change.",
    'hosp.altFilter.all': 'All',
    'hosp.altFilter.balancing': 'Balancing homes',
    'hosp.altFilter.day': 'Day hospitals',
    'hosp.altEmpty': 'No alternative care matches this filter.',
    'hosp.altAI.title': 'Ask the assistant',
    'hosp.altAI.body':
      'The assistant can help check availability, HMO fit, and admission criteria before you call.',
    'hosp.altAI.cta': 'Find balancing homes that fit',
    'hosp.altAIPromptRegion':
      'I am looking for a balancing home or psychiatric day hospital in the {{region}} area that fits our HMO. Which options are currently available and who should I call first?',
    'hosp.altAIPromptGeneric':
      'I am looking for a balancing home or psychiatric day hospital that fits our HMO. Which options are currently available and who should I call first?',

    'altCare.kind.balancing_home': 'Balancing home',
    'altCare.kind.day_hospital': 'Day hospital',
    'altCare.capacity': 'Up to {{n}} spots',
    'altCare.dailyCost': 'Approx. daily cost',
    'altCare.notAccepted': 'Not a fit for:',
    'altCare.funding.kupat_holim': 'Covered by HMO',
    'altCare.funding.rehab_basket': 'Via rehab basket',
    'altCare.funding.private': 'Private',
    'altCare.funding.subsidized': 'Subsidized / sliding',

    'cases.kicker': 'Case studies',
    'cases.title': 'How other families coped',
    'cases.intro':
      "Anonymized scenarios other families lived through — what worked, what they'd do differently. Treat these as orientation, not a treatment plan. Every case is unique.",
    'cases.disclaimer':
      'These stories are educational composites based on caregiver reports and open literature. They are not a substitute for psychiatric or legal counsel, and what worked for one family may not work for another.',
    'cases.filters': 'Filters',
    'cases.diagnosis': 'Diagnosis',
    'cases.age': 'Age',
    'cases.trigger': 'Trigger',
    'cases.allDiagnoses': 'All diagnoses',
    'cases.allAges': 'All ages',
    'cases.allTriggers': 'All triggers',
    'cases.count': '{{n}} matching cases',
    'cases.empty': 'No cases match. Try broadening filters.',
    'cases.clearFilters': 'Clear filters',
    'cases.situation': 'Situation',
    'cases.action': 'Action taken',
    'cases.takeaway': 'Key takeaway',
    'cases.durationLabel': 'Treatment duration',
    'cases.diagnosis.bipolar_mania': 'Mania (Bipolar 1)',
    'cases.diagnosis.bipolar_depression': 'Bipolar depression',
    'cases.diagnosis.psychotic_break': 'Psychotic break',
    'cases.diagnosis.postpartum_psychosis': 'Postpartum psychosis',
    'cases.diagnosis.major_depression': 'Major depression',
    'cases.diagnosis.suicidality_crisis': 'Suicidality crisis',
    'cases.diagnosis.eating_disorder': 'Eating disorder',
    'cases.age.adolescent': 'Adolescent (13–17)',
    'cases.age.young_adult': 'Young adult (18–29)',
    'cases.age.adult': 'Adult (30–55)',
    'cases.age.older_adult': 'Older adult (55+)',
    'cases.trigger.med_noncompliance': 'Medication non-compliance',
    'cases.trigger.sleep_disruption': 'Sleep disruption',
    'cases.trigger.substance_use': 'Substance use',
    'cases.trigger.major_life_event': 'Major life event',
    'cases.trigger.postpartum': 'Postpartum',
    'cases.trigger.unknown': 'Unknown',

    'trend.kicker': 'Last two weeks',
    'trend.title': 'Sleep, mood, meds · {{days}} days',
    'trend.empty': "Not enough daily logs to draw a trend yet. Log for a few days and the chart will appear here.",
    'trend.legend.sleep': 'Sleep',
    'trend.legend.missed': 'Missed meds',
    'trend.today': 'Today',

    'refill.kicker': 'Refill reminder',
    'refill.overdue':
      'Refill date was {{date}} ({{n}} days ago). Sudden discontinuation is a known relapse trigger — call the pharmacist or psychiatrist now.',
    'refill.dueToday': 'Refill is due today ({{date}}).',
    'refill.upcoming': 'Refill is due on {{date}} (in {{n}} days).',
    'refill.updateCta': 'Update date',

    'postDischarge.kicker': 'First 30 days',
    'postDischarge.title': 'Post-discharge timeline',
    'postDischarge.intro':
      'The first month after admission carries the highest re-admit risk. The checklist is organized by phase — check off what is already done.',
    'postDischarge.bannerBody': 'Day {{day}} after discharge — check the tasks for this phase.',
    'postDischarge.bannerCta': 'Open timeline',
    'postDischarge.dischargeOn': 'Discharge date: {{date}}',
    'postDischarge.dayLabel': 'Day {{day}}',
    'postDischarge.progress': '{{done}} of {{total}} done',
    'postDischarge.currentPhase': 'Current phase',
    'postDischarge.pastPhase': 'Complete',
    'postDischarge.disclaimer':
      'This checklist does not replace your discharge instructions. Follow the treating team. It is a memory aid for what to ask and when to schedule.',
    'postDischarge.noDate.title': 'No discharge date saved',
    'postDischarge.noDate.body':
      'Add the discharge date to the medical record to get a timeline anchored to the days since.',
    'postDischarge.noDate.cta': 'Update medical record',
    'postDischarge.phase.day0.title': 'Day 0–2',
    'postDischarge.phase.day0.intent': 'A safe arrival home',
    'postDischarge.phase.day3.title': 'Day 3–6',
    'postDischarge.phase.day3.intent': 'Building routine',
    'postDischarge.phase.day7.title': 'Day 7–13',
    'postDischarge.phase.day7.intent': 'First outpatient visit',
    'postDischarge.phase.day14.title': 'Day 14–20',
    'postDischarge.phase.day14.intent': 'Refills and second visit',
    'postDischarge.phase.day21.title': 'Day 21–29',
    'postDischarge.phase.day21.intent': 'Gradual return to function',
    'postDischarge.phase.day30.title': 'Day 30+',
    'postDischarge.phase.day30.intent': 'Wrap-up and next plan',
    'postDischarge.item.dischargeSummary': 'Collect discharge summary (printed + digital).',
    'postDischarge.item.meds7day': 'Verify 7-day medication supply at home.',
    'postDischarge.item.bookNextAppt': 'Book first follow-up (community psychiatrist) within 7 days.',
    'postDischarge.item.homeSafety': 'Walk through the home — remove dangerous items.',
    'postDischarge.item.homeSafetyHint':
      'Meds locked, firearm out of the home, alcohol limited.',
    'postDischarge.item.followUpConfirmed': 'Confirm the psychiatrist appointment by phone.',
    'postDischarge.item.familyRoutine':
      'Assign family roles (who drives to the appointment, who handles meds).',
    'postDischarge.item.sleepLogged': 'Daily log in Matzpen for 3 consecutive days.',
    'postDischarge.item.firstOutpatient': 'First outpatient visit happened.',
    'postDischarge.item.escalationScript': "If the visit didn't happen — run the escalation script.",
    'postDischarge.item.escalationScriptHint':
      'Call the district psychiatrist. Say: "discharged on X, no follow-up booked." They will help arrange an urgent slot.',
    'postDischarge.item.sideEffects': 'Log side effects from any new medication.',
    'postDischarge.item.refillScheduled': "Next refill date set and updated in Matzpen.",
    'postDischarge.item.secondVisit': 'Book second follow-up (day 21–30).',
    'postDischarge.item.communityReengage': 'Gradual return to support groups / clubs.',
    'postDischarge.item.sickLeave': 'Submit sick-leave paperwork to employer / school.',
    'postDischarge.item.insuranceClaim':
      'Open a National Insurance file if relevant (form 7801).',
    'postDischarge.item.returnPlan': 'Plan a gradual return to work / studies with the treating team.',
    'postDischarge.item.threeMonthReview': 'Book a 3-month review.',
    'postDischarge.item.familyDebrief': 'Family debrief: what worked, what we would do differently.',
    'postDischarge.item.warningSignsUpdated': 'Update personal warning signs in the record.',

    'safety.kicker': 'Home safety',
    'safety.title': 'Restricting access to lethal means',
    'safety.intro':
      'In crisis, reducing access to items that could be used for self-harm is the single most-proven suicide-prevention action. The conversation is hard — and that is OK. This page covers what to do and how to talk about it without losing trust.',
    'safety.why.title': 'Why this works',
    'safety.why.body':
      'Consistent research shows that reducing access to lethal means lowers mortality — even without additional treatment. Suicidal moments usually pass within hours; if the means are not at hand at that moment, most people survive.',
    'safety.scriptLabel': 'What you can say',
    'safety.item.meds': 'Medications',
    'safety.item.medsBody':
      'Store all medication (including pain-killers, sleep aids, antidepressants) in a locked cabinet. Only one adult holds the key. Take old / unused meds out of the home.',
    'safety.item.medsScript':
      "I'm putting the meds in a locked cabinet for the next month — not because I don't trust you, but because in a crisis this is basic. I will help you take them every morning.",
    'safety.item.firearms': 'Firearms',
    'safety.item.firearmsBody':
      'If there is a firearm in the home — store it with a relative, a responsible neighbor, or at the police station. License holders can request temporary storage with their licensing provider. If immediate removal is not possible — lock with a different lock from the ammunition.',
    'safety.item.firearmsScript':
      "Your firearm will stay with [name] for a few weeks. As soon as you are back to yourself we will bring it back. I want you to be safe.",
    'safety.item.sharps': 'Knives and sharp objects',
    'safety.item.sharpsBody':
      'During acute suicidality — remove large knives, razor blades, and long cords from immediate reach. You do not need a "sterile home" — just move the specific items the treating team flagged.',
    'safety.item.car': 'Car and keys',
    'safety.item.carBody':
      'If your loved one drives during an unstable episode — keep keys in a locked drawer or on you. Unsafe driving is a real-world trigger.',
    'safety.item.disposal': 'Disposing of leftover medication',
    'safety.item.disposalBody':
      'Pharmacies at the HMOs accept unused medication for safe disposal. Do not throw in household trash or down the toilet. Removing surplus meds materially lowers risk.',
    'safety.crisis.title': 'If risk appears immediate',
    'safety.crisis.body':
      "If your loved one mentioned self-harm or suicide, or you found hidden meds or a knife — don't wait. Call 101.",
    'safety.crisis.callMDA': 'Call 101 (MDA)',
    'safety.crisis.callEran': 'Call 1201 (ERAN)',
    'safety.crisis.openEmergency': 'Open emergency',
    'safety.disclaimer':
      'This page is based on open suicide-prevention guidance (Means Matter, Israeli Ministry of Health). Not clinical advice. If risk is immediate — calling 101 comes first.',

    'whenWell.kicker': "When they're well — who is my person",
    'whenWell.heading': "Who they are when they're well",
    'whenWell.intro':
      'A short document so the ER team or a new psychiatrist sees a person, not just a chart. Fill in once, print, take with you.',
    'whenWell.loves.label': 'What they love',
    'whenWell.loves.hint': 'Music, food, people, places — anything that calms or connects.',
    'whenWell.loves.placeholder': 'e.g. dogs, falafel, my grandmother, jazz',
    'whenWell.calms.label': 'What helps calm them',
    'whenWell.calms.hint': 'Things that help in tense moments — music, silence, holding a hand.',
    'whenWell.calms.placeholder': 'e.g. quiet music, going outside, a hug',
    'whenWell.neverSay.label': "What NEVER to say",
    'whenWell.neverSay.hint': 'Phrases or topics that escalate — important for ER staff.',
    'whenWell.neverSay.placeholder': 'e.g. "calm down!", "you\'re exaggerating", mention the ex',

    'gr.form.dates.kicker': 'Clinical dates (optional)',
    'gr.form.dischargeDate.label': 'Last discharge date',
    'gr.form.dischargeDate.hint': 'Anchors the post-discharge 30-day timeline.',
    'gr.form.nextRefillDate.label': 'Next refill date',
    'gr.form.nextRefillDate.hint': 'A reminder appears on the dashboard 3 days before.',

    'share.title': 'Share with the treating team',
    'share.kicker': 'Temporary share link',
    'share.intro':
      'Create a read-only link to the medical record. Send it to a psychiatrist or show in the ER. The link expires automatically at the time you choose and can be revoked manually any time.',
    'share.ttlLabel': 'Valid for',
    'share.ttl.24h': '24 hours',
    'share.ttl.7d': '7 days',
    'share.ttl.30d': '30 days',
    'share.createCta': 'Create link',
    'share.copy': 'Copy',
    'share.copied': 'Copied ✓',
    'share.revoke': 'Revoke',
    'share.expiresAt': 'Expires {{when}}',
    'share.disclaimer':
      'Anyone with the link can read the record. Send only to trusted addresses (psychiatrist, ER) and revoke when no longer needed.',
    'share.notConfigured': "Can't create a link — Supabase isn't configured.",
    'share.viewer.kicker': 'Medical record — view',
    'share.viewer.unnamed': 'Patient',
    'share.viewer.relationship': 'Primary caregiver: {{rel}}',
    'share.viewer.updated': 'Updated: {{when}}',
    'share.viewer.dischargeDate': 'Last discharge date',
    'share.viewer.empty': '—',
    'share.viewer.loading': 'Loading record…',
    'share.viewer.expiredTitle': 'Link no longer valid',
    'share.viewer.expiredBody': 'The link has expired, been revoked, or never existed. Ask the family for a new one.',
    'share.viewer.errorTitle': 'Failed to load record',
    'share.viewer.notConfigured': 'The service is not configured.',
    'share.viewer.disclaimer':
      'This record is for reference only. Not a substitute for a full medical record and not updated in real time.',

    'warRoom.kicker': 'War room',
    'warRoom.title': 'Coordinated crisis management',
    'warRoom.intro':
      "One place where the whole envelope sees the same thing: who's on shift, what needs doing, and who needs backup right now. Updates sync in real time.",
    'warRoom.disclaimer':
      'The war room is for family coordination, not a substitute for the treating team. In immediate danger call 100/101 first.',
    'warRoom.notConfigured': 'The war room is available only after connecting to Supabase.',
    'warRoom.tab.shifts': 'Shifts',
    'warRoom.tab.tasks': 'Tasks',
    'warRoom.tab.envelope': 'Envelope',

    'warRoom.shifts.heading': 'Observation shift board',
    'warRoom.shifts.startAt': 'Shift starts',
    'warRoom.shifts.endAt': 'Shift ends',
    'warRoom.shifts.note': 'Shift note (optional)',
    'warRoom.shifts.notePlaceholder': 'e.g. driving to therapy at 17:00',
    'warRoom.shifts.signUp': 'Sign up for shift',
    'warRoom.shifts.empty': 'No shifts yet. Who takes the first one?',
    'warRoom.shifts.activeNow': 'On shift now',
    'warRoom.shifts.unnamedMember': 'Family member',
    'warRoom.shifts.errorBadDate': 'Invalid date.',
    'warRoom.shifts.errorEndBeforeStart': 'End must be after start.',

    'warRoom.tasks.heading': 'Envelope task list',
    'warRoom.tasks.placeholder': 'New task (e.g. pick up medication)',
    'warRoom.tasks.add': 'Add',
    'warRoom.tasks.empty': 'No open tasks. Add the first one.',
    'warRoom.tasks.completed': 'Completed tasks ({{n}})',
    'warRoom.tasks.doneBy': 'Done · {{name}} · {{when}}',
    'warRoom.tasks.createdBy': 'Added · {{name}}',
    'warRoom.tasks.remove': 'Remove',

    'warRoom.backup.heading': 'Backup request',
    'warRoom.backup.sosCta': '⚡ I need backup — call for help',
    'warRoom.backup.activeBanner': 'Active backup request',
    'warRoom.backup.requestedBy': '{{name}} is asking for backup',
    'warRoom.backup.yoursWaiting': 'Your request is active — the family can see it',
    'warRoom.backup.confirmIntro':
      'The request will appear immediately for everyone currently connected to the war room. Use only when truly needed — keep the signal trustworthy.',
    'warRoom.backup.messageLabel': 'Message (optional)',
    'warRoom.backup.messagePlaceholder': 'e.g. need someone here in an hour',
    'warRoom.backup.send': 'Send request',
    'warRoom.backup.resolve': 'Resolved',
    'warRoom.backup.disclaimer':
      'Visible only to envelope members. Not a substitute for emergency services — for immediate danger call 101/100.',
    'push.sos.title': '⚡ Matzpen backup request',
    'push.sos.fallbackBody': 'Family member needs help now. Open the war room.',
    'push.optIn.body':
      'Enable push so you receive alerts even when the app is closed. Recommended for envelope owners.',
    'push.optIn.cta': 'Enable notifications',
    'push.optIn.denied':
      'Notifications are blocked for this browser. Open site settings and allow "Notifications" to enable.',

    'warRoom.envelope.heading': 'The envelope — who is with me',
    'warRoom.envelope.intro':
      'Add family and friends to the war room. Only envelope members can see shifts, tasks, and backup requests. They do NOT see your private daily log entries.',
    'warRoom.envelope.inviteCta': 'Create invite link',
    'warRoom.envelope.ownerTag': 'owner',
    'warRoom.envelope.disclaimer':
      'Anyone with the link can join the war room. Share only with people you trust, and revoke unused links.',

    'warRoom.envelope.join.title': 'Join the envelope',
    'warRoom.envelope.join.needsLogin':
      "Sign in or create an account to join. You'll be redirected back here automatically.",
    'warRoom.envelope.join.redeeming': 'Joining the war room…',
    'warRoom.envelope.join.ok': 'Joined successfully ✓',
    'warRoom.envelope.join.redirecting': 'Taking you to the war room…',
    'warRoom.envelope.join.errorTitle': 'This invite is no longer valid',
    'warRoom.envelope.join.notConfigured': 'The service is not configured.',
    'warRoom.envelope.join.backHome': 'Back home',

    'lockdown.kicker': 'Emergency protocol',
    'lockdown.title': 'Environment lockdown',
    'lockdown.intro':
      "When warning metrics climb, reducing access to high-risk items is the single thing the family can do right now. Check off each completed item — every envelope member sees the progress in real time.",
    'lockdown.disclaimer':
      "This is a family-coordination checklist, not a substitute for treatment. Even if everything is checked, when immediate danger appears, call 101/100 first.",
    'lockdown.progress': '{{done}} of {{total}} done',
    'lockdown.resetCta': 'Reset',
    'lockdown.resetConfirm': 'Reset the whole checklist?',
    'lockdown.doneBy': 'Done · {{name}} · {{when}}',
    'lockdown.category.access': 'Keys & vehicle access',
    'lockdown.category.finance': 'Credit, cash, finance',
    'lockdown.category.travel': 'Passport & departure',
    'lockdown.category.substances': 'Alcohol & medication',
    'lockdown.item.carKeys': 'Hide the car keys',
    'lockdown.item.carKeysHint': 'Include any spare in a magnetic case, coat pocket, or with a neighbor.',
    'lockdown.item.spareKeys': 'Hide all spare keys',
    'lockdown.item.homeKeys': 'House keys — make sure no one can slip out at night unnoticed',
    'lockdown.item.creditCards': 'Collect credit cards',
    'lockdown.item.creditCardsHint':
      "Include any additional cards. Consider freezing through the bank app before hiding.",
    'lockdown.item.idCard': 'Hide the national ID card',
    'lockdown.item.checkbook': 'Hide the checkbook',
    'lockdown.item.bankApps': 'Temporarily remove banking apps from the phone',
    'lockdown.item.bankAppsHint':
      'Especially apps that allow instant transfers (Bit, PayBox) or opening new credit lines.',
    'lockdown.item.passport': 'Hide the passport',
    'lockdown.item.driverLicense': 'Hide the driver license',
    'lockdown.item.alcohol': 'Remove alcohol from the home',
    'lockdown.item.oldMeds': 'Remove old / unused medication',
    'lockdown.item.oldMedsHint':
      'Pharmacies at the HMOs accept surplus meds for disposal. Keep only current treatment, locked.',
    'lockdown.banner.kicker': 'Warning metrics rising',
    'lockdown.banner.body':
      'An alert is active. Running the environment lockdown shortens the risk window.',
    'lockdown.banner.cta': 'Open lockdown protocol',
    'lockdown.followUp.title': 'Next steps',
    'lockdown.followUp.body':
      'Once the environment is locked, the complementary steps: urgent legal filings, shift coordination, and a safety review.',
    'lockdown.followUp.legalCta': 'Legal shield',
    'lockdown.followUp.warRoomCta': 'War room',
    'lockdown.followUp.safetyCta': 'Safety guide',

    'playbook.kicker': 'De-escalation playbook',
    'playbook.title': 'What to say when things heat up',
    'playbook.intro':
      "Communication scripts based on LEAP. The principle: validate the feeling without agreeing with the delusion. \"You sound terrified\" connects; \"yes, the neighbors really are listening\" confirms the delusion.",
    'playbook.disclaimer':
      "Scripts are starting points, not formulas. Read your person and adapt. Not clinical advice.",
    'playbook.leap.title': 'LEAP — in brief',
    'playbook.leap.body':
      'L — Listen actively, no argument over facts.\nE — Empathize — validate the feeling.\nA — Agree on shared goals (sleep, feel safe), not on the diagnosis.\nP — Partner — build a small shared step.',
    'playbook.allScenarios': 'All scenarios',
    'playbook.signsLabel': 'Signs to recognize',
    'playbook.doLabel': 'Do',
    'playbook.dontLabel': "Don't",
    'playbook.scriptLabel': 'Opening script',
    'playbook.scriptAltLabel': 'Alternative wording',
    'playbook.askAssistant.title': "Didn't find a matching scenario?",
    'playbook.askAssistant.body':
      'The assistant can help compose a tailored script for your specific situation right now.',
    'playbook.askAssistant.cta': 'Ask the assistant',
    'playbook.askAssistant.prompt':
      'I am dealing with a complex situation with my family member right now. Could you help me choose wording using the LEAP method?',

    'playbook.paranoid.title': 'Paranoid delusions',
    'playbook.paranoid.signs':
      "A feeling of being followed, belief that things are added to food, sudden distrust of relatives, closing windows and curtains.",
    'playbook.paranoid.do':
      "Validate the feeling (\"that sounds really frightening\"), keep a non-threatening physical distance, speak quietly and slowly, offer a small shared physical action (glass of water).",
    'playbook.paranoid.dont':
      "Don't argue facts. Don't laugh. Don't say \"calm down\" or \"there's nothing to worry about.\" Don't touch suddenly from behind.",
    'playbook.paranoid.script':
      "I hear you. I don't need to know exactly who's following — what matters to me is that you feel threatened. I'm here. Can we sit together for a minute?",
    'playbook.paranoid.scriptAlt':
      "I understand why you don't want to eat this now. That's fine. Maybe something else I prepared in front of you?",

    'playbook.grandiosity.title': 'Grandiosity',
    'playbook.grandiosity.signs':
      "Big business plans, expensive purchases, sense of mission, unusual confidence, fast speech, no sleep but no distress about it.",
    'playbook.grandiosity.do':
      "Show interest without confirming the story. Focus on one small step (\"let's talk about what you want to do tomorrow\"). Redirect to a calming activity (nature, music).",
    'playbook.grandiosity.dont':
      "Don't confront the big idea. Don't say \"you're not thinking clearly.\" Don't try to sign financial agreements right now.",
    'playbook.grandiosity.script':
      "I hear a big idea and it feels very real to you. Let's do one small thing together today — get at least 5-6 hours of sleep, and tomorrow we'll come back to the rest.",
    'playbook.grandiosity.scriptAlt':
      "Interesting idea. To do it well, it's worth checking with [trusted person] before investing. Can we wait two weeks?",

    'playbook.agitation.title': 'Agitation',
    'playbook.agitation.signs':
      "Pacing, yelling, slamming doors, sudden anger, inability to sit still.",
    'playbook.agitation.do':
      "Move kids and pets out of the room. Stand at an angle (not in front), with a free exit. Speak slowly. Offer simple options (\"water or a step outside?\"). Allow time.",
    'playbook.agitation.dont':
      "Don't raise your voice. Don't block the exit. Don't touch forcefully. Don't issue ultimatums (\"calm down or else…\").",
    'playbook.agitation.script':
      "I see there's a lot of pressure on you right now. I'm not going to talk about anything important. I'm just here. If you'd like, I'll step out for a minute and come back.",

    'playbook.refusalMeds.title': 'Refusing medication',
    'playbook.refusalMeds.signs':
      "Arguing about dosage, \"I don't need this anymore,\" hiding pills, blaming the doctor, mistrust of treatment.",
    'playbook.refusalMeds.do':
      "Listen first. Ask what's bothering them about it (\"which side effect are you feeling?\"). Offer to discuss with the doctor together. Mention a shared goal, not the diagnosis.",
    'playbook.refusalMeds.dont':
      "Don't say \"you must.\" Don't hide pills in food without their knowledge (kills trust permanently). Don't repeat \"you're sick and you need it.\"",
    'playbook.refusalMeds.script':
      "I hear that this medication is doing something unpleasant. Tell me exactly. I can schedule a meeting with the doctor and sit with you — and you can tell them yourself.",
    'playbook.refusalMeds.scriptAlt':
      "I understand the decision to stop. One ask — before stopping entirely, let's talk to the doctor together. So we don't miss something.",

    'playbook.suicidal.title': 'Suicidal thoughts',
    'playbook.suicidal.signs':
      "Talk of 'disappearing,' farewells, giving away belongings, searching methods, \"everyone would be better off without me,\" sudden calm after a period of distress.",
    'playbook.suicidal.do':
      "Ask directly (\"are you thinking of hurting yourself?\"). Listen without correcting. Remove lethal means from the home (meds, firearms, see /safety). Don't leave alone. Call 101.",
    'playbook.suicidal.dont':
      "Don't say \"don't be dramatic.\" Don't promise \"I won't tell anyone\" — if life is at risk, you must call. Don't leave the person alone.",
    'playbook.suicidal.script':
      "I hear you. I'm not going anywhere. We'll tell the doctor together. I'm with you.",

    'playbook.withdrawal.title': 'Withdrawal & deep depression',
    'playbook.withdrawal.signs':
      "Not getting out of bed, refusing food, stopping responding to phone, hygiene drop, \"I have no energy,\" silence.",
    'playbook.withdrawal.do':
      "Speak in short, positive, non-demanding sentences. Offer a tiny action (\"let's step to the window for a minute\"). Bring food and drink to the room. Touch only if welcomed.",
    'playbook.withdrawal.dont':
      "Don't say \"get up, there's no reason to be sad.\" Don't force conversation. Don't blast music or do \"treat yourself!\"",
    'playbook.withdrawal.script':
      "I know this is a terribly hard moment. I'm not expecting anything from you. I'm here, I'm bringing you water, and I'll stay nearby until you want something.",

    'pulse.kicker': 'How are YOU?',
    'pulse.title': 'A quick check — for you, not the person you care for',
    'pulse.intro':
      "One minute a day. Helps you remember you're a person too, and lets the rest of the envelope see if someone is burning out.",
    'pulse.notNow': 'Not now',
    'pulse.sleepLabel': 'How many hours did you sleep last night?',
    'pulse.moodLabel': 'How are you feeling?',
    'pulse.mood.1': 'Exhausted',
    'pulse.mood.2': 'Hard',
    'pulse.mood.3': 'Middle',
    'pulse.mood.4': 'OK',
    'pulse.mood.5': 'Good',
    'pulse.noteLabel': "What's heaviest right now? (optional)",
    'pulse.notePlaceholder': 'Anything that helps you put it in words',
    'pulse.save': 'Save',
    'pulse.savedKicker': 'Saved',
    'pulse.savedBody': 'Thank you for taking care of yourself too.',

    'burnout.kicker': 'Watch the envelope',
    'burnout.noSleep':
      '{{name}} reported zero hours of sleep today. Worth checking on them and offering relief.',
    'burnout.solo48h':
      "{{name}} has been managing alone for 48 hours. The best time to jump in is now.",
    'burnout.selfCareCta': 'Support resources',
    'burnout.dismiss': 'Dismiss',

    'selfCare.kicker': 'A healthy envelope',
    'selfCare.title': 'Support for the caring family',
    'selfCare.intro':
      "A burned-out family can't help anyone. Here is a list of resources in Israel — for YOUR support, not the patient's.",
    'selfCare.why.title': 'Why this is essential',
    'selfCare.why.body':
      "Research shows that families caring for people with serious mental illness are at high risk for depression, anxiety, and burnout. Support for caregivers is part of the treatment — not an extra.",
    'selfCare.callCta': 'Call {{number}}',
    'selfCare.openCta': 'Open website',
    'selfCare.disclaimer':
      'Information is accurate to the best of our knowledge. Verify details on the organizations\' sites — they change.',
    'selfCare.enosh.title': 'ENOSH — family support groups',
    'selfCare.enosh.body':
      'The Israeli Mental Health Association runs regional family support groups. Free initial consultation.',
    'selfCare.ozma.title': 'OZMA — family-member forum',
    'selfCare.ozma.body':
      'OZMA is an organization of family members of mental-health patients. Provides counseling, support groups, and couples guidance.',
    'selfCare.eran.title': 'ERAN — emotional first aid',
    'selfCare.eran.body':
      "Anonymous 24/7 line. You can call for yourself — not just on behalf of your loved one.",
    'selfCare.yad_sarah.title': 'Yad Sarah — home assistance',
    'selfCare.yad_sarah.body':
      'Loans of medical equipment, in-home help, accessible transport — reduces daily load.',
    'selfCare.kupa_therapy.title': 'Psychological treatment for YOU via your HMO',
    'selfCare.kupa_therapy.body':
      'You are also entitled to treatment. Go to your GP and ask for a referral to a psychologist — for you, not the patient.',
    'selfCare.support_group.title': 'Online support group',
    'selfCare.support_group.body':
      'If you can\'t make it to an in-person group — search "family support mental health" on Facebook or via ENOSH/OZMA.',
    'selfCare.shareLoad.title': 'Share the load',
    'selfCare.shareLoad.body':
      "If envelope members aren't pitching in — invite them to the war room. Sharing shifts and tasks lifts the burden off the one person leading.",
    'selfCare.shareLoad.cta': 'Open war room',

    'vault.kicker': 'Secure vault',
    'vault.title': 'Behavioral evidence for clinicians',
    'vault.intro':
      "Video / audio / image records of unusual behavior. Useful for the district psychiatrist, ER, and treating psychiatrist — during a crisis the pattern isn't visible in clinic, and without evidence the decision is made on hearsay.",
    'vault.disclaimer':
      'Files are visible only to envelope members. Do not display publicly or share in chat groups. Intended for professionals only.',
    'vault.encryptionNote':
      'Files are encrypted at the server level (Supabase Storage), and access is via temporary signed links. There is no real client-side encryption — anyone with access to an envelope account can view the files. Make sure everyone you invite is truly in the envelope.',
    'vault.recorder.title': 'Record on your phone',
    'vault.recorder.audio': 'Audio',
    'vault.recorder.video': 'Video',
    'vault.recorder.start': '● Start recording',
    'vault.recorder.stop': '■ Stop & upload',
    'vault.recorder.maxLabel': '(max 5 minutes)',
    'vault.recorder.hint':
      "Microphone / camera permission required on first use. The recording isn't saved until you confirm at the next step.",
    'vault.upload.title': 'Or upload from gallery',
    'vault.upload.body': 'Pick an existing video, audio, or image from your phone or computer. Max 50MB.',
    'vault.upload.pick': 'Pick file',
    'vault.pending.title': 'Ready to upload',
    'vault.pending.newRecording': 'New recording',
    'vault.pending.captionLabel': 'Short caption (recommended — helps the clinician identify it fast)',
    'vault.pending.captionPlaceholder': 'e.g. euphoria and rapid speech, Tuesday evening',
    'vault.pending.save': 'Save to vault',
    'vault.items.heading': 'Files in the vault',
    'vault.items.empty': 'Vault is empty. Record or upload the first piece of evidence.',
    'vault.deleteConfirm': 'Delete this file? This cannot be undone.',

    'gr.vaultLink.title': 'Behavioral evidence for a clinician',
    'gr.vaultLink.body':
      'Add short videos or audio recordings of unusual behavior — useful for ER triage or a psychiatrist visit.',
    'gr.vaultLink.cta': 'Open vault',

    'assistant.starter.playbook': 'How do I talk to them when it heats up?',
    'assistant.playbookLink': 'Open de-escalation playbook →',

    'privacy.kicker': 'Transparency & trust',
    'privacy.title': 'Privacy & data security',
    'privacy.intro':
      "We understand this is especially sensitive information. This page explains where your data lives, who can see it, and how to delete an account.",
    'privacy.where.title': 'Where your data lives',
    'privacy.where.body':
      'Your data is stored in Supabase, a managed database service. All traffic is encrypted with TLS. There is no intermediate server — the app talks to Supabase directly.',
    'privacy.who.title': 'Who can see it',
    'privacy.who.body':
      'Only the signed-in account can see your check-ins. We do not share data with third parties, do not show ads, and do not use your data to train models.',
    'privacy.delete.title': 'Account deletion',
    'privacy.delete.body':
      'To delete your account and its data, email the address below — we will complete the deletion within 14 days.',
    'privacy.contactTitle': 'Get in touch',
    'privacy.contactBody': 'For questions, deletion requests, or bug reports:',
  },
};

export function translate(
  locale: Locale,
  key: string,
  vars?: Record<string, string | number>,
): string {
  const bundle = TRANSLATIONS[locale] ?? TRANSLATIONS.he;
  let str = bundle[key] ?? TRANSLATIONS.he[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = str.replace(new RegExp(`{{\\s*${k}\\s*}}`, 'g'), String(v));
    }
  }
  return str;
}
