import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/Reveal";
import { formatKickoff, formatOdds, tips } from "@/lib/tips";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return tips.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tip = tips.find((t) => t.slug === slug);
  return { title: tip?.title ?? "Tips" };
}

export default async function TipPage({ params }: Props) {
  const { slug } = await params;
  const tip = tips.find((t) => t.slug === slug);
  if (!tip) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 pt-16 sm:px-6">
      <Reveal>
        <Link href="/tips" className="text-sm text-mute hover:text-white">← Alla tips</Link>
        <p className="mt-8 text-sm font-semibold uppercase tracking-wider text-win">{tip.sport} · {tip.league}</p>
        <h1 className="mt-2 font-display text-4xl font-extrabold leading-tight sm:text-5xl">{tip.title}</h1>
        <p className="mt-3 text-mute">{tip.match} · {formatKickoff(tip.kickoff)}</p>
      </Reveal>
      <Reveal delay={100}>
        <div className="mt-10 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-line bg-line">
          {[
            ["Spel", tip.pick],
            ["Odds", formatOdds(tip.odds)],
            ["Insats", `${String(tip.stake).replace(".", ",")} enh.`],
          ].map(([k, v]) => (
            <div key={k} className="bg-panel p-5">
              <p className="text-[11px] uppercase tracking-wider text-mute">{k}</p>
              <p className={`mt-1 font-semibold ${k === "Odds" ? "font-display text-2xl text-win" : "text-white"}`}>{v}</p>
            </div>
          ))}
        </div>
      </Reveal>
      <Reveal delay={200}>
        <div className="mt-10 space-y-5 text-lg leading-relaxed text-white/85">
          {tip.body.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </Reveal>
    </article>
  );
}
