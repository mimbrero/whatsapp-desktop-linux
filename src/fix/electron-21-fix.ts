import { session } from "electron";
import Settings from "../settings";
import Fix from "./fix";

const settings = new Settings("fixes");

/**
 * Fixes #35, clears corrupt storage data.
 */
export default class Electron21Fix extends Fix {

    public override beforeLoad() {
        if (!settings.get("electron-21", false)) {
            console.info("Clearing storage data...");

            session.defaultSession.clearStorageData();
            settings.set("electron-21", true);
        }
    }
}
