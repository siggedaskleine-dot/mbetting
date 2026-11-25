import { and, asc, count, desc, eq, max, sql } from "drizzle-orm";
import { db } from "./db";
import { forumCategory, forumPost, forumThread, user } from "./db/schema";

export async function getCategoriesWithStats() {
  const cats = await db.select().from(forumCategory).orderBy(asc(forumCategory.sortOrder), asc(forumCategory.name));
  const threadStats = await db
    .select({ categoryId: forumThread.categoryId, threads: count(), last: max(forumThread.lastPostAt) })
    .from(forumThread)
    .groupBy(forumThread.categoryId);
  const postStats = await db
    .select({ categoryId: forumThread.categoryId, posts: count() })
    .from(forumPost)
    .innerJoin(forumThread, eq(forumPost.threadId, forumThread.id))
    .groupBy(forumThread.categoryId);
  return cats.map((c) => {
    const t = threadStats.find((s) => s.categoryId === c.id);
    const p = postStats.find((s) => s.categoryId === c.id);
    return { ...c, threads: t?.threads ?? 0, posts: p?.posts ?? 0, lastPostAt: t?.last ?? null };
  });
}

export async function getCategory(slug: string) {
  const [c] = await db.select().from(forumCategory).where(eq(forumCategory.slug, slug));
  return c ?? null;
}

export async function getThreads(categoryId: number) {
  return db
    .select({
      id: forumThread.id,
      title: forumThread.title,
      pinned: forumThread.pinned,
      locked: forumThread.locked,
      createdAt: forumThread.createdAt,
      lastPostAt: forumThread.lastPostAt,
      author: user.name,
      replies: sql<number>`(select count(*) - 1 from ${forumPost} where ${forumPost.threadId} = ${forumThread.id})`,
    })
    .from(forumThread)
    .innerJoin(user, eq(forumThread.authorId, user.id))
    .where(eq(forumThread.categoryId, categoryId))
    .orderBy(desc(forumThread.pinned), desc(forumThread.lastPostAt));
}

export async function getThread(categoryId: number, id: number) {
  const [t] = await db
    .select()
    .from(forumThread)
    .where(and(eq(forumThread.id, id), eq(forumThread.categoryId, categoryId)));
  if (!t) return null;
  const posts = await db
    .select({
      id: forumPost.id,
      body: forumPost.body,
      createdAt: forumPost.createdAt,
      editedAt: forumPost.editedAt,
      authorId: forumPost.authorId,
      authorName: user.name,
      authorImage: user.image,
      authorRole: user.role,
    })
    .from(forumPost)
    .innerJoin(user, eq(forumPost.authorId, user.id))
    .where(eq(forumPost.threadId, id))
    .orderBy(asc(forumPost.createdAt), asc(forumPost.id));
  return { ...t, posts };
}

export async function getLatestThreads(limit = 5) {
  return db
    .select({
      id: forumThread.id,
      title: forumThread.title,
      lastPostAt: forumThread.lastPostAt,
      categorySlug: forumCategory.slug,
      categoryName: forumCategory.name,
      categoryIcon: forumCategory.icon,
    })
    .from(forumThread)
    .innerJoin(forumCategory, eq(forumThread.categoryId, forumCategory.id))
    .orderBy(desc(forumThread.lastPostAt))
    .limit(limit);
}

export function timeAgo(d: Date) {
  const s = Math.round((Date.now() - d.getTime()) / 1000);
  if (s < 60) return "nyss";
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min sedan`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} tim sedan`;
  const days = Math.round(h / 24);
  if (days < 7) return days === 1 ? "i går" : `${days} dagar sedan`;
  return new Intl.DateTimeFormat("sv-SE", { day: "numeric", month: "short", year: "numeric", timeZone: "Europe/Stockholm" }).format(d);
}
