## Matzpen Repository Structure

Next.js 14 (App Router) + TypeScript + Tailwind. Hebrew-first, RTL, Supabase-backed.

### Directory layout

```
Matzpen/
├── app/                       # Next.js App Router — routes, layout, global CSS
│   ├── layout.tsx             # Root layout: fonts, AuthProvider, AuthGate, Shell
│   ├── page.tsx               # Dashboard (daily log + alert banner)
│   ├── globals.css            # Tailwind base + design tokens
│   ├── login/                 # /login — email/password + Google OAuth
│   ├── emergency/             # /emergency — crisis mode UI
│   ├── golden-record/         # /golden-record — patient medical summary
│   └── bureaucracy/           # /bureaucracy — rights & paperwork checklists
│
├── components/                # Reusable client components
│   ├── AlertBanner.tsx        # Early-warning banner driven by recent logs
│   ├── AuthGate.tsx           # Redirects unauthenticated users to /login
│   ├── BottomNav.tsx          # Mobile bottom nav
│   ├── ConfigBanner.tsx       # "Supabase not configured" preview banner
│   ├── DailyLogForm.tsx       # Daily tracking form
│   ├── GoldenRecordDisplay.tsx
│   ├── GoldenRecordForm.tsx
│   ├── NavBar.tsx             # Desktop top nav
│   ├── Shell.tsx              # Page chrome wrapper
│   └── icons.tsx              # Inline SVG icons
│
├── context/
│   └── AuthContext.tsx        # Supabase auth state + sign-in/up/out helpers
│
├── lib/
│   ├── constants.ts           # Shared constants (currently MOCK_PATIENT_*)
│   ├── supabaseClient.ts      # Supabase client + `supabaseConfigured` flag
│   └── types.ts               # Domain types: DailyLog, GoldenRecord, etc.
│
├── services/
│   └── supabaseService.ts     # Data-access layer for daily_logs, checklists, golden_records
│
├── utils/
│   └── alertAlgorithm.ts      # Rule engine that turns logs into alert level
│
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── vercel.json
└── package.json
```

### Environment

`NEXT_PUBLIC_*` env vars are baked into the client bundle at **build time**.

Required:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Local dev: copy `.env.local.example` → `.env.local` and fill values, then `npm run dev`.
Vercel: set both vars under Project → Settings → Environment Variables, then **redeploy** (existing builds were compiled without them).

When the vars are absent the app runs in a read-only "preview" mode: `AuthGate` lets everything through, `DailyLogForm` simulates saves, and the dashboard shows `MOCK_LOGS`.

### Data model (Supabase tables)

- `daily_logs` — one row per caregiver submission. Columns referenced by code: `patient_id`, `date`, `sleep_hours`, `affective_state`, `psychomotor_speed`, `impulsivity_event`, `note`, `logged_by`, `logged_by_name`, `created_at`.
- `checklist_items` — bureaucracy progress. Unique on `(patient_id, section, item_key)`.
- `golden_records` — one row per patient. Unique on `patient_id`.

### Scripts

```bash
npm run dev        # next dev
npm run build      # next build
npm run start      # next start (after build)
npm run lint       # next lint
npm run typecheck  # tsc --noEmit
```
