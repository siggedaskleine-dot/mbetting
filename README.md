# MBetting Tips

Speltips, blogg och forum. Byggt med Next.js, Tailwind, Drizzle (SQLite/Turso) och Better Auth.

## Kom igång lokalt

```bash
npm install
cp .env.example .env      # fyll i BETTER_AUTH_SECRET och ADMIN_EMAIL
npm run db:migrate        # skapar tabellerna i local.db och standardkategorier i forumet
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
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Slår på Google-inloggning (valfritt) |

**Publicera på nätet:** se [PUBLICERA.md](PUBLICERA.md).

## Admin

- `/admin` listar alla tips med statistik. Där sätter du resultat (Kommande, Vunnen, Förlorad, Struken) med ett klick.
- Tipsen skrivs i Markdown och kan förhandsvisas innan de publiceras.
- Utkast syns inte för besökare.
- Träffsäkerhet, ROI och enheter räknas ut automatiskt från avgjorda tips. Strukna tips räknas inte.

## Forum

- Alla kan läsa. För att skapa trådar och svara måste man vara medlem (e-post eller Google).
- Admin skapar, byter namn på, sorterar och tar bort kategorier på `/admin/forum`.
- Admin kan fästa, låsa och ta bort trådar och ta bort alla inlägg. Medlemmar kan ta bort sina egna inlägg.
- Enkel spamspärr: max ett inlägg per 15 sekunder per användare.

## Databasändringar

Ändra `lib/db/schema.ts`, kör `npm run db:generate` och checka in den nya filen i `drizzle/`.
Den körs automatiskt vid nästa bygge.
