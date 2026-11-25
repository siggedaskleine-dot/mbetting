import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { TipCard } from "@/components/TipCard";
import { tips } from "@/lib/tips";

export const metadata: Metadata = { title: "Speltips" };

export default function TipsPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6">
      <Reveal>
        <p className="text-sm font-semibold uppercase tracking-wider text-win">Speltips</p>
        <h1 className="mt-2 font-display text-4xl font-extrabold sm:text-6xl">Alla tips</h1>
        <p className="mt-4 max-w-2xl text-mute">Varje tips har en analys, rekommenderad insats och mitt eget betyg på hur säker jag är.</p>
      </Reveal>
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
