import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "database.db");

const db = new Database(dbPath);

// Enable WAL mode for better performance
db.pragma("journal_mode = WAL");

export default db;
