# Clipperie — plan de build

> Un live de deux heures devient trente clips verticaux.

Base de départ : le code de Fantômes (landing, pages légales, comptes Supabase, réglages,
suppression de compte), repris et adapté. Fantômes reste intact sur sa branche
`claude/fantomes-saas-mvp-ip8cy4`. Clipperie aura son propre projet Vercel et son propre
projet Supabase.

## Périmètre MVP (strict)

1. Dépôt d'un fichier ou d'un lien, transcription automatique
2. Repérage des moments forts et découpe en verticales de 30 à 60 s
3. Sous-titres incrustés et titre proposé pour chacun
4. Export par lot, prêt à publier

Autour : landing, questionnaire, écran de calcul, avant-goût gratuit, paywall, réglages,
/admin pour vendre à la main, mesure d'audience, pages légales.

Hors périmètre sauf validation explicite : suivi automatique des visages, format streamer
(webcam en haut, jeu en bas), correction des sous-titres mot à mot, choix de styles de
sous-titres, publication directe sur TikTok/YouTube, offre annuelle, comptes d'équipe.

## Comment ça marche

```
Navigateur ──(fichier, envoyé directement)──▶ Cloudflare R2 (stockage vidéo)
     │                                              │
     ▼                                              ▼
Vercel (Next.js) ──▶ Supabase (comptes + base) ◀── Worker Railway (ffmpeg)
                                                    ├─ son extrait ─▶ Deepgram (transcription mot à mot)
                                                    ├─ transcription ─▶ Claude (moments forts + titres)
                                                    └─ ffmpeg : découpe, 1080×1920, sous-titres incrustés, zip
```

- Le fichier ne passe jamais par Vercel (limité à 4,5 Mo par requête) : il part du navigateur
  vers R2 en morceaux, avec reprise si la connexion coupe.
- Vercel ne peut pas faire tourner ffmpeg pendant 20 minutes : un petit serveur dédié
  (« worker », sur Railway) prend les vidéos en file d'attente.
- Ordre de montage : les 3 meilleurs clips d'abord (l'avant-goût arrive en ~5 min), puis les autres.

## Étapes

Chaque étape est mise en ligne et testable sur téléphone avant de passer à la suivante.

| # | Livrable visible | Ton temps | Comptes à créer | État |
|---|------------------|-----------|-----------------|------|
| 1 | Landing en ligne + pages légales, 404, erreur, aperçus de liens | 20 min | Vercel | à faire |
| 2 | Questionnaire (7 écrans) + écran de calcul, sans compte | 5 min | — | à faire |
| 3 | Comptes : inscription après le calcul, connexion, réglages, suppression ; schéma | 25 min | Supabase | à faire |
| 4 | Dépôt fichier/lien + transcription, progression en direct | 35 min | Cloudflare, Railway, Deepgram | à faire |
| 5 | Moments forts → clips verticaux sous-titrés et titrés ; avant-goût (3 clips offerts) | 30 min | Anthropic (API) | à faire |
| 6 | Paywall + Stripe Checkout intégré (mode test), webhook, export par lot, portail client | 35 min | Stripe | à faire |
| 7 | /admin (vente à la main), mesure Umami, emails (Resend), nom de domaine | 45 min | Umami, Resend, registrar | à faire |
| 8 | Production : mentions complétées, Stripe live, Vercel Pro, premier achat réel | 1 h | — | à faire |

Calendrier visé : semaine 1 → étapes 1 à 3 ; semaine 2 → 4 et 5 ; semaine 3 → 6 et 7 ;
semaine 4 → 8 et lancement. En parallèle, dès maintenant : déclarer la micro-entreprise si ce
n'est pas fait (le SIRET peut prendre plusieurs semaines, Stripe live en a besoin).

### Détail

1. **Landing** — promesse mot pour mot en haut, douleur chiffrée, trois bénéfices, emplacement
   d'avis marqué (vide tant qu'il n'y a pas de vrais avis), un seul bouton « Commencer » (aussi
   en barre collante sur mobile). Pages légales réécrites pour Clipperie. Image Open Graph.
2. **Questionnaire + calcul** — une question par écran, barre de progression en forme de
   timeline, réponses gardées dans le navigateur. Le calcul s'affiche sans compte.
3. **Comptes** — repris de Fantômes : email + mot de passe avec accès immédiat (le lien magique
   ouvrirait un autre navigateur que celui de TikTok/Instagram), connexion par code en secours.
   Le compte est demandé au moment de déposer la vidéo : « pour t'envoyer tes clips ».
