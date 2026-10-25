# CAHIER DES CHARGES FONCTIONNEL ET TECHNIQUE
## Projet : LA MAISON DU DROIT

**Version :** 1.0  
**Nature du projet :** SaaS juridique et marketplace de services juridiques  
**Marché cible :** Cameroun  
**Langue principale :** Français  
**Application :** Web responsive  
**Technologie frontend :** React  
**Public cible :** Particuliers, entreprises, avocats, notaires, juristes et cabinets juridiques.

---

# 1. PRÉSENTATION DU PROJET

## 1.1. Vision

La Maison du Droit est une plateforme numérique destinée à faciliter l'accès aux professionnels du droit au Cameroun.

Elle doit permettre aux particuliers et aux entreprises de trouver un professionnel compétent, de consulter son profil, de lire ses publications, de prendre rendez-vous et de payer une consultation en ligne.

La plateforme doit également fournir aux professionnels un environnement de travail leur permettant de gérer leurs rendez-vous, leurs clients, leurs dossiers, leurs publications et leurs ressources juridiques.

À terme, elle intégrera une bibliothèque juridique spécialisée dans le droit applicable au Cameroun et un assistant fondé sur l'intelligence artificielle pour faciliter la recherche documentaire et la préparation des consultations.

Le produit doit être conçu comme un véritable SaaS évolutif, et non comme un simple site vitrine.

## 1.2. Proposition de valeur

La plateforme repose sur quatre piliers :

1. **Trouver :** découvrir des professionnels du droit par spécialité, ville et type de service.
2. **Consulter :** réserver et payer des consultations en ligne.
3. **Gérer :** permettre aux professionnels d'organiser leurs rendez-vous, leurs clients et leurs dossiers.
4. **S'informer :** consulter des articles, des guides, des modèles et des ressources juridiques.

## 1.3. Objectifs commerciaux

La plateforme doit permettre de :

- Faciliter la recherche de professionnels du droit.
- Simplifier la prise de rendez-vous.
- Permettre aux professionnels de développer leur visibilité.
- Automatiser la gestion des réservations.
- Proposer des abonnements professionnels.
- Générer des revenus sur les services numériques et, si les règles applicables le permettent, sur les consultations réservées via la plateforme.
- Construire progressivement une bibliothèque juridique fiable.
- Intégrer ultérieurement une assistance juridique par IA.

## 1.4. Principes fondamentaux

L'application doit être :

- Professionnelle et élégante.
- Facile à utiliser sur mobile.
- Rapide et accessible avec une connexion Internet limitée.
- Sécurisée.
- Adaptée aux usages du marché camerounais.
- Évolutive.
- Facile à maintenir.
- Multirôle : client, professionnel et administrateur.

Les fonctionnalités doivent être réellement opérationnelles. Les boutons décoratifs, les données fictives présentées comme réelles et les interactions simulées ne sont pas acceptables dans les fonctionnalités déclarées terminées.

---

# 2. IDENTITÉ VISUELLE ET EXPÉRIENCE UTILISATEUR

## 2.1. Identité de marque

Nom : **LA MAISON DU DROIT**

Signature : **Vos droits, notre engagement.**

Positionnement : une plateforme juridique professionnelle, rassurante, moderne et accessible.

## 2.2. Direction artistique

Adopter une identité visuelle premium, inspirée des cabinets juridiques modernes.

Palette recommandée :

- Bleu marine profond : `#071A2B`
- Or : `#C9A04A`
- Blanc cassé : `#F8F6F0`
- Gris clair : `#E8EBEF`
- Gris foncé : `#343A40`

Utiliser le bleu marine pour les éléments institutionnels, l'or pour les accents visuels et le blanc cassé pour améliorer la lisibilité.

La typographie doit être élégante, lisible et cohérente.

L'interface doit inspirer la confiance sans paraître ancienne ou excessivement formelle.

## 2.3. Bannière principale

La page d'accueil doit comporter une bannière visuelle mettant en scène trois professionnels noirs africains dans un cabinet juridique haut de gamme :

- Un homme en costume représentant le leadership et la confiance.
- Une femme avocate portant une tenue professionnelle adaptée à sa profession.
- Un homme avocat portant également sa tenue professionnelle.

L'environnement doit évoquer un cabinet juridique prestigieux : bibliothèque, ouvrages juridiques, mobilier élégant et éclairage chaleureux.

Le visuel doit être adapté au marché camerounais.

Texte principal :

« LA MAISON DU DROIT »

« Vos droits, notre engagement. »

« Trouvez le bon professionnel. Comprenez vos droits. Préparez vos démarches. »

Boutons :

- Trouver un professionnel.
- Découvrir la plateforme.

Le visuel doit être optimisé pour les ordinateurs et les téléphones.

Ne pas intégrer les textes importants directement dans l'image si cela empêche leur adaptation aux différentes tailles d'écran. Prévoir un visuel et du texte HTML distincts.

