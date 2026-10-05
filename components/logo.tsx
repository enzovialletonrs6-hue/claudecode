import Link from "next/link";

export function GhostGlyph({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M16 4.5C10.2 4.5 6.5 8.7 6.5 14.4V27.5l3.2-2.4 3.1 2.4 3.2-2.4 3.2 2.4 3.1-2.4 3.2 2.4V14.4C25.5 8.7 21.8 4.5 16 4.5Z" />
      <circle cx="12.4" cy="14" r="1.9" fill="var(--color-papier)" />
      <circle cx="19.6" cy="14" r="1.9" fill="var(--color-papier)" />
    </svg>
  );
}

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 py-2 text-encre"
      aria-label={href === "/" ? "Fantômes, retour à l'accueil" : "Fantômes, retour à ton espace"}
    >
      <GhostGlyph className="h-7 w-7" />
      <span className="titre text-[1.4rem] leading-none">Fantômes</span>
    </Link>
  );
}
