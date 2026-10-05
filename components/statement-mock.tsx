// Extrait de relevé fictif (marques inventées) : montre en un coup d'œil ce que fait
// le produit — repérer, chiffrer sur un an, résilier.

type Line = {
  date: string;
  label: string;
  amount: string;
  yearly?: string;
  cancelled?: boolean;
};

const lines: Line[] = [
  { date: "01/09", label: "PRLV SEPA MUTUELLE SANTÉ", amount: "38,20" },
  { date: "03/09", label: "CB BOULANGERIE DU PORT", amount: "4,60" },
  {
    date: "05/09",
    label: "PRLV SEPA FITCLUB PREMIUM",
    amount: "29,99",
    yearly: "359,88 € par an",
    cancelled: true,
  },
  {
    date: "07/09",
    label: "CB CINÉPASS*ABONNEMENT",
    amount: "9,99",
    yearly: "119,88 € par an",
  },
  { date: "12/09", label: "CB MARCHÉ CENTRAL", amount: "31,75" },
  {
    date: "18/09",
    label: "PRLV OPTION CLOUD 200 GO",
    amount: "2,99",
    yearly: "35,88 € par an",
  },
];

export function StatementMock() {
  return (
    <figure className="relative mx-auto w-full max-w-[26rem]">
      {/* Feuille de dessous, pour l'effet de liasse. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 translate-x-1.5 translate-y-2 rotate-2 rounded-md border border-trait bg-papier-fonce"
      />
      <div className="relative -rotate-1 rounded-md border border-trait bg-feuille px-4 pt-4 pb-5 font-mono text-[0.78rem] leading-tight sm:px-5 sm:text-[0.85rem]">
        <div className="flex items-baseline justify-between border-b border-trait pb-2 text-[0.7rem] tracking-wide text-crayon uppercase sm:text-[0.75rem]">
          <span>Relevé · septembre</span>
          <span>Débit €</span>
        </div>

        <ul className="mt-1">
          {lines.map((line) => (
            <li
              key={line.label}
              className="pointilles relative border-b py-2 last:border-b-0"
            >
              <div className="grid grid-cols-[auto_1fr_auto] items-baseline gap-x-2.5">
                <span className="text-crayon">{line.date}</span>
                <span className="min-w-0 truncate">
                  {line.yearly ? (
                    <span className="surligne">{line.label}</span>
                  ) : (
                    line.label
                  )}
                </span>
                <span className="tabular-nums">
                  {line.cancelled ? (
                    <span className="barre">{line.amount}</span>
                  ) : (
                    line.amount
                  )}
                </span>
              </div>
              {line.yearly && (
                <p className="mt-1 text-right font-sans text-[0.85rem] font-bold text-tampon sm:text-[0.9rem]">
                  = {line.yearly}
                </p>
              )}
              {line.cancelled && (
                <span
                  aria-hidden="true"
                  className="tampon absolute bottom-1.5 left-[16%] font-sans text-[0.8rem] sm:text-[0.9rem]"
                >
                  Résilié
                </span>
              )}
            </li>
          ))}
        </ul>

        <div className="mt-2 flex items-baseline justify-between border-t-2 border-encre pt-3 font-sans">
          <span className="font-bold">3 fantômes repérés</span>
          <span className="titre text-[1.35rem] text-tampon sm:text-[1.5rem]">
            515,64 €/an
          </span>
        </div>
      </div>
      <figcaption className="sr-only">
        Exemple de relevé : trois abonnements oubliés, soit 515,64 euros par an.
      </figcaption>
    </figure>
  );
}
