import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora", weight: ["400", "600", "700", "800"] });

export const metadata: Metadata = {
  title: { default: "MBetting Tips – Speltips med analys", template: "%s · MBetting Tips" },
  description: "Genomarbetade speltips inom fotboll, hockey och tennis. Läs tipsen gratis och diskutera i forumet.",
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv" className={`${inter.variable} ${sora.variable}`}>
      <body className="min-h-screen">
        <div className="aurora" aria-hidden="true" />
        <div className="grid-bg" aria-hidden="true" />
        <Header />
        <main className="pt-18">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
