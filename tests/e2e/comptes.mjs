// Test de bout en bout des comptes : inscription, connexion (mot de passe, code, lien),
// sécurité des données (RLS) et suppression. Nécessite `npx supabase start` et
// `PORT=3000 npm run start` (avec .env.local pointant vers le Supabase local).
import { chromium } from "playwright";
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";

const env = Object.fromEntries(fs.readFileSync(new URL("../../.env.local", import.meta.url), "utf8").trim().split("\n").map((l) => l.split(/=(.*)/s).slice(0, 2)));
const BASE = "http://localhost:3000";
const MAIL = "http://127.0.0.1:54324";
const email = `test.${Date.now()}@exemple.fr`;
const results = [];
const check = (name, ok, extra = "") => { results.push([ok ? "OK " : "ÉCHEC", name, extra]); };

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const mobile = { viewport: { width: 375, height: 812 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true };
const ctx = await browser.newContext(mobile);
const page = await ctx.newPage();

// 1. Validation côté serveur
await page.goto(BASE + "/inscription");
await page.getByRole("button", { name: "Créer mon compte gratuit" }).click();
await page.waitForSelector("#email-erreur");
check("champs vides refusés", (await page.textContent("#email-erreur")).includes("Indique") || (await page.textContent("#email-erreur")).includes("valide"), await page.textContent("#email-erreur"));
await page.fill("#email", "pas-un-email");
await page.fill("#password", "123");
await page.getByRole("button", { name: "Créer mon compte gratuit" }).click();
await page.waitForFunction(() => document.querySelector("#password-erreur")?.textContent.includes("8"));
check("email invalide + mot de passe court", (await page.textContent("#email-erreur")).includes("pas valide") && (await page.textContent("#password-erreur")).includes("8 caractères"));
check("email conservé après erreur", (await page.inputValue("#email")) === "pas-un-email", await page.inputValue("#email"));
await page.screenshot({ path: "/tmp/fantomes-e2e-inscription-erreurs.png" });

// 2. Inscription réussie
await page.fill("#email", email);
await page.fill("#password", "motdepasse1");
await page.getByRole("button", { name: "Créer mon compte gratuit" }).click();
await page.waitForURL(BASE + "/app", { timeout: 15000 });
check("inscription → espace", page.url() === BASE + "/app");
check("état vide guidé affiché", await page.getByText("Allons débusquer").isVisible());
await page.screenshot({ path: "/tmp/fantomes-e2e-app.png", fullPage: true });

// 3. Déjà connecté → /inscription renvoie vers /app
await page.goto(BASE + "/inscription");
check("inscription redirige si connecté", page.url() === BASE + "/app", page.url());

// 4. Réglages
await page.goto(BASE + "/app/reglages");
check("réglages : email affiché", await page.getByText(email).isVisible());
check("réglages : offre gratuite", await page.getByText("Analyse gratuite").isVisible());
await page.fill("#password", "nouveaumdp2");
await page.getByRole("button", { name: "Enregistrer le mot de passe" }).click();
await page.waitForSelector("text=C'est enregistré");
check("changement de mot de passe", true);
await page.screenshot({ path: "/tmp/fantomes-e2e-reglages.png", fullPage: true });

// 5. Déconnexion puis accès protégé
await page.getByRole("button", { name: "Me déconnecter" }).click();
await page.waitForURL(BASE + "/");
await page.goto(BASE + "/app/reglages");
check("accès protégé après déconnexion", page.url().startsWith(BASE + "/connexion?suite=%2Fapp%2Freglages"), page.url());

// 6. Mauvais mot de passe, puis bon mot de passe → retour à la page demandée
await page.fill("#email", email);
await page.fill("#password", "motdepasse1");
await page.getByRole("button", { name: "Me connecter" }).click();
await page.waitForSelector("p[role=alert]");
check("mauvais mot de passe", (await page.textContent("p[role=alert]")).includes("incorrect"));
await page.fill("#password", "nouveaumdp2");
await page.getByRole("button", { name: "Me connecter" }).click();
await page.waitForURL(BASE + "/app/reglages");
check("connexion → page demandée", true);
await page.getByRole("button", { name: "Me déconnecter" }).click();
await page.waitForURL(BASE + "/");

// 7. Connexion par code reçu par email
await fetch(MAIL + "/api/v1/messages", { method: "DELETE" });
await page.goto(BASE + "/connexion?mode=code");
await page.fill("#email", email);
await page.getByRole("button", { name: "Recevoir mon code" }).click();
await page.waitForSelector("text=On t'a envoyé un code");
let msg;
for (let i = 0; i < 20 && !msg; i++) {
  const list = await (await fetch(MAIL + "/api/v1/messages")).json();
  msg = list.messages?.find((m) => m.To?.some((t) => t.Address === email));
  if (!msg) await new Promise((r) => setTimeout(r, 500));
}
const full = await (await fetch(`${MAIL}/api/v1/message/${msg.ID}`)).json();
check("email de connexion en français", full.Subject === "Ton code de connexion Fantômes", full.Subject);
const code = full.HTML.match(/>(\d{6})</)?.[1];
const link = full.HTML.match(/href="([^"]*auth\/confirm[^"]*)"/)?.[1]?.replace(/&amp;/g, "&");
check("code et lien présents", Boolean(code && link), `${code} ${link}`);
await page.screenshot({ path: "/tmp/fantomes-e2e-code.png" });
await page.fill("#code", "000000");
await page.getByRole("button", { name: "Me connecter" }).click();
await page.waitForSelector("p[role=alert]");
check("mauvais code refusé", (await page.textContent("p[role=alert]")).includes("expiré"));
await page.fill("#code", code);
await page.getByRole("button", { name: "Me connecter" }).click();
await page.waitForURL(BASE + "/app");
check("connexion par code", true);

// 8. Lien de l'email ouvert dans un AUTRE navigateur (cas TikTok / Instagram)
await fetch(MAIL + "/api/v1/messages", { method: "DELETE" });
const ctx2 = await browser.newContext(mobile);
const p2 = await ctx2.newPage();
await p2.goto(BASE + "/connexion?mode=code");
await p2.fill("#email", email);
await p2.getByRole("button", { name: "Recevoir mon code" }).click();
await p2.waitForSelector("text=On t'a envoyé un code");
let msg2;
for (let i = 0; i < 20 && !msg2; i++) {
  const list = await (await fetch(MAIL + "/api/v1/messages")).json();
  msg2 = list.messages?.[0];
  if (!msg2) await new Promise((r) => setTimeout(r, 500));
}
const full2 = await (await fetch(`${MAIL}/api/v1/message/${msg2.ID}`)).json();
const link2 = full2.HTML.match(/href="([^"]*auth\/confirm[^"]*)"/)?.[1]?.replace(/&amp;/g, "&");
const ctx3 = await browser.newContext(mobile);
const p3 = await ctx3.newPage();
await p3.goto(link2);
check("lien email dans un autre navigateur", p3.url() === BASE + "/app", p3.url());
await p3.goto(link2);
check("lien déjà utilisé, déjà connecté → espace", p3.url() === BASE + "/app", p3.url());
const ctx5 = await browser.newContext(mobile);
const p5 = await ctx5.newPage();
await p5.goto(link2);
check("lien déjà utilisé, non connecté → message clair", p5.url().includes("erreur=lien") && (await p5.getByText("a expiré ou a déjà servi").isVisible()), p5.url());
await p5.screenshot({ path: "/tmp/fantomes-e2e-lien-expire.png" });
await ctx2.close(); await ctx3.close(); await ctx5.close();

// 9. Inscription avec un email déjà pris
const ctx4 = await browser.newContext(mobile);
const p4 = await ctx4.newPage();
await p4.goto(BASE + "/inscription");
await p4.fill("#email", email);
await p4.fill("#password", "autremdp123");
await p4.getByRole("button", { name: "Créer mon compte gratuit" }).click();
await p4.waitForSelector("p[role=alert]");
check("email déjà pris", (await p4.textContent("p[role=alert]")).includes("existe déjà"), await p4.textContent("p[role=alert]"));
await ctx4.close();

// 10. Sécurité des données (RLS), en se faisant passer pour l'utilisateur avec la clé publique
const user = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, { auth: { persistSession: false } });
await user.auth.signInWithPassword({ email, password: "nouveaumdp2" });
const other = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, { auth: { persistSession: false } });
const otherEmail = `autre.${Date.now()}@exemple.fr`;
await other.auth.signUp({ email: otherEmail, password: "motdepasse1" });
const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SECRET_KEY, { auth: { persistSession: false } });
const { data: otherProfile } = await admin.from("profiles").select("id").eq("email", otherEmail).single();
await admin.from("charges").insert({ user_id: otherProfile.id, merchant_key: "netflix", label: "Netflix", raw_label: "PRLV NETFLIX", amount_cents: 1349, frequency: "monthly", first_seen: "2026-07-01", last_seen: "2026-09-01" });

