# Clipperie — plan de build

> Un live de deux heures devient trente clips verticaux.

Base de départ : le code de Fantômes (landing, pages légales, comptes Supabase, réglages,
suppression de compte), repris et adapté. Fantômes reste intact sur sa branche
`claude/fantomes-saas-mvp-ip8cy4`. Clipperie aura son propre projet Vercel et son propre
projet Supabase. Pull request de suivi : https://github.com/enzovialletonrs6-hue/claudecode/pull/1

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
Téléphone ── lien YouTube, Twitch, Drive… ──▶ Vercel (Next.js) ──▶ Supabase (comptes, base, file d'attente)
    │                                                                   ▲
    └── fichier (envoyé directement, en morceaux) ──▶ Cloudflare R2 ◀───┤
                                                                        │
                                       Worker Railway (ffmpeg) ─────────┘
                                         ├─ récupération YouTube (voir « Liens YouTube »)
                                         ├─ son ─▶ Deepgram (transcription mot à mot)
                                         ├─ transcription ─▶ Claude (moments forts + titres)
                                         └─ découpe 1080×1920, sous-titres incrustés, zip
```

- Le fichier ne passe jamais par Vercel (limité à 4,5 Mo par requête) : il part du navigateur
  vers R2 en morceaux, avec reprise si la connexion coupe.
- Vercel ne peut pas faire tourner ffmpeg pendant 20 minutes : un petit serveur dédié
  (« worker », sur Railway) prend les vidéos en file d'attente.
- Ordre de montage : les 3 meilleurs clips d'abord, puis les autres. Avant-goût en ~5 min
  depuis un fichier, ~15 min depuis un lien YouTube (à mesurer pendant le test de l'étape 4).

## Liens YouTube

Demande du 6 octobre : coller un lien YouTube doit suffire pour créer ses clips. C'est l'action
principale de l'écran de dépôt ; fichier, Twitch, Google Drive et Dropbox restent visibles
juste en dessous.

**Le problème.** YouTube bloque les téléchargements qui viennent de serveurs (« Sign in to
confirm you're not a bot »). Les jetons PO ne suffisent pas quand l'adresse du serveur est
repérée, et YouTube change ses protections toutes les 4 à 8 semaines. Même OpusClip a eu des
pannes d'import YouTube (18 août, 10 et 11 septembre, 2 octobre 2026).

**La récupération.** Une seule fonction `fetchFromYouTube(lien)` dépose la vidéo dans R2. Elle a
deux routes interchangeables, départagées par un test à l'étape 4 :

- Route A, notre récupérateur : yt-dlp mis à jour chaque nuit, Deno et un fournisseur de jetons
  PO (bgutil), avec une adresse résidentielle par vidéo (proxy résidentiel payé au Go, ~1 $/Go
  chez DataImpulse ou Evomi). On ne télécharge que le nécessaire : le son (~45 Mo pour 2 h) pour
  la transcription, puis seulement les passages retenus, en 1080p. Environ 0,07 $ par essai et
  0,25 à 1 $ par vidéo payante, sans abonnement.
- Route B, prestataire spécialisé : HuntAPI (Toulouse) récupère la vidéo entière et la garde
  24 h ; le worker la copie dans R2. Un crédit par vidéo réussie, 99 $/mois pour 500 vidéos
  (remise startup possible jusqu'à −50 %), 10 vidéos offertes pour le test. Au-delà d'1 h, la
  vidéo arrive en 720p : parfait en « plan entier », moins net en « recadré ».
- Le test (7 jours, pendant la construction de l'étape 5) : les deux routes sur 20 vrais liens
  de la cible, dont 3 non répertoriés, 3 de 3 h 30 à 4 h, 2 lives terminés depuis moins de 6 h,
  plus 3 liens Twitch. On garde la route qui réussit au moins 19 fois sur 20 en moins de 20 min ;
  si les deux passent, la moins chère. La route A reste branchée en secours si B l'emporte (elle
  ne coûte rien à l'arrêt). Avant de payer quoi que ce soit : confirmation écrite du fournisseur
  de proxy (YouTube autorisé) ou de HuntAPI (vidéos non répertoriées, durée maximale, contrat de
  sous-traitance RGPD, lieu d'hébergement).

**Côté utilisateur.**

- Un grand champ « Colle ton lien YouTube » : coller (appui long) suffit, le bouton « Coller »
  n'est qu'un raccourci. En 1 s, une carte montre miniature, titre et chaîne (via oEmbed, sans
  clé d'API Google). Les liens de partage de l'appli, de YouTube Studio, `/live/` et
  `youtu.be` sont reconnus.
- Une case obligatoire, non cochée par défaut : « Je suis le créateur de cette vidéo, ou j'ai son
  accord écrit, et je demande à Clipperie d'en récupérer une copie pour moi. » On garde la
  date, l'IP tronquée, le lien et la chaîne, comme preuve.
- Progression honnête : un chrono qui tourne pendant « Récupération depuis YouTube », pas de
  fausse barre. « Tu peux fermer l'appli, on t'envoie un email dès que tes 3 premiers clips sont
  prêts. »
- Le cadrage « recadré » se choisit après la récupération, sur une vraie image de la vidéo ;
  les clips se remontent alors en ~30 s.
- Les cas connus ont un message précis tout de suite : vidéo privée, réservée aux membres,
  limitée aux adultes, live en cours ou première pas encore diffusée, lien de chaîne ou de
  playlist, Short. Un live tout juste terminé : on attend que YouTube l'ait traité et on
  t'écrit. Plus de 4 h : on découpe les 4 premières heures, annoncé avant de lancer.
- Si YouTube bloque : nouvelles tentatives automatiques (1 h, 3 h, 12 h, 24 h) et email quand
  ça passe. En attendant, trois boutons, dans cet ordre sur téléphone : « Je finis sur
  ordinateur » (email avec le lien), « Lien Google Drive ou Dropbox », « Depuis l'app YouTube
  Studio » (taille du fichier annoncée honnêtement). L'essai gratuit n'est consommé que si
  les clips arrivent.
- Pendant une panne connue, un bandeau prévient avant même de coller le lien.

**Surveillance.** Une sonde récupère deux fois par jour la même vidéo de test. Si elle échoue, tu
reçois un email et le bandeau s'affiche ; les vidéos bloquées repartent seules quand elle
redevient verte. /admin affiche le taux de réussite des 20 derniers liens. Chaque fichier reçu
est vérifié (taille, durée, son présent) avant de payer la transcription.

**Coûts protégés.** L'essai est réservé dès le lancement (un seul par compte, rendu si la
récupération échoue) et un seul par chaîne YouTube. Une même vidéo YouTube n'est récupérée et
transcrite qu'une fois, même collée par plusieurs comptes. L'essai analyse au plus 2 h. Code de
vérification par email avant le premier essai (à valider).

**Juridique.** Télécharger depuis YouTube sort de ses conditions d'utilisation et touche au
droit français sur les mesures techniques de protection (CPI L331-5 et L335-3-1). Le risque
reste chez Clipperie, même en passant par un prestataire. Toute la concurrence (OpusClip,
Vizard, Klap…) est dans la même position, et aucune action contre un outil de clips n'a été
trouvée. Défense principale : c'est le créateur, titulaire des droits, qui autorise la copie
(case à cocher + CGV). Clauses CGV :

- garantie de droits ;
- mandat technique ;
- licence limitée au service ;
- import par lien « au mieux », le fichier restant toujours possible ;
- remboursement au prorata si l'import YouTube est indisponible plus de 7 jours d'affilée ;
- vidéos d'autrui interdites ;
- signalement et retrait (DSA).

Recommandé : 1 h d'avocat (~150 à 300 €) avant d'ouvrir les liens YouTube au public.

## Étapes

Chaque étape est mise en ligne et testable sur téléphone avant de passer à la suivante.

| # | Livrable visible | Ton temps | Comptes à créer | État |
|---|------------------|-----------|-----------------|------|
| 1 | Landing en ligne + pages légales, 404, erreur, aperçus de liens | 20 min | Vercel | à faire |
| 2 | Questionnaire (7 écrans) + écran de calcul, sans compte | 5 min | — | à faire |
| 3 | Comptes : inscription après le calcul, code par email, réglages, suppression ; schéma | 50 min | Supabase, Resend, nom de domaine | à faire |
| 4 | Dépôt (lien YouTube en tête, fichier, Twitch, Drive, Dropbox) + transcription ; test des deux routes YouTube | 1 h 30, dont le test réparti sur 7 jours | Cloudflare, Railway, Deepgram, proxy résidentiel, HuntAPI | à faire |
| 5 | Moments forts → clips verticaux sous-titrés et titrés ; avant-goût (3 clips offerts) ; email « clips prêts » | 30 min | Anthropic (API) | à faire |
| 6 | Paywall + Stripe Checkout intégré (mode test), webhook, export par lot, portail client | 35 min | Stripe | à faire |
| 7 | /admin (vente à la main, santé des liens YouTube), mesure Umami | 20 min | Umami | à faire |
| 8 | Production : mentions complétées, avis d'avocat, Stripe live, Vercel Pro, premier achat réel | 1 h | — | à faire |

Calendrier visé : semaine 1 → étapes 1 à 3 ; semaine 2 → 4 et 5 (le test YouTube tourne pendant
l'étape 5) ; semaine 3 → 6 et 7 ; semaine 4 → 8 et lancement. En parallèle, dès maintenant :
déclarer la micro-entreprise si ce n'est pas fait (le SIRET peut prendre plusieurs semaines,
Stripe live en a besoin).

### Détail

1. **Landing** — promesse mot pour mot en haut, douleur chiffrée, trois bénéfices, emplacement
   d'avis marqué (vide tant qu'il n'y a pas de vrais avis), un seul bouton « Commencer » (aussi
   en barre collante sur mobile). Pages légales réécrites pour Clipperie. Image Open Graph.
2. **Questionnaire + calcul** — une question par écran, barre de progression en forme de
   timeline, réponses gardées dans le navigateur. Le calcul s'affiche sans compte.
3. **Comptes** — repris de Fantômes : email + mot de passe (le lien magique ouvrirait un autre
   navigateur que celui de TikTok/Instagram), connexion par code en secours. Le compte est
   demandé au moment de déposer la vidéo : « pour t'envoyer tes clips ». Emails envoyés par
   Resend avec ton domaine (Supabase n'écrit sinon qu'aux membres de ton projet).
4. **Dépôt + transcription** — lien YouTube en action principale (voir « Liens YouTube ») ;
   aussi fichier (jusqu'à 10 Go, 4 h) ou lien Twitch, Google Drive, Dropbox, lien direct. Le
   worker extrait le son, Deepgram rend une transcription mot à mot minutée. Écran de
   progression : Récupération → Transcription → Repérage → Montage 12/30.
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
7. **Admin + mesure** — /admin réservé à ton email : créer un compte client, lui lancer une
   vidéo par lien, lui ouvrir un accès manuel (formule + date de fin) sans Stripe ; santé des
   liens YouTube et coût des essais. Umami : entonnoir landing → questionnaire → compte →
   vidéo → paywall → paiement.
8. **Production** — champs `[À COMPLÉTER]` remplis, avis d'avocat sur les liens YouTube,
   Stripe live, passage Vercel Pro, un vrai paiement de ta part puis remboursement. Ensuite :
   plan de lancement sur 14 jours.

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
7. Ta prochaine vidéo à découper, elle est où ? — Sur YouTube / Sur Twitch /
   Sur mon ordinateur / Sur Google Drive ou Dropbox

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

| Formule | Prix | Clips par mois | Vidéo analysée par mois | Par jour |
|---------|------|----------------|-------------------------|----------|
| Essentiel | 19 €/mois | 20 | 6 h | 0,62 € |
| **Créateur** (mise en avant) | **49 €/mois** | **60** | **15 h** | **1,61 €** |
| Studio | 99 €/mois | 150 | 40 h | 3,25 € |

- Un clip compte quand tu le débloques pour l'exporter ; les clips proposés et non gardés ne
  comptent pas. Les heures analysées sont plafonnées par formule : sans plafond, un abonné
  Essentiel très actif coûterait plus qu'il ne rapporte.
- 19 € capte les petits podcasts et fait paraître 49 € raisonnable ; 99 € sert les streamers
  quotidiens et les monteurs indépendants qui gèrent plusieurs créateurs.
- Exemple de mix pour l'objectif : 30 × 19 € + 90 × 49 € + 25 × 99 € = 7 455 € avec 145 clients.
- Réaliste : 10 clients le premier mois ; 7 400 €/mois demande plutôt 6 à 12 mois, car les
  outils de clips perdent des clients chaque mois (créateurs qui arrêtent de publier).
- TVA : l'objectif dépasse le seuil de la franchise ; à ce moment-là, un prix affiché de 49 € TTC
  rapporte 40,83 € HT. À voir avec un comptable.
- Stripe plutôt que Whop : c'est un logiciel, pas un accès à une communauté.

## Coûts

| Service | Rôle | Coût |
|---------|------|------|
| Vercel | site et API | 0 pendant le build ; **Pro 20 $/mois dès la première vente** (le palier gratuit interdit l'usage commercial) |
| Supabase | comptes et base | 0 (palier gratuit ; les vidéos n'y sont pas stockées : 50 Mo max par fichier) |
| Cloudflare R2 | vidéos et clips | 0 jusqu'à 10 Go, puis 0,015 $/Go ; téléchargements gratuits |
| Railway | worker ffmpeg | ~5 $/mois (forfait Hobby, 5 $ d'usage inclus) ; sortie de données 0,05 $/Go, quelques centimes par vidéo |
| Récupération YouTube | route A ou B (voir « Liens YouTube ») | A : ~1 $/Go de proxy, ~0,07 $ par essai, 0,25 à 1 $ par vidéo payante, recharge de départ 5 à 20 $ ; B : 99 $/mois pour 500 vidéos, à partir du lancement seulement |
| Deepgram | transcription | 200 $ offerts (plusieurs centaines d'heures), puis ~0,52 $ par live de 2 h |
| Claude (Opus 5.5) | moments forts et titres | ~0,30 à 0,50 $ par live de 2 h, à l'usage |
| Stripe | paiement | pas d'abonnement ; ~1,5 % + 0,25 € par paiement + 0,7 % pour la facturation récurrente |
| Resend, Umami | emails, mesure | 0 (paliers gratuits) |
| Nom de domaine | clipperie.fr ou équivalent | ~10 €/an |
| Avocat | avis sur les liens YouTube, une fois | ~150 à 300 € |

Coût fixe une fois en vente : ~26 €/mois avec la route A, ~110 €/mois avec la route B (~70 € avec
la remise startup). Coût variable : ~1 € par live de 2 h analysé. Chaque essai coûte ~1 € : à 5 %
d'essais transformés en clients, un client payant coûte ~20 € d'essais (suivi dans /admin).
Marge sur un client Créateur : ~90 %.

## Schéma de données (à valider avant la migration de l'étape 3)

- `profiles` — un par compte, créé automatiquement : `email`, `quiz` (réponses du questionnaire),
  `trial_video_id` (l'essai, réservé une seule fois).
- `subscriptions` — un par compte, écrit uniquement par le webhook Stripe ou par /admin :
  `plan` (essentiel, createur, studio), `status` (active, past_due, canceled), `source`
  (stripe, manual), `clips_per_period`, `hours_per_period`, `current_period_start`,
  `current_period_end`, `stripe_customer_id`, `stripe_subscription_id`.
- `videos` — une par dépôt : `source_type` (upload, youtube, link), `source_url`, `youtube_id`,
  `channel_name`, `storage_key`, `title`, `duration_s`, `framing` (full, crop) + `crop_x`,
  `is_trial`, `rights_declared_at` + `rights_declared_ip`, `fetch_provider`, `vendor_job_id`,
  `attempts`, `next_attempt_at`, `status` (uploading, queued, fetching, waiting_youtube,
  youtube_blocked, transcribing, detecting, rendering, ready, failed), `progress`, `error`,
  `source_deleted_at`.
- `youtube_sources` — une par vidéo YouTube, partagée entre comptes : durée, son, transcription,
  passages déjà récupérés, date de récupération (une vidéo n'est récupérée et transcrite qu'une
  fois).
- `clips` — ~15 par heure de vidéo : `video_id`, `rank`, `start_s`, `end_s`, `title`, `text`,
  `status` (pending, rendering, ready, failed), `file_key`, `thumb_key`, `unlocked_at`,
  `unlock_source` (trial, plan, admin). Quota = clips débloqués par `plan` sur la période en cours.
- `exports` — un par export par lot : `video_id`, `clip_ids`, `status`, `file_key`.
- `service_status` — état de la sonde YouTube (vert ou rouge, dernière vérification).
- `stripe_events` — journal des événements Stripe déjà traités (pas de double activation).

Sécurité : chacun ne lit que ses lignes (RLS) ; abonnement, essai et déblocages écrits côté
serveur uniquement. Transcriptions mot à mot rangées dans R2, pas en base.

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
  montrent une timeline vide « colle ton lien ici ». Pas de dégradé, de verre dépoli ni d'emoji.
- Ton : tutoiement, phrases courtes, mots de créateur, chiffres concrets en heures et en euros,
  jamais culpabilisant.

## Décisions

Validé :

- 6 octobre : coller un lien YouTube suffit pour créer ses clips ; c'est l'action principale de
  l'écran de dépôt (voir « Liens YouTube »).

En attente de réponse (recommandation entre parenthèses) :

- Formules 19 / 49 / 99 €, quota compté au déblocage. (Oui.)
- Heures de vidéo analysées par mois : 6 h, 15 h, 40 h selon la formule ; l'essai analyse
  jusqu'à 2 h. (Oui.)
- Avant-goût : 3 clips complets offerts, sans filigrane, le reste visible et verrouillé. (Oui.)
- Garantie : 30 jours sur le premier paiement, un email suffit, remboursement lancé sous 48 h.
  (Oui.)
- Email « tes clips sont prêts », hors liste du MVP : la récupération et le montage prennent
  10 à 15 min, l'email ramène la personne au paywall. (L'ajouter, via Resend.)
- Code de vérification à 6 chiffres par email avant le premier essai : chaque essai coûte ~1 €,
  et il faut une adresse valide pour prévenir que les clips sont prêts. (Oui ; un code marche
  dans le navigateur de TikTok, un lien non.)
- Cadrage : « plan entier » et « recadré » (choisi sur une vraie image après récupération), sans
  suivi des visages. (Oui.)
- 1 h d'avocat avant d'ouvrir les liens YouTube au public, ~150 à 300 €. (Oui.)
- Route B si elle gagne le test : ~85 €/mois de plus dès le lancement. (Décision au moment du
  test, chiffres en main.)
- Direction design et schéma ci-dessus. (À valider.)

Décisions techniques :

- Clipperie construit sur cette branche à partir du code de Fantômes ; nouveaux projets Vercel
  et Supabase (le palier gratuit Supabase permet deux projets actifs).
- Le proxy (`proxy.ts`) ne tourne que sur les pages de compte : la landing reste statique.
- Récupération YouTube derrière une seule fonction, routes interchangeables, jamais de cookies
  de compte Google, jamais d'API YouTube Data dans le produit (ses règles interdisent le
  téléchargement).
- Vidéos sources supprimées 7 jours après traitement, clips 60 jours après création.
- Un seul essai par compte et par chaîne YouTube ; vidéos de 4 h maximum (au-delà : les 4
  premières heures).
- L'accès payant n'est activé que par le webhook Stripe signé, jamais par la redirection.
- Aucun secret côté navigateur ; toutes les entrées validées côté serveur (zod).

## Champs à compléter avant la production

Repérés par `[À COMPLÉTER]` sur `/mentions-legales`, `/cgv`, `/confidentialite` : nom ou raison
sociale, adresse (ou domiciliation), SIRET, mention TVA (franchise en base si micro-entreprise),
téléphone, directeur de publication, médiateur de la consommation, email de contact
(`lib/site.ts`), nom de domaine. Sous-traitants à citer : Vercel, Supabase, Cloudflare, Railway,
Deepgram, Anthropic, Stripe, Resend, Umami, et le fournisseur de proxy ou HuntAPI selon la
route retenue.

## Risques

1. La qualité des moments choisis fait tout le produit : on teste sur 5 vrais lives de la cible
   avant le lancement et on ajuste les consignes.
2. YouTube casse la récupération toutes les quelques semaines, chez nous comme chez les
   concurrents : sonde, bandeau, nouvelles tentatives automatiques, et le fichier ou un lien
   Drive en solution de rechange. Si YouTube imposait partout son nouveau mode de diffusion
   (SABR) avant que yt-dlp ne le gère, les liens YouTube pourraient être coupés plusieurs
   semaines.
3. Chaque essai coûte ~1 € : un essai par compte et par chaîne, code par email, 2 h analysées
   au plus.
4. Droits et conditions de YouTube : case à cocher, CGV, avis d'avocat avant le lancement.

## Sources (vérifiées les 5 et 6 octobre 2026)

- Supabase, limite de taille des fichiers : https://supabase.com/docs/guides/storage/uploads/file-limits
- Vercel Hobby, usage non commercial : https://vercel.com/docs/plans/hobby
- Deepgram : https://www.cekura.ai/blogs/deepgram-pricing
- Cloudflare R2 : https://developers.cloudflare.com/r2/pricing/
- Railway : https://docs.railway.com/pricing/plans
- OpusClip, prix : https://quso.ai/blog/opus-clip-pricing ; pannes d'import YouTube : https://status.opus.pro/history/1
- yt-dlp, jetons PO : https://github.com/yt-dlp/yt-dlp/wiki/PO-Token-Guide
- Blocage des serveurs malgré les jetons PO : https://github.com/yt-dlp/yt-dlp/issues/16773 ,
  https://raw.githubusercontent.com/Brainicism/bgutil-ytdlp-pot-provider/master/README.md
- SABR : https://github.com/yt-dlp/yt-dlp/pull/13515
- HuntAPI (tarifs lus via des extraits, à reconfirmer) : https://www.huntapi.com/pricing
- Proxy résidentiel : https://dataimpulse.com/residential-proxies/ , https://evomi.com/pricing
- Conditions de YouTube : https://www.youtube.com/static?template=terms
- Téléchargement depuis YouTube Studio : https://support.google.com/youtube/answer/56100
