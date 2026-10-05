# Étape 2 — Brancher les comptes (Supabase)

Quatre actions, environ 20 minutes au total. Fais-les dans l'ordre, et vérifie le
résultat attendu avant de passer à la suivante.

Les liens `supabase.com/dashboard/project/_/…` ouvrent directement le bon écran : Supabase te
demande simplement de choisir ton projet la première fois.

---

## Action 1 — Créer le projet et ses tables (≈ 8 min)

1. Va sur **supabase.com** → **Start your project** → **Continue with GitHub**.
2. Clique sur **New project** :
   - **Name** : `fantomes`
   - **Database Password** : clique sur **Generate a password**, puis copie-le dans tes notes
     (on n'en aura pas besoin, mais garde-le).
   - **Region** : choisis **Paris** (ou à défaut une région en Europe).
   - Clique sur **Create new project** et attends environ 2 minutes.
3. Ouvre l'éditeur SQL : https://supabase.com/dashboard/project/_/sql/new
4. Ouvre le fichier du schéma sur GitHub :
   https://github.com/enzovialletonrs6-hue/claudecode/blob/claude/fantomes-saas-mvp-ip8cy4/supabase/migrations/20261005000000_schema_initial.sql
   et clique sur l'icône **Copy raw file** (deux petits carrés, en haut à droite du code).
5. Colle dans l'éditeur SQL de Supabase, puis clique sur **Run**.

**Résultat attendu** : le message `Success. No rows returned`. Dans **Table Editor**
(menu de gauche), tu vois 4 tables : `analyses`, `charges`, `profiles`, `stripe_events`.

---

## Action 2 — Régler la connexion (≈ 5 min)

1. **Inscription sans email de confirmation** :
   https://supabase.com/dashboard/project/_/auth/providers → clique sur **Email** →
   désactive **Confirm email** → **Save**.
2. **Adresse de ton site** :
   https://supabase.com/dashboard/project/_/auth/url-configuration → dans **Site URL**, colle
   l'adresse Vercel de ton site (par exemple `https://fantomes-xxxx.vercel.app`, sans `/` à la
   fin) → **Save**.
3. **Email de connexion en français** :
   https://supabase.com/dashboard/project/_/auth/templates → choisis **Magic Link** :
   - **Subject** : `Ton code de connexion Fantômes`
   - **Body** (ou « Message body ») : remplace tout le contenu par celui de ce fichier
     (même méthode que pour l'action 1, icône **Copy raw file**) :
     https://github.com/enzovialletonrs6-hue/claudecode/blob/claude/fantomes-saas-mvp-ip8cy4/supabase/templates/lien-connexion.html
   - **Save**.

**Résultat attendu** : les trois écrans affichent un message de confirmation après **Save**.

---

## Action 3 — Donner les clés à Vercel (≈ 5 min)

1. Ouvre le panneau de connexion Supabase :
   https://supabase.com/dashboard/project/_?showConnect=true&framework=nextjs&connectTab=frameworks
   Tu y vois deux lignes : `NEXT_PUBLIC_SUPABASE_URL=…` et
   `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=…`.
2. Ouvre la page des clés : https://supabase.com/dashboard/project/_/settings/api-keys
   Dans **Secret keys**, copie la clé qui commence par `sb_secret_`.
   Cette clé est confidentielle : ne la colle **nulle part ailleurs** que dans Vercel.
3. Sur **vercel.com**, ouvre ton projet `fantomes` → **Settings** → **Environment Variables**.
   Ajoute ces trois variables (coche les trois environnements) :

   | Key | Value |
   |-----|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | l'URL du panneau de connexion (`https://….supabase.co`) |
   | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | la clé `sb_publishable_…` |
   | `SUPABASE_SECRET_KEY` | la clé `sb_secret_…` |

   Astuce : tu peux coller les trois lignes `NOM=valeur` d'un coup dans le champ **Key**,
   Vercel les sépare tout seul.
4. Onglet **Deployments** → sur le déploiement le plus récent, menu **⋯** → **Redeploy**.

**Résultat attendu** : après environ une minute, la page `/inscription` de ton site
n'affiche plus le message « Les comptes ne sont pas encore activés ».

---

## Action 4 — Tester sur ton téléphone (≈ 2 min)

1. Sur ton site, touche **Analyser mon relevé gratuitement**, crée un compte avec ton email.
   → Tu arrives sur « Allons débusquer tes fantômes. »
2. **Réglages** → **Me déconnecter**.
3. **Connexion** → **Mot de passe oublié ? Reçois un code par email** → indique ton email.
   → Tu reçois un email en français avec un code : tape-le, tu es reconnecté.
4. **Réglages** → **Je veux supprimer mon compte** → coche la case → supprime.
   → « C'est fait. » Dans Supabase, **Authentication → Users** ne montre plus ton compte.

Bon à savoir : tant que l'envoi d'emails professionnel n'est pas branché (étape 6), Supabase
n'envoie les codes qu'aux adresses des membres de ton projet (l'email de ton compte
Supabase), et seulement quelques-uns par heure. Pour le test 3, utilise donc cette adresse-là. L'inscription par mot de passe, elle, fonctionne pour tout le monde dès maintenant.
