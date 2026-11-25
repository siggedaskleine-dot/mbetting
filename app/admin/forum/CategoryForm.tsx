"use client";

import { useActionState, useEffect, useRef, useTransition } from "react";
import { deleteCategory, saveCategory } from "@/app/forum/actions";
import type { ForumCategory } from "@/lib/db/schema";

const input =
  "w-full rounded-xl border border-line bg-ink/60 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-win/60";

export function CategoryForm({ cat, threads }: { cat?: ForumCategory; threads?: number }) {
  const [state, action, pending] = useActionState(saveCategory, undefined);
  const [delPending, start] = useTransition();
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok && !cat) ref.current?.reset();
  }, [state, cat]);

  return (
    <form ref={ref} action={action} className={`grid gap-3 p-5 sm:grid-cols-[64px_1fr_1.6fr_80px_auto] sm:items-center ${delPending ? "opacity-50" : ""}`}>
      {cat && <input type="hidden" name="id" value={cat.id} />}
      <input name="icon" defaultValue={cat?.icon ?? "💬"} aria-label="Ikon" className={`${input} text-center text-xl`} maxLength={4} />
      <input name="name" defaultValue={cat?.name} required placeholder="Namn, t.ex. Basket" aria-label="Namn" className={input} />
      <input name="description" defaultValue={cat?.description} placeholder="Kort beskrivning" aria-label="Beskrivning" className={input} />
      <input name="sortOrder" type="number" defaultValue={cat?.sortOrder ?? 0} aria-label="Ordning" title="Ordning (lägst först)" className={input} />
      <div className="flex items-center gap-2">
        <button disabled={pending} className={cat ? "rounded-full border border-line px-4 py-2 text-sm hover:bg-white/5" : "btn-primary !py-2.5 text-sm"}>
          {pending ? "Sparar…" : cat ? "Spara" : "Lägg till"}
        </button>
        {cat && (
          <button
            type="button"
            onClick={(e) => {
              const b = e.currentTarget;
              if (b.dataset.armed !== "1") {
                b.dataset.armed = "1";
                b.textContent = threads ? `Radera ${threads} trådar?` : "Säker?";
                setTimeout(() => {
                  b.dataset.armed = "";
                  b.textContent = "Ta bort";
                }, 3500);
                return;
              }
              start(() => deleteCategory(cat.id));
            }}
            className="rounded-full border border-loss/30 px-4 py-2 text-sm text-loss hover:bg-loss/10"
          >
            Ta bort
          </button>
        )}
      </div>
      {state?.error && <p className="text-sm text-loss sm:col-span-5">{state.error}</p>}
      {state?.ok && cat && <p className="text-sm text-win sm:col-span-5">Sparat.</p>}
    </form>
  );
}
