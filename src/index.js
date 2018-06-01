import { app, BrowserWindow, ipcMain } from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import { enableLiveReload } from 'electron-compile';
import fs from 'fs';
import { exec } from 'child_process';
import pm2 from 'pm2';
import chokidar from 'chokidar';


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const isDevMode = process.execPath.match(/[\\/]electron/);

if (isDevMode) enableLiveReload({ strategy: 'react-hmr' });

const createWindow = async () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools.
  if (isDevMode) {
    await installExtension(REACT_DEVELOPER_TOOLS);
    mainWindow.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
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

ipcMain.on('initialize', (event, arg) => {
  if (arg === 'start') {
    exec('pm2 resurrect', () => {
      exec('pm2 stop cco upload', () => {
        event.sender.send('initialize', 'started');
      });
    });
  }
});

ipcMain.on('toggle-cco', (event, arg) => {
  if (arg === 'start') {
    pm2.start('cco');
  } else if (arg === 'stop') {
    pm2.stop('cco');
  }
});

ipcMain.on('toggle-upload', (event, arg) => {
  if (arg === 'start') {
    pm2.start('upload');
  } else if (arg === 'stop') {
    pm2.stop('upload');
  }
});

ipcMain.on('copy-cco', (event, arg) => {
  const hotfolderPath = '/Volumes/G33STORE/_callas_server/BNS_STAGING/input';
  arg.forEach((file) => {
    fs.copyFile(file.path, `${hotfolderPath}/${file.name}`, (err) => {
      if (err) console.error(err);
    });
  });
});

const pdfPath = '/Volumes/G33STORE/_callas_server/BNS_STAGING/Success';
const watcher = chokidar.watch(pdfPath, {
  ignored: /(^|[\/\\])\../,
  awaitWriteFinish: true,
  persistent: true,
});

watcher
  .on('add', (path) => {
    const filename = path.split('/').pop();
    const jobNumber = filename.substring(0, 8);

    mainWindow.webContents.send('pdf-ready', jobNumber);
  })
  .on('unlink', (path) => {
    const filename = path.split('/').pop();
    const jobNumber = filename.substring(0, 8);

    mainWindow.webContents.send('pdf-removed', jobNumber);
  });