## 2.4. Responsive design

L'application doit fonctionner sur :

- Ordinateurs de bureau.
- Ordinateurs portables.
- Tablettes.
- Smartphones Android.
- Smartphones iOS.

La conception mobile est prioritaire pour la recherche de professionnels, la réservation et la consultation des articles.

---

# 3. ARCHITECTURE GÉNÉRALE DE L'APPLICATION

L'application doit comporter quatre espaces principaux.

### Espace 1 : public

Accessible sans connexion.

Il comprend :
- La page d'accueil.
- Le moteur de recherche.
- L'annuaire des professionnels.
- Les profils publics.
- Les catégories juridiques.
- Les articles.
- Les guides publics.
- Les pages institutionnelles.

### Espace 2 : client

Accessible après inscription et connexion.

Il comprend :
- Le tableau de bord.
- Les réservations.
- Les paiements.
- Les factures ou reçus.
- Les informations du compte.
- Les documents partagés par les professionnels.
- Les notifications.

### Espace 3 : professionnel

Accessible après inscription et validation du profil.

Il comprend :
- Le tableau de bord professionnel.
- Le calendrier.
- Les réservations.
- Les clients.
- Les dossiers.
- Les documents.
- La bibliothèque juridique.
- Les articles.
- Les paiements et statistiques.
- Les paramètres du compte.

Les fonctionnalités accessibles doivent dépendre du rôle et des droits du professionnel.

### Espace 4 : administrateur

Accessible uniquement aux utilisateurs disposant de permissions administratives.

Il comprend :
- La gestion des comptes.
- La vérification des professionnels.
- La gestion des spécialités.
- La gestion des articles.
- La gestion des ressources juridiques.
- Le suivi des réservations.
- Le suivi des paiements.
- La gestion des abonnements.
- Les signalements.
- Les paramètres généraux.
- Les journaux d'audit.

---

# 4. FONCTIONNALITÉS PUBLIQUES

## 4.1. Page d'accueil

Créer une page d'accueil comprenant les sections suivantes :

1. Barre de navigation.
2. Bannière principale.
3. Barre de recherche juridique.
4. Catégories de problèmes juridiques.
5. Professionnels mis en avant, si leur mise en avant est autorisée.
6. Fonctionnement de la plateforme.
7. Articles récents.
8. Présentation des avantages.
9. Appel à l'inscription des professionnels.
10. Pied de page.

La barre de recherche doit permettre de rechercher un professionnel par nom, spécialité ou ville.

Prévoir un accès visible aux fonctions suivantes :

- Trouver un avocat.
- Trouver un notaire.
- Trouver un juriste.
- Lire les conseils juridiques.
- Prendre rendez-vous.
- Créer un compte professionnel.

Ne pas afficher de professionnels fictifs sur le site en production.

## 4.2. Catégories juridiques

Prévoir initialement les catégories suivantes :

- Droit de la famille.
- Divorce et séparation.
- Successions et héritage.
- Droit foncier.
- Droit immobilier.
- Droit des locataires.
- Droit des propriétaires.
- Droit du travail.
- Droit des affaires.
- Création d'entreprise.
- Droit pénal.
- Convocations et procédures judiciaires.
- Droits des femmes.
- Droit des enfants.
- Violences conjugales.
- Abus de pouvoir et d'autorité.
- Fraudes et escroqueries.
- Litiges avec les administrations.

Les catégories doivent être gérées depuis l'administration, sans nécessiter de modification du code pour ajouter ou retirer une catégorie.

Les catégories constituent des points d'entrée vers les professionnels et les contenus pertinents. Elles ne doivent pas être interprétées comme une garantie de compétence juridique.

## 4.3. Annuaire des professionnels

Créer une page d'annuaire comprenant :

- Une liste de professionnels.
- Une recherche textuelle.
- Un filtre par profession.
- Un filtre par spécialité.
- Un filtre par ville.
- Un filtre par modalité de consultation.
- Un filtre par tarif, si les tarifs sont renseignés.
- Un tri pertinent.
- Une pagination.

Prévoir notamment les villes de Douala, Yaoundé, Bafoussam et Garoua, ainsi que la possibilité d'ajouter d'autres villes.

Les données doivent provenir de la base de données.

## 4.4. Profil public d'un professionnel

Chaque professionnel doit disposer d'une URL publique.

Le profil doit afficher, selon les informations validées :

- Nom et prénom.
- Photo.
- Profession.
- Présentation.
- Qualifications.
- Numéro ou référence professionnelle lorsque cela est approprié et publiable.
- Statut de vérification.
- Domaines d'activité.
- Ville.
- Langues parlées.
- Tarifs.
- Types de consultations.
- Disponibilités.
- Articles publiés.
- Bouton de réservation.

Ne jamais attribuer automatiquement le statut « vérifié » à un professionnel qui n'a pas été contrôlé.

La plateforme doit distinguer les informations déclarées par le professionnel de celles effectivement vérifiées.

