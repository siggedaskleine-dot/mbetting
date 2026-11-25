import { formatOdds, tips } from "@/lib/tips";

export function OddsTicker() {
  const items = [...tips, ...tips];
  return (
    <div className="marquee overflow-hidden border-y border-line bg-panel/50 py-3">
      <div className="marquee-track">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex shrink-0" aria-hidden={dup === 1}>
            {items.map((t, i) => (
              <span key={`${dup}-${i}`} className="mx-6 flex items-center gap-3 whitespace-nowrap text-sm">
                <span className={`h-1.5 w-1.5 rounded-full ${t.status === "pågår" ? "bg-gold" : t.status === "vunnen" ? "bg-win" : "bg-loss"}`} />
                <span className="text-mute">{t.match}</span>
                <span className="font-medium text-white">{t.pick}</span>
                <span className="font-display font-bold text-win">{formatOdds(t.odds)}</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
