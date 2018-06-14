import { ipcMain } from 'electron';

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
  if (arg.table === 0) {
    Rename.find({ $or: [{ original: { $regex: arg.search, $options: 'i' } }, { new: { $regex: arg.search, $options: 'i' } }] }).then((logs) => {
      event.sender.send('search-logs', logs);
    });
  } else {
    Reset.find({ order: { $regex: arg.search, $options: 'i' } }).then((logs) => {
      event.sender.send('search-logs', logs);
    });
  }
});
