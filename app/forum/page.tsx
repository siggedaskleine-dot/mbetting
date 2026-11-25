import type { Metadata } from "next";
import Link from "next/link";
import { GlowCard } from "@/components/GlowCard";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = { title: "Forum" };

// Exempelkategorier. I steg 3 skapar admin kategorierna själv.
const categories = [
  { name: "Fotboll", desc: "Allsvenskan, Premier League, Champions League och mer.", icon: "⚽", threads: 0 },
  { name: "Ishockey", desc: "SHL, NHL och internationell hockey.", icon: "🏒", threads: 0 },
  { name: "Tennis", desc: "Grand Slam, ATP och WTA.", icon: "🎾", threads: 0 },
  { name: "Strategi och bankroll", desc: "Insatser, värdespel och hur man håller disciplinen.", icon: "📈", threads: 0 },
];

export default function ForumPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6">
      <Reveal>
        <p className="text-sm font-semibold uppercase tracking-wider text-win">Forum</p>
        <h1 className="mt-2 font-display text-4xl font-extrabold sm:text-6xl">Diskutera spel</h1>
        <p className="mt-4 max-w-2xl text-mute">
          Alla kan läsa. För att skriva inlägg och kommentera behöver du{" "}
          <Link href="/logga-in?registrera=1" className="text-win hover:underline">bli medlem</Link>.
        </p>
      </Reveal>
      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {categories.map((c, i) => (
          <Reveal key={c.name} delay={(i % 2) * 100}>
            <GlowCard className="flex items-center gap-5 p-6">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-line bg-ink/60 text-2xl">{c.icon}</span>
              <div className="min-w-0 flex-1">
                <h2 className="font-display text-lg font-semibold">{c.name}</h2>
                <p className="mt-1 text-sm text-mute">{c.desc}</p>
              </div>
              <span className="text-right text-xs text-mute"><span className="block font-display text-xl font-bold text-white">{c.threads}</span>trådar</span>
            </GlowCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
