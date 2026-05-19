'use client';

import Link from 'next/link';

function PublicHeader() {
  return (
    <header className="sticky top-0 z-30 bg-sand-50/90 backdrop-blur border-b border-ink/5">
      <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-xl text-ink">
          <span aria-hidden className="text-clay">◐</span>
          מצפן
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/about" className="text-clay font-semibold">אודות</Link>
          <Link href="/organizations" className="text-ink-soft hover:text-ink transition-colors hidden sm:inline">
            לארגונים
          </Link>
          <Link href="/login" className="mz-btn mz-btn-clay px-5 py-2 text-sm h-10">
            כניסה
          </Link>
        </div>
      </nav>
    </header>
  );
}

function PublicFooter() {
  return (
    <footer className="bg-white border-t border-ink/5 py-10 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-ink-mute">
        <div className="flex items-center gap-2 font-bold text-ink">
          <span aria-hidden className="text-clay">◐</span>
          מצפן
        </div>
        <div className="flex flex-wrap justify-center gap-5">
          <Link href="/privacy" className="hover:text-ink transition-colors">פרטיות</Link>
          <Link href="/terms" className="hover:text-ink transition-colors">תנאי שימוש</Link>
          <Link href="/" className="hover:text-ink transition-colors">דף הבית</Link>
          <Link href="/organizations" className="hover:text-ink transition-colors">לארגונים</Link>
        </div>
      </div>
    </footer>
  );
}

const VISION_ITEMS = [
  {
    year: '2025',
    title: 'שיתוף פעולה עם קופות חולים',
    body: 'אינטגרציה ישירה עם מערכות המידע של קופות החולים, כדי שהמטפלים יוכלו לקבל התראות בזמן אמת ולתאם טיפול ביתי.',
  },
  {
    year: '2026',
    title: 'אפליקציה מובייל נייטיב',
    body: 'אפליקציה ל-iOS ו-Android עם התראות push, תיעוד קולי מהיר, ותמיכה בשימוש אופליין — כי משברים לא מחכים לחיבור לאינטרנט.',
  },
  {
    year: '2028',
    title: 'התראות ניבוי מבוססות AI',
    body: 'מודל למידת מכונה שמנתח מגמות של שבועות וחודשים ומתריע למשפחה ולצוות הרפואי על הידרדרות צפויה — לפני שמגיע המשבר.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-dvh flex flex-col bg-sand-50" dir="rtl">
      <PublicHeader />

      {/* Hero */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-clay mb-3">אודות מצפן</p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            נבנה על ידי משפחה,
            <br />
            עבור משפחות
          </h1>
          <p className="mt-5 text-lg text-ink-soft leading-relaxed">
            כשהאדם שאתה אוהב נמצא במשבר פסיכיאטרי, המערכת לא נועדה עבורך.
            מצפן נועד לשנות זאת.
          </p>
        </div>
      </section>

      {/* Founder Story */}
      <section className="py-12 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Avatar */}
            <div className="shrink-0 flex flex-col items-center gap-3">
              <div className="h-24 w-24 rounded-full bg-clay/20 text-clay flex items-center justify-center text-2xl font-extrabold select-none">
                YB
              </div>
              <div className="text-center">
                <div className="font-bold text-ink text-sm">יוסי בן-דוד</div>
                <div className="text-xs text-ink-mute">מייסד מצפן</div>
              </div>
            </div>

            {/* Story */}
            <div className="flex-1 space-y-4 text-ink-soft leading-relaxed">
              <p>
                הסיפור של מצפן מתחיל בלילה אחד שבו הבנתי שאני לא יודע מה לעשות.
                בן משפחה קרוב — מישהו שאוהב בכל ליבי — היה במשבר פסיכיאטרי חריף.
                לחצתי כפתורים, חיפשתי בגוגל, ניסיתי להבין מה ההבדל בין הוראת בדיקה
                לאשפוז כפוי — בשלוש לפנות בוקר, לבד.
              </p>
              <p>
                גיליתי שאני לא לבד. מאות אלפי משפחות בישראל מתמודדות עם אותה חוסר
                הכוונה, אותם ניירת ביטוח לאומי בלתי נגמרת, ואותו רגע של "מה עושים
                עכשיו?" שאין לו תשובה מסודרת.
              </p>
              <p>
                בניתי את מצפן כי אני מאמין שמשפחה מיודעת, מוכנה ופחות בודדה — היא
                הגורם המשמעותי ביותר בדרך להחלמה. לא תרופה, לא אשפוז — אלא אדם
                אחד שיודע מה לעשות ברגע הנכון.
              </p>
              <p className="font-semibold text-ink">
                מצפן הוא הכלי שהייתי רוצה שיהיה לי באותו לילה.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision 2028 */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-sm font-bold uppercase tracking-widest text-clay mb-2">חזון 2028</p>
            <h2 className="text-3xl font-extrabold">לאן אנחנו הולכים</h2>
            <p className="text-ink-mute mt-3 max-w-lg mx-auto">
              מצפן הוא רק ההתחלה. הנה שלושה צעדים שאנחנו עובדים עליהם.
            </p>
          </div>

          <div className="space-y-4">
            {VISION_ITEMS.map((item, idx) => (
              <div key={item.year} className="mz-card p-6 flex gap-5">
                <div className="shrink-0 flex flex-col items-center gap-1">
                  <div className="h-10 w-10 rounded-full bg-clay/10 text-clay font-bold text-sm flex items-center justify-center">
                    {idx + 1}
                  </div>
                  <div className="text-[10px] font-semibold text-ink-mute">{item.year}</div>
                </div>
                <div>
                  <h3 className="font-bold text-ink">{item.title}</h3>
                  <p className="text-ink-soft text-sm mt-1 leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-6 bg-white text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-extrabold">הצטרפו אלינו</h2>
          <p className="text-ink-mute mt-3 leading-relaxed">
            כבר 340 משפחות סומכות על מצפן. הצטרפו בחינם וספרו לנו מה אתם צריכים.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Link href="/login" className="mz-btn mz-btn-clay h-12 px-8">
              התחילו בחינם
            </Link>
            <a href="mailto:feedback@matzpen.app" className="mz-btn mz-btn-ghost h-12 px-8">
              כתבו לנו
            </a>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
