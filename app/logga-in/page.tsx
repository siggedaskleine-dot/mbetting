import type { Metadata } from "next";
import { LogoMark } from "@/components/Logo";

export const metadata: Metadata = { title: "Logga in" };

type Props = { searchParams: Promise<{ registrera?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const register = (await searchParams).registrera === "1";

  return (
    <section className="mx-auto flex max-w-md flex-col items-center px-4 pt-16 sm:px-6">
      <LogoMark size={56} />
      <h1 className="mt-6 text-center font-display text-3xl font-bold">{register ? "Bli medlem" : "Välkommen tillbaka"}</h1>
      <p className="mt-2 text-center text-sm text-mute">
        {register ? "Skapa ett konto för att skriva i forumet." : "Logga in för att kommentera i forumet."}
      </p>

      <div className="mt-8 w-full rounded-3xl border border-line bg-panel/80 p-6 backdrop-blur sm:p-8">
        <button type="button" disabled className="btn-ghost w-full justify-center opacity-70">
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>
          Fortsätt med Google
        </button>
        <div className="my-6 flex items-center gap-3 text-xs text-mute"><span className="h-px flex-1 bg-line" />eller med e-post<span className="h-px flex-1 bg-line" /></div>
        <form className="space-y-4">
          {register && (
            <label className="block">
              <span className="text-sm text-mute">Användarnamn</span>
              <input disabled className="mt-1 w-full rounded-xl border border-line bg-ink/60 px-4 py-3 outline-none focus:border-win/60" />
            </label>
          )}
          <label className="block">
            <span className="text-sm text-mute">E-post</span>
            <input disabled type="email" className="mt-1 w-full rounded-xl border border-line bg-ink/60 px-4 py-3 outline-none focus:border-win/60" />
          </label>
          <label className="block">
            <span className="text-sm text-mute">Lösenord</span>
            <input disabled type="password" className="mt-1 w-full rounded-xl border border-line bg-ink/60 px-4 py-3 outline-none focus:border-win/60" />
          </label>
          <button type="button" disabled className="btn-primary w-full justify-center opacity-70">
            {register ? "Skapa konto" : "Logga in"}
          </button>
        </form>
        <p className="mt-6 rounded-xl border border-gold/30 bg-gold/10 p-3 text-center text-xs text-gold">
          Inloggningen kopplas på i nästa steg. Det här är designen.
        </p>
      </div>
    </section>
  );
}
