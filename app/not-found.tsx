import type { Metadata } from "next";
import Link from "next/link";
import { GhostGlyph } from "@/components/logo";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Page introuvable",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center gap-5 px-4 py-16 sm:px-6">
        <GhostGlyph className="h-14 w-14 text-encre" />
        <p className="font-mono text-[0.8rem] tracking-wide text-crayon uppercase">
          Erreur 404
        </p>
        <h1 className="titre text-[2.4rem] sm:text-[3rem]">
          Cette page s&apos;est <span className="surligne">volatilisée.</span>
        </h1>
        <p>
          Le lien est peut-être incomplet, ou la page n&apos;existe plus. Pas de panique,
          l&apos;essentiel est sur l&apos;accueil.
        </p>
        <Link href="/" className="bouton self-start">
          Retour à l&apos;accueil
        </Link>
      </main>
    </>
  );
}
