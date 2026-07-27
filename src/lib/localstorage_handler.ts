// i would use typed-local-storage, but it wasnt working for some reason ;-;

import { ZStoredData } from "$lib/storage_schemas";

import { browser } from "$app/environment";

export enum StoreType {
    NoStore,
    LocalStore,
}

export default class Store {
    readonly #store_type: StoreType;

    constructor() {
        if (!browser) { this.#store_type = StoreType.NoStore; }

        try {
            localStorage.setItem("testKey", "testVal");
            localStorage.removeItem("testKey");
            this.#store_type = StoreType.NoStore;
        } catch {
            this.#store_type = StoreType.NoStore;
        }
    }

    set stored(value: ZStoredData) {
        localStorage.setItem("periods", JSON.stringify(value));
    }

    get stored(): ZStoredData {
        const raw = localStorage.getItem("periods");

        if (raw == null) {
            return {
                version: 0,
                periods: []
            };
        }

        const data = JSON.parse(raw);

        const v0 = ZStoredData.safeParse(data);

        if (v0.success) {
            return v0.data;
        }

        return {
            version: 0,
            periods: []
        };
    }

    set stored_string(value: string) {
        const data = JSON.parse(value);

        const v0 = ZStoredData.safeParse(data);

        if (v0.success) {
            localStorage.setItem("periods", value);
        }
    }

    get store_type() {
        return this.#store_type;
    }
}