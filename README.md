# La Maison du Droit

Socle frontend de la plateforme juridique camerounaise, construit avec React, TypeScript, Vite et Tailwind CSS v4. Cette première phase livre les fondations publiques et documente la passation vers les équipes suivantes.

## Prise en main

### Prérequis

- Node.js 20.19+ ou 22.12+.
- npm.

### Installation et démarrage

```bash
npm install
npm run dev
```

Vite affiche l'URL locale dans le terminal. Pour produire et prévisualiser le build :

```bash
npm run build
npm run preview
```

### Commandes qualité

```bash
npm run test
npm run test:watch
npm run lint
```

## Publication sur GitHub Pages

Le dépôt est configuré pour publier automatiquement le site à l’adresse `https://kapnist.github.io/Lamaisondudroit/` après chaque push sur `main`.

1. Dans GitHub, ouvrir **Settings → Pages** et sélectionner **GitHub Actions** comme source de publication.
2. Vérifier que les actions sont autorisées dans **Settings → Actions → General**.
3. Envoyer un commit sur `main`, ou lancer manuellement le workflow **Deploy to GitHub Pages** depuis l’onglet **Actions**.
4. Attendre la réussite des tâches `build` et `deploy`, puis ouvrir l’URL Pages du dépôt.

Le build de production utilise `/Lamaisondudroit/` comme chemin de base et génère un `404.html` pour permettre aux routes React de se recharger directement sur Pages. En développement, Vite continue d’utiliser `/`.

GitHub Pages héberge uniquement les fichiers statiques du frontend. L’authentification, les profils et le stockage Supabase ne seront opérationnels qu’après configuration du projet Supabase et des paramètres/URLs de redirection associés. Aucun secret serveur ne doit être ajouté au workflow ou exposé dans le bundle.

## Fonctionnalités de cette phase

- Page d'accueil responsive avec l'identité bleu marine/or et l'image fournie sans texte intégré.
- Navigation publique, menu mobile et liens vers les principales sections.
- Recherche par mot-clé, ville et profession conduisant à l'annuaire.
- Filtres d'annuaire par profession et ville, synchronisés avec les paramètres de l'URL.
- Recherche des profils vérifiés par nom, ville, profession et spécialités enregistrées.
- Pages de profils publics avec photo, spécialités, présentation en sections et partage du lien.
- Inscription professionnelle avec téléversement de photo et saisie de sections « titre + texte ».
- Tableau de bord professionnel authentifié pour modifier la photo, la ville, les spécialités et les sections de présentation; toute modification d'un profil vérifié suspend sa publication jusqu'à une nouvelle validation.
- Migration Supabase avec profils, validation, journaux d'audit, justificatifs privés, avatars privés et contrôles d'accès.
- Catégories initiales issues du cahier des charges.
- Villes proposées dans les filtres : Douala, Yaoundé, Bafoussam, Garoua, Bangangté et Bamena.
- États vides explicites : aucun faux professionnel ou contenu juridique présenté comme authentique.
- Filtrage des profils limité aux profils vérifiés dans le module de catalogue.
- Page 404, balises de description, navigation clavier, libellés de champs et respect de la préférence « réduire les animations ».
- Typographie responsive renforcée : boutons à 14 px minimum et textes secondaires à 12 px minimum, y compris sur mobile.
- Visuel de bannière optimisé en JPEG (environ 197 Ko) à partir du PNG fourni, dont l'original reste conservé.
- Fiche fictive de démonstration pour Maître Noupa Rudi, affichée séparément des profils vérifiés dans l’annuaire public et accessible à `/professionnels/demo/maitre-noupa-rudi`. Son statut fictif est explicite et la réservation est désactivée.
- Formulaire de préparation à l’inscription professionnelle avec sélection d’une ou plusieurs catégories juridiques.
- Pour les candidatures d’avocat, champs statut titulaire/stagiaire, matricule, ordre, ville de prestation de serment, cabinet de stage et cinq justificatifs requis. Lorsque Supabase est configuré, les pièces sont téléversées dans un bucket privé et le profil reste en attente de validation.
- Les candidatures restent non vérifiées et ne peuvent pas proposer de consultations. Le badge « Vérifié » est réservé aux profils dont la validation est réellement enregistrée; le profil de démonstration Maître Noupa affiche « Vérification à confirmer ».
- Sans configuration Supabase, le formulaire reste une prévisualisation de développement en navigateur; les photos et pièces ne sont alors pas envoyées ni conservées.
- L’annuaire présente les dix régions du Cameroun comme filtres. Le formulaire de candidature associe la région aux villes connues : Bangangté, Bamena et Bafoussam (Ouest), Douala (Littoral), Yaoundé (Centre) et Garoua (Nord).
- Menu de partage sur la fiche de profil avec options WhatsApp, Facebook, Instagram (copie du lien puis ouverture) et copie directe.

