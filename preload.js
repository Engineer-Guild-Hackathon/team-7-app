const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getUsage: () => ipcRenderer.invoke('get-usage'),
  updateCategory: (appId, newType) => ipcRenderer.invoke('update-category', { appId, newType }),
});
