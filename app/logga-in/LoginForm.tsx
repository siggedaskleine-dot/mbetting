"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

const input =
  "mt-1 w-full rounded-xl border border-line bg-ink/60 px-4 py-3 outline-none transition focus:border-win/60 focus:shadow-[0_0_0_4px_rgba(44,245,155,0.12)]";

const errors: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD: "Fel e-post eller lösenord.",
  USER_ALREADY_EXISTS: "Det finns redan ett konto med den e-posten.",
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "Det finns redan ett konto med den e-posten.",
  PASSWORD_TOO_SHORT: "Lösenordet måste vara minst 8 tecken.",
  INVALID_EMAIL: "Ogiltig e-postadress.",
};

export function LoginForm({ register, next, google }: { register: boolean; next: string; google: boolean }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email"));
    const password = String(f.get("password"));
    const res = register
      ? await authClient.signUp.email({ email, password, name: String(f.get("name") || email.split("@")[0]) })
      : await authClient.signIn.email({ email, password });
    setPending(false);
    if (res.error) {
      setError(errors[res.error.code ?? ""] ?? res.error.message ?? "Något gick fel. Försök igen.");
      return;
    }
    const role = (res.data?.user as { role?: string } | undefined)?.role;
    router.push(next === "/" && role === "admin" ? "/admin" : next);
    router.refresh();
  }

  return (
    <div className="mt-8 w-full rounded-3xl border border-line bg-panel/80 p-6 backdrop-blur sm:p-8">
      <button
        type="button"
        disabled={!google || pending}
        onClick={async () => {
          setPending(true);
          const res = await authClient.signIn.social({ provider: "google", callbackURL: next });
          if (res?.error) {
            setPending(false);
            setError("Det gick inte att logga in med Google. Försök igen.");
          }
        }}
        title={google ? undefined : "Google-inloggning är inte aktiverad än"}
        className="btn-ghost w-full justify-center disabled:opacity-50"
      >
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>
        Fortsätt med Google
      </button>
      <div className="my-6 flex items-center gap-3 text-xs text-mute"><span className="h-px flex-1 bg-line" />eller med e-post<span className="h-px flex-1 bg-line" /></div>
      <form className="space-y-4" onSubmit={onSubmit}>
        {register && (
          <label className="block">
            <span className="text-sm text-mute">Användarnamn</span>
            <input name="name" required minLength={2} maxLength={30} autoComplete="nickname" className={input} />
          </label>
        )}
        <label className="block">
          <span className="text-sm text-mute">E-post</span>
          <input name="email" type="email" required autoComplete="email" className={input} />
        </label>
        <label className="block">
          <span className="text-sm text-mute">Lösenord</span>
          <input name="password" type="password" required minLength={8} autoComplete={register ? "new-password" : "current-password"} className={input} />
        </label>
        {error && <p className="rounded-xl border border-loss/30 bg-loss/10 px-4 py-3 text-sm text-loss">{error}</p>}
        <button disabled={pending} className="btn-primary w-full justify-center disabled:opacity-60">
          {pending ? "Vänta…" : register ? "Skapa konto" : "Logga in"}
        </button>
      </form>
      {register && (
        <p className="mt-4 text-center text-xs text-mute">
          Genom att skapa ett konto godkänner du våra <Link href="/integritet" className="underline hover:text-white">villkor och integritetspolicy</Link> och intygar att du är minst 18 år.
        </p>
      )}
      <p className="mt-6 text-center text-sm text-mute">
        {register ? "Har du redan ett konto? " : "Inget konto än? "}
        <Link href={register ? `/logga-in?till=${encodeURIComponent(next)}` : `/logga-in?registrera=1&till=${encodeURIComponent(next)}`} className="text-win hover:underline">
          {register ? "Logga in" : "Bli medlem"}
        </Link>
      </p>
    </div>
  );
}
