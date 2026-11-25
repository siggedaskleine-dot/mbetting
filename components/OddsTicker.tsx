import { formatOdds, getPublishedTips } from "@/lib/tips";

export async function OddsTicker() {
  const tips = await getPublishedTips(10);
  if (tips.length === 0) return null;
  // Fyll ut så att bandet alltid är bredare än skärmen.
  const items = Array.from({ length: Math.max(2, Math.ceil(8 / tips.length)) }, () => tips).flat();
  return (
    <div className="marquee overflow-hidden border-y border-line bg-panel/50 py-3">
      <div className="marquee-track">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex shrink-0" aria-hidden={dup === 1}>
            {items.map((t, i) => (
              <span key={`${dup}-${i}`} className="mx-6 flex items-center gap-3 whitespace-nowrap text-sm">
                <span className={`h-1.5 w-1.5 rounded-full ${t.status === "pågår" ? "bg-gold" : t.status === "vunnen" ? "bg-win" : t.status === "förlorad" ? "bg-loss" : "bg-mute"}`} />
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
