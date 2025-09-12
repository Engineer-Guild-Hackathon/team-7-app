import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

let db: Database | null = null;

// データベースへの接続を確立し、シングルトンインスタンスを返す関数
export async function getDb() {
  if (db) {
    return db;
  }

  // Next.jsのプロジェクトルートからの相対パスでDBファイルを指定
  // process.cwd()はプロジェクトのルートディレクトリを指します
  const dbPath = path.join(process.cwd(), 'app_usage.db');
  console.log(`データベースの場所: ${dbPath}`);

  const newDb = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  // テーブルの初期化
  // Electronのmain.mjsで行っていた初期化処理をここに集約
  await newDb.exec(`
    CREATE TABLE IF NOT EXISTS usage_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      app_name TEXT NOT NULL,
      duration INTEGER NOT NULL,
      date TEXT NOT NULL
    )
  `);

  await newDb.exec(`
    CREATE TABLE IF NOT EXISTS app_categories (
      app_name TEXT PRIMARY KEY,
      type TEXT DEFAULT 'other' NOT NULL
    )
  `);

  db = newDb;
  return db;
}
