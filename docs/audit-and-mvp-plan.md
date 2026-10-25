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
- En mode développement, l’accueil et l’annuaire sans filtre affichent désormais une carte de maquette séparée des résultats publiés, avec photo, nom, spécialité et lien vers la fiche locale. Une recherche « famille », « Noupa » ou « Rudi » l'affiche également. Les filtres de ville ou de région la masquent tant que la ville du profil n'est pas renseignée. La carte est explicitement non vérifiée et absente de production.
- Ajout d'une section « Les experts les plus sollicités » à l'accueil : elle présente les profils publiés et la maquette de démonstration séparément. Aucun classement fictif n'est créé; les sollicitations réelles ne pourront être classées qu'après activation de la réservation et collecte de statistiques fiables.
- Ajout de `/professionnels/inscription` avec sélection obligatoire d'au moins une catégorie et sélection multiple. Les soumissions de démonstration sont conservées dans `localStorage` et affichées dans l'annuaire local comme candidatures en attente; elles ne sont ni transmises à un serveur ni visibles en production. La migration depuis l'ancienne clé `sessionStorage` est prise en charge.
- « Explorer l’annuaire » ouvre `/professionnels` sans filtre, où toutes les candidatures du navigateur de développement sont visibles avec leur statut. Les données `localStorage` ne sont partagées qu'entre les onglets du même navigateur, jamais avec d'autres utilisateurs ou appareils.
- Ajout des dix régions du Cameroun dans le filtre de l'annuaire et des régions associées aux villes connues dans les formulaires et les cartes de candidatures. Pour la suite, enrichir cette correspondance depuis le catalogue administrable au lieu de supposer une couverture nationale des villes.
- L'annuaire agrège les résultats publics qui devront provenir du backend après validation et, en développement uniquement, les candidatures locales clairement marquées non vérifiées.
- Ajout d'un menu de partage depuis la fiche de profil avec liens WhatsApp/Facebook, copie puis ouverture d'Instagram (sans endpoint web Instagram de partage direct) et copie du lien, avec message d'état et avertissement pour les liens de prévisualisation locale.
- Ajout au formulaire avocat des statuts titulaire/stagiaire et des champs obligatoires pour le diplôme, le matricule, l'Ordre, la ville de prestation de serment, le cabinet de stage et les cinq justificatifs associés. Pour protéger les documents, cette maquette ne téléverse ni ne conserve les fichiers; un backend avec stockage privé est nécessaire avant toute collecte réelle.
- Les candidatures sont marquées « Profil non vérifié » et ne donnent pas accès aux consultations. Le profil démo Maître Noupa affiche « Vérification à confirmer » plutôt qu'un badge de vérification trompeur. Le badge « Vérifié » du catalogue reste conditionné à une validation effective.
- En production, la recherche publique devra afficher les profils effectivement enregistrés et approuvés par le serveur. Les formulaires et candidatures locaux ne sont pas publiés; leur partage local n'est pas utilisable hors de l'environnement de développement.
- Ajout à la maquette d'une présentation adaptée du droit de la famille couvrant violences conjugales, protection des enfants, séparations et accompagnement. Le texte reste à valider par le professionnel et à relire juridiquement; les promesses de mesures garanties ont été reformulées en examen des options applicables.
- Création de l'accueil responsive, de la navigation desktop/mobile et de l'annuaire avec recherche, filtres et état vide.
- Utilisation de `images/la maison du droit.png`, seul visuel fourni sans texte incrusté, avec un dérivé JPEG à qualité 88 dans `public/images/hero-cabinet.jpg` (environ 197 Ko contre 1,94 Mo pour le PNG original). Le fichier original reste intact.
- Ajout d'un `.env.example` sans secret, d'un `.gitignore`, du guide de démarrage et de cette documentation d'audit/passation.
- Mise à jour de Vitest après détection d'avis de sécurité dans la première version résolue par npm; le nouvel audit complet ne signale aucune vulnérabilité.
- Ajout de l'intégration Supabase côté client (`@supabase/supabase-js`) et d'un `.env.example` public sans secret. La connexion réelle reste désactivée tant que `.env.local` et le projet hébergé ne sont pas configurés.
- Ajout de la migration versionnée `supabase/migrations/20261025000100_secure_lawyer_verification.sql` : profils relationnels, demandes de vérification, fonctions RPC contrôlées, journal d'audit, accès administrateur explicite et compartiments de stockage.
- Les justificatifs d'avocat restent dans un compartiment privé; la photo l'est également avant validation. Les URL signées de photo ne sont créées que pour le propriétaire ou un profil vérifié.
- Création de compte Supabase et soumission de candidature disponibles quand la configuration est présente; une confirmation d'adresse électronique peut être requise avant connexion et envoi du dossier.
- Ajout d'un téléversement photo de profil, d'un aperçu local sans conservation, et d'un éditeur de présentation par sections (titre et texte; jusqu'à 12 sections).
- Ajout du tableau de bord professionnel authentifié `/professionnel/tableau-de-bord`, permettant de modifier la photo, la ville, les catégories/spécialités et les sections de présentation. Toute modification d'un profil déjà vérifié suspend sa publication et ses consultations jusqu'à une nouvelle validation.
- L'annuaire interroge la vue publique `published_professional_profiles`, qui filtre côté base les profils validés; la recherche applique aussi les catégories, la ville et la profession. Chaque résultat mène à une fiche publique avec sa photo signée et ses sections.
- Ajout de fonctions RPC administratives pour lister les profils en attente, consulter la file de justificatifs des avocats et consigner une décision. L'UUID d'un administrateur doit être ajouté par le propriétaire de la base à `public.platform_admins`; aucun écran d'administration n'est encore livré.

