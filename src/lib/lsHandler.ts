// i would use typed-local-storage, but it wasnt working for some reason ;-;

import * as s from "$lib/storageSchemas";

import {browser} from "$app/environment";

export enum StoreType {
    NoStore,
    LocalStore,
}

function defaultStored(): s.ZStoredData {
    return {
        version: 1,
        presets: [
            {
                name: "Classes",
                periods: [],
                criteria: []
            }
        ],
        defaultPreset: 0
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

    set stored(value: s.ZStoredData | s.ZStoredDataV0) {
        if (this.#storeType === StoreType.NoStore) { return; }
        localStorage.setItem("periods", JSON.stringify(value));
    }

    get stored(): s.ZStoredData {
        if (this.#storeType === StoreType.NoStore) { return defaultStored(); }

        const raw = localStorage.getItem("periods");

        if (raw == null) {
            return defaultStored();
        }

        const data = JSON.parse(raw);

        const v1 = s.ZStoredData.safeParse(data);

        if (v1.success) {
            return v1.data;
        }

        const v0 = s.ZStoredDataV0.safeParse(data);

        if (v0.success) {
            return s.migrateV1(v0.data);
        }

        return defaultStored();
    }

    get storeType() {
        return this.#storeType;
    }
}