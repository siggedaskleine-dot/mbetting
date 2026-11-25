"use client";

import Link from "next/link";
import { marked } from "marked";
import { useActionState, useMemo, useState } from "react";
import type { FormState } from "./actions";
import type { Tip } from "@/lib/tips";

type Action = (state: FormState, form: FormData) => Promise<FormState>;

const input =
  "mt-1 w-full rounded-xl border border-line bg-ink/60 px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-win/60 focus:shadow-[0_0_0_4px_rgba(44,245,155,0.12)]";

function toLocalInput(d: Date) {
  // Visa matchtiden i svensk tid i datumfältet.
  const parts = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Stockholm",
    year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false,
  }).format(d);
  return parts.replace(" ", "T");
}

export function TipForm({ action, tip }: { action: Action; tip?: Tip }) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [body, setBody] = useState(tip?.body ?? "");
  const [preview, setPreview] = useState(false);
  const html = useMemo(() => (preview ? (marked.parse(body, { breaks: true, async: false }) as string) : ""), [preview, body]);

  const field = (name: string, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <label className="block">
      <span className="text-sm text-mute">{label}</span>
      <input name={name} className={input} {...props} />
    </label>
  );

  return (
    <form action={formAction} className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <div className="space-y-5">
        {field("title", "Rubrik", { defaultValue: tip?.title, required: true, placeholder: "Derbyt bjuder på mål" })}
        <label className="block">
          <span className="text-sm text-mute">Ingress (syns på korten)</span>
          <textarea name="excerpt" rows={2} defaultValue={tip?.excerpt} className={input} placeholder="En eller två meningar som sammanfattar tipset." />
        </label>
        <div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-mute">Analys</span>
            <div className="flex rounded-full border border-line p-0.5 text-xs">
              <button type="button" onClick={() => setPreview(false)} className={`rounded-full px-3 py-1 ${!preview ? "bg-white/10 text-white" : "text-mute"}`}>Skriv</button>
              <button type="button" onClick={() => setPreview(true)} className={`rounded-full px-3 py-1 ${preview ? "bg-white/10 text-white" : "text-mute"}`}>Förhandsvisa</button>
            </div>
          </div>
          <textarea
            name="body"
            rows={16}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className={`${input} font-mono text-sm leading-relaxed ${preview ? "hidden" : ""}`}
            placeholder={"Skriv din analys här.\n\n**Fetstil**, *kursiv*, ## Rubrik och - punktlistor fungerar."}
          />
          {preview && (
            <div className="prose-tip mt-1 min-h-[24rem] rounded-xl border border-line bg-ink/40 p-6" dangerouslySetInnerHTML={{ __html: html || "<p style='opacity:.5'>Inget att visa än.</p>" }} />
          )}
          <p className="mt-2 text-xs text-mute">Du kan använda Markdown: **fetstil**, *kursiv*, ## rubrik, - lista, [länk](https://…).</p>
        </div>
      </div>

      <aside className="space-y-5 rounded-2xl border border-line bg-panel/70 p-6 lg:sticky lg:top-24 lg:self-start">
        <h2 className="font-display text-lg font-semibold">Spelet</h2>
        <div className="grid grid-cols-2 gap-3">
          {field("sport", "Sport", { defaultValue: tip?.sport ?? "Fotboll", required: true, list: "sporter" })}
          {field("league", "Liga", { defaultValue: tip?.league, placeholder: "Premier League" })}
        </div>
        <datalist id="sporter">
          {["Fotboll", "Ishockey", "Tennis", "Basket", "Handboll", "Bandy", "Trav", "E-sport"].map((s) => <option key={s} value={s} />)}
        </datalist>
        {field("match", "Match", { defaultValue: tip?.match, required: true, placeholder: "Arsenal – Chelsea" })}
        {field("kickoff", "Matchstart (svensk tid)", { type: "datetime-local", defaultValue: tip ? toLocalInput(tip.kickoff) : undefined, required: true })}
        {field("pick", "Spel", { defaultValue: tip?.pick, required: true, placeholder: "Över 2,5 mål" })}
        <div className="grid grid-cols-2 gap-3">
          {field("odds", "Odds", { defaultValue: tip ? String(tip.odds).replace(".", ",") : undefined, required: true, inputMode: "decimal", placeholder: "1,92" })}
          {field("stake", "Insats (enheter)", { defaultValue: tip ? String(tip.stake).replace(".", ",") : "1", required: true, inputMode: "decimal" })}
        </div>
        <label className="block">
          <span className="text-sm text-mute">Säkerhet</span>
          <select name="confidence" defaultValue={tip?.confidence ?? 3} className={input}>
            {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} av 5</option>)}
          </select>
        </label>
        <label className="block">
          <span className="text-sm text-mute">Resultat</span>
          <select name="status" defaultValue={tip?.status ?? "pågår"} className={input}>
            <option value="pågår">Kommande</option>
            <option value="vunnen">Vunnen</option>
            <option value="förlorad">Förlorad</option>
            <option value="struken">Struken (räknas inte)</option>
          </select>
        </label>
        {field("slug", "Webbadress (valfri)", { defaultValue: tip?.slug, placeholder: "skapas från rubriken" })}

        {state?.error && <p className="rounded-xl border border-loss/30 bg-loss/10 px-4 py-3 text-sm text-loss">{state.error}</p>}

        <div className="flex flex-col gap-2 pt-2">
          <button name="intent" value="publish" disabled={pending} className="btn-primary justify-center disabled:opacity-60">
            {pending ? "Sparar…" : tip?.published ? "Spara och uppdatera" : "Publicera"}
          </button>
          <button name="intent" value="draft" disabled={pending} className="btn-ghost justify-center disabled:opacity-60">
            {tip?.published ? "Avpublicera och spara som utkast" : "Spara som utkast"}
          </button>
          <Link href="/admin" className="py-2 text-center text-sm text-mute hover:text-white">Avbryt</Link>
        </div>
      </aside>
    </form>
  );
}
