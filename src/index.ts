import { app } from 'electron';
import WhatsApp from './whatsapp';

const whatsApp = new WhatsApp();

if (!app.requestSingleInstanceLock()) {
    app.quit();
    process.exit();
}

app.whenReady().then(() => {
    whatsApp.init();
    app.on('second-instance', () => app.focus()); // Another instance tried to run
});

app.on('window-all-closed', () => app.quit());