4. **Dépôt + transcription** — fichier (jusqu'à 10 Go, 4 h) ou lien (Twitch, Google Drive,
   Dropbox, lien direct). Le worker extrait le son, Deepgram rend une transcription mot à mot
   minutée. Écran de progression : Réception → Transcription → Repérage → Montage 12/30.
5. **Clips** — Claude lit la transcription et choisit ~15 moments par heure (30 à 60 s, une
   accroche, une idée complète, une chute), coupés sur des fins de phrase, avec un titre chacun.
   ffmpeg monte chaque clip en 1080×1920 : mode « plan entier » (image complète sur fond flouté,
   titre en haut) ou « recadré » (tu choisis une fois la zone à garder). Sous-titres mot à mot,
   mot prononcé surligné en jaune. Titre modifiable (le clip se remonte en ~30 s).
   Avant-goût : 3 clips complets offerts, les autres visibles (titre, durée) et verrouillés.
6. **Paywall + Stripe** — voir « Le tunnel ». Accès activé uniquement par le webhook signé.
   Export par lot : un zip (clips + `titres.txt`) sur ordinateur, « Enregistrer dans Photos »
   par le menu de partage sur téléphone. Réglages : bouton « Résilier mon abonnement » visible
   (obligation légale en France), portail client Stripe, message clair si un paiement échoue.
7. **Admin + mesure + emails** — /admin réservé à ton email : créer un compte client, lui
   lancer une vidéo par lien, lui ouvrir un accès manuel (formule + date de fin) sans Stripe.
   Umami : entonnoir landing → questionnaire → compte → vidéo → paywall → paiement. Resend :
   codes de connexion et email « tes clips sont prêts ».
8. **Production** — champs `[À COMPLÉTER]` remplis, Stripe live, passage Vercel Pro, un vrai
   paiement de ta part puis remboursement. Ensuite : plan de lancement sur 14 jours.

## Le tunnel

