import path from "path";
import { BrowserWindow, ipcMain } from "electron";

import WhatsApp from "../whatsapp";
import Module from "./module";
import Settings from "../settings";

export default class Preferences extends Module {
    private readonly window: BrowserWindow;
    private readonly settings: Settings;

    constructor(
        private readonly whatsApp: WhatsApp
    ) {
        super();

        this.settings = new Settings("preferences");

        this.window = new BrowserWindow({
            title: "WhatsApp - Preferences",
            width: 320,
            height: 240,
            show: false,
            minimizable: false,
            maximizable: false,
            resizable: false,
            autoHideMenuBar: true,
            webPreferences: {
                preload: path.join(__dirname, "preferences-module-preload.js")
            }
        });

        this.window.on("close", this.onClose.bind(this));

        ipcMain.handle("get-preference", this.onGetPreference.bind(this));
        ipcMain.on("set-preference", this.onSetPreference.bind(this));

        this.window.loadFile("src/module/preferences-module.html");
    }

    get showInTray(): boolean {
        return this.settings.get("show-in-tray", true);
    }

    show(): void {
        this.window.show();
    }

    private onClose(event: Electron.Event): void {
        this.window.hide();

        if (!this.whatsApp.quitting) {
            event.preventDefault();
        }
    }

    private onGetPreference(event: Electron.IpcMainInvokeEvent, key: string): void {
        return this.settings.get(key);
    }

    private onSetPreference(event: Electron.IpcMainEvent, key: string, value: any): void {
        this.settings.set(key, value);
    }
}
