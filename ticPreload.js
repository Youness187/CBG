const { contextBridge, ipcRenderer } = require("electron/renderer");

contextBridge.exposeInMainWorld("electronAPI", {
    setScore: (score) => ipcRenderer.send("info:score", score),
  });