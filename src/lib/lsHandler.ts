// i would use typed-local-storage, but it wasnt working for some reason ;-;

import { ZStoredData } from "$lib/storageSchemas";

import { browser } from "$app/environment";

export enum StoreType {
    NoStore,
    LocalStore,
}

function defaultStored(): ZStoredData {
    return {
        version: 0,
        periods: []
    };
}

export default class Store {
    readonly #storeType: StoreType;

    constructor() {
        if (!browser) { this.#storeType = StoreType.NoStore; }

        try {
            localStorage.setItem("testKey", "testVal");
            localStorage.removeItem("testKey");
            this.#storeType = StoreType.LocalStore;
        } catch {
            this.#storeType = StoreType.NoStore;
        }
    }

    set stored(value: ZStoredData) {
        if (this.#storeType === StoreType.NoStore) { return; }
        localStorage.setItem("periods", JSON.stringify(value));
    }

    get stored(): ZStoredData {
        if (this.#storeType === StoreType.NoStore) { return defaultStored(); }

        const raw = localStorage.getItem("periods");

        if (raw == null) {
            return defaultStored();
        }

        const data = JSON.parse(raw);

        const v0 = ZStoredData.safeParse(data);

        if (v0.success) {
            return v0.data;
        }

        return defaultStored();
    }

    get storeType() {
        return this.#storeType;
    }
}