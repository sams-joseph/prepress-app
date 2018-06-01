import shell from 'shelljs';
import { ipcMain } from 'electron';

ipcMain.on('initialize', (event, arg) => {
  if (arg === 'start') {
    console.log('start');
    // shell.exec('./init.sh');
    event.sender.send('asynchronous-reply', 'pong');
  }
});
