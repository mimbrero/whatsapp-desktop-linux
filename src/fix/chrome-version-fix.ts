import { ipcMain } from "electron";
import WhatsApp from "../whatsapp";
import Fix from "./fix";

export default class ChromeVersionFix extends Fix {

    constructor(private readonly whatsApp: WhatsApp) {
        super();
    }

    public override onLoad() {
        this.whatsApp.reload();

        ipcMain.on("chrome-version-bug", () => {
            console.info("Detected chrome version bug. Reloading...");
            this.whatsApp.reload();
        });
    }
}
