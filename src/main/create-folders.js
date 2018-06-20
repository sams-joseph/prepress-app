import { ipcMain } from 'electron';
import fs from 'fs';
import axios from 'axios';
import Store from 'electron-store';
import { pad } from './util';

const store = new Store();
const errors = [];

function makeFolders(order, part) {
  const base = store.get('g33store');
  const wip = `${base}/WIP`;
  try {
    fs.mkdirSync(`${wip}/${order}P${part}`);
    fs.mkdirSync(`${wip}/${order}P${part}/mmt_hires`);
    fs.mkdirSync(`${wip}/${order}P${part}/original_client_creative`);
    fs.mkdirSync(`${wip}/${order}P${part}/paint_files`);
    fs.mkdirSync(`${wip}/${order}P${part}/prep_art`);
    fs.mkdirSync(`${wip}/${order}P${part}/prep_art/LOW`);
  } catch (err) {
    if (err.code === 'EEXIST') errors.push('Folder Exists');
  }
}

const createFolders = () => ipcMain.on('create-folders', (event, arg) => {
  axios
    .get(`https://orders.mmt.com/api/?job=${arg}&part=01&token=OsGHJd3Bxt`)
    .then((result) => {
      const {
        job,
      } = result.data;

      for (let i = 1; i <= job.totalParts; i += 1) {
        makeFolders(arg, pad(i));
      }

      event.sender.send('create-folders', 'done');
    })
    .catch((err) => {
      console.log(err);
    });
});

export default createFolders;
