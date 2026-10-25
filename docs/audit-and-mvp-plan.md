# Audit du dépôt et plan d'exécution du MVP

## 1. Audit initial

### Architecture et technologies détectées

- Le dépôt ne contenait pas d'application : uniquement `claude.md` et trois images PNG.
- Aucun manifeste, code frontend, backend, schéma de données, migration, test ou fichier de déploiement n'était présent.
- Le visuel sans texte intégré `images/la maison du droit.png` convient à une bannière responsive. Les deux autres images comportent déjà du texte dans l'image et ne sont pas retenues comme contenu d'interface.
- Le projet démarre sur React, TypeScript, Vite et Tailwind CSS v4 côté interface.

### Fonctionnalités présentes avant le développement

Aucune fonctionnalité applicative ni donnée professionnelle vérifiée n'était présente.

### Lacunes et risques initiaux

- Aucun backend, persistance, authentification ni contrôle d'accès côté serveur.
- Aucun profil de professionnel vérifié : l'annuaire doit rester vide plutôt que présenter des personnes inventées.
- Aucun prestataire de paiement, système de notification ou service de stockage configuré.
- Une interface cliente seule ne peut pas assurer la prévention des doubles réservations, la confidentialité, les autorisations ou la preuve de paiement.
- Les règles professionnelles, de traitement des données et de paiement doivent être vérifiées avant ouverture en production.

## 2. Architecture proposée

### Étape fondatrice livrée dans cette phase

- Application React/TypeScript avec Vite, Tailwind CSS v4 et routes publiques.
- Parcours public d'accueil et annuaire prêt à recevoir des profils publiés et vérifiés.
- Aucune donnée professionnelle de démonstration n'est affichée comme réelle.
- Les recherches et filtres côté interface sont préparés, mais le catalogue reste vide en attendant une source de données serveur.
- Documentation de prise en main, architecture, limites, décisions et consignes de passation dans `README.md`.

### Cible technique à confirmer avant les espaces authentifiés

- PostgreSQL relationnel et migrations versionnées.
- API métier unique (backend dédié ou backend intégré) après décision d'architecture documentée.
- Authentification éprouvée, rôles contrôlés par le serveur et autorisations testées.
- Stockage privé pour les justificatifs et documents de dossiers.
- Adaptateur de paiement indépendant, activé uniquement après sélection et validation d'un prestataire disponible au Cameroun.
- Notifications transactionnelles et journal d'audit pour les actions sensibles.

## 3. Modèle de données proposé

Le modèle sera versionné avec migrations. Les principales relations envisagées :

- `users`, `roles`, `user_roles` : identité et permissions.
- `professional_profiles`, `professional_credentials`, `specialties`, `professional_specialties` : profil, justificatifs privés, spécialités et statut de vérification.
- `services`, `availability_rules`, `availability_exceptions`, `appointments`, `appointment_events` : offre, fuseau `Africa/Douala`, créneaux, rendez-vous et historique.
- `payments`, `refunds` : état financier issu du prestataire et traitements idempotents.
- `subscription_plans`, `subscriptions` : offres et périodes d'accès configurables.
- `clients`, `client_cases`, `case_documents`, `case_notes` : données privées rattachées à des propriétaires et permissions explicites.
- `articles`, `article_categories`, `legal_resources`, `legal_resource_versions` : contenus et validation éditoriale.
- `notifications`, `audit_logs` : communications et journal des opérations sensibles.

Clés étrangères, contraintes anti-chevauchement des rendez-vous, index de recherche, dates UTC et autorisations serveur seront définis dans les migrations. Les documents confidentiels ne seront jamais servis depuis un chemin public permanent.

## 4. Dépendances externes

- Fournisseur d'authentification et base de données PostgreSQL.
- Stockage objet privé et politique de rétention.
- Prestataire compatible avec MTN Mobile Money / Orange Money et reversements au Cameroun, à sélectionner après vérification contractuelle.
- Service d'e-mail ou SMS pour vérifications et notifications.
- Hébergement, sauvegardes et supervision.
- Revue juridique des conditions d'utilisation, données personnelles, règles professionnelles et commissions.

Aucune de ces intégrations n'est actuellement configurée ou déclarée opérationnelle.

## 5. Plan d'exécution et critères de validation

| Phase | Périmètre | Critères de validation |
| --- | --- | --- |
| 0 — Fondations publiques (terminée) | Identité, navigation responsive, accueil, catégories, annuaire sans données fictives | Build, lint et tests passent ; parcours d'annuaire vérifié dans le navigateur ; état vide explicite |
| 1 — Données et rôles | Choix du backend, schéma, migrations, authentification, rôles et soumission des profils | Migrations reproductibles ; tests d'accès inter-utilisateurs et de privilèges négatifs |
| 2 — Publication des profils | Revue administrative, statut de vérification, pages publiques | Aucun profil visible sans validation ; recherche, filtres et pagination alimentés par la base |
| 3 — Rendez-vous | Services, disponibilités, fuseaux, réservation, événements | Deux requêtes concurrentes ne réservent pas le même créneau ; annulation et statuts tracés |
| 4 — Paiements et notifications | Adaptateur fournisseur, callbacks signés, reçus et notifications | Réconciliation fournisseur côté serveur ; callbacks rejoués sans double traitement ; échecs non confirmés |
| 5 — Contenus et administration | Articles, modération, catégories, comptes, journal d'audit | Seuls les contenus validés sont publics ; opérations sensibles autorisées et journalisées |
| 6 — Stabilisation MVP | Tests fonctionnels, accessibilité, sécurité, performance et préparation production | Tests essentiels réussis ; restauration de sauvegarde vérifiée ; risques restants documentés |

