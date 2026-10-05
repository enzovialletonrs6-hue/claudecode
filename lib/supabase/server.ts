import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./database.types";
import { getSupabaseEnv } from "./env";

// Client Supabase côté serveur, au nom de l'utilisateur connecté (les règles RLS s'appliquent).
// Renvoie null tant que les clés ne sont pas configurées.
export async function createClient() {
  const env = getSupabaseEnv();
  if (!env) return null;
  const cookieStore = await cookies();

  return createServerClient<Database>(env.url, env.publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Appelé depuis un composant serveur : le proxy s'occupe de rafraîchir les cookies.
        }
      },
    },
  });
}

// Utilisateur connecté (vérifié auprès de Supabase), ou null.
export async function getCurrentUser() {
  const supabase = await createClient();
  if (!supabase) return { supabase: null, user: null };
  const { data } = await supabase.auth.getUser();
  return { supabase, user: data.user };
}
