const { app } = require('electron');
const main = require('./main');

app.whenReady().then(() => main.init());
app.on('window-all-closed', () => app.quit());