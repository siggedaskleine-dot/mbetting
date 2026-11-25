# Publicera MBetting Tips

Den här guiden tar sidan från GitHub till nätet. Allt nedan går att göra gratis.
Räkna med ungefär 20 minuter. Du behöver tre konton: **Turso** (databas), **Vercel** (webbhotell) och **Google Cloud** (för Google-inloggning).

## 1. Skapa databasen på Turso

1. Gå till [turso.tech](https://turso.tech) och logga in med ditt GitHub-konto.
2. Klicka **Create Database**. Döp den till `mbetting` och välj regionen **Europe (Stockholm/Frankfurt)** eller närmast.
3. Öppna databasen och kopiera **Database URL**. Den börjar med `libsql://`.
4. Klicka **Create Token** och kopiera token.

Spara båda, du behöver dem i steg 2.

## 2. Lägg upp sidan på Vercel

1. Gå till [vercel.com](https://vercel.com) och logga in med GitHub.
2. Klicka **Add New → Project** och välj repot `mbetting`. Ge Vercel åtkomst om den frågar.
3. Öppna **Environment Variables** och lägg in:

   | Namn | Värde |
   | --- | --- |
   | `DATABASE_URL` | Database URL från Turso |
   | `DATABASE_AUTH_TOKEN` | Token från Turso |
   | `BETTER_AUTH_SECRET` | En lång slumpad text, minst 32 tecken. Till exempel från [generate-secret.vercel.app/32](https://generate-secret.vercel.app/32) |
   | `BETTER_AUTH_URL` | Sidans adress, t.ex. `https://mbetting.vercel.app` (fyll i när du vet adressen, se punkt 5) |
   | `ADMIN_EMAIL` | Din e-postadress. Den blir admin. |

4. Klicka **Deploy**. Bygget skapar tabellerna i databasen och lägger in fem forumkategorier automatiskt.
5. När bygget är klart får du en adress, t.ex. `mbetting.vercel.app`. Kontrollera att `BETTER_AUTH_URL` stämmer med den. Ändrar du den: gå till **Deployments**, välj de tre prickarna på senaste och **Redeploy**.

## 3. Bli admin

1. Öppna sidan och klicka **Bli medlem**.
2. Registrera dig med **exakt den e-post** du skrev i `ADMIN_EMAIL` (med e-post och lösenord, eller med Google om det är samma adress).
3. Nu ser du knappen **Admin** i toppmenyn. Där skriver du tips och hanterar forumkategorier.

## 4. Slå på Google-inloggning

1. Gå till [console.cloud.google.com](https://console.cloud.google.com) och skapa ett nytt projekt, t.ex. `MBetting`.
2. Gå till **APIs & Services → OAuth consent screen**. Välj **External**, fyll i appnamn `MBetting Tips`, din e-post och spara. Klicka **Publish app** så att alla kan logga in.
3. Gå till **APIs & Services → Credentials → Create Credentials → OAuth client ID**.
   - Application type: **Web application**
   - Authorized JavaScript origins: `https://mbetting.vercel.app` (din adress)
   - Authorized redirect URIs: `https://mbetting.vercel.app/api/auth/callback/google`
4. Kopiera **Client ID** och **Client secret**.
5. Lägg in dem i Vercel under **Environment Variables** som `GOOGLE_CLIENT_ID` och `GOOGLE_CLIENT_SECRET`, och gör **Redeploy**.

Knappen **Fortsätt med Google** fungerar nu.

## 5. Egen domän (valfritt)

1. Köp en domän, t.ex. `mbetting.se`, hos en registrar (Loopia, One.com, Namecheap m.fl.).
2. I Vercel: **Settings → Domains → Add** och följ instruktionerna för DNS.
3. Uppdatera `BETTER_AUTH_URL` till den nya adressen och lägg till den nya adressen i Google (punkt 4.3). Gör **Redeploy**.

## Uppdateringar

Varje gång något ändras på `main`-grenen på GitHub bygger Vercel om sidan automatiskt. Databasen uppdateras samtidigt om tabellerna har ändrats.

## Om något krånglar

- **"Ingen behörighet" på /admin:** kontot registrerades med en annan e-post än `ADMIN_EMAIL`. Registrera dig med rätt adress.
- **Google-inloggningen ger fel om "redirect_uri_mismatch":** adressen i Google (punkt 4.3) stämmer inte exakt med sidans adress.
- **Inloggningen fungerar inte alls:** kontrollera att `BETTER_AUTH_URL` och `BETTER_AUTH_SECRET` är ifyllda och gör **Redeploy**.