---

# 5. INSCRIPTION ET AUTHENTIFICATION

## 5.1. Inscription des clients

Le client doit pouvoir créer un compte avec :

- Nom.
- Prénom.
- Adresse électronique ou numéro de téléphone.
- Mot de passe, si une authentification par mot de passe est retenue.
- Acceptation des conditions applicables.

L'application doit prévoir la vérification de l'adresse électronique ou du numéro de téléphone selon le mécanisme retenu.

Ne pas imposer des informations qui ne sont pas nécessaires à la création du compte.

## 5.2. Inscription des professionnels

Le formulaire professionnel doit recueillir :

- Identité.
- Coordonnées.
- Profession.
- Ville d'exercice.
- Spécialités.
- Présentation professionnelle.
- Qualifications.
- Informations nécessaires à la vérification.
- Tarifs et modalités de consultation.
- Documents justificatifs requis.

Le professionnel ne doit pas être automatiquement publié dès son inscription.

Prévoir les statuts suivants :

- Brouillon.
- En attente de vérification.
- Vérification complémentaire nécessaire.
- Approuvé.
- Refusé.
- Suspendu.

Les règles de validation devront être configurables selon la profession et les exigences applicables au Cameroun.

## 5.3. Gestion des sessions

Prévoir :

- Connexion.
- Déconnexion.
- Réinitialisation du mot de passe.
- Expiration sécurisée des sessions.
- Protection contre les tentatives répétées de connexion.
- Contrôle des accès selon les rôles.

Un utilisateur ne doit pas pouvoir devenir administrateur en modifiant une valeur dans son navigateur ou en envoyant une requête manuelle.

---

# 6. SYSTÈME DE RÉSERVATION

Cette fonctionnalité constitue l'une des priorités du MVP.

## 6.1. Configuration des services

Chaque professionnel peut définir plusieurs services.

Exemples :

- Consultation initiale de 30 minutes.
- Consultation approfondie de 60 minutes.
- Consultation à distance.
- Consultation en cabinet.

Chaque service comporte :

- Un nom.
- Une description.
- Une durée.
- Un prix.
- Une modalité.
- Un délai minimal de réservation.
- Des règles d'annulation.
- Un statut actif ou inactif.

Les services doivent pouvoir être modifiés sans intervention technique.

## 6.2. Gestion des disponibilités

Le professionnel peut définir :

- Ses jours de travail.
- Ses horaires.
- Ses pauses.
- Ses jours d'indisponibilité.
- Ses congés.
- Ses créneaux exceptionnels.
- La durée entre deux consultations, si nécessaire.

Le système génère automatiquement les créneaux disponibles à partir de ces paramètres et des rendez-vous existants.

Le fuseau horaire doit être géré explicitement. Prévoir une configuration cohérente pour le Cameroun et stocker les dates de manière à éviter les erreurs de conversion.

## 6.3. Parcours de réservation

Le parcours doit suivre ces étapes :

1. Le client sélectionne un professionnel.
2. Il choisit un service.
3. Il sélectionne une date.
4. Il choisit un créneau disponible.
5. Il renseigne les informations nécessaires.
6. Il vérifie le récapitulatif.
7. Il accepte les conditions applicables.
8. Il effectue le paiement si le service est payant.
9. Le système confirme la réservation.
10. Le client et le professionnel reçoivent une notification.

Prévoir un récapitulatif clair du prix, de la durée, de la date et des modalités de consultation.

## 6.4. Prévention des doubles réservations

Le système doit empêcher deux clients de réserver simultanément le même créneau.

Cette règle doit être garantie par le backend et la base de données, pas uniquement par l'interface React.

Prévoir une transaction sécurisée, une contrainte d'unicité adaptée ou un mécanisme équivalent.

Les créneaux temporairement sélectionnés peuvent être réservés pendant une durée limitée lors du paiement.

Si le paiement échoue ou expire, le créneau doit être libéré selon les règles définies.

## 6.5. Gestion des rendez-vous

Le client doit pouvoir consulter ses réservations.

Le professionnel doit pouvoir consulter :

- Les rendez-vous du jour.
- Les rendez-vous à venir.
- Les rendez-vous passés.
- Les rendez-vous annulés.
- Les informations préalables communiquées par le client.

Prévoir les statuts suivants :

- En attente de paiement.
- En attente de confirmation, si le service le nécessite.
- Confirmé.
- Terminé.
- Annulé.
- Remboursé.
- Absence constatée, si cette fonctionnalité est retenue.

Toute modification de statut doit être autorisée et tracée.

Les règles de remboursement doivent être configurées et communiquées clairement aux utilisateurs.

---

# 7. PAIEMENTS

La plateforme doit prévoir une couche de paiement indépendante du reste de l'application.

Le choix définitif du prestataire devra être effectué après vérification de sa disponibilité au Cameroun, de ses conditions contractuelles et de ses capacités de reversement.

