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
          <Link href="/about" className="text-ink-soft hover:text-ink transition-colors hidden sm:inline">
            אודות
          </Link>
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
          מצפן — ניהול משבר פסיכיאטרי
        </div>
        <div className="flex flex-wrap justify-center gap-5">
          <Link href="/privacy" className="hover:text-ink transition-colors">פרטיות</Link>
          <Link href="/terms" className="hover:text-ink transition-colors">תנאי שימוש</Link>
          <Link href="/about" className="hover:text-ink transition-colors">אודות</Link>
          <Link href="/organizations" className="hover:text-ink transition-colors">לארגונים</Link>
          <a href="mailto:feedback@matzpen.app" className="hover:text-ink transition-colors">משוב</a>
        </div>
      </div>
    </footer>
  );
}

const FEATURES = [
  {
    icon: '📊',
    title: 'מעקב יומי',
    body: 'כדקה ביום לתיעוד שינה, מצב רגשי ותרופות — המערכת מזהה מגמות וסימני הידרדרות לפני שהם מתפוצצים.',
  },
  {
    icon: '🚨',
    title: 'מצב חירום',
    body: 'עץ החלטה ברור לפסיכוזה, אובדנות ואלימות — מי לפנות, מה לומר, ומה הזכויות שלכם ברגע האמת.',
  },
  {
    icon: '📋',
    title: 'תיק למיון',
    body: 'מסמך אחד שמכיל אבחנה, תרופות, אלרגיות וסימני אזהרה — מוכן להדפסה ולחירום בכל רגע.',
  },
  {
    icon: '✨',
    title: 'מצפן AI',
    body: 'עוזר חכם שמסביר בירוקרטיה פסיכיאטרית, זכויות ביטוח לאומי ותהליכי אשפוז — בשפה של בני אדם.',
  },
];

const PRICING = [
  {
    name: 'חינם',
    sub: 'Beta',
    price: '₪0',
    period: 'לתמיד',
    color: 'border-sand-100',
    cta: 'התחילו עכשיו',
    ctaClass: 'mz-btn mz-btn-ghost',
    features: ['מעקב יומי', 'מצב חירום', 'תיק למיון', 'מצפן AI (20 שאלות/יום)'],
  },
  {
    name: 'פרמיום',
    sub: '',
    price: '₪49',
    period: 'לחודש',
    color: 'border-clay ring-2 ring-clay/20',
    cta: 'התחילו בחינם',
    ctaClass: 'mz-btn mz-btn-clay',
    badge: 'מומלץ',
    features: ['הכל בחינם +', 'מצפן AI ללא הגבלה', 'כלים מתקדמים (War Room, Lockdown)', 'שיתוף עם בני משפחה', 'תמיכה בעדיפות'],
  },
  {
    name: 'ארגוני',
    sub: '',
    price: 'צרו קשר',
    period: '',
    color: 'border-ink/20',
    cta: 'דברו איתנו',
    ctaClass: 'mz-btn mz-btn-ghost',
    features: ['הכל בפרמיום +', 'ניהול קבוצת מטפלים', 'דשבורד ארגוני', 'אינטגרציה עם מערכות קיימות', 'הדרכה ויישום'],
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-dvh flex flex-col bg-sand-50" dir="rtl">
      <PublicHeader />

      {/* Hero */}
      <section className="flex-1 flex items-center justify-center px-6 py-20 md:py-32 text-center">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-clay-bg text-clay text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            <span className="h-2 w-2 rounded-full bg-clay animate-pulse" />
            340 משפחות כבר משתמשות במצפן
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight text-ink">
            מרכז ניהול משבר
            <br />
            <span className="text-clay">למשפחות</span>
          </h1>
          <p className="mt-5 text-lg md:text-xl text-ink-soft leading-relaxed max-w-xl mx-auto">
            מעקב, חירום, תיק למיון וזכויות — במקום אחד, תמיד מוכן.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/login" className="mz-btn mz-btn-clay h-14 px-8 text-lg rounded-2xl">
              התחילו בחינם
            </Link>
            <Link href="/about" className="mz-btn mz-btn-ghost h-14 px-8 text-lg rounded-2xl">
              קראו עוד
            </Link>
          </div>
          <p className="mt-4 text-sm text-ink-mute">ללא כרטיס אשראי · Beta חינמית</p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-10">
            כל מה שצריך לצד אחד
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {FEATURES.map((f) => (
              <div key={f.title} className="mz-card p-6 flex gap-4">
                <div className="text-3xl shrink-0" aria-hidden>{f.icon}</div>
                <div>
                  <h3 className="font-bold text-lg text-ink">{f.title}</h3>
                  <p className="text-ink-soft mt-1 leading-relaxed text-sm">{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 px-6">
        <div className="max-w-xl mx-auto text-center">
          <div className="mz-card p-8">
            <div className="text-4xl mb-4" aria-hidden>❝</div>
            <blockquote className="text-lg text-ink leading-relaxed font-medium">
              בלילה שהבנתי שמשהו לא בסדר, פתחתי את מצפן ועברתי את עץ החלטות החירום.
              זה הוביל אותי בדיוק לאן שצריך בלי שידעתי מה לעשות לבד.
            </blockquote>
            <p className="mt-4 text-sm text-ink-mute">— בת זוג של אדם עם הפרעה דו-קוטבית, תל אביב</p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-3">
            מחיר שנגיש לכולם
          </h2>
          <p className="text-center text-ink-mute mb-10">בטא חינמית לחלוטין. פרמיום כשתהיו מוכנים.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PRICING.map((plan) => (
              <div key={plan.name} className={`mz-card p-6 flex flex-col border-2 ${plan.color} relative`}>
                {plan.badge && (
                  <span className="absolute -top-3 end-5 bg-clay text-white text-xs font-bold px-3 py-1 rounded-full">
                    {plan.badge}
                  </span>
                )}
                <div className="mb-4">
                  <div className="text-sm font-semibold text-ink-mute">{plan.name}</div>
                  {plan.sub && <div className="text-xs text-clay font-bold">{plan.sub}</div>}
                  <div className="text-3xl font-extrabold text-ink mt-1">
                    {plan.price}
                    {plan.period && <span className="text-base font-normal text-ink-mute"> /{plan.period}</span>}
                  </div>
                </div>
                <ul className="flex-1 space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-ink-soft">
                      <span className="text-sage mt-0.5">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/login" className={`${plan.ctaClass} text-center`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
