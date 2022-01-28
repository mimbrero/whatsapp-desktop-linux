import { BrowserWindow, Event, shell } from 'electron';
import WindowSettings from './settings/window-settings';

const USER_AGENT = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36';

export default class WhatsApp {
    private readonly windowSettings: WindowSettings = new WindowSettings();
    private window: BrowserWindow;

    public init() {
        this.window = this.createWindow();

        this.windowSettings.applySettings(this.window);
        this.makeLinksOpenInBrowser();
        
        this.window.on('close', event => this.onClose(event));
    }

    private createWindow() {
        const window = new BrowserWindow({
            title: 'WhatsApp',
            backgroundColor: '#090D11',
            width: 1100,
            height: 700,
            minWidth: 650,
            minHeight: 550
        });

        window.setMenu(null);
        window.loadURL('https://web.whatsapp.com/', { userAgent: USER_AGENT }); // TODO: Offline checker & "Computer not connected" page

        return window;
    }

    private makeLinksOpenInBrowser() {
        this.window.webContents.setWindowOpenHandler(details => {
            if (details.url != this.window.webContents.getURL()) {
                shell.openExternal(details.url);
                return { action: 'deny' };
            }
        });
    }

    // Events

    private onClose(event: Event) {
        this.windowSettings.saveSettings(this.window);
    }
};
