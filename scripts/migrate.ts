// Körs automatiskt före varje bygge (npm run build) och lokalt med npm run db:migrate.
// Uppdaterar databasens tabeller och lägger in standardkategorier i forumet första gången.
try {
  process.loadEnvFile();
} catch {}

async function main() {
  const { migrate } = await import("drizzle-orm/libsql/migrator");
  const { db } = await import("../lib/db");
  const { forumCategory } = await import("../lib/db/schema");

  await migrate(db, { migrationsFolder: "./drizzle" });

  const existing = await db.select({ id: forumCategory.id }).from(forumCategory).limit(1);
  if (existing.length === 0) {
    await db.insert(forumCategory).values([
      { slug: "fotboll", name: "Fotboll", description: "Allsvenskan, Premier League, Champions League och mer.", icon: "⚽", sortOrder: 1 },
      { slug: "ishockey", name: "Ishockey", description: "SHL, NHL och internationell hockey.", icon: "🏒", sortOrder: 2 },
      { slug: "tennis", name: "Tennis", description: "Grand Slam, ATP och WTA.", icon: "🎾", sortOrder: 3 },
      { slug: "strategi", name: "Strategi och bankroll", description: "Insatser, värdespel och hur man håller disciplinen.", icon: "📈", sortOrder: 4 },
      { slug: "snack", name: "Allmänt snack", description: "Allt annat som rör spel och sport.", icon: "💬", sortOrder: 5 },
    ]);
    console.log("Standardkategorier för forumet inlagda.");
  }
  console.log("Databasen är uppdaterad.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
export {};
