import Store from "$lib/localstorage_handler";
import type { StorageSchema } from "$lib/storage_schemas";
import globals from  "$lib/globals.svelte";
import { from_binary } from "$lib/bin_convert";

import debug_json from "$lib/assets/debug_json.json";
import debug_base91 from "$lib/assets/debug_base91.txt?raw";

const store = new Store<StorageSchema>();

let dev_open: boolean = $state(false);

function reload() {
    window.location.reload();
}

export function toggle_dev_menu() {
    dev_open = !dev_open;
}

export function is_dev_open(): boolean {
    return dev_open;
}

export function nuke_ls() {
    localStorage.removeItem("periods");
    reload();
}

export function load_debug_json() {

    store.set_item("periods", debug_json);
    reload();
}

export async function load_debug_base91() {
    const data = await from_binary(debug_base91);
    if (data == null) {
        alert("Could not decode");
        return;
    }
    store.set_item("periods", data.periods);
    reload();
}

export function manual_current_period() {
    const input = prompt("Current period index");

    try {
        const idx = Number(input);

        if (
            Number.isNaN(idx) ||
            !Number.isInteger(idx) ||
            idx < 0 ||
            idx >= globals.periods.length
        ) {
            throw new Error();
        }

        globals.dev_current_period = idx;
    } catch {
        alert("Bad input")
    }
}