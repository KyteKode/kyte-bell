import Store, {StoreType} from "$lib/localstorage_handler";
import globals from "$lib/globals.svelte";
import PeriodData from "$lib/period_data.svelte";

const store = new Store();
export const lsAvailable = store.storeType == StoreType.LocalStore;

export function updateStoredPeriods() {
    store.stored = {
        version: 0,
        periods: globals.periods.map(period => period.to_zod())
    };
}

export function getStoredPeriods(): PeriodData[] {
    return store.stored.periods
        .map(period => PeriodData.from_zod(period));
}