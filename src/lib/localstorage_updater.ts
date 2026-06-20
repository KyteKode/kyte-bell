import type { StorageSchema } from "$lib/storage_schemas";
import Store from "$lib/localstorage_handler";
import globals from "$lib/globals.svelte";
import PeriodData from "$lib/period_data.svelte";

const store = new Store<StorageSchema>();

export function update_stored_periods() {
    store.setItem("periods",
        globals.periods.map(period => period.to_json_interface())
    );
}

export function get_stored_periods(): PeriodData[] {
    const item = store.getItem("periods");
    if (item == null) { return []; }
    return item.map(period => PeriodData.from_json_interface(period));
}

function check_ls_available(): boolean {
    return store.stored;
}

export const ls_available = check_ls_available();