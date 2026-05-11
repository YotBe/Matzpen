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
    'common.langName': 'EN',

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

    // ── Dashboard ──────────────────────────────────────────────────────────
    'dashboard.greeting': 'שלום, {{name}}',
    'dashboard.defaultName': 'בן/בת משפחה',
    'dashboard.title': 'דיווח מעקב יומי',
    'dashboard.subtitle':
      'המצפן של {{patient}} · המעקב היומי לוקח כדקה ועוזר לזהות סימני אזהרה מוקדמים.',
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
    'gr.cancelEdit': 'ביטול ושמירת הגרסה הקיימת',
    'gr.docHeader': 'תיק רפואי למיון',
    'gr.updated': 'עודכן: {{when}}',
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
    'common.langName': 'עב',

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

    'dashboard.greeting': 'Hello, {{name}}',
    'dashboard.defaultName': 'family member',
    'dashboard.title': 'Daily check-in',
    'dashboard.subtitle':
      "{{patient}}'s compass · the daily log takes about a minute and helps surface early warning signs.",
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
    'gr.cancelEdit': 'Cancel and keep the current version',
    'gr.docHeader': 'Triage medical file',
    'gr.updated': 'Updated: {{when}}',
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
