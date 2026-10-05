import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { CodeLoginForm, PasswordLoginForm } from "@/components/auth/login-forms";
import { FormError, Notice } from "@/components/form/fields";
import { NOT_CONFIGURED_MESSAGE } from "@/lib/auth/errors";
import { safeNextPath } from "@/lib/auth/redirect";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = {
  title: "Connexion",
  robots: { index: false },
};

export default async function Connexion({ searchParams }: PageProps<"/connexion">) {
  const params = await searchParams;
  const byCode = params.mode === "code";
  const suite = safeNextPath(params.suite);

  return (
    <AuthShell
      eyebrow="Connexion"
      title={byCode ? "On t'envoie un code." : "Content de te revoir."}
      intro={
        byCode
          ? "Pas besoin de mot de passe : indique ton email, tu reçois un code de connexion."
          : undefined
      }
    >
      <div className="flex flex-col gap-5">
        {!isSupabaseConfigured && <Notice>{NOT_CONFIGURED_MESSAGE}</Notice>}
        {params.erreur === "lien" && (
          <FormError message="Ce lien a expiré ou a déjà servi. Demande un nouveau code ci-dessous." />
        )}
        {params.verifier === "1" && (
          <Notice>
            Presque fini : confirme ton adresse en cliquant sur le lien qu&apos;on vient de
            t&apos;envoyer, puis connecte-toi.
          </Notice>
        )}
        {byCode || params.erreur === "lien" ? (
          <CodeLoginForm suite={suite} />
        ) : (
          <PasswordLoginForm suite={suite} />
        )}
      </div>

      <div className="pointilles mt-8 flex flex-col gap-3 border-t pt-6">
        {byCode ? (
          <Link href={`/connexion${suite !== "/app" ? `?suite=${encodeURIComponent(suite)}` : ""}`} className="lien font-bold">
            Me connecter avec mon mot de passe
          </Link>
        ) : (
          <Link
            href={`/connexion?mode=code${suite !== "/app" ? `&suite=${encodeURIComponent(suite)}` : ""}`}
            className="lien font-bold"
          >
            Mot de passe oublié ? Reçois un code par email
          </Link>
        )}
        <p>
          Pas encore de compte ?{" "}
          <Link href="/inscription" className="lien font-bold">
            Créer un compte gratuit
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
