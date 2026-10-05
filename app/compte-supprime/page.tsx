import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Compte supprimé",
  robots: { index: false },
};

export default function CompteSupprime() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center gap-5 px-4 py-16 sm:px-6">
        <span className="tampon self-start text-[1.1rem]">Supprimé</span>
        <h1 className="titre text-[2.4rem] sm:text-[3rem]">C&apos;est fait.</h1>
        <p>
          Ton compte et toutes ses données ont été effacés. Merci d&apos;être passé, et bonne
          chasse aux fantômes.
        </p>
        <Link href="/" className="bouton self-start">
          Retour à l&apos;accueil
        </Link>
      </main>
    </>
  );
}
