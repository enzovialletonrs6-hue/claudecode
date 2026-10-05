const steps = [
  {
    title: "Récupère tes relevés",
    text: "Dans l'appli ou sur le site de ta banque, télécharge tes 3 derniers relevés (PDF) ou un export CSV.",
  },
  {
    title: "Dépose-les ici",
    text: "On les lit en quelques secondes, puis on les efface. On ne garde que les abonnements trouvés.",
  },
  {
    title: "Découvre ce que tu paies vraiment",
    text: "Chaque prélèvement qui revient, avec son coût sur un an. Les plus chers en haut.",
  },
];

export default function Espace() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="font-mono text-[0.8rem] tracking-wide text-crayon uppercase">Ton espace</p>
        <h1 className="titre mt-2 text-[2.2rem] sm:text-[2.8rem]">
          Allons débusquer <span className="surligne">tes fantômes.</span>
        </h1>
        <p className="mt-3 text-encre/85">
          Il te faut seulement tes derniers relevés bancaires. Voici comment ça se passe.
        </p>
      </div>

      <ol className="flex flex-col gap-5">
        {steps.map((step, index) => (
          <li key={step.title} className="flex gap-4">
            <span className="titre flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-encre text-[1.1rem]">
              {index + 1}
            </span>
            <div>
              <h2 className="titre text-[1.25rem] leading-tight">{step.title}</h2>
              <p className="mt-1 text-encre/85">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="flex flex-col gap-2">
        <button type="button" className="bouton w-full sm:w-auto" aria-disabled="true" disabled>
          Déposer mon relevé
        </button>
        <p className="font-mono text-[0.85rem] text-crayon">
          Le dépôt de relevé arrive très bientôt.
        </p>
      </div>
    </div>
  );
}
