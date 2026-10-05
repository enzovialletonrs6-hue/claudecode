import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

// Seules les pages liées au compte passent par ici : la landing reste statique et rapide.
export const config = {
  matcher: ["/app/:path*", "/connexion", "/inscription"],
};
