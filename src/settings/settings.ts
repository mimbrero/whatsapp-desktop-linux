import Store from 'electron-store';

export default abstract class Settings {
    store: Store;
    section: string;

    protected constructor(section: string) {
        this.store = new Store();
        this.section = section + ".";
    }

    protected get(key: string, defaults: any = null): any {
        return this.store.get(this.section + key, defaults);
    }

    protected set(key: string, value: any): void {
        this.store.set(this.section + key, value);
    }
};
