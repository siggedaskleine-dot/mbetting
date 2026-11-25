# MBetting Tips

Speltips, blogg och forum. Byggt med Next.js, Tailwind, Drizzle (SQLite/Turso) och Better Auth.

## Kom igång lokalt

```bash
npm install
cp .env.example .env      # fyll i BETTER_AUTH_SECRET och ADMIN_EMAIL
npm run db:push           # skapar tabellerna i local.db
npm run db:seed           # valfritt: lägger in några exempeltips
npm run dev
```

Öppna http://localhost:3000, gå till **Bli medlem** och registrera dig med e-posten i `ADMIN_EMAIL`.
Det kontot blir admin och hamnar på `/admin`, där du skriver och publicerar tips.

## Miljövariabler

| Namn | Vad |
| --- | --- |
| `DATABASE_URL` | `file:local.db` lokalt, `libsql://…turso.io` i molnet |
| `DATABASE_AUTH_TOKEN` | Token från Turso (bara i molnet) |
| `BETTER_AUTH_SECRET` | Lång slumpad sträng: `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | Sidans adress, t.ex. `https://mbetting.se` |
| `ADMIN_EMAIL` | E-post som blir admin när den registreras (flera med komma) |

## Admin

- `/admin` listar alla tips med statistik. Där sätter du resultat (Kommande, Vunnen, Förlorad, Struken) med ett klick.
- Tipsen skrivs i Markdown och kan förhandsvisas innan de publiceras.
- Utkast syns inte för besökare.
- Träffsäkerhet, ROI och enheter räknas ut automatiskt från avgjorda tips. Strukna tips räknas inte.
