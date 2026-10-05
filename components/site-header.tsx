import { Logo } from "./logo";

export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 pt-3 sm:px-6">
      <Logo />
    </header>
  );
}
