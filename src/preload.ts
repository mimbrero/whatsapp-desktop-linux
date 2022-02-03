import { ipcRenderer } from 'electron';

window.Notification = class extends Notification {
    constructor(title: string, options: NotificationOptions) {
        super(title, options);
        this.onclick = _event => ipcRenderer.send('notification-click');
    }
}
