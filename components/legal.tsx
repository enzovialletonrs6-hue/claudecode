import type { ReactNode } from "react";
import { SiteHeader } from "./site-header";
import { site } from "@/lib/site";

// Marque bien visible pour ce qui reste à remplir avant la mise en production.
export function Todo({ children }: { children: ReactNode }) {
  return (
    <mark className="rounded-sm border border-dashed border-tampon bg-surligneur/60 px-1 font-mono text-[0.85em] text-encre">
      [À COMPLÉTER : {children}]
    </mark>
  );
}

// Tant que l'adresse de contact définitive n'existe pas, on l'affiche comme champ à remplir.
export function ContactEmail() {
  if (site.contactEmail.endsWith(".example")) return <Todo>email de contact</Todo>;
  return <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>;
}

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pt-6 pb-16 sm:px-6 md:pt-10">
        <h1 className="titre text-[2.2rem] sm:text-[2.8rem]">{title}</h1>
        <p className="mt-2 font-mono text-[0.8rem] text-crayon">
          Dernière mise à jour : {site.lastLegalUpdate}
        </p>
        <div className="mt-8 flex flex-col gap-8 [&_a]:underline [&_a]:underline-offset-4 [&_h2]:titre [&_h2]:mb-2 [&_h2]:text-[1.4rem] [&_h2]:leading-tight [&_li]:mt-1 [&_p+p]:mt-3 [&_ul+p]:mt-3 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-5">
          {children}
        </div>
      </main>
    </>
  );
}
