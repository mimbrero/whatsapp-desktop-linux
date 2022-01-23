import { BrowserWindow, screen } from 'electron';
import Settings from './settings';

export default class WindowSettings extends Settings {
    constructor() {
        super("window");
    }

    public applySettings(window: BrowserWindow) {
        let bounds = this.getBounds(window.getBounds());
        let display = screen.getDisplayMatching(bounds).workArea;
        if (
            bounds.x >= display.x &&
            bounds.y >= display.y &&
            bounds.width + bounds.x <= display.width + display.x &&
            bounds.height + bounds.y <= display.height + display.y
        ) {
            window.setBounds(bounds);
        }

        if (this.isMaximized()) {
            window.maximize();
        }
    }

    public saveSettings(window: BrowserWindow) {
        this.setBounds(window.getNormalBounds());
        this.setMaximized(window.isMaximized());
    }

    public getBounds(defaults: Electron.Rectangle): Electron.Rectangle {
        return this.get("bounds", defaults);
    }

    public setBounds(bounds: Electron.Rectangle) {
        this.set("bounds", bounds);
    }

    public isMaximized(): boolean {
        return this.get("maximized", false);
    }

    public setMaximized(maximized: boolean) {
        this.set("maximized", maximized);
    }
};
