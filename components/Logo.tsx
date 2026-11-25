import Link from "next/link";

export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg
      className="logo-mark"
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="mb-g" x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2cf59b" />
          <stop offset="1" stopColor="#f7c548" />
        </linearGradient>
        <linearGradient id="mb-s" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#141b2a" />
          <stop offset="1" stopColor="#0a0e16" />
        </linearGradient>
      </defs>
      {/* Sköld */}
      <path
        d="M24 2.5 42.5 9v14.2c0 11.1-7.6 19.6-18.5 22.3C13.1 42.8 5.5 34.3 5.5 23.2V9L24 2.5Z"
        fill="url(#mb-s)"
        stroke="url(#mb-g)"
        strokeWidth="2"
      />
      {/* M som också är en stigande graf */}
      <path
        d="M13 32V17l6.5 8.5L24 19l4.5 6.5L35 15"
        stroke="url(#mb-g)"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M35 15v17" stroke="url(#mb-g)" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M30.5 14.5H35.5V19.5" stroke="#f7c548" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-3" aria-label="MBetting Tips, till startsidan">
      <LogoMark />
      <span className="font-display text-lg font-bold leading-none tracking-tight">
        <span className="text-white">MBetting</span>
        <span className="ml-1 bg-gradient-to-r from-win to-gold bg-clip-text text-transparent">Tips</span>
      </span>
    </Link>
  );
}
