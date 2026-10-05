// Tout ce qui décrit le produit et l'offre est ici : changer un prix ou une phrase
// ne demande de toucher qu'à ce fichier.

function resolveSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "http://localhost:3000";
}

export const site = {
  name: "Fantômes",
  url: resolveSiteUrl(),
  // La phrase d'ouverture des vidéos : elle doit rester identique en haut de la landing.
  promise: "Débusque les abonnements que tu paies sans t'en servir.",
  description:
    "Dépose ton relevé bancaire : on retrouve les prélèvements qui reviennent, on te montre ce qu'ils te coûtent sur un an et on te prépare la lettre pour les arrêter.",
  contactEmail: "contact@fantomes.example", // [À COMPLÉTER] à l'étape 6, avec ton domaine
  acceptedFormats: "PDF, CSV ou OFX",
  lastLegalUpdate: "5 octobre 2026",
};

export const offer = {
  priceEuros: 19,
  priceLabel: "19 €",
  billing: "une seule fois",
  // Seuil de la garantie : si l'audit trouve moins que ça par an, on rembourse.
  guaranteeThresholdLabel: "19 €",
  guaranteeDays: 30,
};

export const routes = {
  start: "/inscription",
  legal: "/mentions-legales",
  terms: "/cgv",
  privacy: "/confidentialite",
};
