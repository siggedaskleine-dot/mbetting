import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/Avatar";
import { getSession } from "@/lib/auth";
import { getCategory, getThread, timeAgo } from "@/lib/forum";
import { createPost } from "../../actions";
import { DeletePostButton, ThreadAdminBar } from "../../ModButtons";
import { PostForm } from "../../PostForm";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ kategori: string; id: string }> };

async function load(params: Props["params"]) {
  const { kategori, id } = await params;
  const cat = await getCategory(kategori);
  const n = Number(id);
  if (!cat || !Number.isInteger(n)) return null;
  const thread = await getThread(cat.id, n);
  return thread ? { cat, thread } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const d = await load(params);
  return { title: d ? d.thread.title : "Forum" };
}

export default async function ThreadPage({ params }: Props) {
  const [d, session] = await Promise.all([load(params), getSession()]);
  if (!d) notFound();
  const { cat, thread } = d;
  const me = session?.user;
  const isAdmin = me?.role === "admin";
  const fmt = new Intl.DateTimeFormat("sv-SE", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Stockholm" });

  return (
    <section className="mx-auto max-w-4xl px-4 pt-16 sm:px-6">
      <Link href={`/forum/${cat.slug}`} className="text-sm text-mute hover:text-white">← {cat.icon} {cat.name}</Link>
      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <h1 className="font-display text-3xl font-extrabold leading-tight sm:text-4xl">
          {thread.pinned && <span className="mr-3 align-middle text-sm font-semibold text-gold">📌</span>}
          {thread.title}
        </h1>
        {isAdmin && <ThreadAdminBar id={thread.id} pinned={thread.pinned} locked={thread.locked} />}
      </div>

      <ol className="mt-10 space-y-4">
        {thread.posts.map((p, i) => (
          <li key={p.id} id={`inlagg-${p.id}`} className={`rounded-2xl border bg-panel/70 p-5 sm:p-6 ${i === 0 ? "border-win/25" : "border-line"}`}>
            <div className="flex items-center gap-3">
              <Avatar name={p.authorName} image={p.authorImage} />
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 font-semibold text-white">
                  {p.authorName}
                  {p.authorRole === "admin" && <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[11px] font-semibold text-gold">Admin</span>}
                </p>
                <p className="text-xs text-mute" title={fmt.format(p.createdAt)}>{timeAgo(p.createdAt)}</p>
              </div>
              {me && (me.id === p.authorId || isAdmin) && <DeletePostButton id={p.id} />}
            </div>
            <div className="mt-4 whitespace-pre-wrap break-words leading-relaxed text-white/85">{p.body}</div>
          </li>
        ))}
      </ol>

      <div className="mt-10 rounded-2xl border border-line bg-panel/70 p-6">
        {!me ? (
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <p className="text-mute">Du behöver vara medlem för att svara.</p>
            <div className="flex gap-3">
              <Link href={`/logga-in?till=/forum/${cat.slug}/${thread.id}`} className="btn-ghost">Logga in</Link>
              <Link href={`/logga-in?registrera=1&till=/forum/${cat.slug}/${thread.id}`} className="btn-primary">Bli medlem</Link>
            </div>
          </div>
        ) : thread.locked && !isAdmin ? (
          <p className="py-4 text-center text-mute">🔒 Tråden är låst och kan inte besvaras.</p>
        ) : (
          <PostForm action={createPost.bind(null, thread.id)} submitLabel="Skicka svar" />
        )}
      </div>
    </section>
  );
}
