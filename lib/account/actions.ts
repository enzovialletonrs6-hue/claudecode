"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { authErrorMessage, NOT_CONFIGURED_MESSAGE } from "@/lib/auth/errors";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/supabase/server";

export type SettingsFormState = { error?: string; fieldError?: string; success?: string };

const newPassword = z
  .string({ error: "Choisis un mot de passe." })
  .min(8, { error: "8 caractères minimum." })
  .max(72, { error: "72 caractères maximum." });

export async function updatePassword(
  _prev: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  const parsed = newPassword.safeParse(formData.get("password") ?? undefined);
  if (!parsed.success) return { fieldError: parsed.error.issues[0]?.message };

  const { supabase, user } = await getCurrentUser();
  if (!supabase) return { error: NOT_CONFIGURED_MESSAGE };
  if (!user) redirect("/connexion?suite=/app/reglages");

  const { error } = await supabase.auth.updateUser({ password: parsed.data });
  if (error) return { error: authErrorMessage(error) };
  return { success: "C'est enregistré : ton nouveau mot de passe est actif." };
}

// Supprime le compte et, en cascade, toutes ses données (profil, analyses, prélèvements).
export async function deleteAccount(
  _prev: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  if (formData.get("confirmation") !== "on") {
    return { fieldError: "Coche la case pour confirmer." };
  }

  const { supabase, user } = await getCurrentUser();
  if (!supabase) return { error: NOT_CONFIGURED_MESSAGE };
  if (!user) redirect("/connexion?suite=/app/reglages");

  const { error } = await createAdminClient().auth.admin.deleteUser(user.id);
  if (error) {
    console.error("Suppression de compte impossible", error);
    return { error: "La suppression n'a pas abouti. Réessaie, ou écris-nous." };
  }

  // Le compte n'existe plus : on efface simplement la session de ce navigateur.
  await supabase.auth.signOut({ scope: "local" });
  redirect("/compte-supprime");
}
