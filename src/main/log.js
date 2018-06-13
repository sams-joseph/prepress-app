import { ipcMain } from 'electron';

import Rename from '../models/Rename';

const log = () => ipcMain.on('get-logs', (event, arg) => {
  Rename.find({}).then((logs) => {
    event.sender.send('get-logs', logs);
  });
});

export default log;
