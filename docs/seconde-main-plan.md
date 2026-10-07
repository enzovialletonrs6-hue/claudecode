# Seconde Main — plan de build

« Une photo, ton annonce prête pour tous les sites d'occasion. »

Statut : plan proposé le 7 octobre 2026, en attente des cinq réponses listées tout en bas.

## Trois points qui engagent le produit

### 1. « Publiée en un clic sur tous les sites » n'est pas possible légalement

Ce que chaque site autorise (vérifié en octobre 2026) :

- **eBay** : API officielle pour publier et pour les messages. La publication en un clic est possible.
- **Vinted** : les conditions d'utilisation interdisent les robots et les outils automatisés.
  L'API officielle est réservée aux vendeurs Pro (au moins 200 articles, vêtements uniquement).
- **Leboncoin** : aucune API publique pour les particuliers. Il existe seulement des API pro
  pour l'immobilier et l'automobile, via des partenaires.
- **Facebook Marketplace** : pas d'API pour les particuliers.

Pour publier en un clic sur Vinted ou Leboncoin, il faudrait un robot qui se connecte avec le
mot de passe du client. Ça viole les conditions d'utilisation, et les comptes se font
suspendre. Il faudrait aussi stocker les mots de passe, le système anti-robot bloque ce genre
de connexion, et rien de tout ça ne marche depuis un téléphone. Je ne le construis pas.

**Proposition : la publication assistée.**

- eBay : vraiment en un clic.
- Vinted, Leboncoin, Facebook : un bouton « Publier sur Vinted » copie le titre, la
  description et le prix, prépare les photos, indique la bonne catégorie et ouvre l'app. Tu
  colles et tu valides, en environ 1 minute par site au lieu de 10.

La promesse devient **« Une photo, ton annonce prête pour tous les sites d'occasion. »** Tes
vidéos doivent reprendre cette phrase mot pour mot. Comme ça, la garantie est tenable.

### 2. Boîte unique : complète pour eBay, en lecture pour les autres sites

- **eBay** : tu lis et tu réponds depuis Seconde Main, grâce à l'API officielle.
- **Vinted et Leboncoin** : ils t'envoient un email à chaque nouveau message. Tu transfères
  ces emails vers ton adresse Seconde Main, et ils arrivent dans la boîte unique. Un bouton
  « Répondre dans Vinted » ouvre l'app.
- **À vérifier avant de coder** : est-ce que le texte du message figure dans ces emails ? Je
  le teste avec tes propres comptes avant l'étape 7.

### 3. Ce dépôt contient déjà Fantômes (étapes 1 et 2 faites)

Avec quelques heures par semaine, mener deux produits en parallèle divise par deux les chances
d'une première vente dans le mois. Il faut choisir un ordre :

- **A.** Seconde Main dans un nouveau dépôt GitHub. Fantômes reste intact. Je reprends sa
  base (comptes, pages légales, 404, aperçus de liens), ce qui fait gagner environ une semaine.
- **B.** Seconde Main remplace Fantômes ici. Fantômes reste récupérable dans l'historique Git.
- **C.** Finir Fantômes d'abord, puis Seconde Main. Fantômes en est à l'étape 2 sur 7, et sa
  promesse est tenable à 100 %.

## Le prix : 9 €/mois ne suffira pas à atteindre 7 400 €/mois

1. **Les particuliers vendent par vagues.** Ils vident un placard, puis ne vendent plus rien
   pendant des mois. Ils prendront un mois et résilieront. Pour garder 823 abonnés actifs, il
   faudrait en recruter des centaines de nouveaux chaque mois, sans fin.
2. **L'illimité à 9 € fait perdre de l'argent.** Chaque annonce coûte environ 0,15 à 0,25 €
   d'IA (lecture des photos et recherche des prix). Un revendeur qui publie 150 annonces par
   mois coûte environ 30 € et en paie 9.
3. **Payer 1 € à l'unité, c'est 27 % de frais.** Stripe prend environ 0,25 € + 1,5 % par
   paiement.

Proposition, avec la formule du milieu mise en avant :

