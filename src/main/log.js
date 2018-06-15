import { ipcMain } from 'electron';
import sanitizer from 'sanitizer';

import Rename from '../models/Rename';
import Reset from '../models/Reset';


export const log = () => ipcMain.on('get-logs', (event, arg) => {
  if (arg === 0) {
    Rename.find({}).then((logs) => {
      event.sender.send('get-logs', logs);
    });
  } else {
    Reset.find({}).then((logs) => {
      event.sender.send('get-logs', logs);
    });
  }
});

export const search = () => ipcMain.on('search-logs', (event, arg) => {
  const query = sanitizer.sanitize(arg.search);

  if (arg.table === 0) {
    Rename.find({ $or: [{ original: { $regex: query, $options: 'i' } }, { new: { $regex: query, $options: 'i' } }] }).then((logs) => {
      event.sender.send('search-logs', logs);
    });
  } else {
    Reset.find({ order: { $regex: query, $options: 'i' } }).then((logs) => {
      event.sender.send('search-logs', logs);
    });
  }
});
