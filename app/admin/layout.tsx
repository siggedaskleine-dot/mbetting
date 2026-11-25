import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const s = await getSession();
  if (!s) redirect("/logga-in?till=/admin");
  if (s.user.role !== "admin") {
    return (
      <section className="mx-auto max-w-md px-4 pt-24 text-center">
        <h1 className="font-display text-3xl font-bold">Ingen behörighet</h1>
        <p className="mt-3 text-mute">Du är inloggad som {s.user.email}, men kontot är inte admin.</p>
      </section>
    );
  }
  return <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6">{children}</div>;
}
