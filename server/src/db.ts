import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

// store DB in a `data` directory next to `src` (i.e. server/data/data.db)
const dataDir = path.resolve(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
const dbPath = path.join(dataDir, 'data.db');

export type WeightRow = { date: string; weight: number; created_at: string };

let db: Database<sqlite3.Database, sqlite3.Statement> | null = null;

export async function initDB() {
  if (db) return;
  db = await open({ filename: dbPath, driver: sqlite3.Database });
  await db.run(
    `CREATE TABLE IF NOT EXISTS weights (
      date TEXT PRIMARY KEY,
      weight REAL NOT NULL,
      created_at TEXT NOT NULL
    )`
  );
}

export async function getAllWeights(): Promise<WeightRow[]> {
  if (!db) throw new Error('DB not initialized');
  return db.all<WeightRow[]>('SELECT date, weight, created_at FROM weights ORDER BY date ASC');
}

export async function upsertWeight(date: string, weight: number) {
  if (!db) throw new Error('DB not initialized');
  const now = new Date().toISOString();
  // Use UPSERT via ON CONFLICT
  await db.run(
    `INSERT INTO weights(date, weight, created_at) VALUES (?, ?, ?)
     ON CONFLICT(date) DO UPDATE SET weight=excluded.weight, created_at=excluded.created_at`,
    date,
    weight,
    now
  );
}

export default {
  initDB,
  getAllWeights,
  upsertWeight
};
