import Link from "next/link";
import { routes, site } from "@/lib/site";
import { Logo } from "./logo";

const links = [
  { href: routes.legal, label: "Mentions légales" },
  { href: routes.terms, label: "Conditions générales de vente" },
  { href: routes.privacy, label: "Confidentialité" },
];

export function SiteFooter() {
  return (
    <footer
      data-cta-anchor
      className="pointilles mt-auto border-t px-4 pt-8 pb-10 sm:px-6"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-1 text-[0.95rem] text-crayon">{site.promise}</p>
        </div>
        <nav aria-label="Informations légales">
          <ul className="flex flex-col gap-1 text-[0.95rem]">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-block py-1.5 underline decoration-trait underline-offset-4 hover:decoration-encre"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={`mailto:${site.contactEmail}`}
                className="inline-block py-1.5 underline decoration-trait underline-offset-4 hover:decoration-encre"
              >
                Nous écrire
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <p className="mx-auto mt-8 max-w-6xl font-mono text-[0.8rem] text-crayon">
        © {new Date().getFullYear()} Fantômes
      </p>
    </footer>
  );
}
