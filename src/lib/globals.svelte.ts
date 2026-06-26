import PeriodData from "$lib/period_data.svelte";
import { get_stored_periods, update_stored_periods } from "$lib/localstorage_updater";

import { browser } from "$app/environment";

let _periods: PeriodData[] = $state([]);

if (browser) {
    _periods = get_stored_periods() ?? [];
}

const globals = {
    get periods() { return _periods; },
    periods_push(data: PeriodData) {
        _periods.push(data);
        _periods.sort((a, b) => a.start.to_minutes() - b.start.to_minutes());
        update_stored_periods();
    },
    periods_delete(idx: number) {
        _periods.splice(idx, 1);
        update_stored_periods();
    },
    periods_update(idx: number, data: PeriodData) {
        _periods[idx] = data;
        update_stored_periods();
    }
}
export default globals;