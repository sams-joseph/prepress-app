import { ipcMain } from 'electron';
import Store from 'electron-store';
import fs from 'fs';

import Rename from '../models/Rename';
import { pad } from './util';

const store = new Store();

function makeJobFolder(order, part) {
  try {
    fs.mkdirSync(`${order}P${part}`);
    fs.mkdirSync(`${order}P${part}/mmt_hires`);
    fs.mkdirSync(`${order}P${part}/original_client_creative`);
    fs.mkdirSync(`${order}P${part}/paint_files`);
    fs.mkdirSync(`${order}P${part}/prep_art`);
    fs.mkdirSync(`${order}P${part}/prep_art/LOW`);
  } catch (err) {
    console.log(err);
  }
}

function renameProd(selectedParts, original, newFile, extension, file) {
  const base = store.get('g33store');
  const wip = `${base}/WIP`;
  selectedParts.forEach((part) => {
    fs.copyFile(`${base}/REWORKS/${original}/paint_files/${file}`, `${wip}/${newFile}P${pad(part)}/paint_files/${newFile}P${pad(part)}${extension}`, (err) => {
      if (err) {
        if (err.code === 'ENOENT') {
          makeJobFolder(`${wip}/${newFile}`, pad(part));
          fs.copyFile(`${base}/REWORKS/${original}/paint_files/${file}`, `${wip}/${newFile}P${pad(part)}/paint_files/${newFile}P${pad(part)}${extension}`, (error) => {
            if (error) throw error;
          });
        } else {
          throw err;
        }
      }
    });
  });
}

function renameProof(selectedParts, original, newFile, extension, file) {
  const base = store.get('g33store');
  const wip = `${base}/WIP`;
  const epsonFolder = `${base}/_Hotfolders/Input/epson`;
  selectedParts.forEach((part) => {
    fs.copyFile(`${base}/REWORKS/${original}/prep_art/${file}`, `${epsonFolder}/${newFile}P${pad(part)}${extension}`, (err) => {
      if (err) {
        if (err.code === 'ENOENT') {
          makeJobFolder(`${wip}/${newFile}`, pad(part));
          fs.copyFile(`${base}/REWORKS/${original}/prep_art/${file}`, `${epsonFolder}/${newFile}P${pad(part)}${extension}`, (error) => {
            if (error) throw error;
          });
        } else {
          throw err;
        }
      }
    });
  });
}

const renameMetro = () => ipcMain.on('rename-metro', (event, arg) => {
  const base = store.get('g33store');
  const wip = base;
  const keys = Object.keys(arg);
  let count = 0;

  keys.forEach((key) => {
    const order = new Rename({
      original: arg[key].original,
      new: arg[key].new,
      parts: arg[key].selectedParts,
    });
    order.save();
    if (Object.prototype.hasOwnProperty.call(arg, key)) {
      const rename = arg[key];

      fs.readdir(`${wip}/REWORKS/${rename.original}/paint_files`, (err, files) => {
        files.forEach((file) => {
          const extension = file.substring(6, file.length);
          renameProd(
            rename.selectedParts,
            rename.original,
            rename.new,
            extension,
            file,
          );
        });
      });

      fs.readdir(`${wip}/REWORKS/${rename.original}/prep_art/`, (err, files) => {
        files.forEach((file) => {
          const extension = file.substring(9, file.length);
          const fileType = file.split('.')[1];
          if (fileType === 'tif' && file.includes('low')) {
            renameProof(
              rename.selectedParts,
              rename.original,
              rename.new,
              extension,
              file,
            );
          }
        });
      });
    }

    count += 1;

    if (count === keys.length) {
      event.sender.send('rename-metro', 'done');
    }
  });
});

export default renameMetro;
