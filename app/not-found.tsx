import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-12 md:py-20 text-center" dir="rtl">
      <div className="mz-card p-8 md:p-12">
        <div className="text-5xl mb-4" aria-hidden>
          ◐
        </div>
        <p className="text-xs font-bold uppercase tracking-widest text-ink-mute">
          404
        </p>
        <h1 className="text-2xl md:text-3xl font-extrabold mt-2">
          הדף שביקשת לא נמצא
        </h1>
        <p className="text-ink-mute mt-3 leading-relaxed">
          ייתכן שהקישור ישן או שגוי. נסי לחזור למסך הראשי או לעבור ישירות לחירום.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-7">
          <Link href="/" className="mz-btn mz-btn-clay">
            חזרה למסך הראשי
          </Link>
          <Link href="/emergency" className="mz-btn mz-btn-ghost">
            עזרה בחירום
          </Link>
        </div>
      </div>
    </div>
  );
}
