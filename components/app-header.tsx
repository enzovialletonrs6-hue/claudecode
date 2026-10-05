import Link from "next/link";
import { Logo } from "./logo";

export function AppHeader() {
  return (
    <header className="pointilles border-b">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-2 sm:px-6">
        <Logo href="/app" />
        <Link
          href="/app/reglages"
          className="lien inline-flex min-h-11 items-center px-1 font-bold"
        >
          Réglages
        </Link>
      </div>
    </header>
  );
}
