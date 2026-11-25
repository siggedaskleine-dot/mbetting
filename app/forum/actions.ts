"use server";

import { asc, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { forumCategory, forumPost, forumThread } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { slugify } from "@/lib/tips";

export type FormState = { error?: string; ok?: boolean } | undefined;

const MAX_TITLE = 120;
const MAX_BODY = 5000;

async function requireUser() {
  const s = await getSession();
  if (!s) throw new Error("Du måste vara inloggad.");
  return s.user;
}

async function requireAdmin() {
  const u = await requireUser();
  if (u.role !== "admin") throw new Error("Bara admin får göra det här.");
  return u;
}

// Enkel spärr mot spam: max ett inlägg per 15 sekunder per användare.
async function tooFast(userId: string) {
  const [last] = await db
    .select({ at: forumPost.createdAt })
    .from(forumPost)
    .where(eq(forumPost.authorId, userId))
    .orderBy(desc(forumPost.createdAt))
    .limit(1);
  return !!last && Date.now() - last.at.getTime() < 15_000;
}

export async function createThread(categorySlug: string, _: FormState, form: FormData): Promise<FormState> {
  const u = await requireUser();
  const title = String(form.get("title") ?? "").trim();
  const body = String(form.get("body") ?? "").trim();
  if (title.length < 3) return { error: "Rubriken behöver minst 3 tecken." };
  if (title.length > MAX_TITLE) return { error: `Rubriken får vara högst ${MAX_TITLE} tecken.` };
  if (body.length < 2) return { error: "Skriv något i inlägget." };
  if (body.length > MAX_BODY) return { error: `Inlägget får vara högst ${MAX_BODY} tecken.` };
  const [cat] = await db.select().from(forumCategory).where(eq(forumCategory.slug, categorySlug));
  if (!cat) return { error: "Kategorin finns inte." };
  if (await tooFast(u.id)) return { error: "Vänta några sekunder innan du skriver igen." };

  const now = new Date();
  const [t] = await db.insert(forumThread).values({ categoryId: cat.id, authorId: u.id, title, createdAt: now, lastPostAt: now }).returning();
  await db.insert(forumPost).values({ threadId: t.id, authorId: u.id, body, createdAt: now });
  revalidatePath("/forum");
  redirect(`/forum/${cat.slug}/${t.id}`);
}

export async function createPost(threadId: number, _: FormState, form: FormData): Promise<FormState> {
  const u = await requireUser();
  const body = String(form.get("body") ?? "").trim();
  if (body.length < 2) return { error: "Skriv något i svaret." };
  if (body.length > MAX_BODY) return { error: `Svaret får vara högst ${MAX_BODY} tecken.` };
  const [t] = await db.select().from(forumThread).where(eq(forumThread.id, threadId));
  if (!t) return { error: "Tråden finns inte längre." };
  if (t.locked && u.role !== "admin") return { error: "Tråden är låst." };
  if (await tooFast(u.id)) return { error: "Vänta några sekunder innan du skriver igen." };

  const now = new Date();
  await db.insert(forumPost).values({ threadId, authorId: u.id, body, createdAt: now });
  await db.update(forumThread).set({ lastPostAt: now }).where(eq(forumThread.id, threadId));
  revalidatePath("/forum", "layout");
  return { ok: true };
}

export async function deletePost(postId: number) {
  const u = await requireUser();
  const [p] = await db.select().from(forumPost).where(eq(forumPost.id, postId));
  if (!p) return;
  if (p.authorId !== u.id && u.role !== "admin") throw new Error("Du kan bara ta bort dina egna inlägg.");
  const [first] = await db.select({ id: forumPost.id }).from(forumPost).where(eq(forumPost.threadId, p.threadId)).orderBy(asc(forumPost.createdAt), asc(forumPost.id)).limit(1);
  if (first?.id === p.id) {
    // Första inlägget tar bort hela tråden.
    await deleteThreadInner(p.threadId, u);
    return;
  }
  await db.delete(forumPost).where(eq(forumPost.id, postId));
  revalidatePath("/forum", "layout");
}

async function deleteThreadInner(threadId: number, u: { id: string; role: string }) {
  const [t] = await db.select().from(forumThread).where(eq(forumThread.id, threadId));
  if (!t) return;
  if (t.authorId !== u.id && u.role !== "admin") throw new Error("Du kan bara ta bort dina egna trådar.");
  const [cat] = await db.select().from(forumCategory).where(eq(forumCategory.id, t.categoryId));
  await db.delete(forumThread).where(eq(forumThread.id, threadId));
  revalidatePath("/forum", "layout");
  redirect(`/forum/${cat?.slug ?? ""}`);
}

export async function deleteThread(threadId: number) {
  const u = await requireUser();
  await deleteThreadInner(threadId, u);
}

export async function toggleThreadFlag(threadId: number, flag: "pinned" | "locked") {
  await requireAdmin();
  const [t] = await db.select().from(forumThread).where(eq(forumThread.id, threadId));
  if (!t) return;
  await db.update(forumThread).set({ [flag]: !t[flag] }).where(eq(forumThread.id, threadId));
  revalidatePath("/forum", "layout");
}

// ---------- Kategorier (admin) ----------

export async function saveCategory(_: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const id = Number(form.get("id") || 0);
  const name = String(form.get("name") ?? "").trim();
  const description = String(form.get("description") ?? "").trim();
  const icon = String(form.get("icon") ?? "").trim() || "💬";
  const sortOrder = Number(form.get("sortOrder") || 0);
  if (name.length < 2) return { error: "Namnet behöver minst 2 tecken." };
  const slug = slugify(String(form.get("slug") ?? "") || name);
  if (!slug) return { error: "Namnet behöver innehålla bokstäver eller siffror." };
  const [clash] = await db.select().from(forumCategory).where(eq(forumCategory.slug, slug));
  if (clash && clash.id !== id) return { error: "Det finns redan en kategori med den adressen." };

  if (id) await db.update(forumCategory).set({ name, description, icon, sortOrder, slug }).where(eq(forumCategory.id, id));
  else await db.insert(forumCategory).values({ name, description, icon, sortOrder, slug });
  revalidatePath("/forum", "layout");
  revalidatePath("/admin/forum");
  return { ok: true };
}

export async function deleteCategory(id: number) {
  await requireAdmin();
  await db.delete(forumCategory).where(eq(forumCategory.id, id));
  revalidatePath("/forum", "layout");
  revalidatePath("/admin/forum");
}
