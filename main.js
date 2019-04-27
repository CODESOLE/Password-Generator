/*jshint esversion: 6 */
const electron = require('electron');
const { app, BrowserWindow } = require('electron');
var electronVibrancy = require("electron-vibrancy");
let win;

function createMainWindow() {

    win = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 565,
        minHeight: 600,
        maxHeight: 600,
        resizable: true,
        transparent: true,
        frame: false,
        icon: 'build/icon.ico'
    });

        electronVibrancy.SetVibrancy(win, 5);

    setTimeout(() => {
        win.loadURL(`file:///${__dirname}/index.html`);
      }, 100);

    win.webContents.openDevTools();

    //win.loadURL(`file:///${__dirname}/index.html`);

    win.on('closed', () => {
        win = null;
    });

}

app.on('ready', createMainWindow);

electronVibrancy.SetVibrancy(win, 5);

app.on('window-all-closed', () => {
    app.quit();
});