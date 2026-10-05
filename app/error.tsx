"use client";

import Link from "next/link";
import { useEffect } from "react";
import { GhostGlyph } from "@/components/logo";
import { SiteHeader } from "@/components/site-header";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center gap-5 px-4 py-16 sm:px-6">
        <GhostGlyph className="h-14 w-14 text-encre" />
        <p className="font-mono text-[0.8rem] tracking-wide text-crayon uppercase">
          Erreur
        </p>
        <h1 className="titre text-[2.4rem] sm:text-[3rem]">
          Quelque chose <span className="surligne">a coincé.</span>
        </h1>
        <p>
          Ce n&apos;est pas de ta faute. Réessaie dans un instant ; si ça continue,
          repasse par l&apos;accueil.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={() => retry()} className="bouton">
            Réessayer
          </button>
          <Link
            href="/"
            className="inline-flex min-h-14 items-center justify-center px-4 font-bold underline underline-offset-4"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </main>
    </>
  );
}
