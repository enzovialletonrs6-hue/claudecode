import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { StatementMock } from "@/components/statement-mock";
import { StickyCta } from "@/components/sticky-cta";
import { offer, routes, site } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

const CTA_LABEL = "Analyser mon relevé gratuitement";

// Les vrais avis s'ajoutent ici, avec l'accord écrit de la personne.
// Tant que la liste est vide, la page affiche un emplacement honnête.
const testimonials: { name: string; found: string; quote: string }[] = [];

const benefits = [
  {
    title: "On les trouve à ta place",
    text: "Dépose ton relevé : on repère chaque prélèvement qui revient, même ceux à 0,99 €.",
  },
  {
    title: "Tu vois ce qu'ils coûtent vraiment",
    text: "Chaque abonnement est classé par son coût sur un an, pas par mois. Les plus chers en haut : tu sais par où commencer.",
  },
  {
    title: "Tu résilies en deux minutes",
    text: "Pour chacun, une lettre de résiliation prête à envoyer. Tu coches « résilié », et ton total d'économies se met à jour.",
  },
];

const faq = [
  {
    q: "Je dois donner mes identifiants bancaires ?",
    a: "Non, jamais. Tu télécharges toi-même ton relevé depuis l'appli ou le site de ta banque, puis tu le déposes. On n'a aucun accès à ton compte.",
  },
  {
    q: "Ça marche avec ma banque ?",
    a: `Oui, avec les relevés des banques françaises, au format ${site.acceptedFormats}. Au moment de déposer, on te montre où trouver le tien.`,
  },
  {
    q: "Combien de mois de relevés faut-il ?",
    a: "Trois mois suffisent pour repérer tout ce qui revient chaque mois. Avec douze mois, on attrape aussi les abonnements annuels.",
  },
  {
    q: "Que faites-vous de mon relevé ?",
    a: "On le lit, on en extrait tes abonnements, puis il est effacé. On ne garde que la liste des abonnements trouvés, et tu peux supprimer ton compte en un clic.",
  },
  {
    q: "Et si vous ne trouvez rien ?",
    a: `Alors tu n'as rien payé : l'analyse est gratuite. Et si tu as pris l'audit complet et qu'il trouve moins de ${offer.guaranteeThresholdLabel} d'abonnements sur un an, on te rembourse sur simple email, dans les ${offer.guaranteeDays} jours.`,
  },
  {
    q: "Vous résiliez à ma place ?",
    a: "Non, tu gardes la main : c'est toi qui décides ce que tu gardes. On te prépare la lettre, tu n'as plus qu'à l'envoyer.",
  },
];

