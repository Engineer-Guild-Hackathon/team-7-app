import { app, BrowserWindow, ipcMain } from 'electron';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import activeWin from 'active-win';
import path from 'path';
import { fileURLToPath } from 'url';

// ===== __dirnameの定義 =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);        
let db;
let mainWindow;

// ===== DB初期化 =====
async function initDb() {
  // 【修正箇所】データを安全に保存できるフォルダパスの取得
  const dbPath = path.join(app.getPath('userData'), 'app_usage.db');
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });


  await db.exec(`
    CREATE TABLE IF NOT EXISTS usage_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      app_name TEXT,
      duration INTEGER,
      date TEXT,
      type TEXT DEFAULT 'other'
    )
  `);
}

// ===== データ挿入 =====
async function logUsage(appName, duration) {
  const today = new Date().toISOString().slice(0, 10);
  await db.run(
    `INSERT INTO usage_log (app_name, duration, date) VALUES (?, ?, ?)`,
    [appName, duration, today]
  );
}

// ===== 今日の使用状況をアプリごとに集計 =====
async function getTodayUsage() {
  const today = new Date().toISOString().slice(0, 10);
  return await db.all(`
    SELECT app_name as name, type, SUM(duration) as total_time, MIN(id) as id
    FROM usage_log
    WHERE date = ?
    GROUP BY app_name, type
    ORDER BY total_time DESC
  `, [today]);
}


// ===== カテゴリ更新 =====
async function updateAppCategory(appId, newType) {
  await db.run(`UPDATE usage_log SET type = ? WHERE id = ?`, [newType, appId]);
}


// ===== IPCイベント =====
ipcMain.handle('get-usage', async () => {
  return await getTodayUsage();
});


ipcMain.handle('update-category', async (_, { appId, newType }) => {
  await updateAppCategory(appId, newType);
  return true;
});


// ===== アクティブウィンドウ監視 =====
async function startTracking() {
  let lastApp = null;
  let lastTime = Date.now();

  setInterval(async () => {
    try {
      const win = await activeWin();
      if (win) {
        const appName = win.owner.name;
        const now = Date.now();

        if (lastApp) {
          const durationSec = Math.floor((now - lastTime) / 1000);
          await logUsage(lastApp, durationSec);
        }

        lastApp = appName;
        lastTime = now;
      }
    } catch (err) {
      console.error(err);
    }
  }, 5000);
}

// ===== ウィンドウ生成 =====
async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  await mainWindow.loadURL('http://localhost:3000'); // ← React dev server
}


app.whenReady().then(async () => {
  await initDb();
  await createWindow();
  await startTracking();
}); 