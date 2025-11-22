# Détente Exé – Backend

Backend TypeScript pour l’ERP interne Détente Exé. La stack privilégie **Express** + **Prisma (PostgreSQL)** pour un socle léger et modulaire facile à étendre par domaines.

## Pourquoi Express plutôt que NestJS ?
- Express reste minimal tout en permettant une architecture modulaire par domaine (auth, clients, projets…).
- Moins de magie : idéal pour une équipe intermédiaire qui souhaite comprendre et ajuster rapidement middleware, services et accès DB.
- Facilite l’intégration progressive de nouveaux modules ou de frameworks complémentaires (queue, websocket) sans dépendre du cycle de Nest CLI.

## Architecture
```
backend/
├── src/
│   ├── config/          # Chargement env & constantes
│   ├── core/            # Logger, Prisma client, erreurs
│   ├── middleware/      # Authentification, erreurs
│   ├── modules/         # Domaines (auth, clients, projets, planning…)
│   ├── utils/           # Helpers (hash mots de passe)
│   ├── app.ts           # Création de l’app Express
│   └── main.ts          # Entrée serveur
├── prisma/schema.prisma # Schéma Postgres
├── tests/               # Exemples de tests Jest
├── package.json         # Scripts (dev, build, test, prisma)
└── .env.example         # Variables requises
```

### Modules livrés (squelettes)
- **Auth & Users** : routes `/auth/register`, `/auth/login`, `/auth/refresh`, `/auth/me`; JWT accès + refresh avec table `RefreshToken`; RBAC basique (ADMIN, MANAGER, TECH, SALES).
- **Clients** : CRUD `/clients` avec protection et rôles.
- **Projets/Chantiers** : `/projects` list + filtres, création, détail avec étapes.
- **Planning/Interventions** : `/schedule` list + création.
- **Stock** : `/items` (lecture initiale).
- **SAV** : `/tickets` (création + lecture).

## Pré-requis
- Node.js 20+
- PostgreSQL disponible et accessible via `DATABASE_URL`
- `npm` ou `pnpm` (les scripts listés utilisent npm)

## Configuration
1. Copier le fichier d’exemple :
   ```bash
   cp .env.example .env
   ```
2. Mettre à jour `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`.

## Installation & lancement
```bash
cd backend
npm install
npm run prisma:generate
npm run dev
```
Le serveur démarre sur `http://localhost:4000` (modifiable via `PORT`).

### Build & production
```bash
npm run build
npm start
```

## Migrations Prisma
```bash
npm run prisma:migrate -- --name init
```
Ce script crée les tables (users, clients, projects, tasks, events, items, tickets, refresh_tokens).

## Tests
```bash
npm test
```
Les tests Jest fournis utilisent des mocks Prisma pour illustrer la structure de tests unitaires sans DB.

## Ajouter un nouveau module (ex. facturation, documents)
1. Créer un dossier dans `src/modules/<module>` avec `*.service.ts` (logique), `*.routes.ts` (routes Express) et éventuellement des sous-dossiers `dto/`, `repository/`.
2. Déclarer les modèles Prisma dans `prisma/schema.prisma`, lancer `npm run prisma:generate` puis `npm run prisma:migrate`.
3. Monter le routeur dans `src/app.ts` (`app.use('/billing', billingRouter);`).
4. Ajouter les autorisations nécessaires via `authenticate`/`authorizeRoles`.
5. Créer des tests dédiés dans `tests/` en mockant `prisma` ou en utilisant une base de test.

Cette séparation service/route facilite l’évolution vers des modules plus riches (PDF, devis, facturation, webhooks) tout en gardant une lisibilité claire.
