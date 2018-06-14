import { ipcMain } from 'electron';
import fs from 'fs';
import Store from 'electron-store';
import moment from 'moment';

import Reset from '../models/Reset';
import { pad } from './util';

const store = new Store();

function makeResetFolder(order, part, cb) {
  const base = store.get('g33store');
  const wip = `${base}/WIP`;
  const date = moment(Date.now()).format('MMM_DD_YYYY_hh-mm-ssA');
  try {
    fs.mkdirSync(`${wip}/${order}P${part}/prep_art/OLD-${date}`);
    fs.mkdirSync(`${wip}/${order}P${part}/prep_art/OLD-${date}/mmt_hires`);
    fs.mkdirSync(`${wip}/${order}P${part}/prep_art/OLD-${date}/paint_files`);
    fs.mkdirSync(`${wip}/${order}P${part}/prep_art/OLD-${date}/prep_art`);

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
  const base = store.get('g33store');
  const wip = `${base}/WIP`;
  selectedParts.forEach((part) => {
    makeResetFolder(order, pad(part), (date) => {
      moveFilesForReset(`${wip}/${order}P${pad(part)}/mmt_hires`, `${wip}/${order}P${pad(part)}/prep_art/OLD-${date}/mmt_hires`);
      moveFilesForReset(`${wip}/${order}P${pad(part)}/paint_files`, `${wip}/${order}P${pad(part)}/prep_art/OLD-${date}/paint_files`);
      moveFilesForReset(`${wip}/${order}P${pad(part)}/prep_art`, `${wip}/${order}P${pad(part)}/prep_art/OLD-${date}/prep_art`);

      fs.mkdirSync(`${wip}/${order}P${pad(part)}/prep_art/LOW`);
    });
  });
}

const reset = () => ipcMain.on('reset-order', (event, arg) => {
  resetOrder(arg.new, arg.selectedParts);
  const order = new Reset({
    order: arg.new,
    parts: arg.selectedParts,
  });
  order.save();
  event.sender.send('reset-order', 'done');
});

export default reset;
