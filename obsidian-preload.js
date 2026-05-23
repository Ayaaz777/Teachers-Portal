const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("calendarStorageApi", {
  isInitialized: () => ipcRenderer.invoke("planner:is-initialized"),
  read: (key) => ipcRenderer.invoke("planner:read", key),
  write: (key, content) =>
    ipcRenderer.invoke("planner:write", { key, content }),
  markInitialized: (meta) => ipcRenderer.invoke("planner:mark-initialized", meta),
  storageInfo: () => ipcRenderer.invoke("planner:storage-info"),
});

contextBridge.exposeInMainWorld("obsidianWindowApi", {
  close: () => ipcRenderer.invoke("obsidian:close"),
});
