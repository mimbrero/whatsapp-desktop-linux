import { app } from 'electron';
import WhatsApp from './whatsapp';

if (!app.requestSingleInstanceLock()) {
    app.quit();
    process.exit();
}

app.whenReady().then(() => new WhatsApp().init());