**Questionnaire** (brouillon à valider à l'étape 2) — chaque question sert le produit ou le calcul,
et fait formuler le problème :

1. Tu fais quoi comme contenu long ? — Podcast / Live Twitch ou YouTube / Formation, webinaire / Autre
2. Combien d'heures de contenu long tu publies par mois ? — 1 à 3 h / 4 à 8 h / 9 à 20 h / Plus de 20 h
3. Le mois dernier, combien de clips courts tu as publiés ? — Aucun / 1 à 5 / 6 à 20 / Plus de 20
4. Quand tu découpes une vidéo toi-même, ça te prend combien de temps ? — Je ne le fais jamais /
   1 à 2 h / Une demi-journée / Une journée entière
5. Qu'est-ce qui t'empêche d'en publier plus ? — Le temps / Choisir les bons moments /
   Le montage (vertical, sous-titres) / Je n'y pense pas
6. Une heure de ton temps, tu l'estimes à combien ? — 15 € / 30 € / 50 € / 100 € ou plus
7. Ta prochaine vidéo à découper, elle est où ? — Sur mon ordinateur / Sur Twitch /
   Sur Google Drive ou Dropbox / Sur YouTube

**Calcul** — clips possibles = heures × 15 ; clips qui dorment = possibles − publiés ;
temps pour tout découper soi-même = (heures ÷ 2) × durée par vidéo (« jamais » : hypothèse d'une
demi-journée, annoncée comme telle) ; coût = ce temps × sa valeur horaire. Face à : ~10 min de
relecture par vidéo avec Clipperie, et le prix de la formule conseillée.

**Paywall** (dans cet ordre) : « Tes 30 clips sont prêts » → « Les découper toi-même : 28 h ce
mois-ci, soit 840 €. Clipperie : 49 € » → trois formules, celle du milieu en avant, prix par mois
et par jour → garantie visible sans défiler → « Sans engagement, résiliable à tout moment » à côté
du bouton → paiement Stripe intégré sur le même écran → quatre questions fréquentes (ça marche
pour mon cas ? combien de temps ça me prend ? et si je veux arrêter ? je paie pour quoi
exactement ?). Rien de faux : pas de faux avis, pas de compte à rebours, pas de places limitées.

Après paiement : retour sur la vidéo d'essai, tous les clips sélectionnés, un bouton
« Exporter mes clips ».

## Prix

Objectif 7 400 €/mois = 152 clients à 49 €. Le prix tient, à condition de le comparer à son
temps (ce que fait le questionnaire) et non aux outils américains : OpusClip est à 15 $ et 29 $
par mois. Le paywall demande deux ou trois formules ; je recommande :

| Formule | Prix | Clips par mois | Par jour |
|---------|------|----------------|----------|
| Essentiel | 19 €/mois | 20 | 0,62 € |
| **Créateur** (mise en avant) | **49 €/mois** | **60** | **1,61 €** |
| Studio | 99 €/mois | 150 | 3,25 € |

- Un clip compte quand tu le débloques pour l'exporter ; les clips proposés et non gardés ne
  comptent pas. Vidéos analysées : illimitées en usage normal (garde-fou technique à 30 h/mois).
- 19 € capte les petits podcasts et fait paraître 49 € raisonnable ; 99 € sert les streamers
  quotidiens et les monteurs indépendants qui gèrent plusieurs créateurs.
- Exemple de mix pour l'objectif : 30 × 19 € + 90 × 49 € + 25 × 99 € = 7 455 € avec 145 clients.
- Réaliste : 10 clients le premier mois ; 7 400 €/mois demande plutôt 6 à 12 mois, car les
  outils de clips perdent des clients chaque mois (créateurs qui arrêtent de publier).
- Stripe plutôt que Whop : c'est un logiciel, pas un accès à une communauté.

## Coûts

| Service | Rôle | Coût |
|---------|------|------|
| Vercel | site et API | 0 pendant le build ; **Pro 20 $/mois dès la première vente** (le palier gratuit interdit l'usage commercial) |
| Supabase | comptes et base | 0 (palier gratuit ; les vidéos n'y sont pas stockées : 50 Mo max par fichier) |
| Cloudflare R2 | vidéos et clips | 0 jusqu'à 10 Go, puis 0,015 $/Go ; téléchargements gratuits |
| Railway | worker ffmpeg | ~5 $/mois (forfait Hobby, 5 $ d'usage inclus) |
| Deepgram | transcription | 200 $ offerts (plusieurs centaines d'heures), puis ~0,52 $ par live de 2 h |
| Claude (Opus 5.5) | moments forts et titres | ~0,30 à 0,50 $ par live de 2 h, à l'usage |
| Stripe | paiement | pas d'abonnement ; ~1,5 % + 0,25 € par paiement + 0,7 % pour la facturation récurrente |
| Resend, Umami | emails, mesure | 0 (paliers gratuits) |
| Nom de domaine | clipperie.fr ou équivalent | ~10 €/an |

Coût fixe une fois en vente : ~26 €/mois. Coût variable : ~1 € par live de 2 h analysé (essais
compris). Marge sur un client Créateur : ~90 %.

## Schéma de données (à valider avant la migration de l'étape 3)

- `profiles` — un par compte, créé automatiquement : `email`, `quiz` (réponses du questionnaire).
- `subscriptions` — un par compte, écrit uniquement par le webhook Stripe ou par /admin :
  `plan` (essentiel, createur, studio), `status` (active, past_due, canceled), `source`
  (stripe, manual), `clips_per_period`, `current_period_start`, `current_period_end`,
  `stripe_customer_id`, `stripe_subscription_id`.
- `videos` — une par dépôt : `source_type` (upload, link), `source_url`, `storage_key`, `title`,
  `duration_s`, `framing` (full, crop) + `crop_x`, `is_trial`, `status` (uploading, queued,
  transcribing, detecting, rendering, ready, failed), `progress`, `error`, `source_deleted_at`.
- `clips` — ~15 par heure de vidéo : `video_id`, `rank`, `start_s`, `end_s`, `title`, `text`,
  `status` (pending, rendering, ready, failed), `file_key`, `thumb_key`, `unlocked_at`,
  `unlock_source` (trial, plan, admin). Quota = clips débloqués par `plan` sur la période en cours.
- `exports` — un par export par lot : `video_id`, `clip_ids`, `status`, `file_key`.
- `stripe_events` — journal des événements Stripe déjà traités (pas de double activation).

Sécurité : chacun ne lit que ses lignes (RLS) ; abonnement et déblocages écrits côté serveur
uniquement. Transcriptions mot à mot rangées dans R2, pas en base.

## Direction design (à valider avant de coder l'interface)

- Concept « table de montage » : timecodes, encoches de coupe, cartes au format 9:16, une
  timeline de 2 h où trente encoches jaunes deviennent trente clips.
- Palette : noir pellicule `#15130F`, blanc écran `#F4F0E6`, gris timecode `#8F897D` ;
  jaune sous-titre `#FFD23F` (le seul bouton plein, les moments repérés, et le mot surligné
  dans les clips eux-mêmes) ; rouge REC `#FF4A2B` (le temps perdu, les alertes).
- Typo : Archivo, une seule police variable (titres extra-condensés en capitales comme des
  sous-titres, texte courant en largeur normale, et dans les clips) + JetBrains Mono pour les
  timecodes et les chiffres.
- Détails : rayures du clap dans le logo, barre de progression en timeline, états vides qui
  montrent une timeline vide « dépose ton live ici ». Pas de dégradé, de verre dépoli ni d'emoji.
- Ton : tutoiement, phrases courtes, mots de créateur, chiffres concrets en heures et en euros,
  jamais culpabilisant.

## Décisions

En attente de réponse (recommandation entre parenthèses) :

- Liens YouTube : YouTube bloque les téléchargements depuis les serveurs. (Au lancement : Twitch,
  Drive, Dropbox, lien direct ; pour YouTube, on guide vers « Télécharger » dans YouTube Studio.)
- Formules 19 / 49 / 99 € et quota compté au déblocage. (Oui.)
- Avant-goût : 3 clips complets offerts, sans filigrane, le reste visible et verrouillé. (Oui.)
- Garantie : 30 jours sur le premier paiement, un email suffit, remboursement lancé sous 48 h.
  (Oui.)
- Email « tes clips sont prêts » : hors liste du MVP, mais le montage prend ~15 min et
  l'email ramène la personne au paywall. (L'ajouter, via Resend.)
- Cadrage : « plan entier » et « recadré » au lancement, sans suivi des visages. (Oui.)
- Direction design et schéma ci-dessus. (À valider.)

Décisions techniques :

- Clipperie construit sur cette branche à partir du code de Fantômes ; nouveaux projets Vercel
  et Supabase (le palier gratuit Supabase permet deux projets actifs).
- Le proxy (`proxy.ts`) ne tourne que sur les pages de compte : la landing reste statique.
- Vidéos sources supprimées 7 jours après traitement, clips 60 jours après création.
- Un seul essai par compte ; vidéos de 4 h maximum.
- L'accès payant n'est activé que par le webhook Stripe signé, jamais par la redirection.
- Aucun secret côté navigateur ; toutes les entrées validées côté serveur (zod).

## Champs à compléter avant la production

Repérés par `[À COMPLÉTER]` sur `/mentions-legales`, `/cgv`, `/confidentialite` : nom ou raison
sociale, adresse (ou domiciliation), SIRET, mention TVA (franchise en base si micro-entreprise),
téléphone, directeur de publication, médiateur de la consommation, email de contact
(`lib/site.ts`), nom de domaine. Sous-traitants à citer : Vercel, Supabase, Cloudflare, Railway,
Deepgram, Anthropic, Stripe, Resend, Umami.

## Risques

1. La qualité des moments choisis fait tout le produit : on teste sur 5 vrais lives de la cible
   avant le lancement et on ajuste les consignes.
2. Envoyer un fichier de plusieurs Go depuis un téléphone est long : le lien (Twitch, Drive)
   est mis en avant, et l'email permet de finir sur ordinateur.
3. Chaque essai coûte ~1 € : un essai par compte, 4 h maximum.
4. Droits : les CGV précisent qu'on ne traite que des vidéos dont on détient les droits.

## Sources (tarifs vérifiés le 5 octobre 2026)

- Supabase, limite de taille des fichiers : https://supabase.com/docs/guides/storage/uploads/file-limits
- Vercel Hobby, usage non commercial : https://vercel.com/docs/plans/hobby
- Deepgram : https://www.cekura.ai/blogs/deepgram-pricing
- Cloudflare R2 : https://mecanik.dev/en/posts/cloudflare-r2-pricing-explained-real-costs-vs-s3-and-backblaze/
- Railway : https://www.budgetforge.dev/tools/railway-pricing-2026
- Blocage YouTube des serveurs : https://github.com/yt-dlp/yt-dlp/issues/15865
- OpusClip : https://quso.ai/blog/opus-clip-pricing
