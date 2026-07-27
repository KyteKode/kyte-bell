import Store, {StoreType} from "$lib/localstorage_handler";
import globals from "$lib/globals.svelte";
import PeriodData from "$lib/period_data.svelte";

const store = new Store();
export const ls_available = store.store_type == StoreType.LocalStore;

export function update_stored_periods() {
    store.stored = {
        version: 0,
        periods: globals.periods.map(period => period.to_zod())
    };
}

export function get_stored_periods(): PeriodData[] {
    return store.stored.periods
        .map(period => PeriodData.from_zod(period));
}