import Link from "next/link";
import { Logo } from "./logo";

export function SiteHeader({ showLogin = false }: { showLogin?: boolean }) {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 pt-3 sm:px-6">
      <Logo />
      {showLogin && (
        <Link href="/connexion" className="lien inline-flex min-h-11 items-center px-1 font-bold">
          Connexion
        </Link>
      )}
    </header>
  );
}