### Validation observée

- `npm run build` : réussi (vérification TypeScript et bundle Vite).
- `npm test` : 8 fichiers et 24 tests réussis après ajout des tests du tableau de bord non configuré, du lien de profil par spécialité et des sections publiques.
- `npm run lint` : réussi.
- `npm audit` : 0 vulnérabilité après la mise à jour de Vitest.
- La route locale `/__dev/professionnels/maitre-noupa-rudi` est incluse uniquement en mode développement; aucune fiche ni son portrait ne sont ajoutés au catalogue ou aux assets publics de production.
- La carte de maquette dans l'annuaire est elle aussi chargée uniquement en développement et reste clairement distincte du nombre de profils publiés/vérifiés.
- Le contenu de présentation du brouillon n'est pas un conseil juridique publié ni une description vérifiée de services réellement fournis.
- Smoke test navigateur : accueil chargé; navigation vers `/professionnels`; recherche « Droit du travail » passée dans `q`; message d'annuaire vide visible.
- Vérification navigateur après changements : formulaire d'inscription, entrée photo, éditeur de présentation et lien de tableau de bord visibles; le dashboard explique honnêtement qu'une configuration Supabase est nécessaire pour l'authentification réelle.
- Contrôle mobile navigateur à 390 px : largeur de contenu mesurée à 375 px, sans débordement horizontal.

### Non réalisé / sans migration

- La migration Supabase existe mais n'a pas été appliquée à un projet; aucun projet ni identifiant Supabase n'a été fourni. L'intégration ne peut donc pas être considérée comme déployée ni testée contre un serveur réel.
- La prévisualisation en mode développement reste locale et ne téléverse ni photo ni justificatifs.
- L'écran d'administration des candidatures est à construire; les RPC et policies sont prévues, mais doivent être validées sur un projet jetable avec tests d'accès positifs et négatifs.
- Aucun service de paiement, e-mail/SMS transactionnel supplémentaire, rendez-vous, documents clients ou fonctionnalité IA n'est connecté.
- Aucun déploiement n'a été effectué. Avant production, appliquer la migration, vérifier les politiques de stockage/RLS et les parcours e-mail, effectuer une revue de sécurité et de confidentialité, puis compléter la modération et les écrans d'administration.

## 8. Suite de travail — profil professionnel

### Parcours livré côté code

1. Le professionnel choisit « Créer un compte » ou « J’ai déjà un compte », entre une adresse électronique et un mot de passe, et complète son profil.
2. Il choisit une photo facultative, au format JPG/PNG/WebP et limitée à 5 Mo.
3. Il sélectionne une ou plusieurs catégories; sa présentation contient au moins une section, chacune avec un titre et un texte (limites de taille et de quantité contrôlées côté client et côté base).
4. Un avocat ajoute les informations et cinq pièces justificatives, limitées à 10 Mo chacune; les autres professions n'envoient pas ces pièces.
5. Le stockage et la fonction de soumission associent les éléments au compte authentifié. Une erreur de transmission est affichée et les fichiers temporaires sont supprimés lorsque le nettoyage est autorisé.
6. Le statut initial est « en attente ». Le profil n'apparaît ni dans la vue publique, ni dans les résultats; il n'offre pas de consultations.
7. Après vérification administrative, la recherche publique affiche le profil selon son nom, sa ville, sa profession et ses catégories. La page détail présente la photo et les sections, avec URL signée temporaire pour la photo.
8. Le professionnel connecté modifie les données dans le tableau de bord. Les modifications sont validées par RPC qui vérifie le propriétaire côté serveur.

### Configuration et validation avant utilisation réelle

Suivre les étapes Supabase décrites dans [README.md](../README.md#configurer-supabase-environnement-de-test). Utiliser un projet de test, appliquer la migration et configurer une redirection d'authentification. Test de sécurité à effectuer : un compte ne doit pas pouvoir modifier un autre profil ou lire les pièces privées d'un autre candidat; un non-administrateur ne doit pas pouvoir consulter les files d'examen ou valider un profil.

Le dashboard d'administration n'est pas encore dans l'interface. Les UUID des administrateurs doivent être contrôlés et ajoutés hors du parcours public. Le bucket photo est privé; les profils de la vue publique uniquement reçoivent des URL signées temporaires.
