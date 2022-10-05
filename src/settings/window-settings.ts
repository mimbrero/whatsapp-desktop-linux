import { BrowserWindow } from 'electron';
import WhatsApp from '../whatsapp';
import Settings from './settings';

export default class WindowSettings extends Settings {
    
    constructor(
        private readonly whatsApp: WhatsApp,
        private readonly window: BrowserWindow
    ) {
        super("window");
    }

    public init() {
        this.applySettings();

        this.window.on("close", () => {
            if (!this.whatsApp.quitting) return;
            this.saveSettings();
        });
    }

    private applySettings() {
        let defaults = this.window.getBounds(); // The window is constructed with the defaults.
        this.window.setBounds(this.get("bounds", defaults));

        if (this.get("maximized", false)) {
            this.window.maximize();
        }
    }

    private saveSettings() {
        this.set("maximized", this.window.isMaximized());

        if (!this.window.isMaximized()) {
            this.set("bounds", this.window.getBounds());
        }
    }
};
