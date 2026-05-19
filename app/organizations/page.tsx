'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';

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
          <Link href="/organizations" className="text-clay font-semibold">לארגונים</Link>
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
          <Link href="/about" className="hover:text-ink transition-colors">אודות</Link>
        </div>
      </div>
    </footer>
  );
}

const ORG_TYPES = [
  {
    icon: '🏥',
    title: 'קופות חולים',
    body: 'הפחיתו אשפוזים חוזרים בקרב מבוטחים עם הפרעות פסיכיאטריות. מצפן מזהה הידרדרות מוקדם ומנחה את המשפחה לפנות לטיפול לפני שמגיע המשבר.',
    highlight: 'חיסכון ממוצע של ₪28,000 לאשפוז שנמנע',
  },
  {
    icon: '🤝',
    title: 'עמותות (ענוש, ער"ן, ועוד)',
    body: 'תנו לאנשי הקשר שלכם כלי מעשי ומיידי. מצפן מגבר את הסיוע האנושי שאתם מספקים עם מידע, מעקב, וזמינות 24/7.',
    highlight: 'משלים את השירות האנושי שלכם',
  },
  {
    icon: '🏨',
    title: 'בתי חולים פסיכיאטריים',
    body: 'שפרו את ההמשכיות הטיפולית לאחר שחרור. מצפן עוקב אחרי 30 הימים הקריטיים ומעלה דגל כשהמשפחה מזהה נסיגה.',
    highlight: '30 ימים שמחוץ לבית חולים — הסיכון הגבוה ביותר',
  },
];

export default function OrganizationsPage() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSent(true);
      setSending(false);
    }, 800);
  }

  return (
    <div className="min-h-dvh flex flex-col bg-sand-50" dir="rtl">
      <PublicHeader />

      {/* Hero */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-clay mb-3">מצפן לארגונים</p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            הפחיתו אשפוזים חוזרים
            <br />
            <span className="text-clay">עד 30%</span>
          </h1>
          <p className="mt-5 text-lg text-ink-soft leading-relaxed max-w-2xl mx-auto">
            כשמשפחות מוכנות, הידרדרות מזוהה בזמן — ואשפוזים יקרים ומיותרים נמנעים.
          </p>
        </div>
      </section>

      {/* ROI Section */}
      <section className="py-12 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="mz-card p-8 md:p-10 border-s-4 border-clay">
            <div className="text-xs font-bold uppercase tracking-widest text-clay mb-3">חישוב ROI</div>
            <h2 className="text-2xl font-extrabold mb-4">כמה עולה אשפוז פסיכיאטרי?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-crimson-bg rounded-2xl">
                <div className="text-3xl font-extrabold text-crimson-deep">₪28,000</div>
                <div className="text-sm text-ink-mute mt-1">עלות ממוצעת לאשפוז</div>
              </div>
              <div className="text-center p-4 bg-amber_-bg rounded-2xl">
                <div className="text-3xl font-extrabold text-amber_-ink">47%</div>
                <div className="text-sm text-ink-mute mt-1">שיעור אשפוז חוזר תוך שנה</div>
              </div>
              <div className="text-center p-4 bg-sage-bg rounded-2xl">
                <div className="text-3xl font-extrabold text-sage">₪49/חודש</div>
                <div className="text-sm text-ink-mute mt-1">עלות מצפן למשפחה</div>
              </div>
            </div>
            <p className="mt-6 text-ink-soft leading-relaxed">
              מצפן עוזר למשפחות לזהות סימני הידרדרות מוקדם, לפנות לטיפול בזמן — ולמנוע את גלגל
              האשפוזים החוזרים שעולה למערכת הבריאות מאות מיליוני שקלים בשנה.
            </p>
          </div>
        </div>
      </section>

      {/* Org Types */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-10">
            לכל ארגון פתרון מותאם
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {ORG_TYPES.map((org) => (
              <div key={org.title} className="mz-card p-6 flex flex-col">
                <div className="text-3xl mb-3" aria-hidden>{org.icon}</div>
                <h3 className="font-bold text-lg text-ink mb-2">{org.title}</h3>
                <p className="text-ink-soft text-sm leading-relaxed flex-1">{org.body}</p>
                <div className="mt-4 bg-clay-bg text-clay text-xs font-semibold px-3 py-2 rounded-xl">
                  {org.highlight}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold">קבעו שיחת היכרות</h2>
            <p className="text-ink-mute mt-2">נשמח לספר לכם על האפשרויות המותאמות לארגון שלכם.</p>
          </div>

          {sent ? (
            <div className="mz-card p-8 text-center">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="font-bold text-xl text-ink">קיבלנו!</h3>
              <p className="text-ink-soft mt-2">ניצור איתכם קשר תוך יום עסקים.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mz-card p-6 md:p-8 space-y-4">
              <div>
                <label className="mz-field-label block mb-1.5">שם הארגון</label>
                <input
                  type="text"
                  required
                  placeholder="קופת חולים / עמותה / בית חולים"
                  className="mz-input"
                />
              </div>
              <div>
                <label className="mz-field-label block mb-1.5">איש קשר</label>
                <input
                  type="text"
                  required
                  placeholder="שם מלא ותפקיד"
                  className="mz-input"
                />
              </div>
              <div>
                <label className="mz-field-label block mb-1.5">טלפון</label>
                <input
                  type="tel"
                  required
                  placeholder="050-000-0000"
                  className="mz-input"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="mz-field-label block mb-1.5">הודעה (אופציונלי)</label>
                <textarea
                  rows={3}
                  placeholder="ספרו לנו קצת על הארגון ומה מחפשים…"
                  className="mz-input resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="mz-btn mz-btn-clay w-full h-12 text-base"
              >
                {sending ? 'שולח…' : 'קבעו שיחה'}
              </button>
            </form>
          )}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
