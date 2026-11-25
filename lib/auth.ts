import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";
import { db, schema } from "./db";

const adminEmails = (process.env.ADMIN_EMAIL ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: { user: schema.user, session: schema.session, account: schema.account, verification: schema.verification },
  }),
  emailAndPassword: { enabled: true, minPasswordLength: 8 },
  // Google-inloggning aktiveras när GOOGLE_CLIENT_ID och GOOGLE_CLIENT_SECRET finns.
  socialProviders: googleEnabled
    ? { google: { clientId: process.env.GOOGLE_CLIENT_ID!, clientSecret: process.env.GOOGLE_CLIENT_SECRET!, prompt: "select_account" } }
    : {},
  account: { accountLinking: { enabled: true, trustedProviders: ["google"] } },
  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "user", input: false },
    },
  },
  databaseHooks: {
    user: {
      create: {
        // Den som registrerar sig med e-posten i ADMIN_EMAIL blir admin.
        before: async (u) => ({
          data: { ...u, role: adminEmails.includes(u.email.toLowerCase()) ? "admin" : "user" },
        }),
      },
    },
  },
  plugins: [nextCookies()],
});

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function isAdmin() {
  const s = await getSession();
  return s?.user.role === "admin";
}
