// preload.js - 料理の受け渡し口の役割

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // UI側からメインプロセスのgetTodaySummary関数を呼び出せるようにする
  getTodaySummary: () => ipcRenderer.invoke('get-today-summary'),

  // UI側からカテゴリ更新を依頼できるようにする
  updateCategory: (appId, newType) => ipcRenderer.invoke('update-category', { appId, newType }),

  // メインプロセスからの 'update' メッセージを受け取れるようにする
  onUpdate: (callback) => ipcRenderer.on('update', (event, ...args) => callback(...args))
});
