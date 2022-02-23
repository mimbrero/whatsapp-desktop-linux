import { App, BrowserWindow, ipcMain, shell } from 'electron';
import path from 'path';
import HotkeyManager from './hotkey-manager';
import TrayManager from './tray-manager';
import WindowSettings from './settings/window-settings';

const USER_AGENT = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36';

export default class WhatsApp {

    private readonly hotkeyManager: HotkeyManager;
    private readonly trayManager: TrayManager;
    private readonly windowSettings = new WindowSettings();

    private readonly window: BrowserWindow;

    private quitting = false;

    constructor(private readonly app: App) {
        this.window = new BrowserWindow({
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
        
        this.window.setMenu(null);

        this.hotkeyManager = new HotkeyManager(this.window);
        this.trayManager = new TrayManager(this.app, this.window);
    }

    public init() {
        this.window.loadURL('https://web.whatsapp.com/', { userAgent: USER_AGENT }); // TODO: Offline checker & "Computer not connected" page
        this.window.webContents.reloadIgnoringCache(); // weird Chrome version bug

        this.makeLinksOpenInBrowser();
        this.registerListeners();
        this.registerHotkeys();

        this.hotkeyManager.init();
        this.trayManager.init();
        this.windowSettings.applySettings(this.window);
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
        this.app.on('second-instance', () => {
            this.window.show();
            this.window.focus();
        });

        ipcMain.on('notification-click', () => this.window.show());

        this.app.on('before-quit', () => this.quitting = true);

        this.window.on('close', event => {
            if (this.quitting) {
                this.windowSettings.saveSettings(this.window);
            } else {
                event.preventDefault();
                this.window.hide()
            }
        });
    }

    private registerHotkeys() {
        this.hotkeyManager.add(
            {
                control: true,
                keys: ["+"],
                action: () => {
                    if (this.window.webContents.getZoomFactor() < 3)
                        this.window.webContents.zoomLevel += 1
                }
            },
            {
                control: true,
                keys: ["0"],
                action: () => this.window.webContents.setZoomLevel(0)
            },
            {
                control: true,
                keys: ["-"],
                action: () => {
                    if (this.window.webContents.getZoomFactor() > 0.5)
                        this.window.webContents.zoomLevel -= 1
                }
            },
            {
                keys: ["F5"],
                action: () => this.window.webContents.reloadIgnoringCache()
            },
            {
                control: true,
                keys: ["R"],
                action: () => this.window.webContents.reloadIgnoringCache()
            },
            {
                control: true,
                keys: ["W"],
                action: () => this.window.close()
            },
            {
                control: true,
                keys: ["Q"],
                action: () => this.app.quit()
            }
        );
    }
};
