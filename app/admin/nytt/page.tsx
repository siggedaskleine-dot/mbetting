import Link from "next/link";
import { createTip } from "../actions";
import { TipForm } from "../TipForm";

export default function NewTipPage() {
  return (
    <>
      <Link href="/admin" className="text-sm text-mute hover:text-white">← Dina tips</Link>
      <h1 className="mb-8 mt-3 font-display text-4xl font-extrabold">Nytt tips</h1>
      <TipForm action={createTip} />
    </>
  );
}
