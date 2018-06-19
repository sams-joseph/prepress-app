import { app, BrowserWindow, ipcMain, dialog, Menu } from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import { enableLiveReload } from 'electron-compile';
import mongoose from 'mongoose';
import Store from 'electron-store';

import { DBUSER, DBPASSWORD } from './config';
import renaming from './main/renaming';
import renameMetro from './main/rename-metro';
import reset from './main/reset';
import { log, search } from './main/log';

const store = new Store();

// require('update-electron-app')();

mongoose.connect(`mongodb://${DBUSER}:${DBPASSWORD}@ds239359.mlab.com:39359/prepress`);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let splash;

const isDevMode = process.execPath.match(/[\\/]electron/);

if (isDevMode) enableLiveReload({ strategy: 'react-hmr' });

const createWindow = async () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    titleBarStyle: 'hidden',
    show: false,
  });

  splash = new BrowserWindow({ width: 600, height: 400, transparent: true, frame: false, alwaysOnTop: true });

  // and load the index.html of the app.
  splash.loadURL(`file://${__dirname}/splash.html`);
  mainWindow.loadURL(`file://${__dirname}/index.html`);


  // Open the DevTools.
  if (isDevMode) {
    await installExtension(REACT_DEVELOPER_TOOLS);
    // mainWindow.webContents.openDevTools();
  }

  // if main window is ready to show, then destroy the splash window and show up the main window
  mainWindow.once('ready-to-show', () => {
    setTimeout(() => {
      splash.destroy();
      mainWindow.show();
    }, 1500);
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  if (!isDevMode) {
    const template = [
      {
        label: 'window',
        submenu: [

        ],
      },
      {
        label: 'File',
        submenu: [
        { role: 'close' },
        { role: 'minimize' },
        { role: 'zoom' },
        { type: 'separator' },
        { role: 'front' },
        { role: 'quit' },
        ],
      },
      {
        label: 'Edit',
        submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'pasteandmatchstyle' },
        { role: 'delete' },
        { role: 'selectall' },
        ],
      },
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

if (!store.has('g33store')) {
  store.set('g33store', '/Volumes/G33STORE/');
}
renaming();
renameMetro();
reset();
log();
search();

ipcMain.on('select-directory', (event, arg) => {
  dialog.showOpenDialog({ properties: ['openDirectory'] }, (directory) => {
    if (typeof directory !== 'undefined') {
      event.sender.send('select-directory', directory);
    }
  });
});

ipcMain.on('save-settings', (event, arg) => {
  store.set('g33store', arg);
  event.sender.send('save-settings', 'saved');
});
