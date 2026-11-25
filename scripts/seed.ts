// Lägger in några exempeltips så att sidan inte är tom vid test.
// Kör: npm run db:seed
try {
  process.loadEnvFile();
} catch {}

const d = (s: string) => new Date(s);

async function main() {
  // Importeras först nu så att .env hunnit läsas in.
  const { db } = await import("../lib/db");
  const { tip } = await import("../lib/db/schema");
  await db
    .insert(tip)
    .values([
      {
        slug: "arsenal-chelsea-over-2-5",
        title: "Derbyt bjuder på mål: över 2,5 i London",
        sport: "Fotboll", league: "Premier League", match: "Arsenal – Chelsea",
        kickoff: d("2026-11-29T17:30:00+01:00"), pick: "Över 2,5 mål", odds: 1.92, stake: 2, confidence: 4, status: "pågår",
        excerpt: "Båda lagen har skapat över 1,8 xG per match senaste fem. Chelseas backlinje läcker på fasta situationer.",
        body: "Arsenal har varit **målfarliga hemma** hela hösten och Chelsea har släppt in i sju raka bortamatcher.\n\nBåda lagen pressar högt, vilket ger ytor i omställningar. Jag tycker att 1,92 är för högt för över 2,5.",
        published: true, publishedAt: new Date(),
      },
      {
        slug: "frolunda-farjestad-hemmaseger",
        title: "Frölunda tar hand om Färjestad",
        sport: "Ishockey", league: "SHL", match: "Frölunda – Färjestad",
        kickoff: d("2026-11-27T19:00:00+01:00"), pick: "Frölunda vinner (inkl. förlängning)", odds: 1.85, stake: 1.5, confidence: 3, status: "pågår",
        excerpt: "Färjestad saknar förstemålvakten och spelar tredje matchen på fyra dagar.",
        body: "Frölundas powerplay är ligans bästa och Färjestad drar på sig många utvisningar borta.\n\nMed trötta ben och en reservmålvakt ser jag värde på hemmalaget.",
        published: true, publishedAt: new Date(),
      },
      {
        slug: "real-madrid-sevilla-btts",
        title: "Real Madrid – Sevilla: båda lagen gör mål",
        sport: "Fotboll", league: "La Liga", match: "Real Madrid – Sevilla",
        kickoff: d("2026-11-22T21:00:00+01:00"), pick: "Båda lagen gör mål", odds: 2.05, stake: 1, confidence: 3, status: "vunnen",
        excerpt: "Sevilla har gjort mål i tio raka bortamatcher. Det slutade 3–1.",
        body: "Sevilla har gjort mål i tio raka bortamatcher och Real Madrid har släppt in i fyra raka. Det slutade 3–1.",
        published: true, publishedAt: new Date(),
      },
      {
        slug: "sinner-alcaraz-set",
        title: "Över 3,5 set i toppmötet",
        sport: "Tennis", league: "ATP Finals", match: "Sinner – Alcaraz",
        kickoff: d("2026-11-20T14:00:00+01:00"), pick: "Över 3,5 set", odds: 1.75, stake: 1, confidence: 2, status: "förlorad",
        excerpt: "Jämn duell på papperet men Sinner vann på raka set. Sånt händer.",
        body: "Jämn duell på papperet, men Sinner vann på raka set. Sånt händer.",
        published: true, publishedAt: new Date(),
      },
    ])
    .onConflictDoNothing();
  console.log("Exempeltips inlagda.");
}

main();
export {};
