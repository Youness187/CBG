const { contextBridge, ipcRenderer } = require("electron/renderer");

contextBridge.exposeInMainWorld("electronAPI", {
  setTitle: (title) => ipcRenderer.send("info:game", title),
  close: (callback) => {ipcRenderer.on("close:sub", (_event, value) => callback(value))},
  onUpdateCounter: (callback) =>
    ipcRenderer.on("resive:resend", (_event, value) => callback(value)),
});