## 6. Limites de la phase actuelle

- L'annuaire et les contenus restent vides jusqu'à la mise en place d'un backend et à la vérification de données réelles.
- Aucune inscription, session, réservation, transaction, notification ou administration n'est connectée à un serveur.
- L'interface est un socle frontend initial, pas un SaaS prêt pour des données réelles ou la production.

## 7. Journal de livraison et vérifications

### Réalisé

- Initialisation de Vite, React, TypeScript strict, Tailwind CSS v4, React Router, ESLint et Vitest.
- Ajout de Bangangté et Bamena aux villes disponibles dans les filtres de recherche.
- Création d'une prévisualisation locale de la fiche Maître Noupa Rudi : avocat en droit de la famille, premier entretien de 45 minutes à 10 000 FCFA. La fiche reste explicitement non publiée et non vérifiée; ville et autorisation/concordance du portrait à confirmer. Le portrait est conservé dans `src/assets/` pour ne pas être servi comme fichier public.
- En mode développement, la recherche de la catégorie « Droit de la famille » affiche désormais une carte de maquette séparée des résultats publiés, avec lien vers la fiche locale. Les filtres de ville masquent cette carte tant que la ville du profil n'est pas renseignée.
- Ajout de `/professionnels/inscription` avec sélection obligatoire d'au moins une catégorie et sélection multiple. Les soumissions de démonstration sont conservées en `sessionStorage` de l'onglet et affichées dans l'annuaire local comme candidatures en attente; elles ne sont ni transmises à un serveur ni visibles en production.
- La recherche « Trouver un professionnel » agrège les résultats publics (qui devront provenir du backend après validation) et, en développement uniquement, les candidatures de la session clairement marquées non vérifiées.
- Ajout d'un menu de partage depuis la fiche de profil avec liens WhatsApp/Facebook, copie puis ouverture d'Instagram (sans endpoint web Instagram de partage direct) et copie du lien, avec message d'état et avertissement pour les liens de prévisualisation locale.
- En production, la recherche publique devra afficher les profils effectivement enregistrés et approuvés par le serveur. Les formulaires et candidatures locaux ne sont pas publiés; leur partage local n'est pas utilisable hors de l'environnement de développement.
- Ajout à la maquette d'une présentation adaptée du droit de la famille couvrant violences conjugales, protection des enfants, séparations et accompagnement. Le texte reste à valider par le professionnel et à relire juridiquement; les promesses de mesures garanties ont été reformulées en examen des options applicables.
- Création de l'accueil responsive, de la navigation desktop/mobile et de l'annuaire avec recherche, filtres et état vide.
- Utilisation de `images/la maison du droit.png`, seul visuel fourni sans texte incrusté, avec un dérivé JPEG à qualité 88 dans `public/images/hero-cabinet.jpg` (environ 197 Ko contre 1,94 Mo pour le PNG original). Le fichier original reste intact.
- Ajout d'un `.env.example` sans secret, d'un `.gitignore`, du guide de démarrage et de cette documentation d'audit/passation.
- Mise à jour de Vitest après détection d'avis de sécurité dans la première version résolue par npm; le nouvel audit complet ne signale aucune vulnérabilité.

### Validation observée

- `npm run build` : réussi (vérification TypeScript et bundle Vite).
- `npm test` : réussi, 6 fichiers et 16 tests.
- `npm run lint` : réussi.
- `npm audit` : 0 vulnérabilité après la mise à jour de Vitest.
- La route locale `/__dev/professionnels/maitre-noupa-rudi` est incluse uniquement en mode développement; aucune fiche ni son portrait ne sont ajoutés au catalogue ou aux assets publics de production.
- La carte de maquette dans l'annuaire est elle aussi chargée uniquement en développement et reste clairement distincte du nombre de profils publiés/vérifiés.
- Le contenu de présentation du brouillon n'est pas un conseil juridique publié ni une description vérifiée de services réellement fournis.
- Smoke test navigateur : accueil chargé; navigation vers `/professionnels`; recherche « Droit du travail » passée dans `q`; message d'annuaire vide visible.
- Contrôle mobile navigateur à 390 px : largeur de contenu mesurée à 375 px, sans débordement horizontal.

### Non réalisé / sans migration

- Aucune migration de base de données n'est créée : il n'existe pas encore de backend ni de modèle persistant configuré.
- Aucun service externe (authentification, paiement, e-mail/SMS, stockage, analytics) n'est connecté.
- Aucun déploiement n'a été effectué. La production requiert un backend, une politique de données et les revues métier/juridiques décrites dans les phases suivantes.