Les moyens de paiement à étudier en priorité comprennent :

- MTN Mobile Money.
- Orange Money.
- Les autres moyens compatibles avec le prestataire retenu.

Ne pas considérer qu'un moyen de paiement est intégré tant que les transactions réelles n'ont pas été testées.

## 7.1. Exigences

Le système doit permettre :

- L'initialisation d'un paiement.
- La vérification de son statut.
- La confirmation d'un paiement réussi.
- La gestion des échecs.
- La gestion des remboursements lorsque le prestataire le permet.
- Le suivi des transactions.
- La génération d'un reçu.
- La prévention des doubles traitements d'une même transaction.

La confirmation d'un paiement doit reposer sur une notification serveur fiable ou une vérification auprès du prestataire.

Ne jamais considérer le simple retour du navigateur comme une preuve suffisante de paiement.

Les clés secrètes doivent être stockées côté serveur dans des variables d'environnement sécurisées.

Les paiements, commissions et reversements doivent respecter les règles applicables aux honoraires des professionnels du droit.

Si aucun prestataire ne peut être activé pendant le développement, créer une interface de paiement simulée uniquement pour les tests et l'identifier clairement comme telle.

---

# 8. TABLEAU DE BORD PROFESSIONNEL

## 8.1. Accueil

Afficher :

- Nombre de rendez-vous à venir.
- Prochain rendez-vous.
- Nombre de clients.
- Réservations récentes.
- Revenus issus des réservations, lorsque les données sont disponibles.
- Notifications.
- Raccourcis vers les principales fonctionnalités.

Les statistiques doivent être calculées à partir des données réelles.

## 8.2. Calendrier

Prévoir :

- Une vue journalière.
- Une vue hebdomadaire.
- Une vue mensuelle.
- La modification des disponibilités.
- Le blocage de créneaux.
- La consultation des réservations.
- La navigation entre les dates.

Une synchronisation avec des calendriers externes pourra être ajoutée dans une phase ultérieure.

## 8.3. Gestion des clients

Le professionnel doit pouvoir consulter les clients avec lesquels il entretient une relation autorisée.

Les informations accessibles comprennent uniquement les données nécessaires au suivi de la relation professionnelle.

Prévoir :

- Recherche de clients.
- Fiche client.
- Historique des consultations.
- Dossiers associés.
- Documents autorisés.
- Notes privées du professionnel.

Les notes privées ne doivent jamais être visibles par les autres clients ni par d'autres professionnels non autorisés.

## 8.4. Gestion des dossiers

Chaque dossier doit comporter :

- Un identifiant.
- Un titre.
- Une catégorie.
- Un client associé.
- Une description.
- Un statut.
- Une date de création.
- Des dates importantes.
- Des documents.
- Des notes privées.
- Un historique des modifications.

Prévoir des statuts configurables, tels que :

- Nouveau.
- En cours.
- En attente de documents.
- En attente d'une démarche.
- Clôturé.

La gestion des dossiers doit respecter les règles de confidentialité et les obligations professionnelles applicables.

## 8.5. Documents

Permettre le téléversement et la consultation de documents autorisés.

Exigences :

- Stockage privé.
- Vérification des permissions côté serveur.
- Contrôle des types de fichiers.
- Limitation de taille.
- Liens de téléchargement temporaires lorsque cela est approprié.
- Journalisation des accès importants.
- Protection contre les fichiers malveillants.
- Possibilité de supprimer ou d'archiver les documents selon les règles applicables.

Ne jamais exposer publiquement les fichiers confidentiels ni leurs chemins de stockage.

---

# 9. ARTICLES ET CONSEILS JURIDIQUES

La plateforme doit inclure un système de publication.

## 9.1. Fonctions

Les professionnels autorisés peuvent :

- Créer un article.
- Enregistrer un brouillon.
- Modifier un article.
- Ajouter une image.
- Choisir une catégorie.
- Ajouter des références.
- Prévisualiser le contenu.
- Soumettre l'article à validation.
- Publier l'article après autorisation.
- Modifier ou dépublier un article selon leurs droits.

## 9.2. Contenu d'un article

Prévoir :

- Titre.
- Résumé.
- Contenu.
- Auteur.
- Catégorie.
- Image de couverture.
- Date de publication.
- Date de mise à jour.
- Références juridiques.
- Statut de validation.

## 9.3. Pages publiques

Créer :

- Une page listant les articles.
- Une page par catégorie.
- Une page de lecture.
- Une page présentant l'auteur.
- Des liens vers les professionnels pertinents, lorsque cela est approprié.

Prévoir les bases du référencement naturel : titres, descriptions, URLs lisibles et métadonnées.

Les articles juridiques doivent pouvoir être signalés et dépubliés en cas de contenu trompeur ou obsolète.

---

# 10. BIBLIOTHÈQUE JURIDIQUE

La bibliothèque juridique constitue une fonctionnalité centrale de la vision à long terme.

