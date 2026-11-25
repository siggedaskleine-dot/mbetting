import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/Reveal";
import { getSession } from "@/lib/auth";
import { getCategory, getThreads, timeAgo } from "@/lib/forum";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ kategori: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = await getCategory((await params).kategori);
  return { title: c ? `${c.name} – Forum` : "Forum" };
}

export default async function CategoryPage({ params }: Props) {
  const slug = (await params).kategori;
  const [cat, session] = await Promise.all([getCategory(slug), getSession()]);
  if (!cat) notFound();
  const threads = await getThreads(cat.id);

  return (
    <section className="mx-auto max-w-5xl px-4 pt-16 sm:px-6">
      <Reveal>
        <Link href="/forum" className="text-sm text-mute hover:text-white">← Forum</Link>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="grid h-16 w-16 place-items-center rounded-2xl border border-line bg-panel text-3xl">{cat.icon}</span>
            <div>
              <h1 className="font-display text-3xl font-extrabold sm:text-4xl">{cat.name}</h1>
              <p className="mt-1 text-mute">{cat.description}</p>
            </div>
          </div>
          {session ? (
            <Link href={`/forum/${cat.slug}/ny`} className="btn-primary">+ Ny tråd</Link>
          ) : (
            <Link href={`/logga-in?till=/forum/${cat.slug}`} className="btn-ghost">Logga in för att skriva</Link>
          )}
        </div>
      </Reveal>

      <Reveal delay={100}>
        <div className="mt-10 overflow-hidden rounded-2xl border border-line bg-panel/70">
          {threads.length === 0 && <p className="p-10 text-center text-mute">Inga trådar här än. Starta den första!</p>}
          <ul className="divide-y divide-line">
            {threads.map((t) => (
              <li key={t.id}>
                <Link href={`/forum/${cat.slug}/${t.id}`} className="flex items-center gap-4 p-5 transition hover:bg-white/[0.03]">
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 font-semibold text-white">
                      {t.pinned && <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[11px] font-semibold text-gold">Fäst</span>}
                      {t.locked && <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-mute">Låst</span>}
                      <span className="truncate">{t.title}</span>
                    </p>
                    <p className="mt-1 text-xs text-mute">av {t.author} · {timeAgo(t.createdAt)}</p>
                  </div>
                  <div className="text-right text-xs text-mute">
                    <span className="block font-display text-lg font-bold text-white">{t.replies}</span>
                    svar
                  </div>
                  <div className="hidden w-28 text-right text-xs text-mute sm:block">{timeAgo(t.lastPostAt)}</div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
