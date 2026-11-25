"use client";

import { useActionState, useEffect, useRef } from "react";
import type { FormState } from "./actions";

type Action = (state: FormState, form: FormData) => Promise<FormState>;

const input =
  "mt-1 w-full rounded-xl border border-line bg-ink/60 px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-win/60 focus:shadow-[0_0_0_4px_rgba(44,245,155,0.12)]";

export function PostForm({ action, withTitle = false, submitLabel }: { action: Action; withTitle?: boolean; submitLabel: string }) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) ref.current?.reset();
  }, [state]);

  return (
    <form ref={ref} action={formAction} className="space-y-4">
      {withTitle && (
        <label className="block">
          <span className="text-sm text-mute">Rubrik</span>
          <input name="title" required minLength={3} maxLength={120} className={input} placeholder="Vad vill du diskutera?" />
        </label>
      )}
      <label className="block">
        <span className="text-sm text-mute">{withTitle ? "Inlägg" : "Ditt svar"}</span>
        <textarea name="body" required maxLength={5000} rows={withTitle ? 10 : 5} className={input} placeholder="Skriv här…" />
      </label>
      {state?.error && <p className="rounded-xl border border-loss/30 bg-loss/10 px-4 py-3 text-sm text-loss">{state.error}</p>}
      <div className="flex justify-end">
        <button disabled={pending} className="btn-primary disabled:opacity-60">{pending ? "Skickar…" : submitLabel}</button>
      </div>
    </form>
  );
}
