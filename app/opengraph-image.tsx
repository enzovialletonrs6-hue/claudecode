import { ImageResponse } from "next/og";
import { loadOgFonts } from "@/lib/og-fonts";
import { site } from "@/lib/site";

export const alt = site.promise;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PAPIER = "#f6f1e6";
const FEUILLE = "#fcfaf4";
const ENCRE = "#1b1a17";
const CRAYON = "#6e685e";
const SURLIGNEUR = "#ffd84a";
const TAMPON = "#c8361b";
const TRAIT = "#d6ccb6";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: PAPIER,
          color: ENCRE,
          padding: "64px 72px",
          fontFamily: "Bricolage",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", width: 700 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 40 }}>
            <svg width="46" height="46" viewBox="0 0 32 32">
              <path
                d="M16 4.5C10.2 4.5 6.5 8.7 6.5 14.4V27.5l3.2-2.4 3.1 2.4 3.2-2.4 3.2 2.4 3.1-2.4 3.2 2.4V14.4C25.5 8.7 21.8 4.5 16 4.5Z"
                fill={ENCRE}
              />
              <circle cx="12.4" cy="14" r="1.9" fill={PAPIER} />
              <circle cx="19.6" cy="14" r="1.9" fill={PAPIER} />
            </svg>
            Fantômes
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              marginTop: 48,
              fontSize: 76,
              lineHeight: 1.02,
              letterSpacing: -2,
            }}
          >
            <span>Débusque les abonnements que tu paies&nbsp;</span>
            <span style={{ background: SURLIGNEUR, padding: "0 10px", marginLeft: -6 }}>
              sans t&apos;en servir.
            </span>
          </div>
          <div
            style={{
              marginTop: "auto",
              fontFamily: "DM Mono",
              fontSize: 26,
              color: CRAYON,
            }}
          >
            Analyse gratuite · Relevé lu puis effacé
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: "auto",
            marginTop: 120,
            width: 320,
            height: 300,
            background: FEUILLE,
            border: `2px solid ${TRAIT}`,
            borderRadius: 8,
            padding: "22px 24px",
            transform: "rotate(-2deg)",
            fontFamily: "DM Mono",
            fontSize: 22,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", color: CRAYON, fontSize: 17 }}>
            <span>PRLV SEPA</span>
            <span>DÉBIT €</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18 }}>
            <span style={{ background: SURLIGNEUR, padding: "0 6px" }}>FITCLUB</span>
            <span>29,99</span>
          </div>
          <div style={{ display: "flex", color: TAMPON, fontFamily: "Bricolage", fontSize: 26, marginTop: 8, justifyContent: "flex-end" }}>
            = 359,88 € par an
          </div>
          <div
            style={{
              display: "flex",
              alignSelf: "center",
              marginTop: 34,
              border: `4px solid ${TAMPON}`,
              borderRadius: 6,
              padding: "6px 18px",
              color: TAMPON,
              fontFamily: "Bricolage",
              fontSize: 40,
              letterSpacing: 5,
              transform: "rotate(-9deg)",
            }}
          >
            RÉSILIÉ
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: await loadOgFonts() },
  );
}
