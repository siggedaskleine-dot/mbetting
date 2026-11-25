import type { Metadata } from "next";
import { LogoMark } from "@/components/Logo";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Logga in" };

type Props = { searchParams: Promise<{ registrera?: string; till?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const sp = await searchParams;
  const register = sp.registrera === "1";
  // Tillåt bara interna adresser att skickas vidare till.
  const next = sp.till && sp.till.startsWith("/") && !sp.till.startsWith("//") ? sp.till : "/";

  return (
    <section className="mx-auto flex max-w-md flex-col items-center px-4 pt-16 sm:px-6">
      <LogoMark size={56} />
      <h1 className="mt-6 text-center font-display text-3xl font-bold">{register ? "Bli medlem" : "Välkommen tillbaka"}</h1>
      <p className="mt-2 text-center text-sm text-mute">
        {register ? "Skapa ett konto för att skriva i forumet." : "Logga in för att kommentera i forumet."}
      </p>
      <LoginForm register={register} next={next} />
    </section>
  );
}
