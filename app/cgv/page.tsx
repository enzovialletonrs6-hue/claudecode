import type { Metadata } from "next";
import Link from "next/link";
import { ContactEmail, LegalPage, Todo } from "@/components/legal";
import { offer, routes } from "@/lib/site";

export const metadata: Metadata = {
  title: "Conditions générales de vente",
  description: "Conditions générales de vente de l'audit Fantômes.",
  alternates: { canonical: routes.terms },
  openGraph: { url: routes.terms },
};

export default function Cgv() {
  return (
    <LegalPage title="Conditions générales de vente">
      <section>
        <h2>1. Objet</h2>
        <p>
          Les présentes conditions générales de vente (CGV) encadrent l&apos;utilisation
          du service Fantômes et l&apos;achat de l&apos;audit complet, proposés par{" "}
          <Todo>prénom et nom</Todo>, entrepreneur individuel, SIRET{" "}
          <Todo>numéro SIRET</Todo> (ci-après « Fantômes »). Elles s&apos;adressent aux
          consommateurs. Toute commande implique leur acceptation.
        </p>
      </section>

      <section>
        <h2>2. Le service</h2>
        <p>
          Fantômes analyse les relevés bancaires que l&apos;utilisateur dépose lui-même
          afin d&apos;y repérer les prélèvements réguliers (abonnements, options,
          services récurrents).
        </p>
        <ul>
          <li>
            <strong>Analyse gratuite</strong> : indique le coût annuel total des
            prélèvements réguliers repérés, leur nombre et le plus coûteux d&apos;entre
            eux.
          </li>
          <li>
            <strong>Audit complet (payant)</strong> : donne accès à la liste complète des
            prélèvements réguliers repérés, classés par coût annuel, à une lettre de
            résiliation pré-remplie pour chacun et au suivi des économies réalisées.
            L&apos;accès est conservé tant que le compte existe.
          </li>
        </ul>
        <p>
          Fantômes ne résilie aucun contrat à la place de l&apos;utilisateur et
          n&apos;accède jamais à son compte bancaire. La détection repose uniquement sur
          les relevés fournis : elle peut ne pas être exhaustive, notamment si les
          relevés couvrent une période courte.
        </p>
      </section>

      <section>
        <h2>3. Prix</h2>
        <p>
          L&apos;audit complet coûte {offer.priceLabel} TTC, payable {offer.billing}. Il ne
          s&apos;agit pas d&apos;un abonnement : aucun autre prélèvement ne sera
          effectué. TVA non applicable, article 293 B du Code général des impôts{" "}
          <Todo>à adapter si tu deviens redevable de la TVA</Todo>. Le prix applicable
          est celui affiché au moment de la commande.
        </p>
      </section>

      <section>
        <h2>4. Commande et paiement</h2>
        <p>
          Le paiement s&apos;effectue en ligne par carte bancaire via notre prestataire
          de paiement Stripe. Fantômes n&apos;a jamais connaissance des numéros de carte.
          L&apos;audit complet est activé dès que Stripe a confirmé le paiement. Un reçu
          est envoyé par email.
        </p>
      </section>

      <section>
        <h2>5. Droit de rétractation</h2>
        <p>
          Le consommateur dispose en principe d&apos;un délai de 14 jours pour se
          rétracter (article L221-18 du Code de la consommation). Toutefois,
          l&apos;audit complet est fourni immédiatement après le paiement. Conformément
          à l&apos;article L221-28 du Code de la consommation, au moment de la commande,
          l&apos;utilisateur demande expressément l&apos;accès immédiat à l&apos;audit et
          reconnaît qu&apos;il perd ainsi son droit de rétractation. Cela ne remet pas en
          cause la garantie prévue à l&apos;article 6.
        </p>
      </section>

      <section>
        <h2>6. Garantie « Fantômes trouvés ou remboursé »</h2>
        <p>
          Si la somme des coûts annuels des prélèvements réguliers repérés par
          l&apos;audit complet est inférieure à {offer.guaranteeThresholdLabel}, Fantômes
          rembourse l&apos;intégralité du prix sur simple demande envoyée à{" "}
          <ContactEmail /> dans les{" "}
          {offer.guaranteeDays} jours suivant l&apos;achat. Le remboursement est effectué
          sur le moyen de paiement utilisé, sous 14 jours.
        </p>
      </section>

      <section>
        <h2>7. Garanties légales</h2>
        <p>
          L&apos;utilisateur bénéficie de la garantie légale de conformité applicable aux
          contenus et services numériques prévue par le Code de la consommation. En cas
          de défaut, il peut contacter Fantômes à l&apos;adresse ci-dessus.
        </p>
      </section>

      <section>
        <h2>8. Engagements de l&apos;utilisateur</h2>
        <p>
          L&apos;utilisateur ne dépose que ses propres relevés, ou des relevés pour
          lesquels il a obtenu l&apos;accord du titulaire du compte. Il est responsable de
          l&apos;exactitude des informations portées sur ses lettres de résiliation (nom,
          adresse, numéro de client).
        </p>
      </section>

      <section>
        <h2>9. Responsabilité</h2>
        <p>
          Fantômes est tenu d&apos;une obligation de moyens. Les lettres de résiliation
          sont des modèles : avant de les envoyer, l&apos;utilisateur vérifie les
          conditions de son contrat (durée d&apos;engagement, préavis, mode d&apos;envoi
          exigé). Fantômes n&apos;est pas responsable des décisions prises par les
          prestataires concernés ni des frais éventuels prévus par ces contrats.
        </p>
      </section>

      <section>
        <h2>10. Données personnelles</h2>
        <p>
          Le traitement des données est décrit dans la{" "}
          <Link href={routes.privacy}>politique de confidentialité</Link>. L&apos;utilisateur
          peut supprimer son compte à tout moment depuis ses réglages.
        </p>
      </section>

      <section>
        <h2>11. Réclamations et médiation</h2>
        <p>
          Toute réclamation peut être adressée à{" "}
          <ContactEmail />. En
          l&apos;absence de solution amiable, le consommateur peut recourir gratuitement
          au médiateur de la consommation suivant (article L612-1 du Code de la
          consommation) : <Todo>nom, adresse et site du médiateur choisi</Todo>.
        </p>
      </section>

      <section>
        <h2>12. Droit applicable</h2>
        <p>
          Les présentes CGV sont soumises au droit français. À défaut d&apos;accord
          amiable, le litige sera porté devant les juridictions compétentes selon les
          règles légales applicables aux consommateurs.
        </p>
      </section>
    </LegalPage>
  );
}