Elle doit être développée après stabilisation des fonctionnalités principales de réservation et de gestion des comptes.

## 10.1. Catégories documentaires

Prévoir les types de ressources suivants :

- Fiches pratiques.
- Modèles de documents.
- Checklists.
- Guides de procédure.
- Références légales.
- Décisions de justice accessibles et autorisées.
- Guides destinés aux clients.

## 10.2. Métadonnées

Chaque ressource doit comporter :

- Un titre.
- Une description.
- Une catégorie.
- Une juridiction.
- Une date de création.
- Une date de vérification.
- Une date de révision éventuelle.
- Des références.
- Un auteur ou un responsable éditorial.
- Un statut de validation.
- Des règles d'accès.

Prévoir les statuts :

- Brouillon.
- En cours de vérification.
- Validé.
- Publié.
- À réviser.
- Archivé.

## 10.3. Recherche

La recherche doit pouvoir porter sur :

- Le titre.
- Le contenu.
- La catégorie.
- Le type de document.
- La juridiction.
- Les mots-clés.

Prévoir une architecture permettant ultérieurement une recherche sémantique assistée par IA.

## 10.4. Gestion des accès

Distinguer :

- Les ressources publiques.
- Les ressources réservées aux professionnels.
- Les ressources accessibles selon l'abonnement.
- Les documents privés appartenant à un dossier.

Ne jamais confondre une ressource juridique publique avec un document confidentiel de client.

La plateforme ne doit pas publier automatiquement des ressources juridiques générées par IA sans contrôle approprié.

---

# 11. ASSISTANT JURIDIQUE PAR IA — PHASE ULTÉRIEURE

Ne pas implémenter un assistant juridique autonome dans la première version du produit.

Préparer toutefois une architecture permettant son ajout sans refonte majeure.

## 11.1. Fonctionnalités futures

L'assistant pourra :

- Rechercher dans la bibliothèque.
- Résumer des ressources.
- Préparer un résumé des informations fournies par un client.
- Identifier les informations manquantes.
- Proposer une checklist.
- Retrouver les modèles pertinents.
- Générer un premier brouillon à partir d'un modèle validé.
- Présenter les références documentaires utilisées.

## 11.2. Règles impératives

L'assistant doit :

- Privilégier les sources juridiques vérifiées.
- Citer les références utilisées.
- Indiquer les incertitudes.
- Distinguer les faits fournis par l'utilisateur des déductions.
- Signaler lorsque les informations disponibles sont insuffisantes.
- Ne pas inventer des textes de loi.
- Ne pas mélanger les juridictions.
- Ne pas présenter ses réponses comme une décision juridique définitive.
- Permettre au professionnel de vérifier et de modifier les résultats.

L'IA ne doit jamais envoyer automatiquement un document juridique à une autorité ou à une partie adverse sans une action explicitement autorisée par le professionnel.

## 11.3. Confidentialité

Les données de dossiers ne doivent pas être envoyées à un fournisseur d'IA sans garanties adaptées, autorisation et configuration appropriées.

L'architecture devra permettre de contrôler les données transmises au modèle, de limiter leur exposition et de respecter les obligations applicables.

---

# 12. ABONNEMENTS PROFESSIONNELS

Préparer une architecture permettant de proposer plusieurs offres.

Les tarifs suivants sont indicatifs et doivent rester configurables depuis l'administration.

| Offre | Prix indicatif | Fonctionnalités principales |
|---|---:|---|
| Découverte | Gratuit | Profil public et fonctionnalités limitées |
| Essentiel | 10 000 FCFA/mois | Calendrier, réservations et publications |
| Professionnel | 25 000 FCFA/mois | Gestion des clients, dossiers et ressources |
| Cabinet | 50 000 FCFA/mois | Gestion de plusieurs professionnels et fonctionnalités partagées |

Ne pas coder les tarifs directement dans les composants React.

Prévoir des entités pour :

- Les plans.
- Les abonnements.
- Les périodes de validité.
- Les statuts.
- Les paiements d'abonnement.
- Les fonctionnalités autorisées.
- Les éventuelles périodes d'essai.

Les limitations doivent être contrôlées côté serveur, pas uniquement dans l'interface.

La facturation des abonnements ne doit être activée en production qu'après configuration et validation du prestataire de paiement.

---

# 13. ESPACE ADMINISTRATEUR

Créer un tableau de bord protégé.

## 13.1. Gestion des utilisateurs

L'administrateur autorisé peut :

- Consulter les utilisateurs.
- Rechercher un compte.
- Examiner un profil professionnel.
- Approuver ou refuser une inscription.
- Suspendre un compte.
- Consulter les signalements.
- Consulter les informations de vérification autorisées.

Les actions sensibles doivent être journalisées.

## 13.2. Gestion du contenu

L'administrateur peut gérer :

