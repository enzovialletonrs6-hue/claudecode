"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { NOT_CONFIGURED_MESSAGE, authErrorMessage } from "./errors";
import { safeNextPath } from "./redirect";

export type AuthFormState = {
  error?: string;
  fieldErrors?: { email?: string; password?: string; code?: string };
  email?: string;
  // Connexion par code : on passe à l'étape « saisir le code » une fois l'email envoyé.
  codeSent?: boolean;
};

const email = z
  .string({ error: "Indique ton adresse email." })
  .trim()
  .toLowerCase()
  .max(254, { error: "Adresse email trop longue." })
  .pipe(z.email({ error: "Cette adresse email n'est pas valide." }));

const newPassword = z
  .string({ error: "Choisis un mot de passe." })
  .min(8, { error: "8 caractères minimum." })
  .max(72, { error: "72 caractères maximum." });

const existingPassword = z
  .string({ error: "Indique ton mot de passe." })
  .min(1, { error: "Indique ton mot de passe." })
  .max(72);

const code = z
  .string({ error: "Indique le code reçu." })
  .trim()
  .regex(/^\d{6,10}$/, { error: "Le code ne contient que des chiffres." });

function firstErrors(error: z.ZodError) {
  const flat = z.flattenError(error).fieldErrors as Record<string, string[] | undefined>;
  return Object.fromEntries(
    Object.entries(flat).map(([key, list]) => [key, list?.[0]]),
  ) as AuthFormState["fieldErrors"];
}

const asText = (value: FormDataEntryValue | null) =>
  typeof value === "string" ? value : undefined;

export async function signUp(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const raw = { email: asText(formData.get("email")), password: asText(formData.get("password")) };
  const parsed = z.object({ email, password: newPassword }).safeParse(raw);
  if (!parsed.success) return { fieldErrors: firstErrors(parsed.error), email: raw.email };

  const supabase = await createClient();
  if (!supabase) return { error: NOT_CONFIGURED_MESSAGE, email: raw.email };

  const { data, error } = await supabase.auth.signUp(parsed.data);
  if (error) return { error: authErrorMessage(error), email: parsed.data.email };

  // Si la confirmation par email est activée dans Supabase, il n'y a pas encore de session.
  if (!data.session) redirect("/connexion?verifier=1");
  redirect("/app");
}

export async function signInWithPassword(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const raw = { email: asText(formData.get("email")), password: asText(formData.get("password")) };
  const parsed = z.object({ email, password: existingPassword }).safeParse(raw);
  if (!parsed.success) return { fieldErrors: firstErrors(parsed.error), email: raw.email };

  const supabase = await createClient();
  if (!supabase) return { error: NOT_CONFIGURED_MESSAGE, email: raw.email };

  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: authErrorMessage(error), email: parsed.data.email };

  redirect(safeNextPath(formData.get("suite")));
}

// Envoie un email contenant un code et un bouton de connexion.
// Crée le compte s'il n'existe pas encore : pas de cul-de-sac.
export async function sendLoginCode(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const raw = { email: asText(formData.get("email")) };
  const parsed = z.object({ email }).safeParse(raw);
  if (!parsed.success) return { fieldErrors: firstErrors(parsed.error), email: raw.email };

  const supabase = await createClient();
  if (!supabase) return { error: NOT_CONFIGURED_MESSAGE, email: raw.email };

  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: { shouldCreateUser: true },
  });
  if (error) return { error: authErrorMessage(error), email: parsed.data.email };

  return { codeSent: true, email: parsed.data.email };
}

export async function verifyLoginCode(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const raw = { email: asText(formData.get("email")), code: asText(formData.get("code")) };
  const parsed = z.object({ email, code }).safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: firstErrors(parsed.error), email: raw.email, codeSent: true };
  }

  const supabase = await createClient();
  if (!supabase) return { error: NOT_CONFIGURED_MESSAGE, email: raw.email, codeSent: true };

  const { error } = await supabase.auth.verifyOtp({
    email: parsed.data.email,
    token: parsed.data.code,
    type: "email",
  });
  if (error) {
    return { error: authErrorMessage(error), email: parsed.data.email, codeSent: true };
  }

  redirect(safeNextPath(formData.get("suite")));
}

export async function signOut() {
  const supabase = await createClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/");
}
