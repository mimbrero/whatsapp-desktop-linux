import axios from "axios";
import { App, BrowserWindow, Menu, NativeImage, nativeImage, Tray } from "electron";

export default class TrayManager {

    private tray: Tray = null;

    constructor(private readonly app: App, private readonly window: BrowserWindow) { }

    public init() {
        this.window.webContents.on("page-favicon-updated", (_event, urls) => this.updateIcon(urls[urls.length - 1]));
        this.window.on('focus', () => this.updateMenu());
        this.window.on('blur', () => this.updateMenu());
    }

    private createTray(image: NativeImage) {
        this.tray = new Tray(image);
        this.updateMenu();
    }

    private updateMenu() {
        if (this.tray == null)
            return;

        const menu = Menu.buildFromTemplate([
            {
                label: this.window.isFocused() ? "Minimize to tray" : "Show WhatsApp",
                click: () => {
                    if (this.window.isFocused()) {
                        this.window.hide();
                    } else {
                        this.window.show();
                        this.window.focus();
                    }
                    this.updateMenu();
                }
            },
            {
                label: "Quit WhatsApp",
                click: () => this.app.quit()
            }
        ]);

        this.tray.setContextMenu(menu); // update the tray's menu copy
    }

    private async updateIcon(url: string) {
        const response = await axios.get(url, { responseType: "arraybuffer" });
        const image = nativeImage.createFromBuffer(Buffer.from(response.data));

        this.tray == null ? this.createTray(image) : this.tray.setImage(image);
    }
};
