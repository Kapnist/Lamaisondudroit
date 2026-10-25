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

## Fonctionnalités de cette phase

- Page d'accueil responsive avec l'identité bleu marine/or et l'image fournie sans texte intégré.
- Navigation publique, menu mobile et liens vers les principales sections.
- Recherche par mot-clé, ville et profession conduisant à l'annuaire.
- Filtres d'annuaire par profession et ville, synchronisés avec les paramètres de l'URL.
- Catégories initiales issues du cahier des charges.
- Villes proposées dans les filtres : Douala, Yaoundé, Bafoussam, Garoua, Bangangté et Bamena.
- États vides explicites : aucun faux professionnel ou contenu juridique présenté comme authentique.
- Filtrage des profils limité aux profils vérifiés dans le module de catalogue.
- Page 404, balises de description, navigation clavier, libellés de champs et respect de la préférence « réduire les animations ».
- Visuel de bannière optimisé en JPEG (environ 197 Ko) à partir du PNG fourni, dont l'original reste conservé.
- Fiche locale de démonstration pour Maître Noupa Rudi, non publiée et non vérifiée, avec texte de présentation proposé, accessible uniquement avec le serveur de développement à `/__dev/professionnels/maitre-noupa-rudi`.
- Formulaire de préparation à l’inscription professionnelle avec sélection d’une ou plusieurs catégories juridiques.
- En mode développement, les candidatures de démonstration sont conservées dans le navigateur et apparaissent dans l’annuaire en tant que profils en attente de vérification. Elles sont partagées entre les onglets de ce navigateur, mais pas avec d’autres appareils ou utilisateurs et sont exclues de la production.
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
- `professionals` est volontairement vide tant qu'aucune source serveur ne fournit de profils vérifiés. Brancher le backend à cette frontière plutôt que d'ajouter des profils fictifs.
- La fiche de démonstration est séparée du catalogue dans `src/data/draftProfiles.ts`; sa route existe uniquement quand `import.meta.env.DEV` est vrai. Son portrait reste sous `src/assets/` et est retiré du build de production avec cette route. Elle ne doit pas être utilisée comme preuve d'identité ni publiée sans consentement sur l'image et validation des justificatifs.
- Le formulaire `/professionnels/inscription` permet de préparer une candidature avec plusieurs catégories. En développement seulement, les entrées sont conservées en `localStorage` pour que l'annuaire les affiche depuis les autres onglets du même navigateur, avec leur statut « en attente ». Ce n'est ni une inscription serveur ni un stockage adapté à de vraies données.
- `ShareProfileButton` ouvre des options explicites : WhatsApp et Facebook préremplissent le partage; Instagram ne proposant pas de lien web standard pour partager une page, l'option copie l'URL puis ouvre Instagram; la copie directe reste disponible. Les liens des brouillons locaux ne sont pas accessibles au public; le bouton le signale.
- En mode développement, une recherche correspondant à « famille », « Noupa » ou « Rudi » affiche une carte de prévisualisation clairement séparée des profils publiés; elle renvoie vers la fiche de démonstration. Cette carte et ses données sont absentes de production.
- Le texte de présentation du brouillon est lui aussi à valider avant publication, notamment les descriptions de démarches juridiques et de protection. Il est formulé sans garantir un résultat ou une mesure spécifique.
- Les contrôles de recherche sont réels côté interface, mais ne déclenchent actuellement aucun appel API.

## Décisions techniques

- **Vite plutôt que Next.js** : le dépôt est vierge et la demande de développement cible explicitement React/TypeScript/Vite/Tailwind. Cette décision ne fournit pas de backend : il faudra choisir et documenter une API avant l'authentification et les données réelles.
- **React Router** : permet des URLs publiques distinctes sans coupler l'interface au stockage.
- **CSS de composants et tokens de marque** : le système visuel est défini dans `src/index.css`; Tailwind v4 est installé et configuré pour permettre les utilitaires au fur et à mesure. Les styles personnalisés maintiennent ici le contrôle du rendu et du responsive.
- **Pas de fournisseur externe ni de secret** : `.env.example` est un emplacement de référence, pas la preuve d'une intégration.
- **Aucun profil ni article de démonstration** : exigence de fiabilité; le contenu public doit provenir de données réelles et validées.

## Sécurité et limites à respecter

Cette livraison est un frontend de démarrage, **pas un SaaS prêt pour la production**. Elle ne fournit pas :

- un backend, une base de données ou des migrations;
- l'authentification, les sessions et les permissions serveur;
- la soumission ou la vérification des profils;
- les articles publiés ou la bibliothèque juridique;
- les services, créneaux, réservations ou la protection contre les doubles réservations;
- un paiement, des reçus, des remboursements ou des notifications;
- le stockage privé, les dossiers, l'administration et les journaux d'audit.

Ne pas collecter de données personnelles réelles, publier des pièces confidentielles, promettre un créneau ou annoncer un paiement actif depuis cette version. Un contrôle visuel React ne remplace jamais une autorisation serveur.

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

Après validation du présent plan, sélectionner l'architecture serveur et livrer les fondations de données et d'authentification avant d'activer l'inscription professionnelle. Les jalons complets et leurs critères d'acceptation figurent dans [docs/audit-and-mvp-plan.md](./docs/audit-and-mvp-plan.md).
