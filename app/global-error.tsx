"use client";

// Dernier filet de sécurité : remplace toute la page si la mise en page elle-même plante.
// Les styles globaux ne sont pas chargés ici, d'où les styles en ligne.
export default function GlobalError({ retry }: { retry: () => void }) {
  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f6f1e6",
          color: "#1b1a17",
          fontFamily: "system-ui, sans-serif",
          padding: "1rem",
        }}
      >
        <title>Erreur · Fantômes</title>
        <main style={{ maxWidth: "32rem" }}>
          <h1 style={{ fontSize: "2rem", lineHeight: 1.1, margin: "0 0 1rem" }}>
            Quelque chose a coincé.
          </h1>
          <p style={{ margin: "0 0 1.5rem", lineHeight: 1.5 }}>
            Ce n&apos;est pas de ta faute. Réessaie dans un instant, ou reviens à
            l&apos;accueil.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => retry()}
              style={{
                minHeight: "3.5rem",
                padding: "0 1.5rem",
                borderRadius: "0.75rem",
                border: 0,
                background: "#1b1a17",
                color: "#f6f1e6",
                fontWeight: 700,
                fontSize: "1rem",
              }}
            >
              Réessayer
            </button>
            {/* Lien HTML classique : on veut recharger toute l'application. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              style={{
                minHeight: "3.5rem",
                display: "inline-flex",
                alignItems: "center",
                color: "#1b1a17",
                fontWeight: 700,
              }}
            >
              Retour à l&apos;accueil
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
