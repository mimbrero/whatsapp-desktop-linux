import { app, BrowserWindow, ipcMain, shell } from "electron";
import path from "path";
import HotkeyManager from "./hotkey-manager";
import TrayManager from "./tray-manager";
import WindowSettings from "./settings/window-settings";

const USER_AGENT = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.9999.0 Safari/537.36";

export default class WhatsApp {

    private readonly window: BrowserWindow;
    public quitting = false;

    constructor() {
        this.window = new BrowserWindow({
            title: "WhatsApp",
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
    }

    public init() {
        this.makeLinksOpenInBrowser();
        this.registerListeners();

        this.window.setMenu(null);
        this.window.loadURL('https://web.whatsapp.com/', { userAgent: USER_AGENT });
        this.reload(); // weird Chrome version bug

        new HotkeyManager(this, this.window).init();
        new TrayManager(this, this.window).init();
        new WindowSettings(this, this.window).init();
    }

    public reload() {
        this.window.webContents.reloadIgnoringCache();
    }

    public quit() {
        this.quitting = true;
        app.quit();
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
        app.on('second-instance', () => {
            this.window.show();
            this.window.focus();
        });

        ipcMain.on('notification-click', () => this.window.show());
        
        ipcMain.on("chrome-version-bug", () => {
            console.log("Detected chrome version bug. Reloading...");
            this.reload();
        });
    }
};