| Formule | Prix | Pour qui |
|---|---|---|
| Carnet | 5 € les 5 annonces (1 € l'annonce), sans abonnement | Un placard à vider, une fois |
| **Mensuel** | **9 €/mois, soit 0,30 €/jour, 30 annonces** | Vend un peu chaque mois |
| Revendeur | 24 €/mois, soit 0,80 €/jour, 200 annonces | Petits revendeurs |

Pour 7 400 €/mois : environ 150 revendeurs (3 600 €) et 420 abonnés au Mensuel (3 780 €). Ça
fait **environ 570 clients au lieu de 823**, avec une base plus stable, parce que les
revendeurs publient chaque semaine. Les revendeurs sont la vraie cible récurrente. Les
particuliers, qui arrivent par TikTok, sont la porte d'entrée.

Garantie proposée : **30 jours satisfait ou remboursé sur le premier paiement.** Un bouton
« Me faire rembourser » dans les réglages (ou un simple email), et le remboursement intégral
arrive sous 5 jours ouvrés, sans justification.

Stripe plutôt que Whop : Seconde Main est un logiciel, pas l'accès à une communauté.

## Les étapes (chacune est en ligne et testable sur ton téléphone)

| # | Ce que tu verras tourner | Ce que tu fais, toi |
|---|---|---|
| 1 | **Landing en ligne** : promesse mot pour mot, douleur chiffrée, 3 bénéfices, emplacement d'avis vide et clairement marqué, bouton « Commencer ». Pages légales avec les champs [À COMPLÉTER], 404, page d'erreur, aperçus de liens, mesure d'audience Umami, affichage en moins de 2 s en 4G | Compte Vercel, compte Umami |
| 2 | **Questionnaire et écran de calcul** : 7 questions, une par écran, barre de progression, sans compte. Ensuite, par exemple : « 375 € dorment dans tes placards. Tout mettre en vente sur 3 sites te prendrait 11 h. Avec Seconde Main : 25 min. » | Rien |
| 3 | **Comptes**, créés juste après le calcul (email et mot de passe, accès immédiat). Les réponses au questionnaire sont gardées. Réglages, suppression de compte. Je te montre le schéma de la base avant la migration | Projet Supabase (guide pas à pas) |
| 4 | **Avant-goût, ta première annonce gratuite** : une photo, puis le titre, la description, la catégorie, l'état et le prix conseillé, avec 3 à 5 annonces comparables (liens). Tu peux l'utiliser tout de suite sur un site. Les autres sites, eBay en un clic et la boîte unique sont visibles mais verrouillés | Compte Claude Console, clé API, plafond de dépenses |
| 5 | **Paywall et paiement (mode test)** : l'écran complet, avec le paiement intégré à la page. Un webhook signé active l'accès, un message clair s'affiche si la carte est refusée, le portail Stripe est dans les réglages. **À partir de là, le produit est vendable** | Compte Stripe, paiement test de bout en bout |
| 6 | **eBay en un clic** : « Connecter mon compte eBay », publication directe, statut de l'annonce sur chaque site (à publier, en ligne, vendue) | Compte développeur eBay |
| 7 | **Boîte unique** : messages eBay (lecture et réponse), notifications Vinted et Leboncoin transférées par email | Une règle de transfert dans ta messagerie |
| 8 | **Vente à la main et emails pro** : page /admin pour créer un compte client, pré-remplir ses annonces et offrir des annonces. Emails envoyés depuis ton domaine. Suivi du parcours visiteur → questionnaire → compte → client | Compte Resend |
| 9 | **Production** : mentions légales complétées, Stripe en réel, nom de domaine, un vrai achat de bout en bout puis son remboursement | SIRET, domaine |

Calendrier :

- **Semaine 1** : étapes 1 à 3.
- **Semaine 2** : étapes 4 et 5. Le produit est vendable en mode test.
- **Semaine 3** : étapes 6 et 7, puis l'étape 9 dès que ton SIRET arrive. C'est là que la
  première vente réelle devient possible.
- **Semaine 4** : étape 8 et lancement (plan de 14 jours livré à ce moment-là).

## À lancer cette semaine, parce que ça prend des jours

- **Statut de micro-entrepreneur**, si ce n'est pas déjà fait, sur
  formalites.entreprises.gouv.fr (gratuit). Le SIRET est indispensable pour encaisser en réel
  et pour les mentions légales. Il faut souvent compter 1 à 3 semaines.
- **Compte développeur eBay** sur developer.ebay.com (gratuit). L'activation des clés de
  production peut prendre quelques jours.

## Budget

| Service | Coût | Pourquoi |
|---|---|---|
| Vercel | Gratuit pour construire, **20 $/mois en production** | Le palier gratuit interdit l'usage commercial |
| Supabase | Gratuit | Base de données, comptes, photos (1 Go) |
| Claude (API) | Environ 0,15 à 0,25 € par annonce, payé à l'usage | Lecture des photos et recherche des prix, avec un plafond de dépenses |
| Stripe | 1,5 % + 0,25 € par paiement | Rien à payer sans vente |
| Nom de domaine | Environ 10 €/an | Crédibilité, emails pro, adresse de transfert des messages |
| Umami, Resend, eBay | Gratuit | |

Le modèle d'IA par défaut est Claude Opus 5.5. Un modèle plus léger divise le coût par deux
environ. À l'étape 4, je comparerai les deux sur 20 objets réels et tu choisiras.

## Direction design (à valider avant que je code l'interface)

- **Idée** : l'étiquette de vide-grenier. Le prix s'affiche sur une étiquette en carton avec
  un œillet, et les photos sont posées comme sur une table de brocante.
- **Couleurs** : fond craie `#FAF6EE`, encre `#1D1C1A`, gris carton `#8B8273`. Vert bouteille
  `#1F5E4B` pour les actions et le statut « en ligne ». Orange étiquette `#F25C2A` pour les
  prix et les euros gagnés, uniquement en gros caractères.
- **Typographie** : Archivo étendu et gras pour les titres et les prix (gros chiffres lisibles
  au pouce), Archivo normal pour le texte. Une seule police variable, donc un chargement léger.
- **Règles** : un seul bouton plein par écran, en bas, à portée de pouce. Pas de dégradé, pas
  d'emoji. Des états vides qui guident, comme « Prends ton premier objet en photo ».
- **Ton** : tutoiement, phrases courtes, chiffres concrets (« 25 € qui dorment dans ton
  placard »), jamais culpabilisant.

## Les réponses dont j'ai besoin pour démarrer

1. **Promesse** : d'accord pour la publication assistée et la phrase « Une photo, ton annonce
   prête pour tous les sites d'occasion » ?
2. **Boîte unique** : d'accord pour une boîte complète sur eBay et les notifications
   Vinted et Leboncoin par email ?
3. **Dépôt** : A, B ou C ?
4. **Prix** : les 3 formules proposées, ou tu gardes 9 €/mois et 1 € l'annonce ?
5. **Design** : d'accord, ou une autre direction ?

## Sources

- Vinted, automatisation et API Pro : [achat-revente-vinted.fr](https://www.achat-revente-vinted.fr/comment-automatiser-ses-ventes-vinted-legalement-methode-2026),
  [cassou.app](https://cassou.app/fr/blog/restriction-vinted-automatisation),
  [dresskare.com](https://dresskare.com/blog-pages/blog-vendeur-pro-seconde-main/dresskare-api-vinted-pro-la-revolution-pour-les-vendeurs-pro)
- Leboncoin, absence d'API publique : [stream.estate](https://stream.estate/fr/blog/api-leboncoin-pourquoi-elle-n-existe-pas-et-les-alternatives-possibles),
  [leboncoin Solutions Pro](https://leboncoinsolutionspro.fr/logiciels-partenaires-api/)
- eBay, API de publication et de messages : [Inventory API](https://developer.ebay.com/api-docs/sell/inventory/overview.html),
  [Message API](https://developer.ebay.com/api-docs/commerce/message/overview.html)
