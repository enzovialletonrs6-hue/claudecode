import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { safeNextPath } from "@/lib/auth/redirect";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_TYPES: EmailOtpType[] = ["email", "magiclink", "signup", "recovery", "invite"];

// Lien reçu par email (connexion, invitation) : on valide le jeton puis on ouvre la session.
// Fonctionne même si le lien s'ouvre dans un autre navigateur que celui de la demande.
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = safeNextPath(searchParams.get("next"));

  const failure = new URL("/connexion?erreur=lien", request.url);
  if (!tokenHash || !type || !ALLOWED_TYPES.includes(type)) {
    return NextResponse.redirect(failure);
  }

  const supabase = await createClient();
  if (!supabase) return NextResponse.redirect(failure);

  const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
  if (error) return NextResponse.redirect(failure);

  return NextResponse.redirect(new URL(next, request.url));
}
