import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { Reveal } from "@/components/Reveal";
import { statusStyles } from "@/components/TipCard";
import { formatKickoff, formatOdds, getPublishedTip, statusLabel } from "@/lib/tips";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tip = await getPublishedTip((await params).slug);
  return { title: tip?.title ?? "Tips", description: tip?.excerpt };
}

export default async function TipPage({ params }: Props) {
  const tip = await getPublishedTip((await params).slug);
  if (!tip) notFound();
  // Bara admin skriver tips, så Markdown-texten räknas som betrodd.
  const html = await marked.parse(tip.body, { breaks: true });

  return (
    <article className="mx-auto max-w-3xl px-4 pt-16 sm:px-6">
      <Reveal>
        <Link href="/tips" className="text-sm text-mute hover:text-white">← Alla tips</Link>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <p className="text-sm font-semibold uppercase tracking-wider text-win">{tip.sport}{tip.league && ` · ${tip.league}`}</p>
          <span className={`rounded-full border px-3 py-0.5 text-xs font-semibold ${statusStyles[tip.status]}`}>{statusLabel[tip.status]}</span>
        </div>
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
        <div className="prose-tip mt-10" dangerouslySetInnerHTML={{ __html: html }} />
      </Reveal>
    </article>
  );
}
