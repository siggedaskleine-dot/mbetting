import { and, desc, eq, inArray } from "drizzle-orm";
import { db } from "./db";
import { tip, type Tip, type TipStatus } from "./db/schema";

export type { Tip, TipStatus };

export const statusLabel: Record<TipStatus, string> = {
  pågår: "Kommande",
  vunnen: "Vunnen",
  förlorad: "Förlorad",
  struken: "Struken",
};

export async function getPublishedTips(limit?: number) {
  const q = db.select().from(tip).where(eq(tip.published, true)).orderBy(desc(tip.kickoff));
  return limit ? q.limit(limit) : q;
}

export async function getPublishedTip(slug: string) {
  const [row] = await db.select().from(tip).where(and(eq(tip.slug, slug), eq(tip.published, true)));
  return row ?? null;
}

export type Stats = { winRate: number | null; roi: number | null; units: number; tipsTotal: number };

export async function getStats(): Promise<Stats> {
  const all = await db.select().from(tip).where(eq(tip.published, true));
  const settled = all.filter((t) => t.status === "vunnen" || t.status === "förlorad");
  const won = settled.filter((t) => t.status === "vunnen");
  const staked = settled.reduce((s, t) => s + t.stake, 0);
  const units = settled.reduce((s, t) => s + (t.status === "vunnen" ? t.stake * (t.odds - 1) : -t.stake), 0);
  return {
    tipsTotal: all.length,
    winRate: settled.length ? (won.length / settled.length) * 100 : null,
    roi: staked ? (units / staked) * 100 : null,
    units,
  };
}

export async function getUpcomingCount() {
  const rows = await db
    .select({ id: tip.id })
    .from(tip)
    .where(and(eq(tip.published, true), inArray(tip.status, ["pågår"])));
  return rows.length;
}

export function formatOdds(o: number) {
  return o.toFixed(2).replace(".", ",");
}

export function formatNumber(n: number, decimals = 1) {
  return n.toFixed(decimals).replace(".", ",");
}

export function formatKickoff(d: Date) {
  return new Intl.DateTimeFormat("sv-SE", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Stockholm",
  }).format(d);
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/å|ä/g, "a")
    .replace(/ö/g, "o")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
