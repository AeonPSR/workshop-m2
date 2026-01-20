import Database from 'better-sqlite3';
import path from 'path';

// Chemin vers votre fichier de base de données
const dbPath = path.join(process.cwd(), 'database.db');

// Initialisation de la base de données
const db = new Database(dbPath);

// Création des tables manuellement au démarrage si elles n'existent pas
db.exec(`
  CREATE TABLE IF NOT EXISTS Badge (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    initials TEXT,
    image TEXT
  );
`);


db.exec(`
  CREATE TABLE IF NOT EXISTS logo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    initials TEXT,
    image TEXT
  );
`);

export default db;