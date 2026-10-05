import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { getSupabaseEnv } from "./env";

// Client « administrateur » : contourne les règles RLS. Uniquement côté serveur,
// pour les opérations que l'utilisateur ne doit jamais pouvoir faire lui-même.
export function createAdminClient() {
  const env = getSupabaseEnv();
  const secretKey = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!env || !secretKey) {
    throw new Error("Clé secrète Supabase manquante (SUPABASE_SECRET_KEY).");
  }
  return createClient<Database>(env.url, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
