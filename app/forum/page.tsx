import type { Metadata } from "next";
import Link from "next/link";
import { GlowCard } from "@/components/GlowCard";
import { Reveal } from "@/components/Reveal";
import { getSession } from "@/lib/auth";
import { getCategoriesWithStats, getLatestThreads, timeAgo } from "@/lib/forum";

export const metadata: Metadata = { title: "Forum" };
export const dynamic = "force-dynamic";

export default async function ForumPage() {
  const [categories, latest, session] = await Promise.all([getCategoriesWithStats(), getLatestThreads(6), getSession()]);

  return (
    <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-win">Forum</p>
            <h1 className="mt-2 font-display text-4xl font-extrabold sm:text-6xl">Diskutera spel</h1>
            <p className="mt-4 max-w-2xl text-mute">
              Alla kan läsa.{" "}
              {session ? (
                <>Välj en kategori och starta en tråd.</>
              ) : (
                <>För att skriva och kommentera behöver du <Link href="/logga-in?registrera=1&till=/forum" className="text-win hover:underline">bli medlem</Link>.</>
              )}
            </p>
          </div>
          {session?.user.role === "admin" && (
            <Link href="/admin/forum" className="rounded-full border border-gold/40 bg-gold/10 px-4 py-2 text-sm font-semibold text-gold hover:bg-gold/20">
              Hantera kategorier
            </Link>
          )}
        </div>
      </Reveal>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-4">
          {categories.length === 0 && <p className="rounded-2xl border border-line bg-panel/60 p-8 text-center text-mute">Inga kategorier än.</p>}
          {categories.map((c, i) => (
            <Reveal key={c.id} delay={i * 60}>
              <GlowCard>
                <Link href={`/forum/${c.slug}`} className="flex items-center gap-5 p-5 sm:p-6">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-line bg-ink/60 text-2xl">{c.icon}</span>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-display text-lg font-semibold text-white">{c.name}</h2>
                    <p className="mt-1 text-sm text-mute">{c.description}</p>
                    {c.lastPostAt && <p className="mt-1 text-xs text-mute/70">Senaste aktivitet {timeAgo(c.lastPostAt)}</p>}
                  </div>
                  <div className="hidden gap-6 text-center text-xs text-mute sm:flex">
                    <span><span className="block font-display text-xl font-bold text-white">{c.threads}</span>trådar</span>
                    <span><span className="block font-display text-xl font-bold text-white">{c.posts}</span>inlägg</span>
                  </div>
                </Link>
              </GlowCard>
            </Reveal>
          ))}
        </div>

        <Reveal delay={150}>
          <aside className="rounded-2xl border border-line bg-panel/70 p-6 lg:sticky lg:top-24">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
              <span className="pulse-dot h-2 w-2 rounded-full bg-win" /> Senaste trådarna
            </h2>
            {latest.length === 0 && <p className="mt-4 text-sm text-mute">Inga trådar än. Bli först!</p>}
            <ul className="mt-4 space-y-4">
              {latest.map((t) => (
                <li key={t.id}>
                  <Link href={`/forum/${t.categorySlug}/${t.id}`} className="group block">
                    <p className="line-clamp-2 text-sm font-medium text-white group-hover:text-win">{t.title}</p>
                    <p className="mt-0.5 text-xs text-mute">{t.categoryIcon} {t.categoryName} · {timeAgo(t.lastPostAt)}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </Reveal>
      </div>
    </section>
  );
}