function CtaBlock({ event }: { event: string }) {
  return (
    <div data-cta-anchor className="flex flex-col items-stretch gap-3 sm:items-start">
      <Link href={routes.start} data-umami-event={event} className="bouton w-full sm:w-auto">
        {CTA_LABEL}
        <span aria-hidden="true" className="hidden min-[400px]:inline">
          →
        </span>
      </Link>
      <p className="font-mono text-[0.8rem] text-crayon sm:text-[0.85rem]">
        Gratuit · Sans carte bancaire · Relevé lu puis effacé
      </p>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        {/* 1. Promesse — mot pour mot celle des vidéos */}
        <section className="mx-auto grid max-w-6xl gap-10 px-4 pt-6 pb-14 sm:px-6 md:grid-cols-[1.1fr_1fr] md:items-center md:gap-12 md:pt-14 md:pb-20">
          <div className="flex flex-col gap-5">
            <h1 className="titre text-[2.6rem] sm:text-[3.4rem] lg:text-[4.3rem]">
              Débusque les abonnements que tu paies{" "}
              <span className="surligne">sans t&apos;en servir.</span>
            </h1>
            <p className="max-w-[34rem] text-[1.125rem] text-encre/85">
              Dépose ton relevé bancaire. On repère chaque prélèvement qui revient, on te
              montre ce qu&apos;il te coûte sur un an, et on te prépare la lettre pour
              l&apos;arrêter.
            </p>
            <CtaBlock event="cta-hero" />
          </div>
          <StatementMock />
        </section>

        {/* 2. La douleur, chiffrée */}
        <section className="bg-papier-fonce">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-2 md:items-center md:py-20">
            <div className="flex flex-col gap-4">
              <h2 className="titre text-[2rem] sm:text-[2.6rem]">
                Sur ton relevé, tu vois <span className="whitespace-nowrap">9,99 €.</span>{" "}
                Sur un an, c&apos;est{" "}
                <span className="whitespace-nowrap text-tampon">119,88 €.</span>
              </h2>
              <p className="max-w-[32rem]">
                Un essai jamais résilié, une appli remplacée par une autre, une option
                activée une fois. Chacun paraît minuscule, alors personne ne les remarque.
                Et ils tournent pendant des années.
              </p>
            </div>

            <div className="rounded-md border border-trait bg-feuille p-5 font-mono text-[0.88rem] sm:text-[0.95rem]">
              <p className="mb-3 text-[0.75rem] tracking-wide text-crayon uppercase">
                Exemple de calcul
              </p>
              <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-2">
                <dt>Essai jamais résilié</dt>
                <dd className="text-right tabular-nums">7,99 €/mois</dd>
                <dt>Appli remplacée</dt>
                <dd className="text-right tabular-nums">4,99 €/mois</dd>
                <dt>Option activée une fois</dt>
                <dd className="text-right tabular-nums">2,99 €/mois</dd>
              </dl>
              <dl className="mt-4 grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 border-t-2 border-encre pt-4">
                <dt>Par mois</dt>
                <dd className="text-right tabular-nums">15,97 €</dd>
                <dt>Par an</dt>
                <dd className="text-right tabular-nums">191,64 €</dd>
                <dt className="font-sans text-[1.05rem] font-bold">En 3 ans</dt>
                <dd className="titre text-right text-[1.5rem] text-tampon tabular-nums">
                  574,92 €
                </dd>
              </dl>
            </div>
          </div>
        </section>

        {/* 3. Trois bénéfices */}
        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-20">
          <h2 className="titre max-w-[36rem] text-[2rem] sm:text-[2.6rem]">
            Tu les retrouves, tu décides, tu économises.
          </h2>
          <ol className="mt-8 grid gap-6 md:grid-cols-3 md:gap-8">
            {benefits.map((benefit, index) => (
              <li key={benefit.title} className="pointilles border-t pt-5">
                <span className="font-mono text-[0.9rem] text-tampon">
                  0{index + 1}
                </span>
                <h3 className="titre mt-2 text-[1.45rem]">{benefit.title}</h3>
                <p className="mt-2 text-encre/85">{benefit.text}</p>
              </li>
            ))}
          </ol>

          <div className="mt-12 rounded-md border-2 border-encre p-5 sm:p-6">
            <h3 className="titre text-[1.35rem]">Ton relevé ne reste pas chez nous.</h3>
            <p className="mt-2 max-w-[44rem] text-encre/85">
              On le lit, on en extrait tes abonnements, puis il est effacé. Pas
              d&apos;identifiants bancaires à donner, pas d&apos;accès à ton compte : on
              ne garde que la liste des abonnements trouvés.
            </p>
          </div>
        </section>

        {/* 4. Preuve sociale — jamais d'avis inventé */}
        <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6 md:pb-20">
          <h2 className="titre text-[2rem] sm:text-[2.6rem]">Leurs fantômes débusqués</h2>
          {testimonials.length > 0 ? (
            <ul className="mt-8 grid gap-6 md:grid-cols-3">
              {testimonials.map((t) => (
                <li key={t.name} className="rounded-md border border-trait bg-feuille p-5">
                  <p className="titre text-[1.6rem] text-tampon">{t.found}</p>
                  <blockquote className="mt-2">« {t.quote} »</blockquote>
                  <p className="mt-3 font-mono text-[0.85rem] text-crayon">{t.name}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-6 rounded-md border-2 border-dashed border-crayon p-5 sm:p-6">
              <p className="font-mono text-[0.75rem] tracking-wide text-crayon uppercase">
                Emplacement réservé aux premiers avis
              </p>
              <p className="mt-2 max-w-[40rem]">
                Fantômes vient d&apos;ouvrir. Les avis de nos premiers utilisateurs
                s&apos;afficheront ici, avec le montant qu&apos;ils ont réellement
                retrouvé. Aucun avis n&apos;est inventé.
              </p>
            </div>
          )}
        </section>

        {/* 5. Prix + garantie */}
        <section className="bg-encre text-papier">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-2 md:py-20">
            <div>
              <h2 className="titre text-[2rem] sm:text-[2.6rem]">
                L&apos;analyse est gratuite.
              </h2>
              <p className="mt-3 max-w-[30rem] text-papier/85">
                Tu vois combien tes abonnements te coûtent sur un an avant de payer quoi
                que ce soit.
              </p>
            </div>
            <div className="rounded-md border border-papier/25 p-5 sm:p-6">
              <p className="font-mono text-[0.8rem] tracking-wide text-papier/70 uppercase">
                Audit complet
              </p>
              <p className="mt-2 flex items-baseline gap-3">
                <span className="titre text-[3.2rem] text-surligneur">
                  {offer.priceLabel}
                </span>
                <span className="text-papier/85">{offer.billing}</span>
              </p>
              <p className="mt-1 text-papier/85">
                Pas d&apos;abonnement. Ce serait un comble.
              </p>
              <ul className="mt-4 flex flex-col gap-2">
                <li>La liste complète de tes prélèvements réguliers</li>
                <li>Une lettre de résiliation prête pour chacun</li>
                <li>Ton total d&apos;économies, mis à jour</li>
              </ul>
              <p className="mt-5 border-t border-dashed border-papier/30 pt-4 text-[0.95rem] text-papier/85">
                <strong className="text-papier">Garantie :</strong> si l&apos;audit trouve
                moins de {offer.guaranteeThresholdLabel} d&apos;abonnements sur un an, on te
                rembourse.
              </p>
            </div>
          </div>
        </section>

        {/* 6. Questions fréquentes */}
        <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 md:py-20">
          <h2 className="titre text-[2rem] sm:text-[2.6rem]">Questions fréquentes</h2>
          <div className="mt-6">
            {faq.map((item) => (
              <details key={item.q} className="group pointilles border-b">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 font-bold [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span
                    aria-hidden="true"
                    className="font-mono text-[1.3rem] font-normal transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="pb-4 text-encre/85">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* 7. Dernier appel à l'action */}
        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 md:pb-24">
          <div className="-mx-4 border-y-2 border-encre bg-feuille px-4 py-8 sm:mx-0 sm:rounded-md sm:border-2 sm:p-10">
            <h2 className="titre text-[2rem] sm:text-[2.8rem]">
              Combien te coûtent <span className="surligne">tes fantômes ?</span>
            </h2>
            <p className="mt-3 mb-6 max-w-[34rem]">
              Réponse en quelques minutes, avec tes derniers relevés.
            </p>
            <CtaBlock event="cta-final" />
          </div>
        </section>
      </main>

      <StickyCta href={routes.start} label={CTA_LABEL} />
    </>
  );
}
