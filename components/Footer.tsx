import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-32 border-t border-line bg-panel/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-sm text-sm leading-relaxed text-mute">
            Analyser, speltips och diskussion om sport. Tipsen är mina egna bedömningar och ingen garanti för vinst.
          </p>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold text-white">Sidor</h3>
          <ul className="space-y-2 text-sm text-mute">
            <li><Link className="hover:text-white" href="/tips">Speltips</Link></li>
            <li><Link className="hover:text-white" href="/forum">Forum</Link></li>
            <li><Link className="hover:text-white" href="/logga-in">Logga in</Link></li>
            <li><Link className="hover:text-white" href="/integritet">Villkor och integritet</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold text-white">Spela ansvarsfullt</h3>
          <ul className="space-y-2 text-sm text-mute">
            <li><a className="hover:text-white" href="https://www.spelpaus.se" target="_blank" rel="noopener noreferrer">Spelpaus.se</a></li>
            <li><a className="hover:text-white" href="https://www.stodlinjen.se" target="_blank" rel="noopener noreferrer">Stödlinjen.se</a></li>
            <li><a className="hover:text-white" href="https://www.spelinspektionen.se" target="_blank" rel="noopener noreferrer">Spelinspektionen</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-mute sm:flex-row sm:px-6">
          <div className="flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-full border-2 border-loss font-bold text-white">18+</span>
            <span>Spel kan vara beroendeframkallande. Spela ansvarsfullt.</span>
          </div>
          <span>© {new Date().getFullYear()} MBetting Tips</span>
        </div>
      </div>
    </footer>
  );
}