- Les catégories.
- Les spécialités.
- Les villes.
- Les articles signalés.
- Les ressources juridiques.
- Les pages institutionnelles.
- Les bannières.
- Les contenus mis en avant.

## 13.3. Gestion financière

Prévoir une vue des :

- Transactions.
- Paiements réussis.
- Paiements échoués.
- Remboursements.
- Abonnements.
- Commissions éventuelles.
- Reversements, si le modèle retenu le permet.

Les montants affichés doivent provenir des données financières enregistrées et rapprochées avec les prestataires.

## 13.4. Journal d'audit

Journaliser les opérations sensibles :

- Modification des rôles.
- Validation d'un professionnel.
- Suspension d'un compte.
- Accès administratif aux données confidentielles.
- Modification d'une ressource juridique.
- Opérations financières importantes.

Le journal ne doit pas contenir inutilement le contenu intégral des dossiers clients.

---

# 14. ARCHITECTURE TECHNIQUE

## 14.1. Principe

React constitue la technologie d'interface, mais il ne suffit pas pour créer un SaaS complet.

L'application nécessite également une base de données, une authentification sécurisée, un backend, un stockage documentaire et des intégrations de paiement.

L'agent doit examiner le dépôt existant avant de choisir l'architecture définitive.

Si aucun projet n'existe, l'architecture recommandée est la suivante.

### Frontend

- React.
- TypeScript.
- Next.js, si aucun framework frontend n'est déjà imposé.
- Tailwind CSS pour les styles, si cela correspond au projet.
- Une bibliothèque de composants cohérente.
- Une bibliothèque de formulaires avec validation.
- Une solution de gestion des états adaptée aux besoins réels.

### Backend

Choisir une solution adaptée au projet existant.

Deux options possibles :

**Option A : Next.js et backend intégré.**

Utiliser les routes serveur et les fonctions serveur lorsque cela est adapté, avec une séparation claire entre logique métier et interface.

**Option B : React avec API dédiée.**

Utiliser un backend distinct, par exemple Node.js avec NestJS ou Express.

Ne pas ajouter plusieurs frameworks backend sans justification.

### Base de données

PostgreSQL est recommandé.

Le schéma doit être versionné et les migrations doivent être reproductibles.

### Stockage documentaire

Utiliser un stockage privé compatible avec les besoins de confidentialité.

Les documents privés ne doivent jamais être accessibles par une URL publique permanente.

### Authentification

Utiliser une solution éprouvée et configurer correctement les rôles, les sessions, la récupération de compte et les protections contre les abus.

### Environnements

Prévoir au minimum :

- Développement local.
- Tests.
- Production.

Les secrets et clés d'API doivent être séparés selon l'environnement.

---

# 15. MODÈLE DE DONNÉES INITIAL

Le schéma doit être conçu de façon relationnelle.

Prévoir au minimum les entités suivantes :

- `users`
- `roles`
- `user_roles`
- `professional_profiles`
- `professional_credentials`
- `specialties`
- `professional_specialties`
- `services`
- `availability_rules`
- `availability_exceptions`
- `appointments`
- `appointment_events`
- `payments`
- `refunds`
- `subscriptions`
- `subscription_plans`
- `clients`
- `client_cases`
- `case_documents`
- `case_notes`
- `articles`
- `article_categories`
- `legal_resources`
- `legal_resource_versions`
- `notifications`
- `reviews`, si cette fonctionnalité est autorisée
- `audit_logs`

Adapter le modèle au système d'authentification choisi et éviter les doublons inutiles.

## 15.1. Règles de conception

- Utiliser des identifiants stables.
- Définir les clés étrangères.
- Définir les contraintes d'intégrité.
- Prévoir les index nécessaires.
- Stocker les dates de manière cohérente.
- Gérer les statuts avec des valeurs explicites.
- Prévoir les dates de création et de modification.
- Prévoir les règles de suppression et d'archivage.
- Ne pas conserver indéfiniment les données sans raison.
- Éviter de stocker des données sensibles inutiles.

Les dossiers, les documents et les notes doivent être reliés à des utilisateurs et à des autorisations explicites.

---

# 16. SÉCURITÉ ET CONFIDENTIALITÉ

La sécurité constitue une exigence transversale.

L'application doit prévoir :

- Contrôle des permissions côté serveur.
- Séparation des données entre utilisateurs.
- Protection contre les accès directs non autorisés.
- Validation des données reçues.
- Protection contre les injections.
- Protection contre les requêtes malveillantes.
- Limitation des tentatives de connexion.
- Gestion sécurisée des sessions.
- Protection des fichiers.
- Sauvegardes.
- Journaux d'audit.
- Gestion des erreurs sans fuite d'informations.
- Gestion des secrets hors du code source.
- Politique de conservation et de suppression des données.

Si une solution comme Supabase est utilisée, configurer et tester les politiques de sécurité au niveau des données, notamment les règles d'accès par utilisateur.

Masquer un bouton dans React ne constitue jamais une mesure de sécurité suffisante.

