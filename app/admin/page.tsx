import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { tip } from "@/lib/db/schema";
import { formatKickoff, formatNumber, formatOdds, getStats } from "@/lib/tips";
import { TipRowActions } from "./TipRowActions";

type Props = { searchParams: Promise<{ sparat?: string }> };

export default async function AdminPage({ searchParams }: Props) {
  const [rows, stats, sp] = await Promise.all([db.select().from(tip).orderBy(desc(tip.kickoff)), getStats(), searchParams]);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-win">Admin</p>
          <h1 className="mt-1 font-display text-4xl font-extrabold">Dina tips</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/forum" className="btn-ghost">Forumkategorier</Link>
          <Link href="/admin/nytt" className="btn-primary">+ Nytt tips</Link>
        </div>
      </div>

      {sp.sparat && (
        <p className="mt-6 rounded-xl border border-win/30 bg-win/10 px-4 py-3 text-sm text-win">Tipset är sparat.</p>
      )}

      <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
        {[
          ["Publicerade", String(stats.tipsTotal)],
          ["Träffsäkerhet", stats.winRate === null ? "–" : `${formatNumber(stats.winRate, 0)} %`],
          ["ROI", stats.roi === null ? "–" : `${formatNumber(stats.roi)} %`],
          ["Enheter", formatNumber(stats.units, 2)],
        ].map(([k, v]) => (
          <div key={k} className="bg-panel p-5">
            <dt className="text-xs uppercase tracking-wider text-mute">{k}</dt>
            <dd className="mt-1 font-display text-2xl font-bold">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-panel/70">
        {rows.length === 0 && <p className="p-10 text-center text-mute">Inga tips än. Skriv ditt första!</p>}
        <ul className="divide-y divide-line">
          {rows.map((t) => (
            <li key={t.id} className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className={`rounded-full px-2.5 py-0.5 font-semibold ${t.published ? "bg-win/15 text-win" : "bg-white/10 text-mute"}`}>
                    {t.published ? "Publicerad" : "Utkast"}
                  </span>
                  <span className="text-mute">{t.sport} · {formatKickoff(t.kickoff)}</span>
                </div>
                <Link href={`/admin/${t.id}`} className="mt-1 block truncate font-semibold text-white hover:text-win">{t.title}</Link>
                <p className="truncate text-sm text-mute">{t.match} · {t.pick} @ {formatOdds(t.odds)}</p>
              </div>
              <TipRowActions id={t.id} status={t.status} slug={t.published ? t.slug : null} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
