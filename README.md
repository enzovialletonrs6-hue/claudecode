# Fantômes

Débusque les abonnements que tu paies sans t'en servir.

- Plan de build, décisions et avancement : [`docs/plan.md`](docs/plan.md)
- Guide de configuration Supabase (étape 2) : [`docs/etape-2-supabase.md`](docs/etape-2-supabase.md)
- Textes de l'offre (prix, promesse, garantie) : [`lib/site.ts`](lib/site.ts)
- Avis clients (à remplir quand ils arrivent) : tableau `testimonials` dans [`app/page.tsx`](app/page.tsx)
- Schéma de la base : [`supabase/migrations/`](supabase/migrations)

## Développement

```bash
npm install
npx supabase start   # Supabase local (Docker requis), applique les migrations
# copier l'URL et les clés affichées dans .env.local (voir .env.example)
npm run dev          # http://localhost:3000
npm run lint
npm run build
```

Les emails envoyés en local (codes de connexion) sont visibles sur http://127.0.0.1:54324.

Test de bout en bout des comptes (Supabase local + application lancée sur le port 3000) :

```bash
npm install --no-save playwright   # une fois, sans modifier package.json
node tests/e2e/comptes.mjs
```

Stack : Next.js (App Router) · TypeScript · Tailwind CSS · Supabase · Stripe · Vercel.
