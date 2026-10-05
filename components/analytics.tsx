import Script from "next/script";

// Mesure d'audience Umami : sans cookie, donc sans bandeau de consentement.
// Ne s'active que si l'identifiant du site est renseigné (étape 6).
export function Analytics() {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  if (!websiteId) return null;
  return (
    <Script
      src="https://cloud.umami.is/script.js"
      data-website-id={websiteId}
      strategy="afterInteractive"
    />
  );
}
