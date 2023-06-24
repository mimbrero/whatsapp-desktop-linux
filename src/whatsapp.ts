import { app, BrowserWindow, ipcMain, shell } from "electron";
import path from "path";
import ChromeVersionFix from "./fix/chrome-version-fix";
import Electron21Fix from "./fix/electron-21-fix";
import HotkeyModule from "./module/hotkey-module";
import ModuleManager from "./module/module-manager";
import TrayModule from "./module/tray-module";
import WindowSettingsModule from "./module/window-settings-module";
import PreferencesModule from "./module/preferences-module";

const USER_AGENT = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.9999.0 Safari/537.36";

export default class WhatsApp {

    private readonly window: BrowserWindow;
    private readonly moduleManager: ModuleManager;
    public readonly preferences: PreferencesModule;
    public quitting = false;

    constructor() {
        this.preferences = new PreferencesModule(this);

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

        const modules = [
            new Electron21Fix(),
            new HotkeyModule(this, this.window),
            new WindowSettingsModule(this, this.window),
            new ChromeVersionFix(this),
            this.preferences
        ];

        if (this.preferences.showInTray) {
            modules.push(new TrayModule(this, this.window));
        }

        this.moduleManager = new ModuleManager(modules);
    }

    public init() {
        this.makeLinksOpenInBrowser();
        this.registerListeners();

        this.moduleManager.beforeLoad();

        this.window.setMenu(null);
        this.window.loadURL('https://web.whatsapp.com/', { userAgent: USER_AGENT });

        this.moduleManager.onLoad();
    }

    public reload() {
        this.window.webContents.reloadIgnoringCache();
    }

    public quit() {
        this.quitting = true;
        this.moduleManager.onQuit();
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
    }
};
