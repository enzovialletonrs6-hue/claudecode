import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

// Page provisoire : remplacée par la vraie inscription à l'étape 2.
export const metadata: Metadata = {
  title: "Ouverture très bientôt",
  robots: { index: false },
};

export default function Inscription() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center gap-5 px-4 py-16 sm:px-6">
        <p className="font-mono text-[0.8rem] tracking-wide text-crayon uppercase">
          Presque prêt
        </p>
        <h1 className="titre text-[2.4rem] sm:text-[3rem]">
          Ça ouvre <span className="surligne">très bientôt.</span>
        </h1>
        <p>
          On met la dernière main à l&apos;analyse des relevés. Reviens dans quelques
          jours : tes fantômes ne vont nulle part, eux.
        </p>
        <Link href="/" className="bouton self-start">
          ← Retour à l&apos;accueil
        </Link>
      </main>
    </>
  );
}