## Organisation du code

```text
src/
  components/       éléments partagés (marque, navigation, recherche)
  data/             catalogue et fonctions pures de filtrage
  pages/            accueil, annuaire, page 404
  test/             configuration de test
  App.tsx           routes publiques
  index.css         tokens de marque et styles responsive/accessibles
  main.tsx          point d'entrée React
images/             visuels fournis, inchangés
public/images/      version JPEG optimisée utilisée pour la bannière
src/assets/         portrait du brouillon, non copié dans le dossier public
docs/
  audit-and-mvp-plan.md  état initial, modèle cible, risques et jalons
```

### Parcours et données

- `/` affiche l'accueil. Les ancres `#domaines`, `#fonctionnement`, `#professionnels` et `#ressources` ciblent les sections publiques.
- `/professionnels` affiche la recherche. Les paramètres `q`, `ville` et `profession` préremplissent les filtres.
- `src/data/catalogue.ts` centralise les catégories, villes, professions et fonction `filterProfessionals`.
- `src/services/professionalProfiles.ts` lit la vue Supabase `published_professional_profiles`; seuls les profils validés sont renvoyés et filtrés selon leurs spécialités. Sans Supabase, l'annuaire reste volontairement vide de profils publics.
- La fiche fictive de démonstration est séparée du catalogue dans `src/data/draftProfiles.ts`. Elle reste distincte des profils réels et vérifiés, porte un avertissement explicite et ne permet aucune réservation. Son portrait reste sous `src/assets/`. Les informations de cette fiche ne constituent pas une preuve d'identité ou de qualification professionnelle.
- Le formulaire `/professionnels/inscription` permet de créer un compte ou de se connecter, de téléverser une photo, de choisir plusieurs catégories et d'ajouter jusqu'à 12 sections de présentation. Avec Supabase, les profils sont enregistrés en attente de vérification.
- Le formulaire d'avocat exige cinq pièces justificatives. Elles sont envoyées vers le bucket privé `lawyer-verification`, accessible uniquement au propriétaire et aux administrateurs configurés.
- La photo est conservée dans le bucket privé `professional-avatars`; des URLs signées temporaires ne sont rendues accessibles au public qu'après vérification du profil.
- `/professionnel/tableau-de-bord` permet au professionnel authentifié de modifier sa photo, sa ville, ses catégories et les titres/textes de présentation.
- En développement sans Supabase, les entrées de démonstration sont conservées dans `localStorage`, uniquement sur le même navigateur. Ce mode ne transmet aucun fichier et n'est pas une inscription serveur.
- `ShareProfileButton` ouvre des options explicites : WhatsApp et Facebook préremplissent le partage; Instagram ne proposant pas de lien web standard pour partager une page, l'option copie l'URL puis ouvre Instagram; la copie directe reste disponible. Les liens des brouillons locaux ne sont pas accessibles au public; le bouton le signale.
- En développement, l’accueil affiche la carte de démonstration; dans l’annuaire, la fiche fictive apparaît aussi en production, toujours séparée et identifiée comme telle. Les recherches sur son nom, sa profession, le droit de la famille ou les sujets de sa présentation (par exemple « avocat » ou « divorce ») la trouvent. Un filtre de ville ou de région la masque, car sa ville reste à confirmer. Le profil ne compte pas dans le total des professionnels vérifiés.
- La section d’accueil « Les experts les plus sollicités » montre les profils approuvés disponibles et la maquette locale distinctement marquée. Le classement par popularité n’est pas simulé : il nécessitera des données réelles de réservation.
- Le texte de présentation du brouillon est lui aussi à valider avant publication, notamment les descriptions de démarches juridiques et de protection. Il est formulé sans garantir un résultat ou une mesure spécifique.
- Les contrôles de recherche interrogent Supabase lorsque l'environnement est configuré; la vue publique renvoie exclusivement des profils approuvés.

## Décisions techniques

