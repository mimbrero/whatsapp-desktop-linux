import { BrowserWindow, Input } from "electron";
import WhatsApp from "./whatsapp";

interface ClickAction {
    control?: boolean,
    keys: Array<string>,
    action: () => void
}

export default class HotkeyManager {

    private readonly actions = new Array<ClickAction>();

    public register(window: BrowserWindow) {
        window.webContents.on('before-input-event', (event, input) => {
            this.actions.forEach(clickAction => {
                if (input.control === clickAction.control && clickAction.keys.includes(input.key.toUpperCase())) {
                    clickAction.action();
                    event.preventDefault();
                }
            });
        });
    }

    public add(clickAction: ClickAction) {
        this.actions.push(clickAction);
    }
};