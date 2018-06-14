import { ipcMain } from 'electron';

import Rename from '../models/Rename';

export const log = () => ipcMain.on('get-logs', (event, arg) => {
  Rename.find({}).then((logs) => {
    event.sender.send('get-logs', logs);
  });
});

export const search = () => ipcMain.on('search-logs', (event, arg) => {
  Rename.find({ $or: [{ original: { $regex: arg, $options: 'i' } }, { new: { $regex: arg, $options: 'i' } }] }).then((logs) => {
    event.sender.send('search-logs', logs);
  });
});
