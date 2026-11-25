import Link from "next/link";
import { getCategoriesWithStats } from "@/lib/forum";
import { CategoryForm } from "./CategoryForm";

export default async function AdminForumPage() {
  const cats = await getCategoriesWithStats();
  return (
    <>
      <Link href="/admin" className="text-sm text-mute hover:text-white">← Admin</Link>
      <h1 className="mt-3 font-display text-4xl font-extrabold">Forumkategorier</h1>
      <p className="mt-2 text-mute">Lägg till, byt namn, ändra ordning eller ta bort kategorier. Lägst ordningsnummer visas först.</p>

      <h2 className="mt-10 font-display text-lg font-semibold">Ny kategori</h2>
      <div className="mt-3 rounded-2xl border border-win/25 bg-panel/70">
        <CategoryForm />
      </div>

      <h2 className="mt-10 font-display text-lg font-semibold">Befintliga ({cats.length})</h2>
      <div className="mt-3 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-panel/70">
        {cats.length === 0 && <p className="p-8 text-center text-mute">Inga kategorier än.</p>}
        {cats.map((c) => (
          <div key={c.id}>
            <CategoryForm cat={c} threads={c.threads} />
            <p className="-mt-3 px-5 pb-4 text-xs text-mute">
              /forum/{c.slug} · {c.threads} trådar · {c.posts} inlägg
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
