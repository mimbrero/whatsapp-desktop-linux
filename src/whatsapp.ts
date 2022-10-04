import { App, BrowserWindow, ipcMain, shell } from 'electron';
import path from 'path';
import HotkeyManager from './hotkey-manager';
import TrayManager from './tray-manager';
import WindowSettings from './settings/window-settings';

const USER_AGENT = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.9999.0 Safari/537.36";

export default class WhatsApp {

    private readonly hotkeyManager: HotkeyManager;
    private readonly trayManager: TrayManager;
    private readonly windowSettings = new WindowSettings();

    private readonly window: BrowserWindow;

    constructor(private readonly app: App) {
        this.window = new BrowserWindow({
            title: 'WhatsApp',
            backgroundColor: '#111b21',
            width: 1100,
            height: 700,
            minWidth: 650,
            minHeight: 550,
            show: !process.argv.includes("--start-hidden"),
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
        this.makeLinksOpenInBrowser();
        this.registerListeners();
        this.registerHotkeys();

        this.hotkeyManager.init();
        this.trayManager.init();
        this.windowSettings.applySettings(this.window);

        this.window.loadURL('https://web.whatsapp.com/', { userAgent: USER_AGENT });
        this.reload(); // weird Chrome version bug
    }

    private reload() {
        this.window.webContents.reloadIgnoringCache();
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

        this.window.on('close', () => this.windowSettings.saveSettings(this.window));
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
                action: () => this.reload()
            },
            {
                control: true,
                keys: ["R"],
                action: () => this.reload()
            },
            {
                control: true,
                keys: ["W"],
                action: () => this.window.hide()
            },
            {
                control: true,
                keys: ["Q"],
                action: () => this.app.quit()
            }
        );
    }
};
