import Database from 'better-sqlite3';
import path from 'path';

// Chemin vers votre fichier de base de données
const dbPath = path.join(process.cwd(), 'database.db');

// Initialisation de la base de données
const db = new Database(dbPath);

// Création des tables manuellement au démarrage si elles n'existent pas

db.exec('PRAGMA foreign_keys = ON;');

db.exec(`
  CREATE TABLE IF NOT EXISTS badge (
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

db.exec(`
  CREATE TABLE IF NOT EXISTS division_logo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    initials TEXT,
    image TEXT
  );
`);




// Nouvelle table PlayerData
db.exec(`
  CREATE TABLE IF NOT EXISTS PlayerData (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lastname TEXT NOT NULL,
    firstname TEXT NOT NULL,
    nationality1 TEXT,
    nationality2 TEXT,
    nationality3 TEXT,
    player_image TEXT,
    date_of_birth DATE,
    preferred_foot TEXT,
    height REAL,
    weight REAL,
    primary_position TEXT,
    secondary_position TEXT,
    vma REAL,
    transfermark_url TEXT,
    qualities TEXT,
    email TEXT,
    phone TEXT,
    email_agent TEXT,
    phone_agent TEXT
  );
`);

// Nouvelle table Resume
db.exec(`
  CREATE TABLE IF NOT EXISTS Resume (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_data_id INTEGER NOT NULL,
    created_at DATE DEFAULT CURRENT_TIMESTAMP,
    updated_at DATE DEFAULT CURRENT_TIMESTAMP,
    is_treated BOOLEAN DEFAULT 0,
    cv_color TEXT, -- enum
    composition_to_display TEXT,
    comments TEXT,
    FOREIGN KEY(player_data_id) REFERENCES PlayerData(id) ON DELETE CASCADE
  );
`);

// Nouvelle table Season
db.exec(`
  CREATE TABLE IF NOT EXISTS Season (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    resume_id INTEGER NOT NULL,
    duration TEXT,
    current_season BOOLEAN DEFAULT 0,
    is_split BOOLEAN DEFAULT 0,
    FOREIGN KEY(resume_id) REFERENCES Resume(id) ON DELETE CASCADE
  );
`);




// Nouvelle table Club_Season
db.exec(`
  CREATE TABLE IF NOT EXISTS Club_Season (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    season_id INTEGER NOT NULL,
    name TEXT,
    division TEXT,
    category TEXT,
    logo_division_id INTEGER,
    logo_club_id INTEGER,
    matchs INTEGER DEFAULT 0,
    goals INTEGER DEFAULT 0,
    assists INTEGER DEFAULT 0,
    average_playing_time INTEGER DEFAULT 0,
    half_number INT,
    badge1_id INTEGER,
    badge2_id INTEGER,
    badge3_id INTEGER,
    FOREIGN KEY(season_id) REFERENCES Season(id) ON DELETE CASCADE,
    FOREIGN KEY(logo_division_id) REFERENCES division_logo(id),
    FOREIGN KEY(logo_club_id) REFERENCES logo(id),
    FOREIGN KEY(badge1_id) REFERENCES badge(id),
    FOREIGN KEY(badge2_id) REFERENCES badge(id),
    FOREIGN KEY(badge3_id) REFERENCES badge(id)
  );`);






  // Table Formations
db.exec(`
  CREATE TABLE IF NOT EXISTS Formations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    resume_id INTEGER NOT NULL,
    duration TEXT,  -- date sous forme de string
    title TEXT,
    details TEXT,
    FOREIGN KEY(resume_id) REFERENCES Resume(id) ON DELETE CASCADE
  );
`);

// Table Essais
db.exec(`
  CREATE TABLE IF NOT EXISTS Essais (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    resume_id INTEGER NOT NULL,
    club TEXT,
    year TEXT,
    FOREIGN KEY(resume_id) REFERENCES Resume(id) ON DELETE CASCADE
  );
`);



export default db;