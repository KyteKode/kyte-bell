import Store from "$lib/localstorage_handler";
import type { StorageSchema } from "$lib/storage_schemas";

import debug_data from "$lib/assets/debug_data.json";

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

export function load_debug_data() {
    store.set_item("periods", debug_data);
    reload()
}