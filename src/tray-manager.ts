import { App, BrowserWindow, Menu, MenuItem, NativeImage, nativeImage, Tray } from "electron";
import path from "path";
import fs from "fs";

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

        let tooltip = "WhatsApp Desktop";

        if (this.unread != 0) {
            menu.insert(0, new MenuItem({
                label: this.unread + " unread chats",
                enabled: false
            }));

            menu.insert(1, new MenuItem({ type: "separator" }));

            tooltip = tooltip + " - " + this.unread + " unread chats";
        }

        this.tray.setContextMenu(menu);
        this.tray.setToolTip(tooltip);
    }

    private onClickFirstItem() {
        if (this.window.isFocused()) {
            this.window.hide();
        } else {
            this.window.show();
            this.window.focus();
        }

        this.updateMenu();
    }

    private findIcon(name: string) {
        let iconPath = this.fromDataDirs("icons/hicolor/512x512/apps/" + name);

        if (iconPath === null)
            iconPath = path.join(this.app.getAppPath(), "data/icons/hicolor/512x512/apps/", name);

        return nativeImage.createFromPath(iconPath);
    }

    private fromDataDirs(iconPath: string) {
        for (let dataDir of process.env.XDG_DATA_DIRS.split(":")) {
            let fullPath = path.join(dataDir, iconPath);
            if (fs.existsSync(fullPath))
                return fullPath;
        }
        return null;
    }
};
