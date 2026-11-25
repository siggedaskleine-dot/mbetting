import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { tip } from "@/lib/db/schema";
import { updateTip } from "../actions";
import { TipForm } from "../TipForm";

export default async function EditTipPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [row] = await db.select().from(tip).where(eq(tip.id, id));
  if (!row) notFound();

  return (
    <>
      <Link href="/admin" className="text-sm text-mute hover:text-white">← Dina tips</Link>
      <h1 className="mb-8 mt-3 font-display text-4xl font-extrabold">Redigera tips</h1>
      <TipForm action={updateTip.bind(null, row.id)} tip={row} />
    </>
  );
}
