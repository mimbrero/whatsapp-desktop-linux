import { App, BrowserWindow, Menu, NativeImage, nativeImage, Tray } from "electron";
import path from "path";

export default class TrayManager {

    private readonly ICON: NativeImage;
    private readonly ICON_UNREAD: NativeImage;

    private readonly tray: Tray;
    private unread = 0;

    constructor(private readonly app: App, private readonly window: BrowserWindow) {
        this.ICON = this.findIcon("io.github.mimbrero.WhatsAppDesktop.png");
        this.ICON_UNREAD = this.findIcon("io.github.mimbrero.WhatsAppDesktop-unread.png");

        this.tray = new Tray(this.ICON);
        this.updateMenu();
    }

    public init() {
        this.window.on('focus', () => this.updateMenu());
        this.window.on('blur', () => this.updateMenu());
        this.window.on('hide', () => this.updateMenu());

        this.window.webContents.on("page-title-updated", (_event, title, explicitSet) => {
            if (!explicitSet) return;

            this.unread = this.getUnread(title);
            this.updateMenu();
            this.tray.setImage(this.unread == 0 ? this.ICON : this.ICON_UNREAD);
        });
    }

    private getUnread(title: string) {
        const matches = title.match(/\(\d+\) WhatsApp/);
        return matches == null ? 0 : Number.parseInt(matches[0].match(/\d+/)[0]);
    }

    private updateMenu() {
        if (this.tray == null)
            return;

        const menu = Menu.buildFromTemplate([
            {
                label: this.window.isFocused() ? "Minimize to tray" : "Show WhatsApp",
                click: () => this.onClickFirstItem()
            },
            {
                label: "Quit WhatsApp",
                click: () => this.app.quit()
            }
        ]);

        this.tray.setContextMenu(menu);
    }

    private onClickFirstItem() {
        if (this.window.isFocused()) {
            this.window.hide();
        } else {
            this.window.show();
            this.window.focus();
        }
    }

    private findIcon(name: string) {
        const iconPath = path.join(this.app.getAppPath(), "data/icons/hicolor/512x512/apps/", name);
        return nativeImage.createFromPath(iconPath);
    }
};
