import Store from "$lib/lsHandler";
import globals from  "$lib/globals.svelte";
import { decodeBin } from "$lib/binSchemas";

import debugJSON from "$lib/assets/debug_json.json";
import debugBase91 from "$lib/assets/debug_base91.txt?raw";

const store = new Store();

let devOpen: boolean = $state(false);

function reload() {
    window.location.reload();
}

export function toggleDevMenu() {
    devOpen = !devOpen;
}

export function isDevOpen(): boolean {
    return devOpen;
}

export function nukeLocalStorage() {
    localStorage.removeItem("periods");
    reload();
}

export function loadDebugJSON() {
    store.stored = debugJSON;
    reload();
}

export async function loadDebugBase91() {
    store.stored = decodeBin(debugBase91);
    reload();
}

export function manualCurrentPeriod() {
    const input = prompt("Current period index");

    try {
        const idx = Number(input);

        if (
            Number.isNaN(idx) ||
            !Number.isInteger(idx) ||
            idx < 0 ||
            idx >= globals.periods.length
        ) {
            new Error();
        }

        globals.devCurrentPeriod = idx;
    } catch {
        alert("Bad input")
    }
}