## Technologies

- **Frontend** : Next.js 16, React 19, Tailwind CSS v4
- **Backend** : API Routes Next.js, SQLite (better-sqlite3)
- **Validation** : Zod
- **PDF** : Puppeteer

## Installation

```bash
npm install
```

## Configuration

Créer un fichier `.env` à la racine :

```
STAFF_ACCESS_CODE=votre_code_acces
```

## Lancement

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## Structure

```
src/
├── app/
│   ├── api/          # Endpoints API REST
│   ├── player/       # Formulaire joueur
│   ├── staff/        # Interface staff
│   └── cv-template/  # Template PDF
├── components/       # Composants React
└── lib/
    └── db.ts         # Configuration SQLite
```

## Documentation

- [API.md](API.md) — Documentation des endpoints API
- [DATABASE.md](DATABASE.md) — Schéma de base de données
