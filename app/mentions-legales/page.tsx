import type { Metadata } from "next";
import { ContactEmail, LegalPage, Todo } from "@/components/legal";
import { routes } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Éditeur, hébergeur et informations légales du site Fantômes.",
  alternates: { canonical: routes.legal },
  openGraph: { url: routes.legal },
};

export default function MentionsLegales() {
  return (
    <LegalPage title="Mentions légales">
      <section>
        <h2>Éditeur du site</h2>
        <p>
          Le site Fantômes (<Todo>nom de domaine</Todo>) est édité par{" "}
          <Todo>prénom et nom</Todo>, entrepreneur individuel (micro-entreprise),
          exerçant sous le nom commercial « Fantômes ».
        </p>
        <ul>
          <li>
            Adresse : <Todo>adresse postale (ou adresse de domiciliation)</Todo>
          </li>
          <li>
            SIRET : <Todo>numéro SIRET</Todo>
          </li>
          <li>
            Email : <ContactEmail />
          </li>
          <li>
            Téléphone : <Todo>numéro de téléphone</Todo>
          </li>
          <li>
            TVA : TVA non applicable, article 293 B du Code général des impôts{" "}
            <Todo>à adapter si tu deviens redevable de la TVA</Todo>
          </li>
        </ul>
      </section>

      <section>
        <h2>Directeur de la publication</h2>
        <p>
          <Todo>prénom et nom</Todo>
        </p>
      </section>

      <section>
        <h2>Hébergement</h2>
        <p>
          Le site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723,
          États-Unis — vercel.com.
        </p>
        <p>
          Les données des comptes sont stockées par Supabase (base de données et
          authentification), sur des serveurs situés dans l&apos;Union européenne.
        </p>
      </section>

      <section>
        <h2>Propriété intellectuelle</h2>
        <p>
          Les textes, éléments graphiques, logo et code du site sont la propriété de
          l&apos;éditeur, sauf mention contraire. Toute reproduction sans autorisation
          est interdite. Les polices Bricolage Grotesque et DM Mono sont utilisées sous
          licence SIL Open Font License.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Pour toute question, écris à{" "}
          <ContactEmail />.
        </p>
      </section>
    </LegalPage>
  );
}
