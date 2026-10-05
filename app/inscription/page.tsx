import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";
import { Notice } from "@/components/form/fields";
import { NOT_CONFIGURED_MESSAGE } from "@/lib/auth/errors";
import { routes } from "@/lib/site";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = {
  title: "Créer mon compte",
  description: "Crée ton compte Fantômes gratuitement et découvre ce que te coûtent tes abonnements.",
  alternates: { canonical: routes.start },
  openGraph: { url: routes.start },
};

export default function Inscription() {
  return (
    <AuthShell
      eyebrow="Analyse gratuite · sans carte bancaire"
      title={
        <>
          Crée ton compte, <span className="surligne">c&apos;est parti.</span>
        </>
      }
      intro="Ensuite, tu déposes ton relevé et tu vois tout de suite ce que te coûtent tes abonnements sur un an."
    >
      {!isSupabaseConfigured && <Notice>{NOT_CONFIGURED_MESSAGE}</Notice>}
      <SignupForm />
      <p className="mt-5 text-[0.9rem] text-crayon">
        En créant ton compte, tu acceptes les{" "}
        <Link href={routes.terms} className="lien">
          conditions générales de vente
        </Link>{" "}
        et la{" "}
        <Link href={routes.privacy} className="lien">
          politique de confidentialité
        </Link>
        .
      </p>
      <p className="pointilles mt-8 border-t pt-6">
        Déjà un compte ?{" "}
        <Link href="/connexion" className="lien font-bold">
          Me connecter
        </Link>
      </p>
    </AuthShell>
  );
}
