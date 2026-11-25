import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getCategory } from "@/lib/forum";
import { createThread } from "../../actions";
import { PostForm } from "../../PostForm";

export const dynamic = "force-dynamic";

export default async function NewThreadPage({ params }: { params: Promise<{ kategori: string }> }) {
  const slug = (await params).kategori;
  const [cat, session] = await Promise.all([getCategory(slug), getSession()]);
  if (!cat) notFound();
  if (!session) redirect(`/logga-in?till=/forum/${slug}/ny`);

  return (
    <section className="mx-auto max-w-3xl px-4 pt-16 sm:px-6">
      <Link href={`/forum/${cat.slug}`} className="text-sm text-mute hover:text-white">← {cat.name}</Link>
      <h1 className="mb-8 mt-4 font-display text-3xl font-extrabold sm:text-4xl">Ny tråd i {cat.name}</h1>
      <div className="rounded-2xl border border-line bg-panel/70 p-6">
        <PostForm action={createThread.bind(null, cat.slug)} withTitle submitLabel="Publicera tråd" />
      </div>
    </section>
  );
}