La plateforme doit être conçue en tenant compte du secret professionnel, des obligations propres à chaque profession et du droit camerounais applicable aux données personnelles et aux services numériques.

Avant le lancement, faire vérifier les conditions d'utilisation, les politiques de confidentialité, le modèle de paiement et les obligations professionnelles par des personnes compétentes.

---

# 17. EXIGENCES DE QUALITÉ

## 17.1. Performance

- Éviter les téléchargements inutiles.
- Optimiser les images.
- Utiliser le chargement différé lorsque cela est pertinent.
- Prévoir la pagination des listes volumineuses.
- Éviter les requêtes répétitives inutiles.
- Optimiser les requêtes de base de données.

## 17.2. Accessibilité

- Utiliser des éléments HTML sémantiques.
- Garantir un contraste suffisant.
- Prévoir la navigation au clavier.
- Ajouter des libellés aux champs.
- Afficher clairement les erreurs.
- Ne pas dépendre uniquement de la couleur pour transmettre une information.

## 17.3. Référencement

Les pages publiques doivent prévoir :

- Des URLs lisibles.
- Des titres et descriptions adaptés.
- Des métadonnées.
- Des pages d'articles indexables.
- Des pages professionnelles indexables lorsque cela est approprié.
- Un sitemap.
- Une gestion correcte des pages inexistantes.

Les espaces privés ne doivent pas être indexés par les moteurs de recherche.

## 17.4. Maintenabilité

- Utiliser TypeScript.
- Séparer les composants d'interface, les services métier et l'accès aux données.
- Éviter les composants monolithiques.
- Éviter les valeurs métier dispersées dans le code.
- Centraliser la configuration.
- Documenter les décisions techniques importantes.
- Écrire des tests.
- Maintenir des dépendances cohérentes.

---

# 18. PÉRIMÈTRE DU MVP

L'agent doit construire le projet en plusieurs phases.

Il ne doit pas tenter de développer toutes les fonctionnalités avancées simultanément.

## MVP — Version initiale

La première version doit inclure :

1. Identité visuelle.
2. Page d'accueil.
3. Navigation responsive.
4. Annuaire des professionnels.
5. Recherche et filtres.
6. Profils publics.
7. Inscription et connexion.
8. Inscription professionnelle avec validation administrative.
9. Tableau de bord client.
10. Tableau de bord professionnel.
11. Configuration des services.
12. Gestion des disponibilités.
13. Réservation.
14. Prévention des doubles réservations.
15. Intégration de paiement lorsque le prestataire est configuré.
16. Gestion des rendez-vous.
17. Notifications.
18. Publication d'articles.
19. Administration.
20. Tests automatisés des fonctionnalités essentielles.

La bibliothèque juridique doit être préparée dans l'architecture, mais son moteur avancé et l'assistance IA seront développés dans les phases suivantes.

Le MVP doit être utilisable de bout en bout par un client et un professionnel de test.

## Phase suivante

Ajouter :

- Gestion des clients.
- Gestion des dossiers.
- Gestion des documents.
- Bibliothèque juridique.
- Modèles et checklists.
- Abonnements.
- Statistiques avancées.

## Phase ultérieure

Ajouter :

- Assistant IA.
- Recherche sémantique.
- Préparation intelligente des consultations.
- Génération de brouillons.
- Synchronisation de calendriers externes.
- Fonctionnalités avancées pour les cabinets.

---

# 19. TESTS ET CRITÈRES D'ACCEPTATION

Une fonctionnalité ne doit pas être déclarée terminée simplement parce que son interface s'affiche.

## 19.1. Tests fonctionnels

Vérifier notamment que :

- Un visiteur peut rechercher un professionnel.
- Un visiteur peut consulter un profil public.
- Un client peut créer un compte.
- Un professionnel peut soumettre son inscription.
- Un administrateur peut valider ou refuser un professionnel.
- Un professionnel validé peut configurer ses disponibilités.
- Un client peut sélectionner un créneau disponible.
- Le système refuse une double réservation.
- Un paiement échoué ne confirme pas un rendez-vous payant.
- Un paiement confirmé permet la confirmation de la réservation selon les règles configurées.
- Le professionnel voit ses réservations.
- Le client voit ses rendez-vous.
- Les annulations suivent les règles définies.
- Un article peut être créé, validé et publié.
- Un utilisateur non autorisé ne peut pas consulter un dossier privé.
- Les pages fonctionnent sur mobile.

## 19.2. Tests de sécurité

Tester notamment :

- L'accès direct aux routes protégées.
- L'accès aux données d'un autre utilisateur.
- La modification frauduleuse d'un rôle.
- Les requêtes non autorisées.
- Les fichiers non autorisés.
- Les erreurs d'authentification.
- Les traitements répétés d'une même notification de paiement.

## 19.3. Tests de paiement

En environnement de test, vérifier :

