import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("preferences", {
  getShowInTray: async (): Promise<boolean> => {
    return await ipcRenderer.invoke("get-preference", "show-in-tray");
  },
  setShowInTray: (enabled: boolean): void => {
    ipcRenderer.send("set-preference", "show-in-tray", enabled);
  }
});
