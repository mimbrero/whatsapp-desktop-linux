const { app, shell, BrowserWindow } = require('electron');
const title = 'Whatsapp';

let window;

function createWindow() {
    window = new BrowserWindow({
        width: 800,
        height: 600,
        title: title,
        backgroundColor: '#090D11'
    });

    window.loadURL(
        'https://web.whatsapp.com/',
        { userAgent: 'Mozilla/5.0 (X11; Fedora; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4464.5 Safari/537.36' }
    ).then(() => window.setTitle(title));

    return window;
}

app.whenReady().then(() => {
    window = createWindow();

    // Make links open in browser
    window.webContents.setWindowOpenHandler(details => {
        if (details.url != window.webContents.url) {
            shell.openExternal(details.url);
            return { action: 'deny' };
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});