import Store, { StoreType } from "$lib/lsHandler";
import globals from "$lib/globals.svelte";
import Preset from "$lib/preset.svelte";

const store = new Store();
export const lsAvailable = store.storeType == StoreType.LocalStore;

export function updateLS() {
    store.stored = {
        version: 1,
        presets: globals.presets.map(preset => preset.toZod()),
        defaultPreset: globals.defaultPreset
    };
}

export function getPresets(): Preset[] {
    return store.stored.presets
        .map(preset => Preset.fromZod(preset));
}

export function getDefaultPreset(): number {
    return store.stored.defaultPreset;
}