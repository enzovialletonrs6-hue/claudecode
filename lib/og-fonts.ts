import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Polices pour les images générées (aperçus de liens, icônes) : satori ne lit pas le woff2.
export async function loadOgFonts() {
  const dir = join(process.cwd(), "assets/fonts");
  const [bricolage, dmMono] = await Promise.all([
    readFile(join(dir, "bricolage-grotesque-latin-800-normal.woff")),
    readFile(join(dir, "dm-mono-latin-500-normal.woff")),
  ]);
  return [
    { name: "Bricolage", data: bricolage, weight: 800 as const, style: "normal" as const },
    { name: "DM Mono", data: dmMono, weight: 500 as const, style: "normal" as const },
  ];
}
