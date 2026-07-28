// i would use typed-local-storage, but it wasnt working for some reason ;-;

import { ZStoredData } from "$lib/storage_schemas";

import { browser } from "$app/environment";

export enum StoreType {
    NoStore,
    LocalStore,
}

function default_stored(): ZStoredData {
    return {
        version: 0,
        periods: []
    };
}

export default class Store {
    readonly #store_type: StoreType;

    constructor() {
        if (!browser) { this.#store_type = StoreType.NoStore; }

        try {
            localStorage.setItem("testKey", "testVal");
            localStorage.removeItem("testKey");
            this.#store_type = StoreType.LocalStore;
        } catch {
            this.#store_type = StoreType.NoStore;
        }
    }

    set stored(value: ZStoredData) {
        if (this.#store_type === StoreType.NoStore) { return; }
        localStorage.setItem("periods", JSON.stringify(value));
    }

    get stored(): ZStoredData {
        if (this.#store_type === StoreType.NoStore) { return default_stored(); }

        const raw = localStorage.getItem("periods");

        if (raw == null) {
            return default_stored();
        }

        const data = JSON.parse(raw);

        const v0 = ZStoredData.safeParse(data);

        if (v0.success) {
            return v0.data;
        }

        return default_stored();
    }

    set stored_string(value: string) {
        if (this.#store_type === StoreType.NoStore) { return; }

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