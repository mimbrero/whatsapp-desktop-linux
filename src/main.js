const { shell, BrowserWindow, Menu } = require('electron');
const settings = require('./settings');

const userAgent = 'Mozilla/5.0 (X11; Fedora; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4464.5 Safari/537.36';
const title = 'WhatsApp';

function init() {
    const window = createWindow();

    window.on('close', event => {
        settings.saveSettings(window);
    });

    // Make links open in browser
    window.webContents.setWindowOpenHandler(details => {
        if (details.url != window.webContents.url) {
            shell.openExternal(details.url);
            return { action: 'deny' };
        }
    });
}

function createWindow() {
    const window = new BrowserWindow({
        title: title,
        backgroundColor: '#090D11',
        minWidth: 650,
        minHeight: 550,
        width: 1100,
        height: 700
    });

    settings.applySettings(window);

    window.setMenu(null);
    window.loadURL('https://web.whatsapp.com/', { userAgent: userAgent }); // TODO: Offline checker & "Trying to reach phone" page

    return window;
}

module.exports = { init }