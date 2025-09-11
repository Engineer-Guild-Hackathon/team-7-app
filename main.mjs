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
  // 【修正箇所】データを安全に保存できるフォルダパスの取得
  const dbPath = path.join(app.getPath('userData'), 'app_usage.db');
  console.log(`データベースの本当の場所: ${dbPath}`);
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

// ===== データ挿入 (デバッグ版) =====
async function logUsage(appName, duration) {
  // 【目印2】この関数が呼び出されたことを表示
  console.log(`[記録試行] アプリ名: ${appName}, 時間: ${duration}秒`);
  if(appName == app.getName()){
    // 【目印3】もし自分自身なら、スキップしたことを表示
    console.log(`[記録スキップ] ${appName}は自分自身のため記録しません。`);
    return;
  }
  const today = new Date().toISOString().slice(0, 10);
  await db.run(
    `INSERT INTO usage_log (app_name, duration, date) VALUES (?, ?, ?)`,
    [appName, duration, today]
  );
  // 【目印4】記録が成功したことを表示
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

// ===== アクティブウィンドウ監視 (デバッグ版) =====
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
        // 【目印1】現在アクティブなアプリ名を表示
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
      // active-winでエラーが起きた場合も表示
      console.error("active-winでエラー:", err);
    }
  }, 5000); // 5秒間隔にしています
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
  await startTracking();
  // ウィンドウは開かない
});