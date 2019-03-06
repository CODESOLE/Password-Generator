const { app, BrowserWindow } = require('electron');
//var electronVibrancy = require("electron-vibrancy")
let win;
//electronVibrancy.SetVibrancy(true,win.getNativeWindowHandle())
function createMainWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 565,
        maxHeight: 600,
        resizable: true,
        transparent: true,
        frame: false,
        icon: 'build/icon.ico'
    });
    //var nativeHandleBuffer = mainWindow.getNativeWindowHandle();
    //var electronVibrancy = require(path.join(__dirname,'..','..'));

    // Whole window vibrancy with Material 0 and auto resize
    //electronVibrancy.SetVibrancy(createMainWindow, 0);

    setTimeout(() => {
        win.loadURL(`file:///${__dirname}/index.html`);
      }, 1000);

    //win.webContents.openDevTools();

    //win.loadURL(`file:///${__dirname}/index.html`);

    win.on('closed', () => {
        win = null;
    });

}

app.on('ready', createMainWindow);

app.on('window-all-closed', () => {
    app.quit();
});