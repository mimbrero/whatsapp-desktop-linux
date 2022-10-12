import Store from 'electron-store';

export default class Settings {
    private readonly store = new Store();
    private readonly section: string;

    constructor(section: string) {
        this.section = section + ".";
    }

    public get(key: string, defaults: any = null): any {
        return this.store.get(this.section + key, defaults);
    }

    public set(key: string, value: any): void {
        this.store.set(this.section + key, value);
    }
};
