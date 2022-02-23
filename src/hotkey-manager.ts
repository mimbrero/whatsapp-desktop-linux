import { BrowserWindow } from "electron";

interface ClickAction {
    control?: boolean,
    keys: Array<string>,
    action: () => void
}

export default class HotkeyManager {

    private readonly actions = new Array<ClickAction>();

    constructor(private readonly window: BrowserWindow) { }

    public init() {
        this.window.webContents.on('before-input-event', (event, input) => {
            this.actions.forEach(clickAction => {
                if (input.control === clickAction.control && clickAction.keys.includes(input.key.toUpperCase())) {
                    clickAction.action();
                    event.preventDefault();
                }
            });
        });
    }

    public add(...clickActions: Array<ClickAction>) {
        clickActions.forEach(action => this.actions.push(action));
    }
};
