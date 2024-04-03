const { app, BrowserWindow, ipcMain } = require("electron/main");
const path = require("node:path");
let win, gameWin;

function createWindow() {
  win = new BrowserWindow({
    width: 600,
    height: 150,
    resizable: false,
    darkTheme: true,
    autoHideMenuBar: true,
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("./src/index.html");
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

ipcMain.on("info:game", (e, game) => {
  gameWin = new BrowserWindow({
    width: 500,
    // parent: win,
    height: 500,
    alwaysOnTop: true,
    autoHideMenuBar: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  gameWin.loadFile(`./src/Games/${game}/index.html`);
  gameWin.on("close", () => {
    gameWin = null;
  });
});


app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
