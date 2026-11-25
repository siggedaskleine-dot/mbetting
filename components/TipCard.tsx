import Link from "next/link";
import { GlowCard } from "./GlowCard";
import { formatKickoff, formatOdds, type Tip } from "@/lib/tips";

const statusStyle: Record<Tip["status"], string> = {
  vunnen: "bg-win/15 text-win border-win/30",
  förlorad: "bg-loss/15 text-loss border-loss/30",
  pågår: "bg-gold/15 text-gold border-gold/30",
};

const statusLabel: Record<Tip["status"], string> = {
  vunnen: "Vunnen",
  förlorad: "Förlorad",
  pågår: "Kommande",
};

export function TipCard({ tip }: { tip: Tip }) {
  return (
    <GlowCard className="h-full">
      <Link href={`/tips/${tip.slug}`} className="flex h-full flex-col p-6">
        <div className="mb-4 flex items-center justify-between gap-2 text-xs">
          <span className="rounded-full border border-line bg-white/5 px-3 py-1 font-medium text-mute">
            {tip.sport} · {tip.league}
          </span>
          <span className={`rounded-full border px-3 py-1 font-semibold ${statusStyle[tip.status]}`}>
            {statusLabel[tip.status]}
          </span>
        </div>
        <p className="text-sm text-mute">{tip.match}</p>
        <h3 className="mt-1 font-display text-xl font-semibold leading-snug text-white">{tip.title}</h3>
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-mute">{tip.excerpt}</p>

        <div className="mt-auto pt-6">
          <div className="flex items-end justify-between rounded-2xl border border-line bg-ink/60 p-4">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-mute">Spel</p>
              <p className="mt-0.5 font-semibold text-white">{tip.pick}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-wider text-mute">Odds</p>
              <p className="font-display text-2xl font-bold text-win">{formatOdds(tip.odds)}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-mute">
            <span>{formatKickoff(tip.kickoff)}</span>
            <span className="flex items-center gap-1" aria-label={`Säkerhet ${tip.confidence} av 5`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={`h-1.5 w-4 rounded-full ${i < tip.confidence ? "bg-win" : "bg-white/10"}`} />
              ))}
            </span>
          </div>
        </div>
      </Link>
    </GlowCard>
  );
}
