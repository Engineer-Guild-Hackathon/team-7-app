import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const { app, BrowserWindow, ipcMain } = require('electron');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const activeWin = require('active-win');
const path = require('path');
const { fileURLToPath } = require('url');

// ===== __dirnameの定義 =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let db;
let mainWindow;
// ===== DB初期化 =====
async function initDb() {
  // データを安全に保存できるフォルダパスの取得
  const dbPath = path.join(__dirname, 'frontend', 'app_usage.db');
  console.log(`[デバッグ] Electronが認識している__dirname: ${__dirname}`);
  console.log(`[デバッグ] 最終的に開こうとしているDBパス: ${dbPath}`);  

  console.log(`データベースの本当の場所: ${dbPath}`);
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });
  await db.exec(`
    CREATE TABLE IF NOT EXISTS usage_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      app_name TEXT NOT NULL,
      duration INTEGER NOT NULL,
      date TEXT NOT NULL
    )
  `);

  // 2. カテゴリ管理テーブル
  await db.exec(`
    CREATE TABLE IF NOT EXISTS app_categories (
      app_name TEXT PRIMARY KEY,
      type TEXT NOT NULL DEFAULT 'other'
    )
  `);
}


// ===== データ挿入  =====
async function logUsage(appName, duration) {
  console.log(`[記録試行] アプリ名: ${appName}, 時間: ${duration}秒`);
  if(appName == app.getName()){
    console.log(`[記録スキップ] ${appName}は自分自身のため記録しません。`);
    return;
  }
  const today = new Date().toISOString().slice(0, 10);
    await db.run(
      'INSERT OR IGNORE INTO app_categories (app_name) VALUES (?)',
      [appName]
    );
    
    // 使用時間ログを記録
    await db.run(
      `INSERT INTO usage_log (app_name, duration, date) VALUES (?, ?, ?)`,
      [appName, duration, today]
    );
  console.log(`[記録成功] ${appName}をデータベースに記録しました。`);
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

// ===== アクティブウィンドウ監視  =====
async function startTracking() {
  const activeWin = require('active-win');
  let lastApp = null;
  let lastTime = Date.now();
  setInterval(async () => {
    try {
      const win = await activeWin.activeWindow();
      if (win) {
        const appName = win.owner.name;
        const now = Date.now();
        console.log(`[監視中] 現在のアプリ: ${appName}`);
        if (lastApp) {
          const durationSec = Math.floor((now - lastTime) / 1000);
          if (durationSec > 0) {
            // logUsage関数を呼び出す
            await logUsage(lastApp, durationSec);
          }
        }
        lastApp = appName;
        lastTime = now;
      }
    } catch (err) {
      console.error("active-winでエラー:", err);
    }
  }, 5000); // 5秒間隔
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
  await mainWindow.loadURL('http://localhost:3000');
}
app.whenReady().then(async () => {
  await initDb();
  await startTracking();
  await createWindow();
});