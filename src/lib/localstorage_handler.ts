// i would use typed-local-storage, but it wasnt working for some reason ;-;

import { browser } from "$app/environment";

export default class Store<S> {
    private _stored: boolean;

    constructor() {
        if (!browser) { this._stored = false; }

        try {
            localStorage.setItem("testKey", "testVal");
            localStorage.removeItem("testKey");
            this._stored = true;
        } catch {
            this._stored = false;
        }
    }

    setItem<K extends keyof S & string>(key: K, value: S[K]) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    getItem<K extends keyof S & string>(key: K): S[K] | null {
        const item = localStorage.getItem(key);
        if (item == null) { return null; }

        return JSON.parse(item);
    }

    get stored() {
        return this._stored;
    }
}