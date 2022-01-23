import { BrowserWindow } from 'electron';
import Settings from './settings';

export default class WindowSettings extends Settings {
    constructor() {
        super("window");
    }

    public applySettings(window: BrowserWindow) {
        let defaults = window.getBounds(); // The window is constructed with the defaults.
        window.setBounds(this.getBounds(defaults));

        if (this.isMaximized()) {
            window.maximize();
        }
    }

    public saveSettings(window: BrowserWindow) {
        this.setMaximized(window.isMaximized());

        if (!window.isMaximized()) {
            this.setBounds(window.getBounds());
        }
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
