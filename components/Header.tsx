"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";

const links = [
  { href: "/", label: "Hem" },
  { href: "/tips", label: "Speltips" },
  { href: "/forum", label: "Forum" },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "border-b border-line bg-ink/75 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Huvudmeny">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive(l.href) ? "text-white" : "text-mute hover:text-white"
              }`}
            >
              {isActive(l.href) && (
                <span className="absolute inset-0 -z-10 rounded-full border border-win/30 bg-win/10 shadow-[0_0_20px_-4px_rgba(44,245,155,0.5)]" />
              )}
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/logga-in" className="text-sm font-medium text-mute transition-colors hover:text-white">
            Logga in
          </Link>
          <Link href="/logga-in?registrera=1" className="btn-primary !px-5 !py-2.5 text-sm">
            Bli medlem
          </Link>
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-full border border-line md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Stäng meny" : "Öppna meny"}
          aria-expanded={open}
        >
          <span className="relative block h-3 w-5">
            <span className={`absolute left-0 top-0 h-0.5 w-5 bg-white transition ${open ? "top-1.5 rotate-45" : ""}`} />
            <span className={`absolute left-0 top-1.5 h-0.5 w-5 bg-white transition ${open ? "opacity-0" : ""}`} />
            <span className={`absolute left-0 top-3 h-0.5 w-5 bg-white transition ${open ? "top-1.5 -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

      <div className={`overflow-hidden transition-[max-height] duration-300 md:hidden ${open ? "max-h-96" : "max-h-0"}`}>
        <nav className="flex flex-col gap-1 px-4 pb-5" aria-label="Mobilmeny">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-xl px-4 py-3 font-medium ${isActive(l.href) ? "bg-win/10 text-white" : "text-mute"}`}
            >
              {l.label}
            </Link>
          ))}
          <div className="mt-2 flex gap-2">
            <Link href="/logga-in" className="btn-ghost flex-1 justify-center">Logga in</Link>
            <Link href="/logga-in?registrera=1" className="btn-primary flex-1 justify-center">Bli medlem</Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
