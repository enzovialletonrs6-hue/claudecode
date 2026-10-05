import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";

export function AuthShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-md flex-1 px-4 pt-6 pb-16 sm:px-6 sm:pt-12">
        <p className="font-mono text-[0.8rem] tracking-wide text-crayon uppercase">{eyebrow}</p>
        <h1 className="titre mt-2 text-[2.2rem] sm:text-[2.6rem]">{title}</h1>
        {intro && <p className="mt-3 text-encre/85">{intro}</p>}
        <div className="mt-7">{children}</div>
      </main>
    </>
  );
}
