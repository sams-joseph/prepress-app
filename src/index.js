import { app, BrowserWindow, ipcMain } from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import { enableLiveReload } from 'electron-compile';
import fs from 'fs';
import mongoose from 'mongoose';
import moment from 'moment';

import { DBUSER, DBPASSWORD } from './config';

require('update-electron-app')();

mongoose.connect(`mongodb://${DBUSER}:${DBPASSWORD}@ds239359.mlab.com:39359/prepress`);

const Rename = mongoose.model('Rename', {
  original: String,
  new: String,
  parts: Array,
  created: { type: Date, default: Date.now },
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const isDevMode = process.execPath.match(/[\\/]electron/);

if (isDevMode) enableLiveReload({ strategy: 'react-hmr' });

const createWindow = async () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
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
function pad(num) {
  let s = String(num);
  while (s.length < 2) { s = `0${s}`; }
  return s;
}

function makeJobFolder(order, part) {
  try {
    fs.mkdirSync(`${order}P${part}`);
    fs.mkdirSync(`${order}P${part}/mmt_hires`);
    fs.mkdirSync(`${order}P${part}/original_client_creative`);
    fs.mkdirSync(`${order}P${part}/paint_files`);
    fs.mkdirSync(`${order}P${part}/prep_art`);
    fs.mkdirSync(`${order}P${part}/prep_art/LOW`);
  } catch (err) {

  }
}

function renameProd(directory, selectedParts, original, newFile, extension, file) {
  const wip = '/Volumes/G33STORE/WIP/';
  const base = '/Volumes/G33STORE/';
  selectedParts.forEach((part) => {
    fs.copyFile(`${base}${directory}/${original}/paint_files/${file}`, `${wip}${newFile}P${pad(part)}/paint_files/${newFile}P${pad(part)}${extension}`, (err) => {
      if (err) {
        if (err.code === 'ENOENT') {
          makeJobFolder(`${wip}${newFile}`, pad(part));
          fs.copyFile(`${base}${directory}/${original}/paint_files/${file}`, `${wip}${newFile}P${pad(part)}/paint_files/${newFile}P${pad(part)}${extension}`, (err) => {
            if (err) throw err;
          });
        } else {
          throw err;
        }
      }
    });
  });
}

function renameBulletin(directory, selectedParts, original, newFile, extension, file) {
  const wip = '/Volumes/G33STORE/WIP/';
  const base = '/Volumes/G33STORE/';
  const prodFolder = '/Volumes/G33STORE/_Hotfolders/Input/production/';
  selectedParts.forEach((part) => {
    fs.copyFile(`${base}${directory}/${original}/prep_art/${original}.tif`, `${wip}${newFile}P${pad(part)}/prep_art/${newFile}P${pad(part)}.tif`, (err) => {
      if (err) {
        if (err.code === 'ENOENT') {
          makeJobFolder(`${wip}${newFile}`, pad(part));
          fs.copyFile(`${base}${directory}/${original}/prep_art/${original}.tif`, `${wip}${newFile}P${pad(part)}/prep_art/${newFile}P${pad(part)}.tif`, (err) => {
            if (err) throw err;
          });
        } else {
          throw err;
        }
      }

      fs.copyFile(`${base}${directory}/${original}/prep_art/${original}.tif`, `${prodFolder}${newFile}P${pad(part)}.tif`, (err) => {
        if (err) throw err;
      });
    });
  });
}

function renameProof(directory, selectedParts, original, newFile, extension, file) {
  const wip = '/Volumes/G33STORE/WIP/';
  const base = '/Volumes/G33STORE/';
  const epsonFolder = '/Volumes/G33STORE/_Hotfolders/Input/epson/';
  selectedParts.forEach((part) => {
    fs.copyFile(`${base}${directory}/${original}/prep_art/LOW/${file}`, `${epsonFolder}${newFile}P${pad(part)}${extension}`, (err) => {
      if (err) {
        if (err.code === 'ENOENT') {
          makeJobFolder(`${wip}${newFile}`, pad(part));
          fs.copyFile(`${base}${directory}/${original}/prep_art/LOW/${file}`, `${epsonFolder}${newFile}P${pad(part)}${extension}`, (err) => {
            if (err) throw err;
          });
        } else {
          throw err;
        }
      }
    });
  });
}

function makeResetFolder(order, part, cb) {
  const wip = '/Volumes/G33STORE/WIP/';
  const date = moment(Date.now()).format('MMM_DD_YYYY_hh-mm-ssA');
  try {
    fs.mkdirSync(`${wip}${order}P${part}/prep_art/OLD-${date}`);
    fs.mkdirSync(`${wip}${order}P${part}/prep_art/OLD-${date}/mmt_hires`);
    fs.mkdirSync(`${wip}${order}P${part}/prep_art/OLD-${date}/paint_files`);
    fs.mkdirSync(`${wip}${order}P${part}/prep_art/OLD-${date}/prep_art`);

    cb(date);
  } catch (err) {
    throw err;
  }
}

function moveFilesForReset(path, newPath) {
  fs.readdirSync(path).forEach((file) => {
    if (!file.includes('OLD-')) {
      fs.renameSync(`${path}/${file}`, `${newPath}/${file}`);
    }
  });
}

function resetOrder(order, selectedParts) {
  const wip = '/Volumes/G33STORE/WIP/';
  selectedParts.forEach((part) => {
    makeResetFolder(order, pad(part), (date) => {
      moveFilesForReset(`${wip}${order}P${pad(part)}/mmt_hires`, `${wip}${order}P${pad(part)}/prep_art/OLD-${date}/mmt_hires`);
      moveFilesForReset(`${wip}${order}P${pad(part)}/paint_files`, `${wip}${order}P${pad(part)}/prep_art/OLD-${date}/paint_files`);
      moveFilesForReset(`${wip}${order}P${pad(part)}/prep_art`, `${wip}${order}P${pad(part)}/prep_art/OLD-${date}/prep_art`);

      fs.mkdirSync(`${wip}${order}P${pad(part)}/prep_art/LOW`);
    });
  });
}

ipcMain.on('rename-orders', (event, arg) => {
  const wip = '/Volumes/G33STORE/';
  const keys = Object.keys(arg);
  let count = 0;

  keys.forEach((key) => {
    const order = new Rename({ original: arg[key].original, new: arg[key].new, parts: arg[key].selectedParts });
    order.save();
    if (Object.prototype.hasOwnProperty.call(arg, key)) {
      const rename = arg[key];

      fs.readdir(`${wip}${rename.directory}/${rename.original}/paint_files`, (err, files) => {
        files.forEach((file) => {
          const extension = file.substring(9, file.length);
          if (file.includes('_mil')) {
            renameBulletin(rename.directory, rename.selectedParts, rename.original, rename.new, extension, file);
          } else {
            renameProd(rename.directory, rename.selectedParts, rename.original, rename.new, extension, file);
          }
        });
      });

      fs.readdir(`${wip}${rename.directory}/${rename.original}/prep_art/LOW`, (err, files) => {
        files.forEach((file) => {
          const extension = file.substring(9, file.length);
          const fileType = file.split('.')[1];
          if (fileType === 'pdf') {
            renameProof(rename.directory, rename.selectedParts, rename.original, rename.new, extension, file);
          }
        });
      });
    }

    count += 1;

    if (count === keys.length) {
      event.sender.send('rename-orders', 'done');
    }
  });
});

ipcMain.on('reset-order', (event, arg) => {
  resetOrder(arg.new, arg.selectedParts);
  event.sender.send('reset-order', 'done');
});

ipcMain.on('get-logs', (event, arg) => {
  Rename.find({}).then((logs) => {
    event.sender.send('get-logs', logs);
  });
});
