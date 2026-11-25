import Link from "next/link";
import { OddsTicker } from "@/components/OddsTicker";
import { Reveal } from "@/components/Reveal";
import { TipCard } from "@/components/TipCard";
import { CountUp } from "@/components/CountUp";
import { GlowCard } from "@/components/GlowCard";
import { stats, tips } from "@/lib/tips";

export default function Home() {
  const upcoming = tips.filter((t) => t.status === "pågår");
  const latest = tips.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-win/30 bg-win/10 px-4 py-1.5 text-xs font-semibold text-win">
            <span className="pulse-dot h-2 w-2 rounded-full bg-win" />
            {upcoming.length} nya tips för helgen
          </span>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="mt-6 max-w-4xl font-display text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-7xl">
            Speltips som bygger på <span className="text-gradient">analys</span>, inte magkänsla.
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-mute">
            Jag går igenom statistik, form och odds varje vecka och delar mina spel helt gratis. Häng med i forumet och
            diskutera matcherna med andra.
          </p>
        </Reveal>
        <Reveal delay={240}>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/tips" className="btn-primary">
              Se veckans tips
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Link>
            <Link href="/forum" className="btn-ghost">Gå till forumet</Link>
          </div>
        </Reveal>

        {/* Statistik */}
        <Reveal delay={320}>
          <dl className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-4">
            {[
              { label: "Träffsäkerhet", node: <CountUp to={stats.winRate} suffix=" %" /> },
              { label: "ROI", node: <CountUp to={stats.roi} decimals={1} prefix="+" suffix=" %" /> },
              { label: "Publicerade tips", node: <CountUp to={stats.tipsTotal} /> },
              { label: "Vinst i enheter", node: <CountUp to={stats.units} decimals={1} prefix="+" /> },
            ].map((s) => (
              <div key={s.label} className="bg-panel/90 p-6 backdrop-blur">
                <dt className="text-xs uppercase tracking-wider text-mute">{s.label}</dt>
                <dd className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">{s.node}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      <OddsTicker />

      {/* Senaste tipsen */}
      <section className="mx-auto max-w-6xl px-4 pt-24 sm:px-6">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-win">Senaste tipsen</p>
              <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Färskt från analysbordet</h2>
            </div>
            <Link href="/tips" className="text-sm font-medium text-mute hover:text-white">Alla tips →</Link>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {latest.map((t, i) => (
            <Reveal key={t.slug} delay={i * 100}>
              <TipCard tip={t} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Så funkar det */}
      <section className="mx-auto max-w-6xl px-4 pt-28 sm:px-6">
        <Reveal>
          <h2 className="text-center font-display text-3xl font-bold sm:text-4xl">Så funkar MBetting Tips</h2>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { n: "01", t: "Läs tipsen gratis", d: "Alla speltips är öppna för alla. Ingen registrering, ingen betalvägg." },
            { n: "02", t: "Bli medlem", d: "Skapa ett konto med Google eller e-post på några sekunder." },
            { n: "03", t: "Diskutera i forumet", d: "Kommentera, ställ frågor och dela dina egna spel med andra." },
          ].map((s, i) => (
            <Reveal key={s.n} delay={i * 100}>
              <GlowCard className="h-full p-7">
                <span className="font-display text-5xl font-extrabold text-white/10">{s.n}</span>
                <h3 className="mt-4 font-display text-xl font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mute">{s.d}</p>
              </GlowCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pt-28 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-win/20 bg-gradient-to-br from-win/15 via-panel to-gold/10 p-10 sm:p-16">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-win/20 blur-3xl" aria-hidden="true" />
            <h2 className="relative max-w-xl font-display text-3xl font-bold sm:text-5xl">Snacka spel med likasinnade.</h2>
            <p className="relative mt-4 max-w-lg text-mute">Gå med i forumet och diskutera helgens matcher, dela strategier och följ upp tipsen.</p>
            <Link href="/logga-in?registrera=1" className="btn-primary relative mt-8">Skapa konto gratis</Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
