import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { TipCard } from "@/components/TipCard";
import { getPublishedTips } from "@/lib/tips";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Speltips" };

export default async function TipsPage() {
  const tips = await getPublishedTips();
  return (
    <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6">
      <Reveal>
        <p className="text-sm font-semibold uppercase tracking-wider text-win">Speltips</p>
        <h1 className="mt-2 font-display text-4xl font-extrabold sm:text-6xl">Alla tips</h1>
        <p className="mt-4 max-w-2xl text-mute">Varje tips har en analys, rekommenderad insats och mitt eget betyg på hur säker jag är.</p>
      </Reveal>
      {tips.length === 0 && (
        <p className="mt-12 rounded-2xl border border-line bg-panel/60 p-8 text-center text-mute">Inga tips publicerade än.</p>
      )}
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tips.map((t, i) => (
          <Reveal key={t.slug} delay={(i % 3) * 100}>
            <TipCard tip={t} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
