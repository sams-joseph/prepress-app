import { ipcMain } from 'electron';
import fs from 'fs';

import Rename from '../models/Rename';
import { pad } from './util';

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

const renaming = () => ipcMain.on('rename-orders', (event, arg) => {
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

export default renaming;