const { data: profiles } = await user.from("profiles").select("id, email, access");
check("RLS : ne voit que son profil", profiles.length === 1 && profiles[0].email === email, JSON.stringify(profiles));
const { error: accessErr } = await user.from("profiles").update({ access: "audit" }).eq("email", email);
check("RLS : impossible de se débloquer l'accès", Boolean(accessErr), accessErr?.message);
const { data: upd, error: nameErr } = await user.from("profiles").update({ full_name: "Camille Test" }).eq("email", email).select("full_name");
check("RLS : peut modifier son nom", !nameErr && upd?.[0]?.full_name === "Camille Test", nameErr?.message);
const { data: charges } = await user.from("charges").select("*");
check("RLS : ne voit pas les prélèvements d'autrui", charges.length === 0, JSON.stringify(charges));
const { error: insErr } = await user.from("charges").insert({ user_id: profiles[0].id, merchant_key: "x", label: "x", raw_label: "x", amount_cents: 100, frequency: "monthly", first_seen: "2026-01-01", last_seen: "2026-02-01" });
check("RLS : ne peut pas créer de prélèvement", Boolean(insErr), insErr?.message);
const { data: ev, error: evErr } = await user.from("stripe_events").select("*");
check("RLS : journal Stripe invisible", Boolean(evErr) || ev.length === 0, evErr?.message);
const { data: otherCharge } = await admin.from("charges").select("annual_cents").eq("user_id", otherProfile.id).single();
check("coût annuel calculé par la base", otherCharge.annual_cents === 16188, String(otherCharge.annual_cents));

// 11. Suppression du compte
await page.goto(BASE + "/app/reglages");
await page.getByText("Je veux supprimer mon compte").click();
await page.getByRole("button", { name: "Supprimer définitivement mon compte" }).click();
await page.waitForSelector("text=Coche la case");
check("suppression : confirmation exigée", true);
await page.check("input[name=confirmation]");
await page.getByRole("button", { name: "Supprimer définitivement mon compte" }).click();
await page.waitForURL(BASE + "/compte-supprime");
const { data: gone } = await admin.from("profiles").select("id").eq("email", email);
check("suppression : profil effacé", gone.length === 0);
const { error: loginErr } = await user.auth.signInWithPassword({ email, password: "nouveaumdp2" });
check("suppression : connexion impossible", Boolean(loginErr));
await page.goto(BASE + "/app");
check("suppression : session effacée", page.url().startsWith(BASE + "/connexion"), page.url());
await page.screenshot({ path: "/tmp/fantomes-e2e-connexion.png" });

await admin.auth.admin.deleteUser(otherProfile.id);
await browser.close();
for (const r of results) console.log(r.join(" | "));
console.log(results.every((r) => r[0] === "OK ") ? "\nTOUT EST VERT" : "\nDES ÉCHECS");
