const { contextBridge, ipcRenderer } = require("electron/renderer");

contextBridge.exposeInMainWorld("electronAPI", {
  setTitle: (title) => ipcRenderer.send("info:game", title),
  setScore: (score) => ipcRenderer.send("info:score", score),
});
