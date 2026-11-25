"use client";

import Link from "next/link";
import { useTransition } from "react";
import { deleteTip, setStatus } from "./actions";
import type { TipStatus } from "@/lib/tips";

const options: { v: TipStatus; label: string; cls: string }[] = [
  { v: "pågår", label: "Kommande", cls: "data-[on=true]:bg-gold/20 data-[on=true]:text-gold" },
  { v: "vunnen", label: "Vunnen", cls: "data-[on=true]:bg-win/20 data-[on=true]:text-win" },
  { v: "förlorad", label: "Förlorad", cls: "data-[on=true]:bg-loss/20 data-[on=true]:text-loss" },
  { v: "struken", label: "Struken", cls: "data-[on=true]:bg-white/15 data-[on=true]:text-white" },
];

export function TipRowActions({ id, status, slug }: { id: number; status: TipStatus; slug: string | null }) {
  const [pending, start] = useTransition();

  return (
    <div className={`flex flex-wrap items-center gap-2 ${pending ? "opacity-50" : ""}`}>
      <div className="flex rounded-full border border-line bg-ink/60 p-1 text-xs" role="group" aria-label="Resultat">
        {options.map((o) => (
          <button
            key={o.v}
            data-on={status === o.v}
            disabled={pending}
            onClick={() => start(() => setStatus(id, o.v))}
            className={`rounded-full px-3 py-1.5 text-mute transition hover:text-white ${o.cls}`}
          >
            {o.label}
          </button>
        ))}
      </div>
      {slug && <Link href={`/tips/${slug}`} className="rounded-full px-3 py-1.5 text-xs text-mute hover:text-white">Visa</Link>}
      <Link href={`/admin/${id}`} className="rounded-full border border-line px-3 py-1.5 text-xs hover:bg-white/5">Redigera</Link>
      <button
        disabled={pending}
        onClick={(e) => {
          const btn = e.currentTarget;
          if (btn.dataset.confirm !== "1") {
            btn.dataset.confirm = "1";
            btn.textContent = "Säker?";
            setTimeout(() => {
              btn.dataset.confirm = "";
              btn.textContent = "Ta bort";
            }, 3000);
            return;
          }
          start(() => deleteTip(id));
        }}
        className="rounded-full border border-loss/30 px-3 py-1.5 text-xs text-loss hover:bg-loss/10"
      >
        Ta bort
      </button>
    </div>
  );
}
