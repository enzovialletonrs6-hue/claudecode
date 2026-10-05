import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { DeleteAccountForm, PasswordForm } from "@/components/settings-forms";
import { signOut } from "@/lib/auth/actions";
import { offer } from "@/lib/site";
import type { Access } from "@/lib/supabase/database.types";
import { getCurrentUser } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Réglages" };

const accessLabels: Record<Access, { title: string; text: string }> = {
  free: {
    title: "Analyse gratuite",
    text: `L'audit complet (${offer.priceLabel}, ${offer.billing}) débloque la liste complète de tes prélèvements et les lettres de résiliation.`,
  },
  audit: { title: "Audit complet", text: "Tu as accès à toute ta liste et à toutes les lettres." },
  monthly: { title: "Abonnement mensuel", text: "Tu as accès à toute ta liste et à toutes les lettres." },
  manual: { title: "Audit complet (offert)", text: "Tu as accès à toute ta liste et à toutes les lettres." },
};

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="pointilles flex flex-col gap-4 border-t pt-6">
      <h2 className="titre text-[1.4rem] leading-tight">{title}</h2>
      {children}
    </section>
  );
}

export default async function Reglages() {
  const { supabase, user } = await getCurrentUser();
  if (!supabase || !user) redirect("/connexion?suite=/app/reglages");

  const { data: profile } = await supabase
    .from("profiles")
    .select("access")
    .eq("id", user.id)
    .single();
  const access = accessLabels[profile?.access ?? "free"];

  return (
    <div className="flex flex-col gap-8">
      <h1 className="titre text-[2.2rem] sm:text-[2.8rem]">Réglages</h1>

      <Section title="Ton compte">
        <p>
          Connecté avec <strong className="break-all">{user.email}</strong>
        </p>
        <form action={signOut}>
          <button type="submit" className="bouton-secondaire w-full sm:w-auto">
            Me déconnecter
          </button>
        </form>
      </Section>

      <Section title="Ton offre">
        <div className="rounded-xl border-2 border-encre bg-feuille p-4">
          <p className="font-bold">{access.title}</p>
          <p className="mt-1 text-encre/85">{access.text}</p>
        </div>
      </Section>

      <Section title="Mot de passe">
        <p className="text-encre/85">
          Utile si tu t&apos;es connecté avec un code reçu par email et que tu veux un mot de
          passe.
        </p>
        <PasswordForm />
      </Section>

      <Section title="Supprimer mon compte">
        <p className="text-encre/85">
          Ton compte, tes abonnements repérés et tes coordonnées sont effacés tout de suite, et
          définitivement. Tes relevés, eux, ne sont jamais conservés.
        </p>
        <details className="group rounded-xl border-2 border-trait p-4 open:border-tampon">
          <summary className="flex min-h-11 cursor-pointer list-none items-center font-bold text-tampon [&::-webkit-details-marker]:hidden">
            Je veux supprimer mon compte
          </summary>
          <div className="mt-3">
            <DeleteAccountForm />
          </div>
        </details>
      </Section>
    </div>
  );
}
