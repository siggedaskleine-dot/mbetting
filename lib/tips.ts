// Exempeldata för steg 1. Ersätts av riktiga inlägg från databasen i steg 2,
// när admin kan publicera tips.

export type TipStatus = "vunnen" | "förlorad" | "pågår";

export type Tip = {
  slug: string;
  title: string;
  sport: string;
  league: string;
  match: string;
  kickoff: string; // ISO
  pick: string;
  odds: number;
  stake: number; // enheter
  confidence: 1 | 2 | 3 | 4 | 5;
  status: TipStatus;
  excerpt: string;
  body: string[];
};

export const tips: Tip[] = [
  {
    slug: "arsenal-chelsea-over-2-5",
    title: "Derbyt bjuder på mål: över 2,5 i London",
    sport: "Fotboll",
    league: "Premier League",
    match: "Arsenal – Chelsea",
    kickoff: "2026-11-29T17:30:00+01:00",
    pick: "Över 2,5 mål",
    odds: 1.92,
    stake: 2,
    confidence: 4,
    status: "pågår",
    excerpt: "Båda lagen har skapat över 1,8 xG per match senaste fem. Chelseas backlinje läcker på fasta situationer.",
    body: [
      "Arsenal har varit målfarliga hemma hela hösten och Chelsea har släppt in i sju raka bortamatcher.",
      "Båda lagen pressar högt, vilket ger ytor i omställningar. Jag tycker att 1,92 är för högt för över 2,5.",
    ],
  },
  {
    slug: "frolunda-farjestad-hemmaseger",
    title: "Frölunda tar hand om Färjestad",
    sport: "Ishockey",
    league: "SHL",
    match: "Frölunda – Färjestad",
    kickoff: "2026-11-27T19:00:00+01:00",
    pick: "Frölunda vinner (inkl. förlängning)",
    odds: 1.85,
    stake: 1.5,
    confidence: 3,
    status: "pågår",
    excerpt: "Färjestad saknar förstemålvakten och spelar tredje matchen på fyra dagar.",
    body: [
      "Frölundas powerplay är ligans bästa och Färjestad drar på sig många utvisningar borta.",
      "Med trötta ben och en reservmålvakt ser jag värde på hemmalaget.",
    ],
  },
  {
    slug: "real-madrid-btts",
    title: "Real Madrid – Sevilla: båda lagen gör mål",
    sport: "Fotboll",
    league: "La Liga",
    match: "Real Madrid – Sevilla",
    kickoff: "2026-11-22T21:00:00+01:00",
    pick: "Båda lagen gör mål",
    odds: 2.05,
    stake: 1,
    confidence: 3,
    status: "vunnen",
    excerpt: "Sevilla har gjort mål i tio raka bortamatcher. Det slutade 3–1.",
    body: ["Sevilla har gjort mål i tio raka bortamatcher och Real Madrid har släppt in i fyra raka. Det slutade 3–1."],
  },
  {
    slug: "sinner-alcaraz-set",
    title: "Över 3,5 set i kvartsfinalen",
    sport: "Tennis",
    league: "ATP Finals",
    match: "Sinner – Alcaraz",
    kickoff: "2026-11-20T14:00:00+01:00",
    pick: "Över 3,5 set",
    odds: 1.75,
    stake: 1,
    confidence: 2,
    status: "förlorad",
    excerpt: "Jämn duell på papperet men Sinner vann på raka set. Sånt händer.",
    body: ["Jämn duell på papperet, men Sinner vann på raka set. Sånt händer."],
  },
];

export const stats = {
  winRate: 61,
  roi: 14.2,
  tipsTotal: 248,
  units: 38.6,
};

export function formatOdds(o: number) {
  return o.toFixed(2).replace(".", ",");
}

export function formatKickoff(iso: string) {
  return new Intl.DateTimeFormat("sv-SE", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Stockholm",
  }).format(new Date(iso));
}
