import Store from 'electron-store';

export default abstract class Settings {
    private readonly store = new Store();
    private readonly section: string;

    protected constructor(section: string) {
        this.section = section + ".";
    }

    protected get(key: string, defaults: any = null): any {
        return this.store.get(this.section + key, defaults);
    }

    protected set(key: string, value: any): void {
        this.store.set(this.section + key, value);
    }
};
