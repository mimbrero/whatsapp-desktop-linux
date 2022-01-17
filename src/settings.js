const Store = require('electron-store');
const store = new Store();

const BOUNDS = 'window.bounds';
const MAXIMIZED = 'window.maximized';

const applySettings = (window) => {
    window.setBounds(store.get(BOUNDS, window.getBounds()));

    if (store.get(MAXIMIZED, false)) {
        window.maximize();
    }
};

const saveSettings = (window) => {
    store.set(MAXIMIZED, window.isMaximized());

    if (!window.isMaximized()) {
        store.set(BOUNDS, window.getBounds());
    }
};

module.exports = { applySettings, saveSettings }