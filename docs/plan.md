# Fantômes — plan de build

## Périmètre MVP (strict)

1. Dépôt du relevé bancaire, détection des prélèvements réguliers
2. Liste classée par montant annuel
3. Lettre de résiliation générée pour chacun
4. Total économisé sur l'année, mis à jour

Tout le reste est hors périmètre sauf validation explicite.

## Étapes

| # | Étape | État |
|---|-------|------|
| 1 | Landing en ligne (+ pages légales, 404, erreur, aperçus de liens) | fait |
| 2 | Comptes (Supabase Auth, schéma, réglages, suppression de compte) | code fait et testé ; configuration Supabase à faire ([guide](etape-2-supabase.md)) |
| 3 | Relevé → détection → liste par coût annuel + onboarding | à faire |
| 4 | Lettres de résiliation + total économisé | à faire |
| 5 | Paiement Stripe (mode test), webhook, portail client | à faire |
| 6 | /admin (vente à la main), mesure d'audience Umami, emails pro (Resend + domaine) | à faire |
| 7 | Production : mentions complétées, Stripe live, domaine, achat réel | à faire |

## Décisions

Appliquées par défaut (recommandations du plan) en attendant confirmation :

- Offre : audit complet 19 € en paiement unique, sans abonnement, avec garantie
  « si l'audit trouve moins de 19 € d'abonnements sur un an, remboursement sous 30 jours ».
  Le paiement sera codé pour gérer aussi un abonnement mensuel si on change d'avis.
- Gratuit : l'analyse montre le total annuel, le nombre d'abonnements et le plus cher ;
  liste complète, lettres et suivi des économies sont payants.

En attente de réponse :

- Lecture des PDF : IA (Haiku ou Opus) / lecteur maison / pas de PDF au lancement.
- Boutons « Ce n'est pas un abonnement » et « Je le garde » (prévus dans le schéma :
  statuts `ignored` et `keep`).

Validé : schéma de données (`supabase/migrations/20261005000000_schema_initial.sql`).

Décisions techniques :

- Inscription email + mot de passe avec accès immédiat (le lien magique ouvrirait un autre
  navigateur que celui de TikTok/Instagram). Connexion par mot de passe, ou par code reçu par
  email (l'email contient aussi un bouton qui marche dans n'importe quel navigateur, via
  `/auth/confirm?token_hash=…`). « Mot de passe oublié » = connexion par code, puis nouveau mot
  de passe dans les réglages.
- Le proxy (`proxy.ts`) ne tourne que sur `/app`, `/connexion` et `/inscription` : la landing
  reste statique.
- Le relevé n'est jamais stocké ; seuls les prélèvements réguliers détectés le sont.
- L'accès payant n'est activé que par le webhook Stripe signé.
- Mesure d'audience Umami (sans cookie, pas de bandeau).

## Direction design

- « Relevé annoté au stylo » : papier `#F6F1E6`, encre `#1B1A17`, crayon `#6E685E`,
  surligneur `#FFD84A` (fantômes repérés), rouge tampon `#C8361B` (résilié, économies).
- Bricolage Grotesque (titres, montants) + DM Mono (lignes de relevé, chiffres).
- Pas de dégradé, pas d'emoji, un seul bouton plein par écran.
- Tutoiement, phrases courtes, jamais culpabilisant.

## Champs à compléter avant la production

Repérés par `[À COMPLÉTER]` sur `/mentions-legales`, `/cgv`, `/confidentialite` :
nom, adresse (ou domiciliation), SIRET, téléphone, directeur de publication, médiateur de la
consommation, email de contact (`lib/site.ts`), nom de domaine, mention Anthropic selon
l'option PDF retenue.
