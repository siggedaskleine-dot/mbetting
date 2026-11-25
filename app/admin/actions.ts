"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { tip } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { slugify } from "@/lib/tips";

export type FormState = { error?: string } | undefined;

const STATUSES = ["pågår", "vunnen", "förlorad", "struken"] as const;

async function requireAdmin() {
  const s = await getSession();
  if (s?.user.role !== "admin") throw new Error("Bara admin får göra det här.");
  return s.user;
}

function num(v: FormDataEntryValue | null) {
  return Number(String(v ?? "").replace(",", "."));
}

function parse(form: FormData) {
  const str = (k: string) => String(form.get(k) ?? "").trim();
  const data = {
    title: str("title"),
    sport: str("sport"),
    league: str("league"),
    match: str("match"),
    pick: str("pick"),
    odds: num(form.get("odds")),
    stake: num(form.get("stake")),
    confidence: Math.round(num(form.get("confidence"))),
    status: str("status") as (typeof STATUSES)[number],
    excerpt: str("excerpt"),
    body: str("body"),
    kickoffRaw: str("kickoff"),
    slug: slugify(str("slug") || str("title")),
    published: form.get("intent") === "publish",
  };

  if (!data.title || !data.sport || !data.match || !data.pick) return { error: "Fyll i rubrik, sport, match och spel." };
  if (!(data.odds > 1)) return { error: "Oddset måste vara större än 1." };
  if (!(data.stake > 0)) return { error: "Insatsen måste vara större än 0." };
  if (!(data.confidence >= 1 && data.confidence <= 5)) return { error: "Säkerheten ska vara 1 till 5." };
  if (!STATUSES.includes(data.status)) return { error: "Ogiltig status." };
  if (!data.slug) return { error: "Rubriken behöver innehålla bokstäver eller siffror." };
  // Datumfältet saknar tidszon, så vi tolkar det som svensk tid.
  const kickoff = data.kickoffRaw ? stockholmToDate(data.kickoffRaw) : null;
  if (!kickoff || isNaN(kickoff.getTime())) return { error: "Ange datum och tid för matchen." };

  const { kickoffRaw: _, ...rest } = data;
  return { values: { ...rest, kickoff } };
}

// "2026-11-29T17:30" i svensk tid -> Date
function stockholmToDate(local: string) {
  const asUtc = new Date(local + "Z");
  const sthlm = new Date(asUtc.toLocaleString("en-US", { timeZone: "Europe/Stockholm" }));
  const utc = new Date(asUtc.toLocaleString("en-US", { timeZone: "UTC" }));
  return new Date(asUtc.getTime() - (sthlm.getTime() - utc.getTime()));
}

async function uniqueSlug(base: string, exceptId?: number) {
  let slug = base;
  for (let i = 2; ; i++) {
    const [hit] = await db.select({ id: tip.id }).from(tip).where(eq(tip.slug, slug));
    if (!hit || hit.id === exceptId) return slug;
    slug = `${base}-${i}`;
  }
}

function refresh(slug?: string) {
  revalidatePath("/");
  revalidatePath("/tips");
  if (slug) revalidatePath(`/tips/${slug}`);
  revalidatePath("/admin");
}

export async function createTip(_: FormState, form: FormData): Promise<FormState> {
  const user = await requireAdmin();
  const parsed = parse(form);
  if ("error" in parsed) return { error: parsed.error };
  const v = parsed.values;
  const slug = await uniqueSlug(v.slug);
  await db.insert(tip).values({ ...v, slug, authorId: user.id, publishedAt: v.published ? new Date() : null });
  refresh(slug);
  redirect("/admin?sparat=1");
}

export async function updateTip(id: number, _: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = parse(form);
  if ("error" in parsed) return { error: parsed.error };
  const [existing] = await db.select().from(tip).where(eq(tip.id, id));
  if (!existing) return { error: "Tipset finns inte längre." };
  const v = parsed.values;
  const slug = await uniqueSlug(v.slug, id);
  await db
    .update(tip)
    .set({
      ...v,
      slug,
      publishedAt: v.published ? existing.publishedAt ?? new Date() : existing.publishedAt,
      updatedAt: new Date(),
    })
    .where(eq(tip.id, id));
  refresh(existing.slug);
  refresh(slug);
  redirect("/admin?sparat=1");
}

export async function setStatus(id: number, status: (typeof STATUSES)[number]) {
  await requireAdmin();
  if (!STATUSES.includes(status)) return;
  const [row] = await db.update(tip).set({ status, updatedAt: new Date() }).where(eq(tip.id, id)).returning();
  refresh(row?.slug);
}

export async function deleteTip(id: number) {
  await requireAdmin();
  const [row] = await db.delete(tip).where(eq(tip.id, id)).returning();
  refresh(row?.slug);
}