- **Supabase** : utilisé pour l'authentification, PostgreSQL, les fonctions RPC contrôlées et le stockage des photos/pièces. La migration SQL versionnée définit les limites de sécurité et les règles de publication.
- **React Router** : permet des URLs publiques distinctes sans coupler l'interface au stockage.
- **CSS de composants et tokens de marque** : le système visuel est défini dans `src/index.css`; Tailwind v4 est installé et configuré pour permettre les utilitaires au fur et à mesure. Les styles personnalisés maintiennent ici le contrôle du rendu et du responsive.
- **Configuration requise** : les variables publiques `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` doivent être configurées dans `.env.local`. Aucune clé `service_role` ne doit être exposée côté navigateur.
- **Aucun profil ni article de démonstration** : exigence de fiabilité; le contenu public doit provenir de données réelles et validées.

## Sécurité et limites à respecter

Cette livraison fournit une intégration Supabase initiale, mais **n'est pas prête pour une production ouverte**. Elle ne fournit pas :

- un projet Supabase hébergé déjà configuré ni des identifiants;
- une interface d'administration pour valider les candidatures (les RPC d'administration sont réservées aux UUID ajoutés explicitement à `platform_admins`);
- les articles publiés ou la bibliothèque juridique;
- les services, créneaux, réservations ou la protection contre les doubles réservations;
- un paiement, des reçus, des remboursements ou des notifications;
- les dossiers clients et la gestion documentaire.

Les migrations et politiques ne sont effectives qu'après application à un projet Supabase de test et vérification des rôles. Ne collecter aucun document réel avant cette étape et une revue de sécurité indépendante.

### Configurer Supabase (environnement de test)

1. Créer un projet Supabase non-production et définir les URL autorisées de redirection d'authentification.
2. Copier `.env.example` vers `.env.local`, puis renseigner `VITE_SUPABASE_URL` et la clé publique anon/publishable du projet. Ne jamais mettre la clé `service_role` dans une variable `VITE_`.
3. Appliquer `supabase/migrations/20261025000100_secure_lawyer_verification.sql` avec la Supabase CLI liée au projet de test (`supabase db push`) ou l'éditeur SQL.
4. Ajouter manuellement l'identifiant UUID du compte administrateur prévu à `public.platform_admins` depuis un contexte propriétaire de base de données. Ne pas fournir de fonction permettant aux utilisateurs de s'auto-attribuer ce rôle.
5. Les candidats confirment leur courriel si la confirmation Supabase est activée, puis se connectent depuis `/professionnel/tableau-de-bord` ou reviennent à l'inscription pour envoyer leur dossier.
6. Les profils restent non publiés jusqu'à une décision administrative. Les profils publics sont consultés par catégories via la vue `published_professional_profiles`; les photos restent privées et sont servies avec des URL signées temporaires.
7. Tester les politiques RLS, les refus d'accès aux documents par un autre compte, le refus d'approbation par un non-admin, l'expiration des URL signées et le parcours e-mail en projet de test avant d'utiliser des données réelles.

## Consignes pour l'équipe de relais

1. Lire [l'audit et le plan MVP](./docs/audit-and-mvp-plan.md) avant d'étendre le périmètre : il décrit le dépôt de départ, les entités cibles, les dépendances externes et les critères de chaque phase.
2. Confirmer le choix du backend, de PostgreSQL, de l'authentification et de l'hébergement avant d'implémenter les espaces privés. Éviter de multiplier les frameworks.
3. Ajouter des profils uniquement après validation administrative enregistrée côté serveur; conserver une distinction vérifiable entre données déclarées et données contrôlées.
4. Implémenter la réservation avec transaction/contrainte en base et le fuseau `Africa/Douala`; ne pas se reposer sur l'état du navigateur pour prévenir les conflits.
5. Ne confirmer un paiement qu'après vérification serveur ou notification signée/idempotente du prestataire. Le prestataire Camerounais reste à sélectionner et à qualifier.
6. Ajouter des tests de permissions négatives, concurrence de réservation, callbacks répétés et flux d'échec de paiement avant d'ouvrir ces parcours.
7. Maintenir les catégories et offres commerciales dans les données administrables à terme; ne pas inscrire de prix de production dans l'interface.
8. Mettre à jour cette documentation à chaque phase avec les migrations, intégrations réellement testées, commandes de déploiement et limites restantes.

## Prochaine étape recommandée

Appliquer et tester la migration Supabase dans un projet non-production, puis compléter l'interface de modération administrative et les tests d'accès négatifs avant d'utiliser des pièces réelles. Les jalons MVP et les limites figurent dans [docs/audit-and-mvp-plan.md](./docs/audit-and-mvp-plan.md).
