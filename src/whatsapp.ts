import { BrowserWindow, ipcMain, shell } from 'electron';
import path from 'path';
import WindowSettings from './settings/window-settings';

const USER_AGENT = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36';

export default class WhatsApp {
    private readonly windowSettings = new WindowSettings();
    private window: BrowserWindow;

    public init() {
        this.window = this.createWindow();
        this.windowSettings.applySettings(this.window);

        this.makeLinksOpenInBrowser();
        this.registerListeners();
        this.registerHotkeys();
    }

    private createWindow() {
        const window = new BrowserWindow({
            title: 'WhatsApp',
            backgroundColor: '#111b21',
            width: 1100,
            height: 700,
            minWidth: 650,
            minHeight: 550,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js'),
                contextIsolation: false // native Notification override in preload :(
            }
        });

        window.setMenu(null);
        window.loadURL('https://web.whatsapp.com/', { userAgent: USER_AGENT }); // TODO: Offline checker & "Computer not connected" page
        window.webContents.reloadIgnoringCache(); // weird Chrome version bug

        return window;
    }

    private makeLinksOpenInBrowser() {
        this.window.webContents.setWindowOpenHandler(details => {
            if (details.url != this.window.webContents.getURL()) {
                shell.openExternal(details.url);
                return { action: 'deny' };
            }
        });
    }

    private registerListeners() {
        this.window.on('close', _event => {
            this.windowSettings.saveSettings(this.window);
        });

        ipcMain.on('notification-click', _event => this.window.show());
    }

    private registerHotkeys() {
        this.window.webContents.on('before-input-event', (_event, input) => {
            if (input.control && (input.key.toLowerCase() === 'q' || input.key.toLowerCase() === 'w')) {
                this.window.close();
            }

            else if (input.key.toLowerCase() === 'f5' || (input.control && input.key.toLowerCase() === 'r')) {
                this.window.reload();
            }
        });
    }
};