- Paiement réussi.
- Paiement refusé.
- Paiement expiré.
- Notification reçue plusieurs fois.
- Remboursement.
- Réconciliation de l'état de la réservation et de l'état du paiement.

## 19.4. Critère de livraison

Le MVP ne sera considéré comme terminé que lorsque :

- Le projet démarre conformément à la documentation.
- Les migrations de base de données fonctionnent.
- Les principales pages sont accessibles.
- Les parcours de réservation sont opérationnels.
- Les autorisations sont testées.
- Les tests essentiels passent.
- Les erreurs bloquantes sont corrigées.
- Les limitations restantes sont documentées.

---

# 20. LIVRABLES ATTENDUS

L'agent doit fournir :

1. Le code source complet.
2. Une architecture claire.
3. Le schéma de base de données.
4. Les migrations.
5. Un fichier `.env.example` sans secrets.
6. Les instructions d'installation.
7. Les instructions de lancement local.
8. Les instructions de déploiement.
9. Les tests automatisés.
10. La documentation des principales fonctionnalités.
11. Une liste des intégrations réellement opérationnelles.
12. Une liste des intégrations en attente de configuration.
13. Un rapport de tests.
14. Un rapport des risques ou limitations connus.

Le projet doit pouvoir être repris par un autre développeur sans dépendre exclusivement de l'agent IA initial.

---

# 21. INSTRUCTIONS IMPÉRATIVES À L'AGENT IA

Tu es responsable du développement technique du projet La Maison du Droit.

Tu dois travailler comme un ingénieur logiciel senior, avec une approche progressive, sécurisée et orientée produit.

## Avant de modifier le code

1. Inspecte le dépôt existant.
2. Identifie les technologies déjà utilisées.
3. Lis les fichiers de documentation et les instructions du projet.
4. Identifie les fonctionnalités existantes.
5. Identifie les éventuels problèmes de sécurité ou de qualité.
6. Établis un plan de développement.
7. Préserve les fonctionnalités existantes qui fonctionnent.

Ne réinitialise pas une base de données existante et ne supprime pas de données sans autorisation explicite.

Ne remplace pas une architecture fonctionnelle sans justification technique.

## Pendant le développement

- Développe une fonctionnalité à la fois.
- Privilégie un code lisible et maintenable.
- Utilise TypeScript si le projet le permet.
- Évite les dépendances inutiles.
- Crée des composants réutilisables.
- Valide les entrées côté serveur.
- Protège toutes les opérations sensibles.
- Ajoute des tests aux fonctionnalités critiques.
- Ne simule pas une intégration de production en la présentant comme réelle.
- Ne publie pas de clés secrètes.
- Ne crée pas de faux professionnels présentés comme authentiques.
- Ne génère pas de ressources juridiques non vérifiées présentées comme officielles.

## En cas d'information manquante

Prends une décision technique raisonnable lorsqu'elle ne compromet ni la sécurité ni le périmètre fonctionnel.

Documente les hypothèses.

Si une décision bloque réellement le développement, présente les options et demande une clarification.

Ne prétends pas qu'une intégration de paiement, une synchronisation ou une fonctionnalité IA est opérationnelle sans l'avoir testée.

## Gestion des modifications

- Préserve les données existantes.
- Utilise des migrations versionnées.
- Évite les suppressions destructives.
- Signale les modifications incompatibles.
- Ne désactive pas des contrôles de sécurité pour faire passer un test.
- Vérifie les conséquences des modifications sur les fonctionnalités existantes.

## À la fin de chaque phase

Fournis un rapport comprenant :

1. Les fonctionnalités terminées.
2. Les fichiers créés ou modifiés.
3. Les décisions d'architecture.
4. Les migrations effectuées.
5. Les tests exécutés.
6. Les résultats obtenus.
7. Les problèmes restants.
8. Les intégrations qui nécessitent des identifiants ou des comptes externes.
9. Les prochaines étapes.

Ne passe à une nouvelle phase qu'après avoir vérifié la stabilité des fonctionnalités précédentes.

---

# 22. PREMIÈRE MISSION À EXÉCUTER

Ne commence pas par développer l'intégralité du SaaS.

Commence par réaliser un audit du dépôt existant et préparer le plan d'exécution du MVP.

Ton premier rapport doit présenter :

- L'architecture actuelle.
- Les technologies détectées.
- Les fonctionnalités déjà présentes.
- Les lacunes identifiées.
- Le schéma de données proposé.
- Les risques techniques.
- Les dépendances externes nécessaires.
- Le plan de développement, étape par étape.
- Les critères de validation de chaque étape.

Après validation du plan, commence par les fondations du projet et la première fonctionnalité, sans détruire les éléments existants.

**Objectif final : construire une plateforme juridique fiable, sécurisée, évolutive et réellement utilisable au Cameroun, avec une architecture permettant d'ajouter progressivement la gestion des dossiers, la bibliothèque juridique et l'assistance par intelligence artificielle.**