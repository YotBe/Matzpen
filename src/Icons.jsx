const I = ({ children, size = 22, stroke = 'currentColor', sw = 1.8 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={stroke}
    strokeWidth={sw}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

export const Icons = {
  Home: (p) => (
    <I {...p}>
      <path d="M3 11l9-7 9 7v9a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2v-9z" />
    </I>
  ),
  Plus: (p) => (
    <I {...p}>
      <path d="M12 5v14M5 12h14" />
    </I>
  ),
  Alert: (p) => (
    <I {...p}>
      <path d="M12 9v4M12 17h.01" />
      <path d="M10.3 3.86l-8.94 15.49A2 2 0 0 0 3.1 22h17.8a2 2 0 0 0 1.73-2.65L13.7 3.86a2 2 0 0 0-3.4 0z" />
    </I>
  ),
  Shield: (p) => (
    <I {...p}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </I>
  ),
  Scroll: (p) => (
    <I {...p}>
      <path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4" />
      <path d="M19 17V5a2 2 0 0 0-2-2H4" />
    </I>
  ),
  Users: (p) => (
    <I {...p}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </I>
  ),
  Moon: (p) => (
    <I {...p}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </I>
  ),
  Pill: (p) => (
    <I {...p}>
      <rect x="2" y="9" width="20" height="6" rx="3" transform="rotate(-45 12 12)" />
      <path d="M8.5 8.5l7 7" transform="rotate(-45 12 12)" />
    </I>
  ),
  Heart: (p) => (
    <I {...p}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
    </I>
  ),
  Phone: (p) => (
    <I {...p}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z" />
    </I>
  ),
  Check: (p) => (
    <I {...p}>
      <path d="M20 6L9 17l-5-5" />
    </I>
  ),
  ChevronL: (p) => (
    <I {...p}>
      <path d="M15 18l-6-6 6-6" />
    </I>
  ),
  ChevronR: (p) => (
    <I {...p}>
      <path d="M9 18l6-6-6-6" />
    </I>
  ),
  X: (p) => (
    <I {...p}>
      <path d="M18 6L6 18M6 6l12 12" />
    </I>
  ),
  Clock: (p) => (
    <I {...p}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </I>
  ),
  Mic: (p) => (
    <I {...p}>
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3" />
    </I>
  ),
  TrendUp: (p) => (
    <I {...p}>
      <path d="M22 7l-9 9-5-5-7 7" />
      <path d="M16 7h6v6" />
    </I>
  ),
  TrendDown: (p) => (
    <I {...p}>
      <path d="M22 17l-9-9-5 5-7-7" />
      <path d="M16 17h6v-6" />
    </I>
  ),
  Calendar: (p) => (
    <I {...p}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </I>
  ),
  Note: (p) => (
    <I {...p}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </I>
  ),
  Info: (p) => (
    <I {...p}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </I>
  ),
};
