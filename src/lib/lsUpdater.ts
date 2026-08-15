import Store, {StoreType} from "$lib/lsHandler";
import globals from "$lib/globals.svelte";
import PeriodData from "$lib/period.svelte";

const store = new Store();
export const lsAvailable = store.storeType == StoreType.LocalStore;

export function updateStoredPeriods() {
    store.stored = {
        version: 0,
        periods: globals.periods.map(period => period.toZod())
    };
}

export function getStoredPeriods(): PeriodData[] {
    return store.stored.periods
        .map(period => PeriodData.fromZod(period));
}