import type { Metadata } from "next";
import { ContactEmail, LegalPage, Todo } from "@/components/legal";
import { routes } from "@/lib/site";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Quelles données Fantômes traite, pourquoi, combien de temps, et comment exercer tes droits.",
  alternates: { canonical: routes.privacy },
  openGraph: { url: routes.privacy },
};

export default function Confidentialite() {
  return (
    <LegalPage title="Politique de confidentialité">
      <section>
        <h2>En bref</h2>
        <ul>
          <li>Ton relevé bancaire est lu puis effacé : il n&apos;est jamais conservé.</li>
          <li>On garde uniquement la liste des prélèvements réguliers trouvés.</li>
          <li>On ne te demande jamais tes identifiants bancaires.</li>
          <li>Aucune donnée n&apos;est vendue ni utilisée pour de la publicité.</li>
          <li>Tu peux supprimer ton compte, et tout ce qu&apos;il contient, en un clic.</li>
        </ul>
      </section>

      <section>
        <h2>Responsable du traitement</h2>
        <p>
          <Todo>prénom et nom</Todo>, entrepreneur individuel, <Todo>adresse</Todo>.
          Contact : <ContactEmail />.
        </p>
      </section>

      <section>
        <h2>Données traitées</h2>
        <ul>
          <li>
            <strong>Compte</strong> : adresse email et mot de passe (stocké sous forme
            chiffrée, jamais lisible).
          </li>
          <li>
            <strong>Lettres de résiliation</strong> : nom, adresse postale et, si tu les
            saisis, tes numéros de client.
          </li>
          <li>
            <strong>Relevés bancaires</strong> : le fichier est analysé puis supprimé dès
            la fin de l&apos;analyse. Seuls les prélèvements réguliers repérés sont
            enregistrés (nom du service, libellé, montant, fréquence, dates).
          </li>
          <li>
            <strong>Paiement</strong> : géré par Stripe. Nous ne voyons jamais ton numéro
            de carte ; nous conservons l&apos;état de ton achat.
          </li>
          <li>
            <strong>Mesure d&apos;audience</strong> : statistiques de visite anonymes, sans
            cookie et sans conservation de ton adresse IP.
          </li>
        </ul>
      </section>

      <section>
        <h2>Pourquoi, et sur quelle base</h2>
        <ul>
          <li>Fournir le service et tes lettres : exécution du contrat.</li>
          <li>Encaisser et comptabiliser les paiements : contrat et obligation légale.</li>
          <li>Sécuriser le service et éviter les abus : intérêt légitime.</li>
          <li>Mesurer l&apos;audience de façon anonyme : intérêt légitime.</li>
        </ul>
        <p>Nous n&apos;envoyons pas d&apos;emails publicitaires.</p>
      </section>

      <section>
        <h2>Qui y a accès</h2>
        <p>
          Seul l&apos;éditeur du site, ainsi que les prestataires techniques suivants, dans
          la limite de leur mission :
        </p>
        <ul>
          <li>Vercel — hébergement du site (États-Unis) ;</li>
          <li>Supabase — base de données et comptes (Union européenne) ;</li>
          <li>Stripe — paiement ;</li>
          <li>Resend — envoi des emails de connexion ;</li>
          <li>Umami — mesure d&apos;audience anonyme ;</li>
          <li>
            <Todo>
              Anthropic — lecture des relevés PDF par intelligence artificielle, à garder
              seulement si cette option est retenue
            </Todo>
          </li>
        </ul>
        <p>
          Lorsque des données sont transférées hors de l&apos;Union européenne, ce
          transfert est encadré par les clauses contractuelles types de la Commission
          européenne ou par le Data Privacy Framework.
        </p>
      </section>

      <section>
        <h2>Combien de temps</h2>
        <ul>
          <li>Relevés bancaires : aucune conservation, effacés après l&apos;analyse.</li>
          <li>
            Compte et abonnements repérés : tant que ton compte existe, et supprimés
            immédiatement lorsque tu le supprimes. Un compte inactif depuis 3 ans est
            supprimé.
          </li>
          <li>
            Pièces comptables liées à un paiement : 10 ans, comme l&apos;exige la loi.
          </li>
        </ul>
      </section>

      <section>
        <h2>Tes droits</h2>
        <p>
          Tu peux accéder à tes données, les rectifier, les effacer, en limiter
          l&apos;usage, t&apos;opposer à leur traitement, les récupérer dans un format
          lisible, et définir des directives pour après ton décès. Écris à{" "}
          <ContactEmail /> : nous
          répondons sous un mois. Tu peux aussi adresser une réclamation à la CNIL
          (cnil.fr).
        </p>
      </section>

      <section>
        <h2>Cookies</h2>
        <p>
          Le site n&apos;utilise que les cookies indispensables à ta connexion. La mesure
          d&apos;audience fonctionne sans cookie : c&apos;est pourquoi aucun bandeau de
          consentement ne s&apos;affiche.
        </p>
      </section>

      <section>
        <h2>Sécurité</h2>
        <p>
          Les échanges sont chiffrés (HTTPS), les données sont chiffrées au repos et
          chaque utilisateur n&apos;a accès qu&apos;à ses propres données.
        </p>
      </section>
    </LegalPage>
  );
}
