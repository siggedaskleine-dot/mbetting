import type { Metadata } from "next";

export const metadata: Metadata = { title: "Villkor och integritet" };

export default function PrivacyPage() {
  return (
    <article className="prose-tip mx-auto max-w-3xl px-4 pt-16 sm:px-6">
      <h1 className="font-display text-4xl font-extrabold text-white">Villkor och integritet</h1>
      <p>MBetting Tips är en privat blogg och ett forum om sport och spel. Här beskriver vi kort vilka uppgifter vi sparar och vad som gäller i forumet.</p>

      <h2>Vilka uppgifter sparas?</h2>
      <ul>
        <li>När du blir medlem sparas ditt användarnamn och din e-postadress. Loggar du in med Google sparas även namn och profilbild från ditt Google-konto.</li>
        <li>Ditt lösenord sparas aldrig i klartext, bara i krypterad form.</li>
        <li>Inlägg du skriver i forumet sparas och visas publikt tillsammans med ditt användarnamn.</li>
        <li>En inloggningscookie används för att hålla dig inloggad. Vi använder inga cookies för reklam eller spårning.</li>
      </ul>

      <h2>Varför?</h2>
      <p>Uppgifterna används bara för att du ska kunna logga in och delta i forumet. De säljs inte och delas inte med andra.</p>

      <h2>Dina rättigheter</h2>
      <p>Du kan när som helst ta bort dina egna inlägg. Vill du att hela ditt konto och alla dina uppgifter raderas, kontakta admin så tas allt bort.</p>

      <h2>Regler i forumet</h2>
      <ul>
        <li>Du måste vara minst 18 år.</li>
        <li>Håll god ton. Personangrepp, hot och spam tas bort.</li>
        <li>Ingen reklam för spelbolag som saknar svensk licens.</li>
        <li>Admin kan ta bort inlägg och trådar och låsa diskussioner.</li>
      </ul>

      <h2>Spela ansvarsfullt</h2>
      <p>
        Tipsen är personliga bedömningar och ingen garanti för vinst. Spel kan vara beroendeframkallande. Behöver du en paus finns{" "}
        <a href="https://www.spelpaus.se" target="_blank" rel="noopener noreferrer">Spelpaus.se</a>, och vill du prata med någon finns{" "}
        <a href="https://www.stodlinjen.se" target="_blank" rel="noopener noreferrer">Stödlinjen</a>.
      </p>
    </article>
  );
}
